import rcompare from "semver/functions/rcompare.js";
import satisfies from "semver/functions/satisfies.js";
import valid from "semver/functions/valid.js";
import validRange from "semver/ranges/valid.js";

/**
Downloads the `.d.ts` files a page's code imports, for Monaco.

Versions are chosen the way a package manager would: the page's own imports
first (a pin from the page, else the newest version whose peer dependencies
agree with what is already chosen), then each package's declared dependency
ranges. One version per package name, like a flat node_modules.

Only files reachable from the imported entry points are fetched, and Monaco
gets them in one batch once every download has settled.
*/

/** Pins packages to a major version, e.g. `effect@3` on Effect's `/docs/v3/` pages. */
export type VersionPin = {
  major: string;
  /** Package names, or scopes ending in `/`, that the pin applies to. */
  names: ReadonlyArray<string>;
};

type PackageJson = {
  types?: string;
  typings?: string;
  main?: string;
  exports?: unknown;
  typesVersions?: Record<string, Record<string, Array<string>>>;
  dependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
  optionalDependencies?: Record<string, string>;
};

type LoadedPackage = {
  /** The name the code imports, e.g. `react`. */
  name: string;
  /** The package the files come from, e.g. `@types/react`. */
  source: string;
  version: string;
  files: ReadonlySet<string>;
  json: PackageJson;
};

// A stuck download would hold back the batch Monaco is waiting for.
const timeout = () => AbortSignal.timeout(20_000);
const cdn = "https://cdn.jsdelivr.net/npm";
const data = "https://data.jsdelivr.com/v1/package";

const nodeBuiltins = new Set(
  "assert async_hooks buffer child_process cluster console constants crypto dgram diagnostics_channel dns domain events fs http http2 https inspector module net os path perf_hooks process punycode querystring readline repl stream string_decoder sys timers tls trace_events tty url util v8 vm wasi worker_threads zlib".split(
    " ",
  ),
);

