import { rootRoute, route } from "@tanstack/virtual-file-routes";

export const routes = rootRoute("root.tsx", [
  route("/", "index.tsx"),
  route("/blog", "blog-index.tsx"),
  route("/blog/$slug", "blog-slug.tsx"),
  route("/github[.]com", "github-index.tsx"),
  route("/github[.]com/$owner/$repo/blob/$branch/$", "github-file.tsx"),
]);
