1234


## Cloudflare Worker Previews

Use `apps/tsx_md` as the Workers Builds root. Install workspace dependencies from the repository root.

Workers Builds runs `pnpm run build`, then `pnpm run deploy` for the production
branch or `pnpm run deploy:preview` for other branches. The preview command uses
native Worker Previews with Wrangler 4.136.2. The empty `previews` config keeps
this app assets-only; no Convex keys or runtime secrets are required.

For an existing Worker, first use **Settings > Builds > Set up Worker Previews**
and restore the commands above after Cloudflare replaces the preview command.
Keep the existing build root and enable non-production branch builds. Verify the
new preview URL and application before completing the rollout.

Build before any manual deploy. From `apps/tsx_md`, run
`pnpm run deploy:dry-run --name <connected-worker-name>` to build and check the production
package without an upload. This keeps the Cloudflare Pages rejection in the build step.
Worker Previews has no dry-run mode. For a manual preview, use
`pnpm run deploy:preview --worker-name <connected-worker-name>`.

See the [Worker Previews configuration](https://developers.cloudflare.com/workers/previews/configuration/)
and [existing Worker setup](https://developers.cloudflare.com/workers/ci-cd/builds/build-branches/#existing-workers-connected-to-builds).
