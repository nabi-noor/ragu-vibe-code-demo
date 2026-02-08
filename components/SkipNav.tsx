export function SkipNavLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-primary-600 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white focus:shadow-lg"
    >
      Skip to main content
    </a>
  );
}

export function SkipNavTarget() {
  return <div id="main-content" tabIndex={-1} className="outline-none" />;
}
