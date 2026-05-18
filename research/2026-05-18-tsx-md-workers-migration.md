# tsx.md Workers Migration Research

Date: 2026-05-18

Status: Draft research

Scope: understand what `tsx_md` is today and what it would take to migrate it
from the old Next.js app with Vercel-shaped remnants to TanStack Start, while
accounting for the live site possibly already being hosted on Netlify, and then
later moving to Cloudflare Workers in the current Noter / `notermd/app`
direction.

Update after implementation started: the operator clarified that Netlify
compatibility is not required. Netlify findings below remain historical context,
not a migration constraint.

Update after Workers follow-up: the PR now adds the Noter-style Workers Static
Assets contract for `apps/tsx_md`, including `wrangler.jsonc`,
`build:cloudflare`, and deploy wrappers.

## Executive Summary

`tsx_md` is not only the current white homepage that links to
`https://noter.md`. That homepage is a temporary signal added while the blog was
expected to move to Noter. The repository still contains the earlier product:
a TypeScript-oriented Markdown/blog site with routes for local articles,
GitHub Markdown rendering, Monaco-powered TypeScript code blocks, a small apps
directory, and experimental pages.

The migration should treat the homepage handoff as intentional current behavior
while preserving or deliberately retiring the hidden routes. The app migration
target is now explicitly TanStack Start rather than a generic Vite SPA. That
narrows the framework choice but separates the work into two phases:

1. migrate Next.js Pages Router code to TanStack Start routes, loaders, and
   browser-safe rendering;
2. ignore Netlify compatibility during the code migration, then move to
   Cloudflare Workers when the app shape is stable.

The current Noter / `notermd/app` base still matters: Vite+, React,
TanStack Start/Router, Tailwind/shadcn-style UI primitives, and Cloudflare
Workers deployment conventions should guide the final shape. Netlify is now
only historical context and should not shape product architecture.

The largest code migration is not the homepage. It is replacing Next.js
Pages Router data primitives:

- `getStaticProps` and Node `fs` for local blog articles.
- `getStaticPaths` for article routes.
- `getServerSideProps` for `/github.com/...` Markdown rendering.
- Next-only imports such as `next/link`, `next/head`, `next/font`, and
  `next-mdx-remote`.

For first-pass feature parity, `tsx.md` does not appear to need Convex. The
current app has no durable product state; its data is local Markdown content and
public GitHub raw Markdown. Convex should only be introduced if the product
scope changes to comments, authored content, user state, or Noter-backed blog
data.

Update after operator notes: the app may already be on Netlify, but Netlify does
not need to keep working during this migration. The practical target is a clean
TanStack Start app first and a Cloudflare Workers deploy contract later.

## Repository Shape

The repo is a pnpm Turborepo with multiple apps:

- `apps/tsx_md`: the primary `tsx.md` app.
- `apps/gif_md`: a small Next app experiment.
- `apps/validate_form`: a Next app tied to one article/demo.
- `apps/example_node`: sample project files used by the `_testing` page.
- `packages/ui` and `config-packages/*`: shared UI/config packages.

The root scripts are still Turborepo-oriented:

- `pnpm run build` -> `turbo build`
- `pnpm run dev` -> `turbo dev ...`
- `pnpm run lint` -> `turbo lint`
- `pnpm run test` -> `turbo test`

There is no `AGENTS.md` inside this repo. This note was written from
`/Users/nicu/dev/my/tsx_md` and only writes inside that repository.

## Current `apps/tsx_md` Product Surface

### Current Homepage

`apps/tsx_md/pages/index.tsx` renders only:

```tsx
<main className="flex min-h-screen items-center justify-center bg-white">
  <a href="https://noter.md">https://noter.md</a>
</main>
```

This should not be interpreted as the full product having already moved. It is
the current public front door and should remain the migration baseline unless a
later product decision restores the blog index to `/`.

### Blog Routes

`apps/tsx_md/articles` contains Markdown articles:

- `enable_noUncheckedIndexedAccess.md`
- `valid_form.md`

