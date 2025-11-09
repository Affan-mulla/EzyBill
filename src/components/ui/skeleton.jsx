import { cn } from "@/lib/utils";

/**
 * Base Skeleton component for loading states
 * Provides a shimmer animation effect
 */
function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-muted/50 dark:bg-neutral-800/50",
        className
      )}
      {...props}
    />
  );
}

/**
 * Table Skeleton - Shows loading state for data tables
 * @param {number} rows - Number of rows to display (default: 5)
 * @param {number} columns - Number of columns to display (default: 6)
 */
function TableSkeleton({ rows = 5, columns = 6 }) {
  return (
    <div className="rounded-md border">
      <div className="border-b">
        <div className="flex items-center h-12 px-4 gap-4">
          {Array.from({ length: columns }).map((_, i) => (
            <Skeleton key={i} className="h-4 flex-1" />
          ))}
        </div>
      </div>
      <div>
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="border-b last:border-0">
            <div className="flex items-center h-16 px-4 gap-4">
              {Array.from({ length: columns }).map((_, colIndex) => (
                <Skeleton key={colIndex} className="h-4 flex-1" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Card Skeleton - Shows loading state for card components
 */
function CardSkeleton() {
  return (
    <div className="rounded-lg border p-6 space-y-4">
      <Skeleton className="h-6 w-2/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-4/5" />
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
      </div>
    </div>
  );
}

/**
 * Product Table Skeleton - Specific skeleton for product listings
 */
function ProductTableSkeleton({ rows = 5 }) {
  return (
    <div className="space-y-4">
      {/* Search and filter skeleton */}
      <div className="flex items-center gap-4 py-4">
        <Skeleton className="h-10 w-full max-w-sm" />
      </div>
      
      {/* Table skeleton */}
      <TableSkeleton rows={rows} columns={6} />
      
      {/* Pagination skeleton */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-9 w-24" />
      </div>
    </div>
  );
}

/**
 * Form Skeleton - Shows loading state for forms
 */
function FormSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-24 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-10 w-full" />
      </div>
      <Skeleton className="h-10 w-32" />
    </div>
  );
}

export { 
  Skeleton, 
  TableSkeleton, 
  CardSkeleton, 
  ProductTableSkeleton,
  FormSkeleton 
};
