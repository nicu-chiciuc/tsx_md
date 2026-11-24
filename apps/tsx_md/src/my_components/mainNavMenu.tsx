import { Link } from "@tanstack/react-router";

const navItems = [
  { exact: true, label: "tsx.md", to: "/" },
  { exact: false, label: "Blog", to: "/blog" },
  { exact: false, label: "github.com", to: "/github.com" },
] as const;

export function MainNavigationMenu() {
  return (
    <nav className="flex justify-center gap-4 px-7 py-6 text-sm text-gray-600">
      {navItems.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          data-label={item.label}
          activeOptions={item.exact ? { exact: true } : undefined}
          activeProps={{ className: "font-medium text-gray-900" }}
          className="inline-flex flex-col items-center underline-offset-4 hover:text-gray-900 hover:underline after:pointer-events-none after:invisible after:h-0 after:overflow-hidden after:font-medium after:select-none after:content-[attr(data-label)]"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
