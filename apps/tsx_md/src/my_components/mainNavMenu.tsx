import { Link } from "@tanstack/react-router";

export function MainNavigationMenu() {
  return (
    <nav className="flex justify-center gap-4 px-7 py-6 text-sm text-gray-600">
      <Link
        to="/"
        activeOptions={{ exact: true }}
        activeProps={{ className: "font-medium text-gray-900" }}
        className="underline-offset-4 hover:text-gray-900 hover:underline"
      >
        tsx.md
      </Link>
      <Link
        to="/blog"
        activeProps={{ className: "font-medium text-gray-900" }}
        className="underline-offset-4 hover:text-gray-900 hover:underline"
      >
        Blog
      </Link>
      <Link
        to="/github.com"
        activeProps={{ className: "font-medium text-gray-900" }}
        className="underline-offset-4 hover:text-gray-900 hover:underline"
      >
        github.com
      </Link>
    </nav>
  );
}
