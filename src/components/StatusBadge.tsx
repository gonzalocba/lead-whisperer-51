import { statusBadgeClasses } from "@/lib/status";
import type { LeadStatus } from "@/lib/mock-data";

export function StatusBadge({ status }: { status: LeadStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${statusBadgeClasses(status)}`}
    >
      {status}
    </span>
  );
}