`apps/tsx_md/pages/blog/index.tsx` reads article frontmatter through
`getArticles()` and lists published articles, filtering out
`status: draft`.

`apps/tsx_md/pages/blog/[slug].tsx` renders one article with:

- `getStaticPaths`
- `getStaticProps`
- `next-mdx-remote`
- custom Monaco code block components
- `Giscus` comments
- a GitHub corner link back to the source Markdown file

The article URLs are currently `/blog/<filename-without-extension>`.
Preserving those paths keeps existing Giscus pathname mapping stable in
production.

### GitHub Markdown Viewer

`apps/tsx_md/pages/github.com/index.tsx` explains the feature:

`tsx.md/github.com/<owner>/<repo>/blob/<branch>/<file>` renders a GitHub
Markdown file with TypeScript-aware code blocks.

`apps/tsx_md/pages/github.com/[...user_repo_file].tsx` currently uses
`getServerSideProps`, fetches from `raw.githubusercontent.com`, serializes the
Markdown through `next-mdx-remote`, and renders it with the same Monaco code
block components.

This route is the main reason the migration needs more than static article
imports. In a Workers Static Assets SPA, this can move to client-side fetch and
client-side Markdown rendering. A Worker request handler is possible, but the
current Noter/template direction is to keep request handlers out of the first
app unless the product truly needs them.

### Monaco TypeScript Code Blocks

`src/my_components/monacoEditor.tsx` maps Markdown code fences to
`@monaco-editor/react` editors.

`src/my_components/monaco_types/setupEditor.ts` configures TypeScript defaults
and automatic type acquisition through `@typescript/ata`.

Important migration details:

- Monaco is browser-only and should live behind client-rendered route/component
  code in the SPA.
- Vite can bundle Monaco, but worker behavior and asset loading need a real
  build/browser validation pass.
- The code still contains suppressions and comments that should be cleaned up
  under the target repo rules, but that is a later implementation step.

### Experimental Routes

`apps/tsx_md/pages/babylon.tsx` renders a Babylon.js demo.

`apps/tsx_md/pages/_testing/index.tsx` is an experiment that reads local files,
extracts TypeScript source with the TypeScript compiler API, formats it with
Prettier, and renders Monaco editors. It uses hard-coded old local paths inside
`src/server/main.ts`.

These routes should be classified before migration:

- `babylon` can be preserved as a normal client route if still desired.
- `_testing` should probably not ship as a production route without a current
  product reason.

### Current App-Level Tooling

`apps/tsx_md/package.json` is Next/Vercel-shaped:

- `build`: `npm run css_types:ci && next build`
- `dev`: `npm run css_types & next dev -p 3020`
- `lint`: `next lint`
- `start`: `next start`

Notable dependencies tied to the old base:

- `next`, `@next/mdx`, `next-mdx-remote`
- `next-global-css`
- `@vercel/node`
- `eslint-config-next`
- `next/font`, `next/link`, `next/head` imports
- `vercel.json` and `vercel.jsonc`

The app also has checked-in `.next` output. The root `.gitignore` ignores
`.next`, but those files are already tracked. A migration should delete tracked
build output as part of cleanup.

## Deployment State Clarification

The local repository does not currently prove where `tsx.md` is deployed.

Local evidence still looks like old Next/Vercel-era code:

- `apps/tsx_md/package.json` includes `@vercel/node`.
- `apps/tsx_md/vercel.json` and `apps/tsx_md/vercel.jsonc` exist.
- the app uses Next.js Pages Router files and `next build`.
- no `netlify.toml`, `.netlify`, or Netlify plugin/package reference exists in
  the checked-in project.

That evidence only describes the repo shape, not the live host. Netlify build
settings can live entirely in the Netlify dashboard, so the absence of
`netlify.toml` does not disprove a current Netlify deployment.

Treat the current host as unknown until it is verified through DNS, Netlify UI,
or deployment records. The migration language should say "Next/Vercel-shaped
code/config" rather than "currently hosted on Vercel."

## Target Base Observed From Noter And `notermd/app`

