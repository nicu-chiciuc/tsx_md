import { spawn } from "node:child_process";
import process from "node:process";
import { fileURLToPath, pathToFileURL } from "node:url";

const vitePlusEntrypoint = fileURLToPath(import.meta.resolve("vite-plus/bin"));

function isEnabled(value: string | undefined) {
  return value === "1" || value === "true";
}

function isPagesBuild(env: NodeJS.ProcessEnv) {
  return isEnabled(env.CF_PAGES) || Boolean(env.CF_PAGES_BRANCH);
}

function run(args: readonly string[], env: NodeJS.ProcessEnv) {
  return new Promise<void>((resolve, reject) => {
    const child = spawn(process.execPath, [vitePlusEntrypoint, ...args], {
      env,
      stdio: "inherit",
    });

    child.on("error", reject);
    child.on("exit", (code, signal) => {
      if (signal) {
        reject(new Error(`vp ${args.join(" ")} exited with ${signal}`));
        return;
      }

      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`vp ${args.join(" ")} exited with ${code}`));
    });
  });
}

export async function main(env: NodeJS.ProcessEnv = process.env) {
  if (isPagesBuild(env)) {
    throw new Error(
      "Cloudflare Pages builds are not the deployment target for tsx.md. Use Cloudflare Workers Builds.",
    );
  }

  await run(["run", "build:app"], env);
}

const entrypoint = process.argv[1];
if (entrypoint && import.meta.url === pathToFileURL(entrypoint).href) {
  await main();
}
