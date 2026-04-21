import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { statusCounts, wonVsLostByMonth, topDestinations } from "@/lib/mock-data";
import { ArrowUpRight, Sparkles, Clock, MapPin, BrainCircuit } from "lucide-react";
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
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-foreground" /> Ganados
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full" style={{ background: "var(--muted-foreground)" }} /> Perdidos
            </span>
            <span className="ml-2">Mensual</span>
          </div>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={wonVsLostByMonth} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--foreground)" stopOpacity={0.22} />
                  <stop offset="95%" stopColor="var(--foreground)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--muted-foreground)" stopOpacity={0.18} />
                  <stop offset="95%" stopColor="var(--muted-foreground)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
              <Area type="monotone" dataKey="ganados" stroke="var(--foreground)" fill="url(#g1)" strokeWidth={2} />
              <Area type="monotone" dataKey="perdidos" stroke="var(--muted-foreground)" fill="url(#g2)" strokeWidth={2} strokeDasharray="4 3" />
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
            <span className="relative inline-flex h-7 w-7 items-center justify-center rounded-md bg-foreground/5 ring-1 ring-border">
              <BrainCircuit className="h-4 w-4 text-foreground" strokeWidth={1.75} />
              <Sparkles className="absolute -right-1 -top-1 h-3 w-3 text-foreground" strokeWidth={2} />
            </span>
            <span className="font-medium text-foreground">Análisis IA general</span>
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

function DestinationsBarChart() {
  const data = topDestinations.slice(0, 5);
  const maxValue = Math.max(...data.map((d) => d.value));
  const highlightIndex = data.findIndex((d) => d.value === maxValue);

  return (
    <div className="mt-3">
      <div className="h-44 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 18, right: 4, left: -28, bottom: 0 }} barCategoryGap="28%">
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis
              dataKey="name"
              stroke="var(--muted-foreground)"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              interval={0}
            />
            <YAxis
              stroke="var(--muted-foreground)"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip
              cursor={{ fill: "var(--muted)", opacity: 0.4 }}
              contentStyle={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                fontSize: 12,
              }}
              formatter={(value) => [`${value}%`, "Consultas"]}
            />
            <Bar dataKey="value" radius={[20, 20, 20, 20]} label={renderBarLabel(highlightIndex) as any}>
              {data.map((_, i) => (
                <Cell
                  key={i}
                  fill={i === highlightIndex ? "var(--foreground)" : "var(--muted)"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function renderBarLabel(highlightIndex: number) {
  return (props: any) => {
    const x = Number(props.x ?? 0);
    const y = Number(props.y ?? 0);
    const width = Number(props.width ?? 0);
    const value = props.value ?? 0;
    const index = props.index ?? -1;
    if (index !== highlightIndex) return <g />;
    const cx = x + width / 2;
    const cy = y - 10;
    const label = `${value}%`;
    const w = label.length * 6 + 12;
    return (
      <g>
        <rect x={cx - w / 2} y={cy - 12} width={w} height={18} rx={4} fill="var(--foreground)" />
        <text x={cx} y={cy + 1} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--background)">
          {label}
        </text>
      </g>
    );
  };
}