Current Noter code and the local `notermd/app` artifact notes point to this
base:

- Vite+ command surface.
- React 19 in the current Noter app; the `notermd/app` template is also on the
  newer React stack.
- TanStack Start / TanStack Router.
- Tailwind through the Vite plugin.
- shadcn-style primitives and `cn()` helper.
- Cloudflare Workers Static Assets through `wrangler.jsonc`.
- `.node-version` pinning Node 24 when plain `node` runs TypeScript helper
  scripts in Cloudflare Workers Builds.
- `package.json` `build` as the Cloudflare dashboard entrypoint, delegating to
  a Cloudflare-aware build script.
- `deploy` and `deploy:preview` wrappers around `wrangler deploy` and
  `wrangler versions upload`.

The relevant Noter `wrangler.jsonc` shape is:

```jsonc
{
  "compatibility_date": "2026-05-14",
  "preview_urls": true,
  "assets": {
    "directory": "./dist/client",
    "not_found_handling": "single-page-application",
  },
}
```

The reusable `notermd/app` notes explicitly say not to hard-code the Worker
name in the reusable config. Let Cloudflare Workers Builds or a local
`CLOUDFLARE_WORKER_NAME` value supply the actual Worker name to the deploy
wrapper.

The operator update changes the interpretation of this section: TanStack Start
is the committed framework target, while SPA/static mode versus full-stack
server-entry mode is a hosting/runtime decision. For the current `tsx.md`
feature set, SPA/static mode still looks sufficient, but TanStack Start keeps
route loaders, SSR, and server functions available if the GitHub Markdown
viewer or blog rendering need them.

## Historical Netlify Hosting Notes

These notes were captured before the operator clarified that Netlify
compatibility is not required. Keep them as background only. Current Netlify
docs document a first-party TanStack Start integration:

- install `@netlify/vite-plugin-tanstack-start`;
- add `netlify()` to `vite.config.ts` alongside the TanStack Start plugin;
- set `netlify.toml` build command to `vite build`;
- set publish output to `dist/client`.

If Netlify is reintroduced later, keep that phase narrow:

- Add Netlify config only as deployment config.
- Avoid Netlify-specific functions or request hooks unless they are explicitly
  planned to be replaced in the Workers phase.
- Keep route/data code portable enough to run on Cloudflare's TanStack Start
  Workers runtime later.
- Keep all old Vercel-shaped config removal in the same app migration so the
  repo is no longer half-old-Next, half-TanStack.

## Cloudflare Workers Hosting Shape

Cloudflare Workers remains the intended later host. Cloudflare's current
Workers docs support two relevant TanStack shapes.

The first shape is the same static-assets deployment model used by Noter:

- Workers Static Assets can serve SPA routes by setting
  `assets.not_found_handling` to `"single-page-application"`, which serves
  `index.html` for non-asset paths.
- Workers Builds has a dashboard build command and deploy command. The
  `notermd/app` notes recommend keeping the dashboard build command as
  `pnpm run build`, then making the repo's `build` script do the right
  Cloudflare-aware work.
- Non-production Workers builds default to `wrangler versions upload`, which
  creates versioned preview URLs.

The second shape is a full TanStack Start Worker runtime. Cloudflare's current
TanStack Start guide uses `@tanstack/react-start/server-entry` as the Worker
entrypoint and enables Node compatibility. That shape is useful if `tsx.md`
keeps server-rendered routes or server functions after the TanStack migration.

The migration should choose one Workers target after the TanStack Start app is
running:

- static assets / SPA fallback if all data can be handled by build-time imports
  and browser fetches;
- TanStack Start server-entry on Workers if the product needs SSR, server
  functions, provider-side caching, or request-time Markdown rendering.

For this repo there are two viable layout choices.

### Option A: Keep The Monorepo Shape

Keep `apps/tsx_md` as a workspace app and add Cloudflare config/scripts either
at the repo root or in `apps/tsx_md`.

Benefits:

- Smaller initial migration.
- Preserves sibling apps while their fate is undecided.
- Allows `packages/ui` and config packages to continue existing.

