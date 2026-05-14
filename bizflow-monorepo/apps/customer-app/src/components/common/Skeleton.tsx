interface Props {
  className?: string;
}

export const Skeleton = ({ className = "" }: Props) => (
  <div className={`animate-pulse bg-stone-200 rounded-lg ${className}`} />
);

export const FoodCardSkeleton = () => (
  <div className="bg-white rounded-2xl p-3 shadow-sm">
    <Skeleton className="w-full h-32 mb-3" />
    <Skeleton className="w-3/4 h-4 mb-2" />
    <Skeleton className="w-1/2 h-3" />
  </div>
);
