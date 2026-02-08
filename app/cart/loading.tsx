export default function CartLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 h-9 w-36 animate-pulse rounded-md bg-warm-200" />
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {Array.from({ length: 3 }, (_, i) => (
            <div
              key={i}
              className="h-24 animate-pulse rounded-xl bg-warm-200"
            />
          ))}
        </div>
        <div className="h-64 animate-pulse rounded-xl bg-warm-200" />
      </div>
    </div>
  );
}
