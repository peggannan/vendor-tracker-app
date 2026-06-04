// src/components/Skeleton.jsx

// Base skeleton block
function Bone({ className = "" }) {
  return (
    <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded-xl ${className}`} />
  );
}

// Card skeleton — mimics a product/transaction card
export function CardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-3">
      <Bone className="w-14 h-14 rounded-xl flex-shrink-0" />
      <div className="flex-1 flex flex-col gap-2">
        <Bone className="h-4 w-2/3" />
        <Bone className="h-3 w-1/2" />
        <Bone className="h-3 w-1/3" />
      </div>
      <Bone className="w-16 h-8 rounded-full flex-shrink-0" />
    </div>
  );
}

// Stat card skeleton
export function StatSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
      <Bone className="h-3 w-1/2 mb-3" />
      <Bone className="h-8 w-3/4 mb-2" />
      <Bone className="h-3 w-1/3" />
    </div>
  );
}

// Transaction card skeleton
export function TransactionSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="flex justify-between mb-3">
        <Bone className="h-3 w-24" />
        <Bone className="h-3 w-16" />
      </div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <Bone className="w-10 h-10 rounded-xl flex-shrink-0" />
          <div className="flex flex-col gap-1.5">
            <Bone className="h-3.5 w-28" />
            <Bone className="h-3 w-20" />
          </div>
        </div>
        <div className="flex flex-col gap-1.5 items-end">
          <Bone className="h-4 w-16" />
          <Bone className="h-3 w-20" />
        </div>
      </div>
      <div className="flex justify-between pt-2 border-t border-gray-50 dark:border-gray-700">
        <Bone className="h-3 w-24" />
        <Bone className="h-6 w-20 rounded-full" />
      </div>
    </div>
  );
}

// Customer card skeleton
export function CustomerSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-3">
      <Bone className="w-11 h-11 rounded-full flex-shrink-0" />
      <div className="flex-1 flex flex-col gap-2">
        <Bone className="h-4 w-1/2" />
        <Bone className="h-3 w-1/3" />
        <Bone className="h-3 w-2/5" />
      </div>
      <div className="flex flex-col gap-1.5 items-end">
        <Bone className="h-4 w-16" />
        <Bone className="h-3 w-12" />
        <Bone className="h-5 w-20 rounded-full" />
      </div>
    </div>
  );
}

// Dashboard stat grid skeleton
export function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        <StatSkeleton />
        <StatSkeleton />
        <StatSkeleton />
        <StatSkeleton />
      </div>
      <Bone className="h-28 w-full rounded-2xl" />
      <div className="flex flex-col gap-3">
        {[1, 2, 3].map((i) => <TransactionSkeleton key={i} />)}
      </div>
    </div>
  );
}

// Page list skeleton — generic list of cards
export function ListSkeleton({ count = 4, type = "card" }) {
  const SkeletonComponent = {
    card: CardSkeleton,
    transaction: TransactionSkeleton,
    customer: CustomerSkeleton,
    stat: StatSkeleton,
  }[type] ?? CardSkeleton;

  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonComponent key={i} />
      ))}
    </div>
  );
}