Costs:

- Cloudflare dashboard setup must know whether the build path is `/` or
  `apps/tsx_md`.
- Asset directory is likely `./apps/tsx_md/dist/client` if `wrangler.jsonc`
  lives at the root, or `./dist/client` if it lives inside the app.
- Root scripts remain Turborepo-shaped unless explicitly changed.

This is the likely first implementation path.

### Option B: Collapse To A Single-App Template Shape

Move the migrated `tsx.md` app to the repository root to look more like
`notermd/app`.

Benefits:

- Closest to the teaching template.
- Simplest Cloudflare dashboard path: `/`, `pnpm run build`,
  `pnpm run deploy`, `pnpm run deploy:preview`.
- Easier future maintenance if sibling apps are historical.

Costs:

- Larger delete/move diff.
- Requires deciding what to do with `gif_md`, `validate_form`, `example_node`,
  `packages/ui`, and `config-packages`.
- More likely to mix migration with cleanup.

This should be a deliberate follow-up if the goal is to make the repo itself a
clean `notermd/app`-style artifact.

## Migration Workstreams

### 1. Route Mapping

Preserve these public routes unless explicitly retired:

- `/` -> temporary `https://noter.md` handoff.
- `/blog` -> article list plus apps list.
- `/blog/$slug` -> article page.
- `/github.com` -> Markdown viewer explanation.
- `/github.com/$` -> GitHub Markdown viewer catch-all.
- `/babylon` -> optional Babylon demo.
- `*` -> not-found route.

Classify `_testing` as non-production unless a current product need keeps it.

### 2. Replace Next Data Loading

Local articles should stop relying on Next `getStaticProps` and Node `fs` at
request time. Good TanStack/Vite options:

- Use `import.meta.glob` with `?raw` for `articles/*.md`.
- Parse frontmatter at build/runtime in browser-safe code.
- Keep the deterministic article list sorted by explicit fields or slug.
- Use TanStack route loaders for route data shape even when the underlying data
  comes from raw imports.

The GitHub viewer should stop relying on `getServerSideProps`.

First-pass portable option:

- Parse the catch-all route in the browser.
- Fetch `https://raw.githubusercontent.com/<owner>/<repo>/<branch>/<path>`.
- Render Markdown client-side.
- Show a quiet failure state for invalid paths, missing files, or non-OK
  responses.

Worker-handler option:

- Add a Worker script only if the product needs server-side fetch control,
  caching, headers, or response rewriting.
- If a Worker script is added, keep static assets serving directly and only run
  the Worker where it earns its cost and complexity.

TanStack Start server-function option:

- Use this only if the GitHub viewer needs SSR or server-side fetch behavior
  during a later Cloudflare Workers phase.
- Avoid provider-owned APIs inside the route logic so the same server function
  can stay portable.

### 3. Replace MDX Rendering

The current app uses `next-mdx-remote` for both local articles and arbitrary
GitHub Markdown. The target app should split those concerns:

- Local trusted articles can be rendered as Markdown/MDX if JSX components are
  still wanted.
- Arbitrary GitHub content should be rendered as Markdown, not executable MDX.

Recommended first-pass rendering stack:

- `react-markdown`
- `remark-gfm` if GitHub-style tables/lists are needed.
- `rehype-sanitize` for remote GitHub content.
- Custom `code` renderer that uses the Monaco component for TypeScript/TSX
  fences and a cheaper plain code block for other languages.

This matches the current app's actual value better than carrying over the
Next-specific MDX runtime.

### 4. Move Shell, Metadata, And Navigation

Replace:

- `pages/_app.tsx`
- `next/head`
- `next/font/google`
- `next/link`

With:

- a TanStack root route/layout
- route-level head/meta where needed
- Vite/Tailwind font setup, probably local fontsource packages
- TanStack links

The current homepage is intentionally minimal. Avoid adding extra marketing
copy during the migration unless the product direction changes.

### 5. Update Styling Base

