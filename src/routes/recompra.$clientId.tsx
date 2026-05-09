import { createFileRoute, Link, notFound, useRouter } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { RecompraStatusBadge } from "@/components/RecompraStatusBadge";
import { RecompraStepper } from "@/components/RecompraStepper";
import { RecompraActionModal } from "@/components/RecompraActionModal";
import { RecompraAIPanel } from "@/components/RecompraAIPanel";
import { recompraClients, defaultRecompraActions } from "@/lib/recompra-data";
import type { RecompraAction, RecompraStatus } from "@/lib/recompra-data";
import { ArrowLeft, Plus, Sparkles, Download } from "lucide-react";
import { useState } from "react";

import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/recompra/$clientId")({
  loader: async ({ params }) => {
    const { data: recompra, error } = await supabase.from('recompras').select(`
      *,
      leads(*),
      dim_servicios(nombre),
      dim_tipo_accion(nombre),
      dim_resultado_recompra(nombre)
    `).eq('id_recompra', params.clientId).single();

    if (error || !recompra) throw notFound();

    const leadName = Array.isArray(recompra.leads) ? recompra.leads[0]?.nombre : (recompra.leads?.nombre || 'Desconocido');
    const serviceName = Array.isArray(recompra.dim_servicios) ? recompra.dim_servicios[0]?.nombre : (recompra.dim_servicios?.nombre || 'Desconocido');
    
    const mapStatus = (id: any): RecompraStatus => {
      switch(Number(id)) {
        case 1: return "Pendiente";
        case 2: return "Contactado";
        case 3: return "En seguimiento";
        case 4: return "Convertido";
        case 5: return "Descartado";
        default: return "Pendiente";
      }
    };

    const lead = Array.isArray(recompra.leads) ? recompra.leads[0] : recompra.leads;
    const now = new Date();
    const lastPurchase = lead?.fecha_ultima_compra ? new Date(lead.fecha_ultima_compra) : null;
    const diffDays = lastPurchase ? Math.floor((now.getTime() - lastPurchase.getTime()) / (1000 * 60 * 60 * 24)) : 0;

    const client = {
      id: recompra.id_recompra,
      name: leadName,
      service: serviceName,
      status: mapStatus(recompra.id_estado_recompra),
      whatsapp: lead?.contacto || 'Sin contacto',
      lastPurchaseDate: lastPurchase ? lastPurchase.toLocaleDateString("es-AR") : 'N/A',
      purchasesCount: lead?.cantidad_compras || 0,
      totalValue: lead?.valor_total_cliente ? `$${lead.valor_total_cliente}` : '$0',
      timeSinceLastPurchase: `${diffDays} días`,
      assignedTo: lead?.id_vendedor === 1 ? 'Laura García' : 'Vendedor'
    };

    // Última acción (la única que guardamos según regla)
    const actionHistory = [];
    if (recompra.id_tipo_accion) {
      const tipoAccion = Array.isArray(recompra.dim_tipo_accion) ? recompra.dim_tipo_accion[0]?.nombre : (recompra.dim_tipo_accion?.nombre || 'Acción');
      const resultado = Array.isArray(recompra.dim_resultado_recompra) ? recompra.dim_resultado_recompra[0]?.nombre : (recompra.dim_resultado_recompra?.nombre || 'Resultado');
      const fContacto = new Date(recompra.fecha_contacto).toLocaleString("es-AR", {
        day: '2-digit', month: '2-digit', hour: '2-digit', minute:'2-digit'
      });
      actionHistory.push({
        date: fContacto,
        type: tipoAccion,
        result: resultado,
        note: recompra.observaciones || ''
      });
    }

    return { client, actionHistory };
  },
  component: RecompraDetailPage,
  notFoundComponent: () => (
    <AppShell>
      <p className="text-sm text-muted-foreground">Cliente no encontrado.</p>
      <Link to="/recompra" search={{ segmento: undefined }} className="mt-3 inline-block text-sm font-medium underline">Volver a la lista</Link>
    </AppShell>
  ),
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.client.name ?? "Cliente"} — Recompra` },
      { name: "description", content: `Perfil de recompra de ${loaderData?.client.name ?? ""}: contexto, estado y análisis IA.` },
    ],
  }),
});

function RecompraDetailPage() {
  const router = useRouter();
  const { client, actionHistory: initialHistory } = Route.useLoaderData();
  const [modalOpen, setModalOpen] = useState(false);
  const [showAI, setShowAI] = useState(false);

  const handleDownloadProfile = () => {
    const today = new Date().toLocaleDateString("es-AR");
    const lines: string[] = [];
    lines.push("PERFIL DE RECOMPRA — LeadFlow");
    lines.push("=============================");
    lines.push(`Generado: ${today}`);
    lines.push("");
    lines.push("ENCABEZADO");
    lines.push("----------");
    lines.push(`Cliente: ${client.name}`);
    lines.push(`Servicio (último viaje): ${client.service}`);
    lines.push(`Estado recompra: ${status}`);
    lines.push(`Vendedor asignado: ${client.assignedTo}`);
    lines.push("");
    lines.push("CONTEXTO CLIENTE");
    lines.push("----------------");
    lines.push(`WhatsApp: ${client.whatsapp}`);
    lines.push(`Fecha última compra: ${client.lastPurchaseDate}`);
    lines.push(`Cantidad de compras: ${client.purchasesCount}`);
    lines.push(`Valor total cliente: ${client.totalValue}`);
    lines.push(`Tiempo desde última compra: ${client.timeSinceLastPurchase}`);
    lines.push("");
    lines.push("HISTORIAL DE ACCIONES");
    lines.push("---------------------");
    if (initialHistory.length === 0) {
      lines.push("(sin acciones registradas)");
    } else {
      initialHistory.forEach((a) => {
        lines.push(`• ${a.date} — ${a.type} → ${a.result}${a.note ? ` | Nota: ${a.note}` : ""}`);
      });
    }
    lines.push("");
    lines.push("ANÁLISIS IA");
    lines.push("-----------");
    lines.push("Probabilidad de recompra: Alta (78%). Cliente dentro de la ventana óptima 12–18 meses.");
    lines.push("");
    lines.push("Tipo de oferta recomendada:");
    lines.push("• Upgrade sobre destino conocido.");
    lines.push("• Beneficio cliente recurrente: early check-in + traslados.");
    lines.push("");
    lines.push("Sensibilidad: orientada a experiencia (no a precio).");
    lines.push("Canal sugerido: WhatsApp.");
    lines.push("");
    lines.push("Estrategia: propuesta personalizada esta semana, anclar en viaje anterior, ventana corta de decisión (7 días).");

    const safe = lines.join("\n").replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" }[c]!));
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>Perfil Recompra — ${client.name}</title>
<style>body{font-family:-apple-system,Segoe UI,Inter,sans-serif;padding:40px;color:#111;line-height:1.55;max-width:780px;margin:auto;}pre{white-space:pre-wrap;font-family:inherit;font-size:13px;}@media print{body{padding:20px;}}</style>
</head><body><pre>${safe}</pre>
<script>window.onload=()=>setTimeout(()=>window.print(),250);</script></body></html>`;
    const w = window.open("", "_blank");
    if (w) { w.document.write(html); w.document.close(); }
  };

  return (
    <AppShell>
      <div className="mb-4">
        <Link to="/recompra" search={{ segmento: undefined }} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Volver
        </Link>
      </div>

      {/* Encabezado */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{client.name}</h1>
          <p className="text-sm text-muted-foreground">{client.service} · Último viaje</p>
        </div>
        <div className="flex items-center gap-3">
          <RecompraStatusBadge status={client.status as RecompraStatus} />
          <button
            onClick={handleDownloadProfile}
            className="inline-flex items-center justify-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-muted"
          >
            <Download className="h-4 w-4" /> Descargar perfil PDF
          </button>
        </div>
      </div>

      {/* Contexto cliente */}
      <section className="mb-5 rounded-xl border border-border bg-card p-5">
        <h2 className="mb-4 text-sm font-semibold">Contexto cliente</h2>
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Field label="WhatsApp" value={client.whatsapp} />
          <Field label="Fecha última compra" value={client.lastPurchaseDate} />
          <Field label="Cantidad de compras" value={String(client.purchasesCount)} />
          <Field label="Valor total cliente" value={client.totalValue} />
          <Field label="Tiempo desde última compra" value={client.timeSinceLastPurchase} />
          <Field label="Servicio" value={client.service} />
        </dl>
      </section>

      {/* Estado recompra */}
      <section className="mb-5 rounded-xl border border-border bg-card p-5">
        <h2 className="mb-4 text-sm font-semibold">Estado recompra</h2>
        <RecompraStepper current={client.status as any} />
      </section>

      {/* Vendedor */}
      <section className="mb-5 rounded-xl border border-border bg-card p-5">
        <h2 className="mb-3 text-sm font-semibold">Vendedor asignado</h2>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-muted text-xs font-semibold">LG</div>
            <div className="text-sm">{client.assignedTo}</div>
          </div>
          <select className="ml-auto rounded-md border border-input bg-background px-3 py-1.5 text-sm">
            <option>Laura García</option>
            <option>Martín López</option>
            <option>Sofía Ruiz</option>
          </select>
        </div>
      </section>

      {/* Action buttons */}
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" /> Registrar acción
        </button>
        <button
          onClick={() => setShowAI((v) => !v)}
          className="inline-flex items-center justify-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-muted"
        >
          <Sparkles className="h-4 w-4" /> {showAI ? "Ocultar análisis IA" : "Analizar con IA"}
        </button>
      </div>

      {/* Historial */}
      <section className="mb-5 rounded-xl border border-border bg-card">
        <h2 className="border-b border-border px-5 py-3.5 text-sm font-semibold">Última acción registrada</h2>
        <div className="hidden md:block">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-5 py-2.5 text-left font-medium">Fecha</th>
                <th className="px-5 py-2.5 text-left font-medium">Tipo</th>
                <th className="px-5 py-2.5 text-left font-medium">Resultado</th>
                <th className="px-5 py-2.5 text-left font-medium">Nota</th>
              </tr>
            </thead>
            <tbody>
              {initialHistory.map((a, i) => (
                <tr key={i} className="border-t border-border">
                  <td className="px-5 py-3 text-muted-foreground">{a.date}</td>
                  <td className="px-5 py-3">{a.type}</td>
                  <td className="px-5 py-3">{a.result}</td>
                  <td className="px-5 py-3 text-muted-foreground">{a.note}</td>
                </tr>
              ))}
              {initialHistory.length === 0 && (
                <tr className="border-t border-border">
                  <td colSpan={4} className="px-5 py-4 text-center text-muted-foreground">Sin acciones registradas.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="space-y-3 p-4 md:hidden">
          {initialHistory.map((a, i) => (
            <div key={i} className="rounded-lg border border-border p-3">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{a.date}</span>
                <span className="font-medium text-foreground">{a.type}</span>
              </div>
              <p className="mt-1 text-sm">{a.result}</p>
              <p className="mt-1 text-xs text-muted-foreground">{a.note}</p>
            </div>
          ))}
          {initialHistory.length === 0 && (
            <div className="text-center text-xs text-muted-foreground p-3">Sin acciones registradas.</div>
          )}
        </div>
      </section>

      {showAI && <RecompraAIPanel clientName={client.name} />}

      <RecompraActionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={async (a) => {
          const now = new Date();
          const nextDate = new Date();
          nextDate.setDate(now.getDate() + a.dias_proxima_accion);
          
          await supabase.from('recompras').update({
            id_tipo_accion: a.id_tipo_accion,
            id_resultado_recompra: a.id_resultado_recompra,
            id_estado_recompra: a.id_estado_recompra,
            observaciones: a.observaciones,
            fecha_contacto: now.toISOString(),
            proxima_accion_fecha: nextDate.toISOString()
          }).eq('id_recompra', client.id);

          setModalOpen(false);
          router.invalidate(); // Refresca loader y la UI
        }}
      />
    </AppShell>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 text-sm font-medium">{value}</dd>
    </div>
  );
}
