import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { RecompraStatusBadge } from "@/components/RecompraStatusBadge";
import { RecompraStepper } from "@/components/RecompraStepper";
import { RecompraActionModal } from "@/components/RecompraActionModal";
import { RecompraAIPanel } from "@/components/RecompraAIPanel";
import { recompraClients, defaultRecompraActions } from "@/lib/recompra-data";
import type { RecompraAction, RecompraStatus } from "@/lib/recompra-data";
import { ArrowLeft, Plus, Sparkles, Download } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/recompra/")({
  loader: ({ params }) => {
    const client = recompraClients.find((c) => c.id === params.clientId);
    if (!client) throw notFound();
    return { client };
  },
  component: RecompraDetailPage,
  notFoundComponent: () => (
    <AppShell>
      <p className="text-sm text-muted-foreground">Cliente no encontrado.</p>
      <Link to="/recompra" className="mt-3 inline-block text-sm font-medium underline">Volver a la lista</Link>
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
  const { client } = Route.useLoaderData();
  const [actions, setActions] = useState<RecompraAction[]>(defaultRecompraActions);
  const [modalOpen, setModalOpen] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [status] = useState<RecompraStatus>(client.status);

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
    if (actions.length === 0) {
      lines.push("(sin acciones registradas)");
    } else {
      actions.forEach((a) => {
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
        <Link to="/recompra" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
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
          <RecompraStatusBadge status={status} />
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
        <RecompraStepper current={status} />
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
        <h2 className="border-b border-border px-5 py-3.5 text-sm font-semibold">Historial de acciones</h2>
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
              {actions.map((a, i) => (
                <tr key={i} className="border-t border-border">
                  <td className="px-5 py-3 text-muted-foreground">{a.date}</td>
                  <td className="px-5 py-3">{a.type}</td>
                  <td className="px-5 py-3">{a.result}</td>
                  <td className="px-5 py-3 text-muted-foreground">{a.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="space-y-3 p-4 md:hidden">
          {actions.map((a, i) => (
            <div key={i} className="rounded-lg border border-border p-3">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{a.date}</span>
                <span className="font-medium text-foreground">{a.type}</span>
              </div>
              <p className="mt-1 text-sm">{a.result}</p>
              <p className="mt-1 text-xs text-muted-foreground">{a.note}</p>
            </div>
          ))}
        </div>
      </section>

      {showAI && <RecompraAIPanel clientName={client.name} />}

      <RecompraActionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={(a) => {
          setActions((prev) => [a, ...prev]);
          setModalOpen(false);
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
