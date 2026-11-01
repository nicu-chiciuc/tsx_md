import * as Cloudflare from "@alchemy.run/cloudflare";
import * as Convex from "@samebase/alchemy-convex";
import * as Alchemy from "alchemy";
import * as Effect from "effect/Effect";

export default Alchemy.Stack(
  "nicu-chiciuc/tsx_md/apps/tsx_md",
  {
    providers: Cloudflare.providers(),
    state: Convex.state({ team: "nicu" }),
  },
  Effect.gen(function* () {
    const { stage } = yield* Alchemy.Stack;
    const site = yield* Cloudflare.Worker("Site", {
      name: stage === "prod" ? "tsx-tsx-md" : `tsx-tsx-md-${stage}`,
      assets: {
        directory: "./dist/client",
        notFoundHandling: "single-page-application",
      },
      compatibility: { date: "2026-05-14" },
      workersDev: { enabled: true, previewsEnabled: true },
    }).pipe(Alchemy.RemovalPolicy.retain(stage === "prod"));

    return { url: site.url };
  }),
);