Current styling is Tailwind 3 plus SCSS globals and old shadcn primitives in
`src/components/ui`.

The Noter/template base uses Vite/Tailwind integration and newer shadcn-style
foundations. Migration should:

- Preserve the visual surface first.
- Move global CSS from `globals.scss` to the target Vite CSS entry if SCSS is no
  longer needed.
- Avoid touching generated shadcn primitives manually unless replacing the
  generated set is part of a deliberate shadcn refresh.

### 6. Update Monaco And Browser-Only Features

Validate these in the Vite/Workers build:

- Monaco editor asset/worker loading.
- Automatic type acquisition fetches.
- Editor height auto-sizing.
- Babylon.js route bundle behavior.

If Monaco dominates the bundle, route-level lazy loading should be considered
for blog articles and GitHub Markdown routes.

### 7. Replace Environment And Analytics Wiring

`src/logRocketSetup.ts` currently checks `process.env['NODE_ENV']`. In Vite,
this should become `import.meta.env.MODE` or a small local env helper.

LogRocket should still only initialize in the browser and only outside local
development.

### 8. Cloudflare Build And Deploy Contract

Add the Workers contract after the app builds locally:

- `.node-version` with Node 24 if Node-invoked helper scripts stay in
  TypeScript.
- `wrangler.jsonc` with `preview_urls: true` and SPA asset fallback.
- `build`, `build:app`, and `build:cloudflare` scripts.
- `deploy`, `deploy:preview`, and dry-run scripts.
- a deploy wrapper that reads `WRANGLER_CI_OVERRIDE_NAME` in Workers Builds and
  `CLOUDFLARE_WORKER_NAME` locally.

If the app remains under `apps/tsx_md`, decide once where `wrangler.jsonc`
lives and keep all paths consistent.

### 9. CI And Validation

Current CI only builds `@aaa/ui`, typechecks `tsx_md`, and checks syncpack.
After migration it should at least run:

- app typecheck
- app build
- Workers dry-run when Cloudflare credentials/name are available locally or in
  CI
- route-level browser checks for `/`, `/blog`, one article,
  `/github.com`, and one fetched GitHub Markdown path

If shipped UI changes materially, add screenshot coverage rather than relying
only on static type/build checks.

## Risks And Sharp Edges

### The Homepage Can Hide Real Migration Scope

Because `/` is now only a `noter.md` link, it is easy to under-scope the work.
The hidden routes still contain the real product and old framework assumptions.

### Remote Markdown Should Not Become Remote Code

The GitHub viewer accepts arbitrary public GitHub Markdown paths. The migration
should not compile that content as executable MDX. Render it as sanitized
Markdown and keep custom behavior constrained to code blocks.

### SSR Behavior Will Change

The old `/github.com/...` route SSRs Markdown before returning HTML. A Workers
Static Assets SPA will fetch and render after load unless a Worker handler is
added. That is likely acceptable for this utility, but it is a real behavior
change for crawlers and no-JS clients.

TanStack Start makes this a decision rather than a forced loss. If SSR matters,
the migration can keep request-time rendering through Start's server runtime on
Cloudflare Workers later. If SSR does not matter, the simpler portable SPA path
is still available.

### Adapter Coupling Can Recreate The Old Host Problem

The app should not become provider-shaped in the same way the current app is
Next/Vercel-shaped. Since Netlify is not a first-pass constraint, avoid adding
provider-specific config until the deployment target needs it. Route modules
and Markdown rendering should stay portable for the later Cloudflare Workers
work.

### Giscus Mapping Depends On Route Stability

Article comments currently use pathname mapping in production. Keep article
paths stable if preserving comments matters.

### Tracked Build Output Should Be Removed

The repo contains tracked `.next` files under multiple apps. The migration
should remove tracked generated output so future diffs are readable.

### Monorepo Or Single-App Needs A Decision

The target template is single-app shaped, but this repo is a Turborepo. The
least risky migration keeps the monorepo first and changes only `apps/tsx_md`.
A later cleanup can collapse the repo if that is the desired final state.

## Recommended First Implementation Plan

