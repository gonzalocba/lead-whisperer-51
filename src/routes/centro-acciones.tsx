import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { AlertTriangle, TrendingUp, Zap, User, Brain, Activity, Clock, RefreshCw, Target } from "lucide-react";

export const Route = createFileRoute("/centro-acciones")({
  component: CentroAccionesPage,
  head: () => ({
    meta: [
      { title: "Centro de acciones — LeadFlow" },
      { name: "description", content: "Bandeja de trabajo priorizada con acciones urgentes, oportunidades y automatizaciones." },
    ],
  }),
});

type ActionType = "manual" | "ia" | "auto";

interface ActionCard {
  title: string;
  description: string;
  type: ActionType;
  actionLabel: string;
  listHref: { to: string };
}

const typeMeta: Record<ActionType, { label: string; icon: typeof User; className: string }> = {
  manual: { label: "Manual", icon: User, className: "bg-muted text-foreground border-border" },
  ia: { label: "Asistida IA", icon: Brain, className: "bg-primary/10 text-primary border-primary/20" },
  auto: { label: "Automatizable", icon: Zap, className: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20" },
};

const urgentes: ActionCard[] = [
  { title: "Leads sin respuesta > 24h", description: "5 leads esperando contacto", type: "auto", actionLabel: "Enviar WhatsApp", listHref: { to: "/leads" } },
  { title: "Follow-ups vencidos", description: "3 leads con acción pendiente", type: "manual", actionLabel: "Registrar seguimiento", listHref: { to: "/leads" } },
  { title: "Recompras sin contactar", description: "4 clientes en ventana activa", type: "auto", actionLabel: "Contactar ahora", listHref: { to: "/recompra" } },
];

const oportunidades: ActionCard[] = [
  { title: "Leads en negociación sin actividad", description: "6 leads con alta probabilidad de cierre", type: "ia", actionLabel: "Reactivar conversación", listHref: { to: "/leads" } },
  { title: "Leads alto valor", description: "3 leads con ticket alto", type: "manual", actionLabel: "Priorizar contacto", listHref: { to: "/leads" } },
  { title: "Leads con alta intención", description: "4 leads activos", type: "ia", actionLabel: "Enviar propuesta", listHref: { to: "/leads" } },
];

const escala: ActionCard[] = [
  { title: "Campaña de recompra activa", description: "7 clientes listos para recompra", type: "auto", actionLabel: "Enviar campaña", listHref: { to: "/recompra" } },
  { title: "Leads por destino (Cancún)", description: "10 leads similares", type: "auto", actionLabel: "Enviar mensaje segmentado", listHref: { to: "/leads" } },
  { title: "Leads dormidos (>5 días)", description: "8 leads inactivos", type: "auto", actionLabel: "Reactivar campaña", listHref: { to: "/leads" } },
];

const kpis = [
  { label: "Acciones pendientes hoy", value: "12", icon: Activity },
  { label: "Leads sin actividad", value: "13", icon: Clock },
  { label: "Recompras activas", value: "11", icon: RefreshCw },
  { label: "Conversión estimada", value: "24%", icon: Target },
];

function ActionItem({ card, accent }: { card: ActionCard; accent: "red" | "yellow" | "green" }) {
  const meta = typeMeta[card.type];
  const Icon = meta.icon;
  const accentBar = {
    red: "bg-red-500",
    yellow: "bg-amber-500",
    green: "bg-emerald-500",
  }[accent];

  return (
    <Card className="relative overflow-hidden">
      <span className={`absolute left-0 top-0 h-full w-1 ${accentBar}`} aria-hidden />
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base">{card.title}</CardTitle>
          <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium ${meta.className}`}>
            <Icon className="h-3 w-3" />
            {meta.label}
          </span>
        </div>
        <CardDescription>{card.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2 pt-0">
        <Button size="sm" onClick={() => toast.success(`Acción ejecutada: ${card.actionLabel}`)}>
          Ejecutar acción
        </Button>
        <Button size="sm" variant="outline" asChild>
          <Link to={card.listHref.to}>Ver lista</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

function Section({
  title,
  subtitle,
  icon: Icon,
  accent,
  cards,
  dotClass,
}: {
  title: string;
  subtitle: string;
  icon: typeof AlertTriangle;
  accent: "red" | "yellow" | "green";
  cards: ActionCard[];
  dotClass: string;
}) {
  return (
    <section className="mb-8">
      <div className="mb-3 flex items-center gap-2">
        <span className={`inline-block h-2.5 w-2.5 rounded-full ${dotClass}`} aria-hidden />
        <Icon className="h-4 w-4 text-muted-foreground" />
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
        <span className="text-sm text-muted-foreground">— {subtitle}</span>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <ActionItem key={c.title} card={c} accent={accent} />
        ))}
      </div>
    </section>
  );
}

function CentroAccionesPage() {
  return (
    <AppShell>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Centro de acciones</h1>
        <p className="text-sm text-muted-foreground">
          Prioridad operativa del día basada en comportamiento de leads y clientes.
        </p>
      </div>

      {/* Resumen operativo */}
      <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k) => {
          const Icon = k.icon;
          return (
            <Card key={k.label}>
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <div className="text-xs text-muted-foreground">{k.label}</div>
                  <div className="mt-1 text-2xl font-semibold">{k.value}</div>
                </div>
                <div className="grid h-9 w-9 place-items-center rounded-md bg-muted text-muted-foreground">
                  <Icon className="h-4 w-4" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Section
        title="Acciones urgentes"
        subtitle="Prioridad alta"
        icon={AlertTriangle}
        accent="red"
        cards={urgentes}
        dotClass="bg-red-500"
      />

      <Section
        title="Oportunidades"
        subtitle="Foco en conversión"
        icon={TrendingUp}
        accent="yellow"
        cards={oportunidades}
        dotClass="bg-amber-500"
      />

      <Section
        title="Automatización / Escala"
        subtitle="Acciones masivas"
        icon={Zap}
        accent="green"
        cards={escala}
        dotClass="bg-emerald-500"
      />
    </AppShell>
  );
}
