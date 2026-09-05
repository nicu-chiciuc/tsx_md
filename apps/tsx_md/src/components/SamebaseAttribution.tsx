export function SamebaseAttribution() {
  return (
    <footer className="flex justify-center px-4 py-4 text-sm text-gray-500">
      <a
        href="https://samebase.com"
        target="_blank"
        rel="noreferrer"
        className="inline-flex min-h-11 items-center gap-2 rounded px-3 py-2 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
      >
        <span>Managed with</span>
        <img
          src="/assets/samebase.svg"
          alt=""
          aria-hidden="true"
          className="size-4"
        />
        <span>Samebase</span>
      </a>
    </footer>
  );
}
