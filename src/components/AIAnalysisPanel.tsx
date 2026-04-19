import { Sparkles, AlertTriangle, TrendingUp, Lightbulb } from "lucide-react";

export function AIAnalysisPanel({ leadName }: { leadName: string }) {
  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex items-center gap-2 border-b border-border px-5 py-3.5">
        <Sparkles className="h-4 w-4" />
        <h2 className="text-sm font-semibold">Análisis IA — {leadName}</h2>
      </div>

      <div className="space-y-5 p-5 text-sm leading-relaxed">
        <Section icon={<Lightbulb className="h-4 w-4" />} title="Diagnóstico">
          El lead muestra interés genuino: respondió positivamente al primer contacto y solicitó cotización.
          Sin embargo, lleva 1 día sin actividad tras el último mensaje. El presupuesto declarado es ajustado
          para luna de miel en Cancún en temporada alta de agosto.
        </Section>

        <Section icon={<AlertTriangle className="h-4 w-4 text-warning-foreground" />} title="Objeciones detectadas">
          <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
            <li>Posible objeción de precio: el rango $1.000–$2.000 USD puede ser insuficiente para 2 pasajeros en agosto. Conviene validar expectativas antes de enviar cotización.</li>
            <li>Sin objeción de fecha detectada aún.</li>
          </ul>
        </Section>

        <Section icon={<TrendingUp className="h-4 w-4 text-success" />} title="Señales de interés">
          <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
            <li>Respondió positivo en el primer contacto.</li>
            <li>Especificó tipo de viaje (luna de miel): hay motivación emocional, no solo precio.</li>
            <li>Fecha definida (agosto 2026): tiene urgencia real.</li>
          </ul>
        </Section>

        <Section icon={<Sparkles className="h-4 w-4" />} title="Estrategia recomendada">
          <p className="text-muted-foreground">
            Enviar cotización hoy con dos opciones: una dentro de su presupuesto (hotel 4 estrellas) y una
            opción premium con diferencia de precio clara. El anclaje emocional de luna de miel facilita el upgrade.
          </p>
          <blockquote className="mt-3 rounded-md border-l-2 border-foreground/40 bg-muted/40 px-3 py-2 text-sm italic text-foreground/80">
            "Te armé dos opciones para que elijas según lo que más se ajuste. La segunda incluye detalles
            especiales para luna de miel que suelen valer la pena..."
          </blockquote>
        </Section>
      </div>
    </div>
  );
}

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {icon}
        {title}
      </div>
      <div className="text-sm">{children}</div>
    </div>
  );
}
