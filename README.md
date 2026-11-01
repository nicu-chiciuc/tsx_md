1234

## Deployment

GitHub Actions deploys the site with Alchemy. `apps/tsx_md/alchemy.run.ts` defines the Worker,
and `.github/workflows/alchemy.yml` builds it before each deploy. A push to `main` deploys
production at <https://tsx.md>. Each pull request gets its own preview Worker, removed when the
pull request closes. No Convex keys or runtime secrets reach the app; the Convex token only
reads and writes Alchemy state.

To build the production package without an upload, run `pnpm run build` from `apps/tsx_md`.