1. Keep the repo layout and migrate only `apps/tsx_md` first.
2. Create the Vite+/TanStack Start app shell in `apps/tsx_md`.
3. Preserve `/` as the temporary `https://noter.md` link.
4. Port blog article loading using Vite raw imports and TanStack route loaders.
5. Port Markdown rendering with a safe renderer and Monaco code blocks.
6. Port `/github.com` to client-side raw GitHub fetching unless SSR is still a
   product requirement.
7. Port or intentionally remove `/babylon` and `_testing`.
8. Replace Next/Vercel dependencies, scripts, and tracked `.next` output.
9. Validate local build and route behavior.
10. Decide whether the Workers target is static-assets SPA or TanStack Start
    server-entry.
11. Add Workers config, deploy wrappers, and Workers dry-run validation after
    the app migration is stable.

## Open Questions

- Should the final repo remain a Turborepo, or should it be collapsed into a
  single `notermd/app`-style app at the root after the first migration?
- Should `/blog` become the homepage again, or should `/` continue linking to
  `noter.md` while the blog remains a secondary route?
- Should the sibling apps `gif_md` and `validate_form` be preserved,
  archived, or deleted?
- Is Giscus still the intended comments system after the blog move plan?
- Does the GitHub Markdown viewer need server-rendered HTML, or is client-side
  rendering acceptable?
- Does `tsx.md` need Convex now, or should Convex stay out until there is real
  durable app state?

## Sources

Local project files inspected:

- `apps/tsx_md/pages/index.tsx`
- `apps/tsx_md/pages/blog/index.tsx`
- `apps/tsx_md/pages/blog/[slug].tsx`
- `apps/tsx_md/pages/github.com/index.tsx`
- `apps/tsx_md/pages/github.com/[...user_repo_file].tsx`
- `apps/tsx_md/src/server/blogServing.ts`
- `apps/tsx_md/src/server/githubServing.ts`
- `apps/tsx_md/src/my_components/monacoEditor.tsx`
- `apps/tsx_md/src/my_components/monaco_types/setupEditor.ts`
- `apps/tsx_md/package.json`
- `apps/tsx_md/next.config.js`
- `apps/tsx_md/vercel.json`
- repository searches for `netlify`, `Netlify`, `vercel`, and `Vercel`

Noter/template references inspected:

- `/Users/nicu/dev/my/noter/apps/noter/package.json`
- `/Users/nicu/dev/my/noter/apps/noter/wrangler.jsonc`
- `/Users/nicu/dev/my/noter/apps/noter/scripts/build-cloudflare.ts`
- `/Users/nicu/dev/my/noter/apps/noter/scripts/deploy-cloudflare.ts`
- `/Users/nicu/dev/my/noter/docs/artifacts/notermd-app/README.md`
- `/Users/nicu/dev/my/noter/docs/artifacts/notermd-app/cloudflare-workers-install.md`
- `/Users/nicu/dev/my/noter/research/2026-04-28-notermd-app-template-adoption.md`
- `/Users/nicu/dev/my/noter/research/2026-05-05-cloudflare-pages-workers-direction.md`

Current Cloudflare docs checked:

- [Cloudflare Workers Static Assets SPA routing](https://developers.cloudflare.com/workers/static-assets/routing/single-page-application/)
- [Cloudflare Workers Builds configuration](https://developers.cloudflare.com/workers/ci-cd/builds/configuration/)
- [Cloudflare Workers preview URLs](https://developers.cloudflare.com/workers/configuration/previews/)
- [Cloudflare Wrangler configuration](https://developers.cloudflare.com/workers/wrangler/configuration/)
- [Cloudflare TanStack Start Workers guide](https://developers.cloudflare.com/workers/framework-guides/web-apps/tanstack-start/)

Current Netlify/TanStack docs checked:

- [Netlify TanStack Start guide](https://docs.netlify.com/build/frameworks/framework-setup-guides/tanstack-start/)
- [TanStack Start hosting docs](https://tanstack.com/start/latest/docs/framework/hosting)
