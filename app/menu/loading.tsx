import { MenuCardSkeletonGrid } from "@/components/Skeletons";

export default function MenuLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="h-9 w-40 animate-pulse rounded-md bg-warm-200" />
        <div className="mt-2 h-4 w-64 animate-pulse rounded-md bg-warm-200" />
      </div>
      <div className="mb-6 h-12 w-full animate-pulse rounded-lg bg-warm-200" />
      <MenuCardSkeletonGrid count={6} />
    </div>
  );
}
