export default function OrderLoading() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <div className="mx-auto h-14 w-14 animate-pulse rounded-full bg-warm-200" />
        <div className="mx-auto mt-4 h-8 w-48 animate-pulse rounded-md bg-warm-200" />
        <div className="mx-auto mt-2 h-4 w-64 animate-pulse rounded-md bg-warm-200" />
      </div>
      <div className="mt-8 h-40 animate-pulse rounded-xl bg-warm-200" />
      <div className="mt-6 h-64 animate-pulse rounded-xl bg-warm-200" />
    </div>
  );
}