export function createTypeLoader(options: {
  pin: VersionPin | undefined;
  onFiles: (files: ReadonlyMap<string, string>) => void;
}) {
  const packages = new Map<string, Promise<LoadedPackage | undefined>>();
  const chosen = new Map<string, LoadedPackage>();
  const files = new Map<string, string>();
  const visited = new Set<string>();
  let pending = 0;
  let pushedSize = 0;
  // Page imports are resolved one after another so each sees the ones before it.
  let pageChain: Promise<unknown> = Promise.resolve();

  async function track<T>(work: () => Promise<T>): Promise<T | undefined> {
    pending++;
    try {
      return await work();
    } catch {
      return undefined;
    } finally {
      pending--;
      if (pending === 0 && files.size !== pushedSize) {
        pushedSize = files.size;
        options.onFiles(files);
      }
    }
  }

  async function getText(url: string) {
    const response = await fetch(url, { signal: timeout() });
    if (!response.ok) throw new Error(`${response.status} ${url}`);
    return response.text();
  }

  async function getJson(url: string, init?: RequestInit): Promise<unknown> {
    const response = await fetch(url, { ...init, signal: timeout() });
    if (!response.ok) throw new Error(`${response.status} ${url}`);
    return response.json();
  }

  async function resolveVersion(name: string, range: string) {
    const body = await getJson(
      `${data}/resolve/npm/${name}@${encodeURIComponent(range)}`,
    ).catch(() => undefined);
    return isRecord(body) && typeof body.version === "string"
      ? body.version
      : undefined;
  }

  async function fetchPackage(
    name: string,
    source: string,
    version: string,
  ): Promise<LoadedPackage | undefined> {
    const [listing, jsonText] = await Promise.all([
      getJson(`${data}/npm/${source}@${version}/flat`),
      getText(`${cdn}/${source}@${version}/package.json`),
    ]);
    const list =
      isRecord(listing) && Array.isArray(listing.files) ? listing.files : [];
    const names = new Set<string>();
    for (const file of list) {
      if (isRecord(file) && typeof file.name === "string") names.add(file.name);
    }
    const json = parsePackageJson(jsonText);
    const loaded = { name, source, version, files: names, json };
    if (![...names].some(isDts) && !source.startsWith("@types/")) {
      return fetchTypesPackage(name, version);
    }
    files.set(`/node_modules/${source}/package.json`, jsonText);
    return loaded;
  }

  async function fetchTypesPackage(name: string, version: string) {
    const source = `@types/${name.startsWith("@") ? name.slice(1).replace("/", "__") : name}`;
    const major = version.split(".")[0] ?? "latest";
    const typesVersion =
      (await resolveVersion(source, major)) ??
      (await resolveVersion(source, "latest"));
    return typesVersion ? fetchPackage(name, source, typesVersion) : undefined;
  }

  /** A package imported from inside another package, using its declared range. */
  function dependency(name: string, range: string | undefined) {
    const existing = packages.get(name);
    if (existing) return existing;
    const loading = (async () => {
      const usable =
        range !== undefined && validRange(range) !== null ? range : "latest";
      const version =
        (await resolveVersion(name, usable)) ??
        (await resolveVersion(name, "latest"));
      if (!version) return undefined;
      const loaded = await fetchPackage(name, name, version);
      if (loaded) chosen.set(name, loaded);
      return loaded;
    })();
    packages.set(name, loading);
    return loading;
  }

  /** A package the page's own code imports. */
  function pagePackage(name: string) {
    const existing = packages.get(name);
    if (existing) return existing;
    const loading = pageChain.then(async () => {
      const pinned = pinFor(options.pin, name);
      const pinnedVersion = pinned
        ? await resolveVersion(name, pinned)
        : undefined;
      const version = pinnedVersion ?? (await compatibleVersion(name));
      if (!version) return undefined;
      const loaded = await fetchPackage(name, name, version);
      if (loaded) chosen.set(name, loaded);
      return loaded;
    });
    pageChain = loading.catch(() => undefined);
    packages.set(name, loading);
    return loading;
  }

  /** The newest version whose peers agree with the packages already chosen. */
  async function compatibleVersion(name: string) {
    const latest = await resolveVersion(name, "latest");
    const relevant = [...chosen.values()].filter(
      (other) => other.json.peerDependencies?.[name] !== undefined,
    );
    if (chosen.size === 0) return latest;

    const peersOf = parseRegistryPeers(
      await getJson(`https://registry.npmjs.org/${name}`, {
        headers: { Accept: "application/vnd.npm.install-v1+json" },
      }).catch(() => undefined),
    );
    if (peersOf.size === 0) return latest;

    const agrees = (version: string) => {
      for (const [peer, range] of Object.entries(peersOf.get(version) ?? {})) {
        const other = chosen.get(peer);
        if (other && !satisfies(other.version, range)) return false;
      }
      return relevant.every((other) => {
        const range = other.json.peerDependencies?.[name];
        return range === undefined || satisfies(version, range);
      });
    };

    if (latest && agrees(latest)) return latest;
    const candidates = [...peersOf.keys()]
      .filter((version) => valid(version) && !version.includes("-"))
      .sort(rcompare);
    return candidates.find(agrees) ?? latest;
  }

  function walkFile(pkg: LoadedPackage, path: string) {
    const vfsPath = `/node_modules/${pkg.source}${path}`;
    if (visited.has(vfsPath)) return;
    visited.add(vfsPath);
    void track(async () => {
      const code = await getText(`${cdn}/${pkg.source}@${pkg.version}${path}`);
      files.set(vfsPath, code);
      const directory = path.slice(0, path.lastIndexOf("/") + 1);
      for (const reference of dtsReferences(code)) {
        if (reference.startsWith(".") || reference.startsWith("/")) {
          const target = resolveRelative(pkg.files, directory, reference);
          if (target) walkFile(pkg, target);
          continue;
        }
        const name = packageName(reference);
        if (name === pkg.name) {
          walkEntry(pkg, subpathOf(reference, name));
          continue;
        }
        const range = declaredRange(pkg.json, name);
        if (
          range === undefined &&
          !packages.has(name) &&
          name !== "@types/node"
        ) {
          continue;
        }
        void track(async () => {
          const target = await dependency(name, range);
          if (target) walkEntry(target, subpathOf(reference, name));
        });
      }
    });
  }

  function walkEntry(pkg: LoadedPackage, subpath: string) {
    for (const path of entryFiles(pkg, subpath)) walkFile(pkg, path);
  }

  return {
    load(code: string) {
      void track(async () => {
        for (const reference of importedModules(code)) {
          const name = packageName(reference);
          void track(async () => {
            const pkg = await pagePackage(name);
            if (pkg) walkEntry(pkg, subpathOf(reference, name));
          });
        }
      });
    },
    files: files as ReadonlyMap<string, string>,
  };
}

