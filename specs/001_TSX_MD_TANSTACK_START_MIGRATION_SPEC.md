# 001: tsx.md TanStack Start Migration

Status: Accepted for implementation

Created: 2026-05-18

Owner: tsx.md app migration

## Goal

Move `apps/tsx_md` from the old Next.js app to a simple TanStack Start app.
Do not optimize the migration around Netlify. The first implementation target
is a clean local TanStack Start build, with Cloudflare Workers left as the
deployment direction once the app shape is stable.

The migration optimizes for simplicity over backwards compatibility. Existing
URLs that still represent useful product behavior should stay stable, but old
framework glue, stale generated output, unused demos, and deployment-specific
workarounds should be removed when they no longer serve the current app.

## Product Scope

Keep:

- `/` as the plain `https://noter.md` handoff page.
- `/blog` as the article/apps index.
- `/blog/$slug` for published local articles.
- `/github.com` as the GitHub Markdown viewer explanation.
- `/github.com/<owner>/<repo>/blob/<branch>/<path>` as the GitHub raw Markdown
  viewer.
- A not-found route.

Re-evaluate during implementation:

- `/babylon` can stay only if it ports cleanly as a client route.
- `/_testing` is not production product surface and should not block the
  migration.

## Framework Shape

Use TanStack Start with file routes and route loaders where they clarify data
flow. Keep provider-specific work at the boundary:

- Cloudflare Workers later lives in `wrangler.jsonc` and deploy scripts.
- Netlify is not a compatibility constraint for this migration.
- Route modules, Markdown parsing, and rendering should stay portable.

Use SPA mode unless the migration uncovers a real need for SSR. Current product
behavior can work with:

- local article Markdown imported by Vite;
- client-side raw GitHub fetches;
- browser-only Monaco editors for TypeScript code fences.

If SSR becomes necessary, document the concrete route and reason before adding
server runtime behavior.

## Data And Rendering

Local articles:

- Import Markdown with Vite raw imports.
- Parse frontmatter in app-owned code.
- Filter `status: draft` from public lists and route params.
- Use deterministic sort order by title, then slug, unless a date field is
  added.

Remote GitHub Markdown:

- Convert `/github.com/<owner>/<repo>/blob/<branch>/<path>` to
  `https://raw.githubusercontent.com/<owner>/<repo>/<branch>/<path>`.
- Render remote content as sanitized Markdown, not executable MDX.
- Fail quietly with a plain invalid/not-found state when the URL shape or fetch
  response is not usable.

Code blocks:

- Use Monaco for TypeScript and TSX fences first.
- Use a cheaper static code block for other languages.
- Keep Monaco browser-only and route/component lazy-loading available if bundle
  size or build behavior demands it.

## Styling

Use the smallest viable styling surface.

- Keep the existing visual language roughly intact while removing accidental
  Next/CSS workarounds.
- Prefer Tailwind through Vite over SCSS unless an existing style genuinely
  needs SCSS.
- Avoid new decorative chrome.
- Do not preserve generated shadcn files just for compatibility if direct app
  code is simpler.

## Deployment

Current migration target:

- A clean local TanStack Start build and preview.
- No Netlify-specific plugin, server function, or config should be added unless
  the operator explicitly reintroduces Netlify as a requirement.

Later target:

- Cloudflare Workers, choosing between static-assets SPA and Start server entry
  after the app runs on TanStack Start.
- The first Workers contract uses Static Assets SPA routing:
  `wrangler.jsonc` owns `dist/client`, SPA fallback, and preview URLs.
- The Cloudflare dashboard build command stays `pnpm run build`.
- `build` delegates to `build:cloudflare`, while `build:app` remains the plain
  static TanStack build.
- `deploy` and `deploy:preview` wrap Wrangler and read the Worker name from
  `WRANGLER_CI_OVERRIDE_NAME` in Workers Builds or `CLOUDFLARE_WORKER_NAME`
  locally.

Remove:

- `vercel.json` and `vercel.jsonc` once no deploy path uses them.
- tracked `.next` output.
- Next-only scripts and dependencies.

## Implementation Checklist

