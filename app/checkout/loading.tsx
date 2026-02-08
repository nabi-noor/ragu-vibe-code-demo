export default function CheckoutLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 h-9 w-40 animate-pulse rounded-md bg-warm-200" />
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="h-48 animate-pulse rounded-xl bg-warm-200" />
          <div className="h-32 animate-pulse rounded-xl bg-warm-200" />
        </div>
        <div className="h-72 animate-pulse rounded-xl bg-warm-200" />
      </div>
    </div>
  );
}
