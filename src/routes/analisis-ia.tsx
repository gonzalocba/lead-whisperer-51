import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { topDestinations, wonVsLostByMonth } from "@/lib/mock-data";
import { Sparkles, TrendingUp, MessageSquare, Target, Trophy, XCircle, Clock, Download } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LabelList } from "recharts";
import { Button } from "@/components/ui/button";

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
  const handleDownloadPDF = () => {
    const lines: string[] = [];
    lines.push("ANÁLISIS IA GENERAL — LeadFlow");
    lines.push("================================");
    lines.push("");
    lines.push("INSIGHTS DEL EQUIPO · ÚLTIMOS 6 MESES");
    lines.push("--------------------------------------");
    lines.push(`Leads ganados: ${totalGanados} (+15% vs trim. anterior)`);
    lines.push(`Leads perdidos: ${totalPerdidos} (−8% vs trim. anterior)`);
    lines.push(`Tasa de cierre: ${tasaCierre}% (Promedio sector: 42%)`);
    lines.push(`Tiempo de cierre: 12 días (−2 días vs mes anterior)`);
    lines.push("");
    lines.push("TOP 5 DESTINOS (% sobre total de consultas)");
    lines.push("-------------------------------------------");
    topDestinations.forEach((d, i) => lines.push(`${i + 1}. ${d.name}: ${d.value}%`));
    lines.push("");
    lines.push("PATRONES DE OFERTA");
    lines.push("------------------");
    lines.push("• Cancún luna de miel: segmento con mayor tasa de cierre (62%). Preferencia clara por hoteles 4★ con upgrade premium.");
    lines.push("• Punta Cana familiar: presupuestos más altos pero ciclos de decisión largos (avg 14 días). Conviene seguimiento estructurado.");
    lines.push("• Caribe amigos: sensibles al precio. 70% pide 2+ cotizaciones. Mostrar comparativa desde el primer contacto.");
    lines.push("• México corporativo: volumen bajo pero tickets altos. Contacto telefónico convierte 3× más que WhatsApp.");
    lines.push("");
    lines.push("MEJORAS DE ATENCIÓN");
    lines.push("-------------------");
    lines.push("• Tiempo de primera respuesta: 23% de los leads esperaron más de 2h. Bajarlo a < 30min puede subir cierre estimado en 12pp.");
    lines.push("• Objeción precio recurrente: aparece en 41% de las negociaciones. Sumar opción \"ancla premium\" en cotizaciones para facilitar comparación.");
    lines.push("• Leads sin actividad > 5 días: hay 7 leads en este estado. Alta probabilidad de pérdida sin intervención.");
    lines.push("");
    lines.push("ACCIONES RECOMENDADAS");
    lines.push("---------------------");
    lines.push("1. Reactivar los 7 leads dormidos con un mensaje breve y oferta de fecha alternativa.");
    lines.push("2. Sumar plantilla de WhatsApp para luna de miel con dos opciones de presupuesto.");
    lines.push("3. Definir SLA interno de respuesta < 30 minutos en horario comercial.");
    lines.push("4. Probar 1 semana de llamadas en frío para leads corporativos México.");

    const html = `<!doctype html><html><head><meta charset="utf-8"><title>Análisis IA general</title>
<style>body{font-family:-apple-system,Segoe UI,Inter,sans-serif;padding:40px;color:#111;line-height:1.55;max-width:780px;margin:auto;}h1{font-size:20px;margin:0 0 4px;}pre{white-space:pre-wrap;font-family:inherit;font-size:13px;}@media print{body{padding:20px;}}</style>
</head><body><pre>${lines.join("\n").replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" }[c]!))}</pre>
<script>window.onload=()=>setTimeout(()=>window.print(),250);</script></body></html>`;
    const w = window.open("", "_blank");
    if (w) { w.document.write(html); w.document.close(); }
  };

  return (
    <AppShell>
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Análisis IA general</h1>
          <p className="text-sm text-muted-foreground">Insights del equipo · últimos 6 meses</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-xs">
            <Sparkles className="h-3.5 w-3.5" />
            <span className="text-muted-foreground">
              <span className="font-medium text-foreground">Tip IA:</span> tu tasa de cierre subió 4pp este mes.
            </span>
          </div>
          <Button variant="outline" size="sm" onClick={handleDownloadPDF}>
            <Download className="h-3.5 w-3.5" />
            Descargar PDF
          </Button>
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
