import { cn } from "@/lib/utils";

// ============================================
// Base Skeleton
// ============================================

interface SkeletonProps {
  className?: string;
}

function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn("animate-pulse rounded-md bg-warm-200", className)}
    />
  );
}

// ============================================
// MenuCard Skeleton
// ============================================

export function MenuCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-warm-200 bg-white">
      {/* image */}
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      {/* content */}
      <div className="p-4">
        <div className="mb-1 flex items-center justify-between">
          <Skeleton className="h-5 w-3/5" />
          <Skeleton className="h-5 w-14" />
        </div>
        <Skeleton className="mt-2 h-4 w-full" />
        <Skeleton className="mt-1.5 h-4 w-4/5" />
        <Skeleton className="mt-4 h-10 w-full rounded-lg" />
      </div>
    </div>
  );
}

export function MenuCardSkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }, (_, i) => (
        <MenuCardSkeleton key={i} />
      ))}
    </div>
  );
}

// ============================================
// Order Row Skeleton
// ============================================

export function OrderRowSkeleton() {
  return (
    <div className="flex items-center justify-between border-b border-warm-100 py-4">
      <div className="flex items-center gap-3">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-4 w-32" />
      </div>
      <div className="flex items-center gap-3">
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-4 w-16" />
      </div>
    </div>
  );
}

export function OrderRowSkeletonList({ count = 5 }: { count?: number }) {
  return (
    <div>
      {Array.from({ length: count }, (_, i) => (
        <OrderRowSkeleton key={i} />
      ))}
    </div>
  );
}

// ============================================
// Dashboard Stat Skeleton
// ============================================

export function StatCardSkeleton() {
  return (
    <div className="rounded-xl border border-warm-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-9 w-9 rounded-lg" />
      </div>
      <Skeleton className="mt-3 h-8 w-20" />
      <Skeleton className="mt-1 h-3 w-32" />
    </div>
  );
}

export function StatCardSkeletonGrid({ count = 4 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: count }, (_, i) => (
        <StatCardSkeleton key={i} />
      ))}
    </div>
  );
}

// ============================================
// Generic Page Skeleton
// ============================================

export function PageSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Skeleton className="mb-6 h-8 w-48" />
      <Skeleton className="mb-8 h-4 w-72" />
      <MenuCardSkeletonGrid />
    </div>
  );
}
