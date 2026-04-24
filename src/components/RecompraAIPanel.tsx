import { Sparkles, AlertTriangle, TrendingUp, Lightbulb, MessageCircle } from "lucide-react";

export function RecompraAIPanel({ clientName }: { clientName: string }) {
  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex items-center gap-2 border-b border-border px-5 py-3.5">
        <Sparkles className="h-4 w-4" />
        <h2 className="text-sm font-semibold">Análisis IA — {clientName}</h2>
      </div>

      <div className="space-y-5 p-5 text-sm leading-relaxed">
        <Section icon={<Lightbulb className="h-4 w-4" />} title="Probabilidad de recompra">
          Alta (78%). El cliente repitió compra previamente y se encuentra dentro de la ventana óptima
          de recompra (12–18 meses). Mantiene un ticket promedio creciente y respuesta positiva al
          último contacto.
        </Section>

        <Section icon={<TrendingUp className="h-4 w-4 text-success" />} title="Tipo de oferta recomendada">
          <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
            <li>Paquete upgrade sobre el destino ya conocido (mismo Caribe, mejor categoría).</li>
            <li>Beneficio exclusivo cliente recurrente: early check-in + traslados incluidos.</li>
          </ul>
        </Section>

        <Section icon={<AlertTriangle className="h-4 w-4 text-warning-foreground" />} title="Sensibilidad del cliente">
          Perfil orientado a <span className="font-medium text-foreground">experiencia</span> por sobre precio.
          Valora servicios incluidos y comodidad. Evitar competir solo por descuento; reforzar diferenciales.
        </Section>

        <Section icon={<MessageCircle className="h-4 w-4" />} title="Canal sugerido">
          <p className="text-muted-foreground">
            WhatsApp como canal principal (último contacto exitoso). Llamada solo para confirmar reserva.
          </p>
        </Section>

        <Section icon={<Sparkles className="h-4 w-4" />} title="Estrategia recomendada">
          <p className="text-muted-foreground">
            Enviar propuesta personalizada esta semana destacando continuidad de experiencia. Anclar en su
            viaje anterior y ofrecer una mejora concreta. Cerrar con ventana corta de decisión (7 días).
          </p>
          <blockquote className="mt-3 rounded-md border-l-2 border-foreground/40 bg-muted/40 px-3 py-2 text-sm italic text-foreground/80">
            "Sé que disfrutaste mucho tu último viaje al Caribe. Te armé una opción para repetir, pero esta vez
            con un upgrade pensado para vos. ¿Te paso los detalles?"
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
