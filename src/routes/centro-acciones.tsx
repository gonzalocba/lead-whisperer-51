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
  MessageCircle,
  Phone,
  Mail,
  Users,
  ArrowRight,
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
type Channel = "whatsapp" | "call" | "email" | "campaign";

interface ActionItem {
  /** Verbo + objeto: la acción que el usuario hará */
  title: string;
  /** A quién afecta */
  audience: string;
  /** Cantidad afectada */
  count: number;
  /** Canal */
  channel: Channel;
  /** Impacto esperado en una línea */
  impact: string;
  /** Etiqueta del botón primario */
  primaryLabel: string;
  /** Ruta de la lista filtrada */
  listHref: string;
}

const channelMeta: Record<Channel, { label: string; icon: typeof MessageCircle }> = {
  whatsapp: { label: "WhatsApp", icon: MessageCircle },
  call: { label: "Llamada", icon: Phone },
  email: { label: "Email", icon: Mail },
  campaign: { label: "Campaña masiva", icon: Users },
};

const priorityMeta: Record<
  Priority,
  { bar: string; chip: string; ring: string; label: string }
> = {
  urgent: {
    bar: "bg-red-500",
    chip: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
    ring: "hover:border-red-500/40",
    label: "Urgente",
  },
  opportunity: {
    bar: "bg-amber-500",
    chip: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    ring: "hover:border-amber-500/40",
    label: "Oportunidad",
  },
  scale: {
    bar: "bg-emerald-500",
    chip: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    ring: "hover:border-emerald-500/40",
    label: "Escala",
  },
};

const urgentes: ActionItem[] = [
  {
    title: "Contactar leads sin respuesta",
    audience: "Leads con > 24h sin contestar",
    count: 5,
    channel: "whatsapp",
    impact: "Recupera ~30% antes de enfriarse",
    primaryLabel: "Generar mensaje",
    listHref: "/leads",
  },
  {
    title: "Resolver follow-ups vencidos",
    audience: "Leads con seguimiento atrasado",
    count: 3,
    channel: "call",
    impact: "Evita pérdida de oportunidades en negociación",
    primaryLabel: "Ver leads",
    listHref: "/leads",
  },
  {
    title: "Iniciar contacto de recompra",
    audience: "Clientes en ventana activa",
    count: 4,
    channel: "whatsapp",
    impact: "Ticket promedio recompra: $1.8k",
    primaryLabel: "Ejecutar acción",
    listHref: "/recompra",
  },
];

const oportunidades: ActionItem[] = [
  {
    title: "Reactivar leads en negociación",
    audience: "Leads en negociación sin actividad reciente",
    count: 6,
    channel: "whatsapp",
    impact: "Alta probabilidad de cierre esta semana",
    primaryLabel: "Generar mensaje",
    listHref: "/leads",
  },
  {
    title: "Contactar leads de alto valor",
    audience: "Leads con ticket estimado > $3k",
    count: 3,
    channel: "call",
    impact: "Mayor impacto en revenue mensual",
    primaryLabel: "Ver leads",
    listHref: "/leads",
  },
  {
    title: "Activar leads con alta intención",
    audience: "Leads con interacción en últimas 48h",
    count: 4,
    channel: "whatsapp",
    impact: "Tasa de cierre histórica: 42%",
    primaryLabel: "Enviar propuesta",
    listHref: "/leads",
  },
];

const escala: ActionItem[] = [
  {
    title: "Ejecutar campaña de recompra",
    audience: "Clientes listos para recompra",
    count: 7,
    channel: "campaign",
    impact: "Conversión estimada: 18%",
    primaryLabel: "Ejecutar campaña",
    listHref: "/recompra",
  },
  {
    title: "Campaña por destino: Cancún",
    audience: "Leads interesados en Cancún",
    count: 10,
    channel: "campaign",
    impact: "Mensaje segmentado por destino",
    primaryLabel: "Ejecutar campaña",
    listHref: "/leads",
  },
  {
    title: "Reactivar leads dormidos",
    audience: "Leads inactivos > 5 días",
    count: 8,
    channel: "campaign",
    impact: "Recupera ~12% del pipeline frío",
    primaryLabel: "Ejecutar campaña",
    listHref: "/leads",
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
  const ch = channelMeta[item.channel];
  const ChIcon = ch.icon;

  return (
    <Card className={`relative overflow-hidden border transition-colors ${p.ring}`}>
      <span className={`absolute left-0 top-0 h-full w-1 ${p.bar}`} aria-hidden />
      <CardHeader className="pb-3 pl-5">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base leading-snug">{item.title}</CardTitle>
          <span
            className={`shrink-0 inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${p.chip}`}
          >
            {p.label}
          </span>
        </div>
        <CardDescription className="flex items-center gap-1.5 text-foreground/80">
          <Users className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="font-medium">{item.count}</span>
          <span className="text-muted-foreground">· {item.audience}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="pl-5 pt-0">
        <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs">
          <span className="inline-flex items-center gap-1.5 text-muted-foreground">
            <ChIcon className="h-3.5 w-3.5" />
            Canal: <span className="text-foreground font-medium">{ch.label}</span>
          </span>
          <span className="inline-flex items-center gap-1.5 text-muted-foreground">
            <TrendingUp className="h-3.5 w-3.5" />
            <span className="text-foreground">{item.impact}</span>
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            onClick={() =>
              toast.success(`${item.primaryLabel}`, {
                description: `${item.count} ${item.audience.toLowerCase()}`,
              })
            }
          >
            {item.primaryLabel}
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
          <Button size="sm" variant="outline" asChild>
            <Link to={item.listHref}>Ver lista</Link>
          </Button>
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
