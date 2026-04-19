import type { LeadStatus } from "./mock-data";

export function statusBadgeClasses(status: LeadStatus): string {
  switch (status) {
    case "Cerrado ganado":
      return "bg-success/15 text-success border-success/30";
    case "Cerrado perdido":
      return "bg-destructive/10 text-destructive border-destructive/30";
    case "Recompra":
      return "bg-warning/20 text-warning-foreground border-warning/40";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
}
