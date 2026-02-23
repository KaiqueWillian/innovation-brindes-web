import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';

export function ProductsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <Card key={`skeleton-${index}`} className="p-4">
          <Skeleton className="aspect-square rounded" />
          <Skeleton className="mt-4 h-4 w-4/5" />
          <Skeleton className="mt-2 h-3 w-2/5" />
          <Skeleton className="mt-2 h-3 w-3/4" />
          <Skeleton className="mt-5 h-10 w-full" />
        </Card>
      ))}
    </div>
  );
}