- [x] Create TanStack Start app shell.
- [x] Port `/`.
- [x] Port `/blog`.
- [x] Port `/blog/$slug`.
- [x] Port `/github.com`.
- [x] Port `/github.com/<owner>/<repo>/blob/<branch>/<path>`.
- [x] Decide `/babylon`.
- [x] Drop `/_testing` or move it out of production routing.
- [x] Replace Next/Vercel scripts and dependencies.
- [x] Drop Netlify as a first-pass compatibility constraint.
- [x] Add the Noter-style Cloudflare Workers build/deploy contract.
- [x] Remove tracked generated Next output.
- [x] Validate typecheck/build.
- [x] Run browser route smoke checks.

## Issue Log

Use this section as the migration uncovers concrete breakpoints.

- 2026-05-18: The local repo does not prove the current live host. It still has
  Vercel-shaped files and dependencies, but Netlify settings may live in the
  dashboard. Later operator clarification says Netlify does not need to work
  during this migration, so provider compatibility is not a blocker.
- 2026-05-18: The homepage is intentionally only a `noter.md` link. Do not
  infer that the hidden blog/GitHub viewer surface has been intentionally
  deleted.
- 2026-05-18: `@netlify/vite-plugin-tanstack-start` pulled `sharp`, and the
  first install attempted a source build that failed because `node-gyp` was not
  in the workspace. Netlify is no longer a first-pass constraint, so the plugin
  and committed `netlify.toml` were removed from the migration.
- 2026-05-18: The TanStack route generator did not resolve the old workspace
  package-style tsconfig extend path (`tsconfig/vite.json`). Use the relative
  config path from `apps/tsx_md` so route generation can run before build.
- 2026-05-18: TanStack virtual routes treat `.` as a route separator unless
  the dot is escaped. Use `github[.]com` in the virtual route config to
  preserve the shipped `/github.com` path.
- 2026-05-18: `/babylon` and `/_testing` were removed from production routing.
  Neither is part of the useful product surface for this migration, and keeping
  them would preserve extra Babylon/Node filesystem/tooling dependencies.
- 2026-05-18: No `.next` files were tracked in git, but the ignored local
  `apps/tsx_md/.next` directory was removed so local validation is looking at
  the TanStack build output.
- 2026-05-18: The first successful build warns that the Markdown/Monaco chunk
  is large. This is acceptable for the first migration because Monaco is the
  core value of article code blocks, but route-level or component-level lazy
  loading remains the next performance lever if the shipped app feels heavy.
- 2026-05-18: Directly loading `/blog/valid_form` initially returned an empty
  React suspense/error marker even though loader data was present. TypeScript
  code fences now render a static fallback during SSR and mount Monaco only
  after client hydration.
- 2026-05-18: `/github.com` initially matched the raw-file catch-all route.
  The raw-file route was narrowed to
  `/github.com/<owner>/<repo>/blob/<branch>/<path>` so the explainer page owns
  `/github.com`.
- 2026-05-18: Browser smoke checks passed for `/`, `/blog`,
  `/blog/valid_form`, `/github.com`,
  `/github.com/robolex-app/public_ts/blob/main/README.md`, and a missing
  route.
- 2026-05-18: The Workers contract now follows the Noter / `notermd/app`
  shape: `build` delegates to a Cloudflare-aware script, `build:app` remains
  the local static build, `wrangler.jsonc` avoids hard-coded Worker names and
  build commands, and deploy wrappers pass the Worker name to Wrangler.
- 2026-05-18: Installing Wrangler in this workspace pulled `sharp`, which
  attempted a source build. `node-addon-api` and `node-gyp` are explicit
  dev dependencies so `pnpm install` can complete in the current environment.
- 2026-05-18: GitHub Actions runs root `syncpack list-mismatches`. `tsx_md` is
  intentionally on the newer TanStack/Workers dependency family while the
  sibling legacy apps remain on the old stack, so the repo syncpack config
  ignores those version families for `tsx_md` only.
- 2026-05-18: The workflow still calls `pnpm -F tsx_md run tsc:ci`, so `tsx_md`
  keeps a `tsc:ci` alias to make that step run a real typecheck.
