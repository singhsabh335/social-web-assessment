import { Loader2 } from "lucide-react";

export function Loader({ label = "Loading" }: { label?: string }) {
  return (
    <div role="status" className="flex items-center justify-center gap-2 py-16 text-sm text-muted">
      <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
      <span>{label}</span>
    </div>
  );
}

export function VideoSkeletons() {
  return (
    <div className="flex gap-3 overflow-hidden lg:grid lg:grid-cols-4">
      {Array.from({ length: 4 }, (_, index) => (
        <div
          key={index}
          className="aspect-[3/4] w-[46%] shrink-0 animate-pulse rounded-xl bg-white/8 lg:w-auto"
        />
      ))}
    </div>
  );
}