function pinFor(pin: VersionPin | undefined, name: string) {
  if (!pin) return undefined;
  const matches = pin.names.some((entry) =>
    entry.endsWith("/") ? name.startsWith(entry) : name === entry,
  );
  return matches ? pin.major : undefined;
}

function declaredRange(json: PackageJson, name: string) {
  return (
    json.dependencies?.[name] ??
    json.peerDependencies?.[name] ??
    json.optionalDependencies?.[name]
  );
}

/** `node:fs`, `fs` and `/// <reference types="node" />` all come from `@types/node`. */
function packageName(specifier: string) {
  if (specifier.startsWith("node:") || specifier === "node") {
    return "@types/node";
  }
  const parts = specifier.split("/");
  const name = specifier.startsWith("@")
    ? `${parts[0]}/${parts[1]}`
    : (parts[0] ?? specifier);
  return nodeBuiltins.has(name) ? "@types/node" : name;
}

function subpathOf(specifier: string, name: string) {
  if (name === "@types/node" || specifier === name) return ".";
  return `.${specifier.slice(name.length)}`;
}

/** Bare and relative modules the page's code imports. */
export function importedModules(code: string) {
  const found = new Set<string>();
  const source = stripComments(code);
  for (const match of source.matchAll(
    /(?:\bfrom\s*|\bimport\s*\(?\s*|\brequire\s*\(\s*)["']([^"'\n]+)["']/g,
  )) {
    const specifier = match[1];
    if (specifier && !specifier.startsWith(".") && !specifier.startsWith("/")) {
      found.add(specifier);
    }
  }
  return found;
}

/** Modules and files a `.d.ts` file points at. */
function dtsReferences(code: string) {
  const found = new Set<string>();
  for (const match of code.matchAll(
    /^\s*\/\/\/\s*<reference\s+(path|types)\s*=\s*["']([^"']+)["']/gm,
  )) {
    const kind = match[1];
    const target = match[2];
    if (!target) continue;
    found.add(
      kind === "path" && !target.startsWith(".") ? `./${target}` : target,
    );
  }
  const source = stripComments(code);
  for (const match of source.matchAll(
    /(?:\bfrom\s*|\bimport\s*\(?\s*|\brequire\s*\(\s*)["']([^"'\n]+)["']/g,
  )) {
    if (match[1]) found.add(match[1]);
  }
  return found;
}

function stripComments(code: string) {
  return code
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/(^|[^:"'`\\])\/\/.*$/gm, "$1");
}

function resolveRelative(
  available: ReadonlySet<string>,
  directory: string,
  specifier: string,
) {
  const joined = normalizePath(
    specifier.startsWith("/") ? specifier : directory + specifier,
  );
  const base = joined.replace(/\.(d\.)?([cm]?)(js|ts)$/, "");
  const extension = /\.([cm]?)(js|ts)$/.exec(joined)?.[1] ?? "";
  return [
    `${base}.d.${extension}ts`,
    `${base}.d.ts`,
    `${joined}.d.ts`,
    `${joined}/index.d.ts`,
  ].find((candidate) => available.has(candidate));
}

function normalizePath(path: string) {
  const out: Array<string> = [];
  for (const part of path.split("/")) {
    if (part === "..") out.pop();
    else if (part !== "." && part !== "") out.push(part);
  }
  return `/${out.join("/")}`;
}

/** The `.d.ts` files TypeScript may pick for `subpath` (`.` or `./x`). */
function entryFiles(pkg: LoadedPackage, subpath: string) {
  const { json, files } = pkg;
  const targets: Array<string> = [];
  if (json.exports !== undefined) {
    // With `exports`, TypeScript reads nothing else.
    targets.push(...exportTargets(json.exports, subpath));
  } else if (subpath === ".") {
    for (const field of [json.types, json.typings, json.main]) {
      if (field) targets.push(field);
    }
    targets.push("index.d.ts");
  } else {
    targets.push(subpath);
    for (const map of Object.values(json.typesVersions ?? {})) {
      for (const [pattern, replacements] of Object.entries(map)) {
        const star = pattern.indexOf("*");
        const key = subpath.slice(2);
        if (star === -1 && pattern === key) targets.push(...replacements);
        if (
          star !== -1 &&
          key.startsWith(pattern.slice(0, star)) &&
          key.endsWith(pattern.slice(star + 1))
        ) {
          const middle = key.slice(
            star,
            key.length - (pattern.length - star - 1),
          );
          targets.push(...replacements.map((r) => r.replace("*", middle)));
        }
      }
    }
  }

  const found = new Set<string>();
  for (const target of targets) {
    const resolved = resolveRelative(files, "/", target);
    if (resolved) found.add(resolved);
  }
  return found;
}

function exportTargets(exportsField: unknown, subpath: string) {
  const map =
    isRecord(exportsField) &&
    Object.keys(exportsField).some((key) => key.startsWith("."))
      ? exportsField
      : { ".": exportsField };
  const exact = map[subpath];
  if (exact !== undefined) return conditionTarget(exact);
  for (const [key, value] of Object.entries(map)) {
    const star = key.indexOf("*");
    if (star === -1) continue;
    const prefix = key.slice(0, star);
    const suffix = key.slice(star + 1);
    if (subpath.startsWith(prefix) && subpath.endsWith(suffix)) {
      const middle = subpath.slice(
        prefix.length,
        subpath.length - suffix.length,
      );
      return conditionTarget(value).map((target) =>
        target.split("*").join(middle),
      );
    }
  }
  return [];
}

/** The target TypeScript picks under `moduleResolution: "bundler"`. */
function conditionTarget(value: unknown): Array<string> {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) {
    for (const item of value) {
      const found = conditionTarget(item);
      if (found.length > 0) return found;
    }
    return [];
  }
  if (isRecord(value)) {
    for (const [condition, target] of Object.entries(value)) {
      if (!bundlerConditions.has(condition)) continue;
      const found = conditionTarget(target);
      if (found.length > 0) return found;
    }
  }
  return [];
}

const bundlerConditions = new Set(["types", "import", "default"]);

function isDts(path: string) {
  return /\.d\.([^.]+\.)?[cm]?ts$/i.test(path);
}

function parsePackageJson(text: string): PackageJson {
  let value: unknown;
  try {
    value = JSON.parse(text);
  } catch {
    return {};
  }
  if (!isRecord(value)) return {};
  const typesVersions: Record<string, Record<string, Array<string>>> = {};
  if (isRecord(value.typesVersions)) {
    for (const [range, map] of Object.entries(value.typesVersions)) {
      if (!isRecord(map)) continue;
      const paths: Record<string, Array<string>> = {};
      for (const [pattern, list] of Object.entries(map)) {
        if (Array.isArray(list)) paths[pattern] = list.filter(isString);
      }
      typesVersions[range] = paths;
    }
  }
  return {
    types: optionalString(value.types),
    typings: optionalString(value.typings),
    main: optionalString(value.main),
    exports: value.exports ?? undefined,
    typesVersions,
    dependencies: stringRecord(value.dependencies),
    peerDependencies: stringRecord(value.peerDependencies),
    optionalDependencies: stringRecord(value.optionalDependencies),
  };
}

/** Each version's peer dependencies, from npm's abbreviated metadata. */
function parseRegistryPeers(value: unknown) {
  const peers = new Map<string, Record<string, string>>();
  if (!isRecord(value) || !isRecord(value.versions)) return peers;
  for (const [version, meta] of Object.entries(value.versions)) {
    peers.set(
      version,
      (isRecord(meta) ? stringRecord(meta.peerDependencies) : undefined) ?? {},
    );
  }
  return peers;
}

function stringRecord(value: unknown) {
  if (!isRecord(value)) return undefined;
  const out: Record<string, string> = {};
  for (const [key, item] of Object.entries(value)) {
    if (typeof item === "string") out[key] = item;
  }
  return out;
}

function optionalString(value: unknown) {
  return typeof value === "string" ? value : undefined;
}

function isString(value: unknown) {
  return typeof value === "string";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
