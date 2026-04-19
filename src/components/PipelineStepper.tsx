import { pipelineSteps } from "@/lib/mock-data";
import type { LeadStatus } from "@/lib/mock-data";
import { Check } from "lucide-react";

export function PipelineStepper({ current }: { current: LeadStatus }) {
  // If current is "Cerrado perdido" or "Recompra", treat as no progress beyond Comprometido
  const idx = pipelineSteps.indexOf(current);
  const activeIdx = idx === -1 ? 0 : idx;

  return (
    <div className="flex items-start gap-1 overflow-x-auto pb-1">
      {pipelineSteps.map((step, i) => {
        const done = i < activeIdx;
        const active = i === activeIdx;
        return (
          <div key={step} className="flex flex-1 min-w-[88px] items-start gap-1">
            <div className="flex flex-col items-center gap-2">
              <div
                className={`grid h-8 w-8 place-items-center rounded-full border text-xs font-semibold ${
                  active
                    ? "bg-primary text-primary-foreground border-primary"
                    : done
                      ? "bg-foreground/10 text-foreground border-transparent"
                      : "bg-background text-muted-foreground border-border"
                }`}
              >
                {done ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <span
                className={`text-[11px] text-center leading-tight ${
                  active ? "font-medium text-foreground" : "text-muted-foreground"
                }`}
              >
                {step}
              </span>
            </div>
            {i < pipelineSteps.length - 1 && (
              <div className={`mt-4 h-px flex-1 ${i < activeIdx ? "bg-foreground/30" : "bg-border"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
