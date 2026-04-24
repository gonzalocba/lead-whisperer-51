import type { RecompraStatus } from "@/lib/recompra-data";

function classes(status: RecompraStatus): string {
  switch (status) {
    case "Convertido":
      return "bg-success/15 text-success border-success/30";
    case "Descartado":
      return "bg-destructive/10 text-destructive border-destructive/30";
    case "En seguimiento":
      return "bg-warning/20 text-warning-foreground border-warning/40";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
}

export function RecompraStatusBadge({ status }: { status: RecompraStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${classes(status)}`}
    >
      {status}
    </span>
  );
}
