import { defineConfig } from "vite-plus";

export default defineConfig({
  fmt: {
    ignorePatterns: [
      ".devcontainer/docker-compose.yml",
      "README.md",
      "apps/example_node/index.js",
      "apps/tsx_md/articles/enable_noUncheckedIndexedAccess.md",
      "apps/tsx_md/articles/valid_form.md",
      "docker-compose.yml",
      "research/2026-05-18-tsx-md-workers-migration.md",
    ],
    printWidth: 80,
    proseWrap: "always",
  },
  lint: {
    plugins: ["typescript", "react"],
    env: {
      browser: true,
      builtin: true,
      node: true,
    },
    ignorePatterns: [
      "**/dist",
      "**/.next",
      "**/node_modules",
      "apps/tsx_md/.tanstack",
      "apps/tsx_md/routeTree.gen.ts",
      "apps/tsx_md/src/routeTree.gen.ts",
    ],
  },
  staged: {
    "*.{cjs,css,cts,html,js,json,jsonc,jsonl,jsx,md,mjs,mts,ts,tsx,yaml,yml}":
      "vp check --fix",
  },
  test: {
    globals: true,
    environment: "jsdom",
    include: [
      "apps/**/*.test.ts",
      "apps/**/*.test.tsx",
      "packages/**/*.test.ts",
      "packages/**/*.test.tsx",
    ],
    exclude: ["**/node_modules/**", "**/dist/**"],
  },
});
