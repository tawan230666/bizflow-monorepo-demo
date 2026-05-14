export const LoadingSpinner = ({ className = "" }: { className?: string }) => (
  <div
    className={`animate-spin rounded-full h-6 w-6 border-2 border-slate-200 border-t-sky-600 ${className}`}
  />
);
