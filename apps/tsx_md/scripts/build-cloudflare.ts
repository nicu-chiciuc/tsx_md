import { spawn } from "node:child_process";
import process from "node:process";
import { pathToFileURL } from "node:url";

function isEnabled(value: string | undefined) {
  return value === "1" || value === "true";
}

function isPagesBuild(env: NodeJS.ProcessEnv) {
  return isEnabled(env.CF_PAGES) || Boolean(env.CF_PAGES_BRANCH);
}

function run(command: string, args: readonly string[], env: NodeJS.ProcessEnv) {
  return new Promise<void>((resolve, reject) => {
    const child = spawn(command, [...args], {
      env,
      stdio: "inherit",
    });

    child.on("error", reject);
    child.on("exit", (code, signal) => {
      if (signal) {
        reject(new Error(`${command} ${args.join(" ")} exited with ${signal}`));
        return;
      }

      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`${command} ${args.join(" ")} exited with ${code}`));
    });
  });
}

export async function main(env: NodeJS.ProcessEnv = process.env) {
  if (isPagesBuild(env)) {
    throw new Error(
      "Cloudflare Pages builds are not the deployment target for tsx.md. Use Cloudflare Workers Builds.",
    );
  }

  await run("pnpm", ["run", "build:app"], env);
}

const entrypoint = process.argv[1];
if (entrypoint && import.meta.url === pathToFileURL(entrypoint).href) {
  await main();
}
