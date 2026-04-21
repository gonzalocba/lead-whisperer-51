import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { statusCounts, wonVsLostByMonth, topDestinations } from "@/lib/mock-data";
import { ArrowUpRight, Sparkles, Clock, MapPin } from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import { ClosingGauge } from "@/components/ClosingGauge";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
  head: () => ({
    meta: [
      { title: "Dashboard — LeadFlow" },
      { name: "description", content: "Métricas comerciales: leads por etapa, cierres vs perdidos y análisis IA." },
    ],
  }),
});

function DashboardPage() {
  return (
    <AppShell>
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Hola, Laura</h1>
          <p className="text-sm text-muted-foreground">
            Tenés <span className="font-medium text-foreground">3 leads</span> esperando una respuesta hace más de 24h.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-xs">
          <Sparkles className="h-3.5 w-3.5 text-foreground" />
          <span className="text-muted-foreground">
            <span className="font-medium text-foreground">Agente IA:</span> Buen momento para retomar a Ana M. — respondió positivo hace 1 día.
          </span>
        </div>
      </div>

      {/* Status chips */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {Object.entries(statusCounts).map(([label, count]) => (
          <div
            key={label}
            className="rounded-lg border border-border bg-card p-4"
          >
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="mt-1 text-2xl font-semibold tracking-tight">{count}</p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="mb-6 rounded-xl border border-border bg-card p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold">Cerrados vs Perdidos</h2>
            <p className="text-xs text-muted-foreground">Línea de tiempo · últimos 6 meses</p>
          </div>
          <span className="text-xs text-muted-foreground">Mensual</span>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={wonVsLostByMonth} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(0.66 0.14 150)" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="oklch(0.66 0.14 150)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(0.62 0.19 25)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="oklch(0.62 0.19 25)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.004 260)" vertical={false} />
              <XAxis dataKey="month" stroke="oklch(0.52 0.01 260)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="oklch(0.52 0.01 260)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
              <Area type="monotone" dataKey="ganados" stroke="oklch(0.66 0.14 150)" fill="url(#g1)" strokeWidth={2} />
              <Area type="monotone" dataKey="perdidos" stroke="oklch(0.62 0.19 25)" fill="url(#g2)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom KPI cards */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5" /> Promedio de cierre
          </div>
          <div className="mt-3">
            <ClosingGauge value={11} target={8} max={14} />
          </div>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            −2 días vs mes anterior
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" /> Destinos más consultados
          </div>
          <DestinationsBarChart />
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5" /> Análisis IA general
          </div>
          <p className="mt-3 text-sm leading-relaxed">
            Tu mejor canal sigue siendo <span className="font-medium">WhatsApp</span>. Los leads con respuesta &lt; 1h tienen 3× tasa de cierre.
          </p>
          <Link
            to="/analisis-ia"
            className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-foreground hover:underline"
          >
            Ver más <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
