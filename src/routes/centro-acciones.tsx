import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  AlertTriangle,
  TrendingUp,
  Zap,
  Activity,
  Clock,
  RefreshCw,
  Target,
} from "lucide-react";

export const Route = createFileRoute("/centro-acciones")({
  component: CentroAccionesPage,
  head: () => ({
    meta: [
      { title: "Centro de acciones — LeadFlow" },
      {
        name: "description",
        content: "Pantalla operativa para ejecutar acciones sobre leads y clientes con prioridad clara.",
      },
    ],
  }),
});

type Priority = "urgent" | "opportunity" | "scale";

interface ActionItem {
  /** Verbo + volumen + segmento */
  title: string;
  /** Acción específica + canal */
  primaryLabel: string;
  /** Texto del link secundario */
  secondaryLabel: string;
  /** Ruta de la lista filtrada */
  listHref: string;
  /** Contexto mínimo (1 línea) */
  context?: string;
}

const priorityMeta: Record<Priority, { bar: string; ring: string }> = {
  urgent: {
    bar: "bg-red-500",
    ring: "hover:border-red-500/40",
  },
  opportunity: {
    bar: "bg-amber-500",
    ring: "hover:border-amber-500/40",
  },
  scale: {
    bar: "bg-emerald-500",
    ring: "hover:border-emerald-500/40",
  },
};

const urgentes: ActionItem[] = [
  {
    title: "Contactar 5 leads sin respuesta",
    primaryLabel: "Enviar mensajes por WhatsApp",
    secondaryLabel: "Ver leads",
    listHref: "/leads",
    context: "+30% recuperación estimada",
  },
  {
    title: "Resolver 3 follow-ups vencidos",
    primaryLabel: "Enviar mensaje de seguimiento",
    secondaryLabel: "Ver leads",
    listHref: "/leads",
    context: "Evita pérdida de oportunidades",
  },
  {
    title: "Contactar 4 clientes para recompra",
    primaryLabel: "Enviar mensajes por WhatsApp",
    secondaryLabel: "Ver clientes",
    listHref: "/recompra",
    context: "Ticket promedio: $1.8k",
  },
];

const oportunidades: ActionItem[] = [
  {
    title: "Reactivar 6 leads en negociación",
    primaryLabel: "Enviar mensaje de cierre",
    secondaryLabel: "Ver leads",
    listHref: "/leads",
    context: "Alta probabilidad de cierre",
  },
  {
    title: "Contactar 3 leads de alto valor",
    primaryLabel: "Agendar llamada",
    secondaryLabel: "Ver leads",
    listHref: "/leads",
    context: "Mayor impacto en revenue",
  },
  {
    title: "Activar 4 leads con alta intención",
    primaryLabel: "Enviar propuesta por WhatsApp",
    secondaryLabel: "Ver leads",
    listHref: "/leads",
    context: "Tasa de cierre histórica: 42%",
  },
];

const escala: ActionItem[] = [
  {
    title: "Lanzar recompra a 7 clientes",
    primaryLabel: "Enviar campaña de recompra",
    secondaryLabel: "Ver clientes",
    listHref: "/recompra",
    context: "Conversión estimada: 18%",
  },
  {
    title: "Contactar 10 leads interesados en Cancún",
    primaryLabel: "Enviar campaña por destino",
    secondaryLabel: "Ver leads",
    listHref: "/leads",
    context: "Mensaje segmentado por destino",
  },
  {
    title: "Reactivar 8 leads dormidos",
    primaryLabel: "Enviar campaña de reactivación",
    secondaryLabel: "Ver leads",
    listHref: "/leads",
    context: "Recupera ~12% del pipeline frío",
  },
];

const kpis = [
  { label: "Acciones pendientes hoy", value: "12", icon: Activity },
  { label: "Leads sin actividad", value: "13", icon: Clock },
  { label: "Recompras activas", value: "11", icon: RefreshCw },
  { label: "Conversión estimada", value: "24%", icon: Target },
];

function ActionCard({ item, priority }: { item: ActionItem; priority: Priority }) {
  const p = priorityMeta[priority];

  return (
    <Card
      className={`relative overflow-hidden border transition-colors ${p.ring} flex flex-col`}
    >
      <span className={`absolute left-0 top-0 h-full w-1 ${p.bar}`} aria-hidden />
      <CardHeader className="pb-3 pl-6">
        <CardTitle className="text-base leading-snug">{item.title}</CardTitle>
      </CardHeader>
      <CardContent className="pl-6 pt-0 flex flex-col gap-3 flex-1">
        <Button
          className="w-full justify-center"
          onClick={() => toast.success(item.primaryLabel)}
        >
          {item.primaryLabel}
        </Button>
        <div className="flex items-center justify-between text-xs">
          <Link
            to={item.listHref}
            className="text-primary hover:underline font-medium"
          >
            {item.secondaryLabel}
          </Link>
          {item.context ? (
            <span className="text-muted-foreground">{item.context}</span>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}

function Section({
  title,
  subtitle,
  icon: Icon,
  priority,
  items,
}: {
  title: string;
  subtitle: string;
  icon: typeof AlertTriangle;
  priority: Priority;
  items: ActionItem[];
}) {
  const p = priorityMeta[priority];
  return (
    <section className="mb-8">
      <div className="mb-3 flex items-center gap-2">
        <span className={`inline-block h-2.5 w-2.5 rounded-full ${p.bar}`} aria-hidden />
        <Icon className="h-4 w-4 text-muted-foreground" />
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
        <span className="text-sm text-muted-foreground">— {subtitle}</span>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((it) => (
          <ActionCard key={it.title} item={it} priority={priority} />
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
        <p className="text-sm text-muted-foreground">Prioridad operativa del día</p>
      </div>

      {/* KPIs superiores */}
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
        priority="urgent"
        items={urgentes}
      />

      <Section
        title="Oportunidades"
        subtitle="Foco en conversión"
        icon={TrendingUp}
        priority="opportunity"
        items={oportunidades}
      />

      <Section
        title="Automatización / Escala"
        subtitle="Acciones masivas"
        icon={Zap}
        priority="scale"
        items={escala}
      />
    </AppShell>
  );
}
