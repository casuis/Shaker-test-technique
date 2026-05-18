export function LoadingBlock() {
  return (
    <div className="space-y-3" aria-label="Loading">
      <div className="h-8 w-48 animate-pulse rounded bg-stone-200" />
      <div className="h-28 animate-pulse rounded-md bg-stone-200" />
      <div className="h-48 animate-pulse rounded-md bg-stone-200" />
    </div>
  );
}
