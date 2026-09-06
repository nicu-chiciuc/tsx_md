import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router";
import type { ReactNode } from "react";
import "@/styles.css";
import { SamebaseAttribution } from "@/components/SamebaseAttribution";

function RootComponent() {
  return (
    <RootDocument>
      <div className="flex min-h-screen flex-col">
        <Outlet />
        <footer className="mx-auto w-full max-w-3xl px-5 py-3 text-right text-gray-500">
          <SamebaseAttribution />
        </footer>
      </div>
    </RootDocument>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function NotFoundPage() {
  return (
    <main className="flex flex-1 items-center justify-center bg-white px-6">
      <div className="max-w-prose">
        <p className="text-sm uppercase tracking-wide text-gray-500">404</p>
        <h1 className="mt-2 text-2xl font-semibold text-gray-900">Not found</h1>
        <p className="mt-3 text-gray-600">That page is not part of tsx.md.</p>
      </div>
    </main>
  );
}

export const Route = createRootRoute({
  component: RootComponent,
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "Typescript-oriented blog of Nicu Chiciuc",
      },
      {
        name: "description",
        content:
          "Contains articles and tools related to TypeScript, JSX, and Markdown.",
      },
    ],
  }),
  notFoundComponent: NotFoundPage,
});
