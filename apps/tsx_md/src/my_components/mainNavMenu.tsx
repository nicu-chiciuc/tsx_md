import { Link } from "@tanstack/react-router";

export function MainNavigationMenu() {
  return (
    <nav className="flex justify-center gap-4 px-7 py-6 text-sm">
      <Link to="/" className="underline-offset-4 hover:underline">
        tsx.md
      </Link>
      <Link to="/blog" className="underline-offset-4 hover:underline">
        Blog & Apps
      </Link>
      <Link to="/github.com" className="underline-offset-4 hover:underline">
        github.com
      </Link>
    </nav>
  );
}
