import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { topDestinations, wonVsLostByMonth } from "@/lib/mock-data";
import { Sparkles, TrendingUp, MessageSquare, Target, Trophy, XCircle, Clock } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

export const Route = createFileRoute("/analisis-ia")({
  component: AIGeneralPage,
  head: () => ({
    meta: [
      { title: "Análisis IA general — LeadFlow" },
      { name: "description", content: "Patrones de oferta, mejoras de atención y acciones recomendadas para tu equipo." },
    ],
  }),
});

const totalGanados = wonVsLostByMonth.reduce((s, m) => s + m.ganados, 0);
const totalPerdidos = wonVsLostByMonth.reduce((s, m) => s + m.perdidos, 0);
const tasaCierre = Math.round((totalGanados / (totalGanados + totalPerdidos)) * 100);

function AIGeneralPage() {
  return (
    <AppShell>
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Análisis IA general</h1>
          <p className="text-sm text-muted-foreground">Insights del equipo · últimos 6 meses</p>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-xs">
          <Sparkles className="h-3.5 w-3.5" />
          <span className="text-muted-foreground">
            <span className="font-medium text-foreground">Tip IA:</span> tu tasa de cierre subió 4pp este mes.
          </span>
        </div>
      </div>

      {/* KPIs */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPI icon={<Trophy className="h-3.5 w-3.5" />} label="Leads ganados" value={String(totalGanados)} sub="+15% vs trim. anterior" />
        <KPI icon={<XCircle className="h-3.5 w-3.5" />} label="Leads perdidos" value={String(totalPerdidos)} sub="−8% vs trim. anterior" />
        <KPI icon={<Target className="h-3.5 w-3.5" />} label="Tasa de cierre" value={`${tasaCierre}%`} sub="Promedio sector: 42%" />
        <KPI icon={<Clock className="h-3.5 w-3.5" />} label="Tiempo de cierre" value={"12 días"} sub="−2 días vs mes anterior" />
      </div>

      {/* Top destinos chart */}
      <section className="mb-6 rounded-xl border border-border bg-card p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold">Top 5 destinos</h2>
            <p className="text-xs text-muted-foreground">% sobre total de consultas</p>
          </div>
        </div>
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topDestinations} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.004 260)" vertical={false} />
              <XAxis dataKey="name" stroke="oklch(0.52 0.01 260)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="oklch(0.52 0.01 260)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
              <Bar dataKey="value" fill="oklch(0.45 0.02 260)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Patrones de oferta */}
      <Block icon={<TrendingUp className="h-4 w-4" />} title="Patrones de oferta">
        <ul className="grid gap-3 sm:grid-cols-2">
          <Insight title="Cancún luna de miel" body="Es el segmento con mayor tasa de cierre (62%). Preferencia clara por hoteles 4★ con upgrade premium." />
          <Insight title="Punta Cana familiar" body="Presupuestos más altos pero ciclos de decisión largos (avg 14 días). Conviene seguimiento estructurado." />
          <Insight title="Caribe amigos" body="Sensibles al precio: 70% pide 2+ cotizaciones. Mostrar comparativa desde el primer contacto." />
          <Insight title="México corporativo" body="Volumen bajo pero tickets altos. Contacto telefónico convierte 3× más que WhatsApp." />
        </ul>
      </Block>

      {/* Mejoras de atención */}
      <Block icon={<MessageSquare className="h-4 w-4" />} title="Mejoras de atención">
        <ul className="space-y-2.5 text-sm">
          <Bullet>
            <span className="font-medium">Tiempo de primera respuesta:</span> 23% de los leads esperaron más de 2h.
            Bajarlo a &lt; 30min puede subir cierre estimado en 12pp.
          </Bullet>
          <Bullet>
            <span className="font-medium">Objeción precio recurrente:</span> aparece en 41% de las negociaciones.
            Sumar opción "ancla premium" en cotizaciones para facilitar comparación.
          </Bullet>
          <Bullet>
            <span className="font-medium">Leads sin actividad &gt; 5 días:</span> hay 7 leads en este estado. Alta
            probabilidad de pérdida sin intervención.
          </Bullet>
        </ul>
      </Block>

      {/* Acciones recomendadas */}
      <Block icon={<Sparkles className="h-4 w-4" />} title="Acciones recomendadas">
        <div className="grid gap-3 sm:grid-cols-2">
          <Action n={1} text="Reactivar los 7 leads dormidos con un mensaje breve y oferta de fecha alternativa." />
          <Action n={2} text="Sumar plantilla de WhatsApp para luna de miel con dos opciones de presupuesto." />
          <Action n={3} text="Definir SLA interno de respuesta &lt; 30 minutos en horario comercial." />
          <Action n={4} text="Probar 1 semana de llamadas en frío para leads corporativos México." />
        </div>
      </Block>
    </AppShell>
  );
}

function KPI({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: string; sub: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">{icon}{label}</div>
      <p className="mt-3 text-2xl font-semibold tracking-tight">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{sub}</p>
    </div>
  );
}

function Block({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <section className="mb-5 rounded-xl border border-border bg-card">
      <div className="flex items-center gap-2 border-b border-border px-5 py-3.5 text-sm font-semibold">
        {icon}{title}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

function Insight({ title, body }: { title: string; body: string }) {
  return (
    <li className="rounded-lg border border-border p-3.5">
      <p className="text-sm font-medium">{title}</p>
      <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{body}</p>
    </li>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-2.5 leading-relaxed">
      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-foreground" />
      <span>{children}</span>
    </li>
  );
}

function Action({ n, text }: { n: number; text: string }) {
  return (
    <div className="flex gap-3 rounded-lg border border-border p-3.5">
      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground text-xs font-semibold">{n}</span>
      <p className="text-sm leading-relaxed">{text}</p>
    </div>
  );
}
