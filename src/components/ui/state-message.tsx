import { Button } from "@/components/ui/button";

interface StateMessageProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ title, description }: StateMessageProps) {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center rounded-2xl border border-dashed border-white/12 bg-white/[0.03] px-6 py-12 text-center">
      <p className="text-base font-medium text-white">{title}</p>
      {description ? <p className="mt-2 max-w-md text-sm text-muted">{description}</p> : null}
    </div>
  );
}

export function ErrorState({ title, description, actionLabel = "Try again", onAction }: StateMessageProps) {
  return (
    <div
      role="alert"
      className="flex min-h-48 flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-12 text-center"
    >
      <p className="text-base font-medium text-white">{title}</p>
      {description ? <p className="mt-2 max-w-md text-sm text-muted">{description}</p> : null}
      {onAction ? (
        <Button className="mt-4" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
