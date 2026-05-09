import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { StatusBadge } from "@/components/StatusBadge";
import { PipelineStepper } from "@/components/PipelineStepper";
import { ActionModal } from "@/components/ActionModal";
import { AIAnalysisPanel } from "@/components/AIAnalysisPanel";
import { pipelineSteps } from "@/lib/mock-data";
import type { ActionEntry, LeadStatus, Lead } from "@/lib/mock-data";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, Plus, Sparkles, Download } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/leads/$leadId")({
  loader: async ({ params }) => {
    // Buscar directamente por la clave primaria id_lead
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('id_lead', params.leadId)
      .single();

    if (error || !data) {
      console.error("Error cargando el lead desde Supabase:", error);
      throw notFound();
    }

    // Buscar acciones de este lead
    const { data: dbActions } = await supabase
      .from('acciones_dia')
      .select('*')
      .eq('id_lead', params.leadId)
      .order('fecha_accion', { ascending: false });

    // Buscar dimensiones para mapeos y dropdowns
    // Si no existen (ej. por RLS) retornarán [] o error
    const { data: tipos } = await supabase.from('dim_tipo_accion').select('*');
    const { data: resultados } = await supabase.from('dim_resultado_accion').select('*');

    let tiposList = tipos || [];
    let resultadosList = resultados || [];

    // Fallback antifrágil si las tablas de dimensiones están vacías o bloqueadas por RLS
    if (tiposList.length === 0) {
      tiposList = [
        { id_tipo_accion: 1, nombre: 'Llamada' },
        { id_tipo_accion: 2, nombre: 'WhatsApp' },
        { id_tipo_accion: 3, nombre: 'Email' },
        { id_tipo_accion: 4, nombre: 'Reunión' },
        { id_tipo_accion: 5, nombre: 'Seguimiento' }
      ];
    }

    if (resultadosList.length === 0) {
      resultadosList = [
        { id_resultado: 1, nombre: 'No responde' },
        { id_resultado: 2, nombre: 'Responde' },
        { id_resultado: 3, nombre: 'Interesado' },
        { id_resultado: 4, nombre: 'Solicita información' },
        { id_resultado: 5, nombre: 'Cotización enviada' },
        { id_resultado: 6, nombre: 'En análisis' },
        { id_resultado: 7, nombre: 'Rechazado' },
        { id_resultado: 8, nombre: 'Cerrado ganado' }
      ];
    }

    const mapEstado = (id: any) => {
      if (typeof id === 'string' && isNaN(Number(id))) return id;
      switch(Number(id)) {
        case 1: return 'Nuevo';
        case 2: return 'Contactado';
        case 3: return 'En negociación';
        case 4: return 'Cerrado ganado';
        case 5: return 'Cerrado perdido';
        default: return 'Nuevo';
      }
    };

    const lead: Lead = {
      id: data.id_lead || data.id || params.leadId,
      name: data.nombre || data.name || 'Sin nombre',
      destination: data.destino || data.destination || (data.id_servicio ? `Servicio #${data.id_servicio}` : 'Desconocido'),
      status: mapEstado(data.id_estado || data.estado || data.status) as LeadStatus,
      daysInPipeline: data.dias_pipeline || data.daysInPipeline || 0,
      whatsapp: data.contacto || data.whatsapp || '',
      tripType: data.tipo_viaje || data.tripType || '',
      passengers: data.pasajeros || data.passengers || 1,
      estimatedDate: data.fecha_estimada || data.estimatedDate || '',
      budget: data.presupuesto || data.budget || '',
      assignedTo: data.vendedor || data.assignedTo || ''
    };

    const mappedActions: ActionEntry[] = (dbActions || []).map((a: any) => {
      const tipoObj = tiposList.find(t => t.id_tipo_accion === a.id_tipo_accion);
      const resObj = resultadosList.find(r => r.id_resultado === a.id_resultado);
      
      return {
        date: new Date(a.fecha_accion).toLocaleString("es-AR", { 
          day: '2-digit', month: '2-digit', year: 'numeric', 
          hour: '2-digit', minute: '2-digit' 
        }),
        type: tipoObj?.nombre || a.id_tipo_accion || 'Desconocido',
        result: resObj?.nombre || a.id_resultado || 'Desconocido',
        note: a.descripcion || ''
      };
    });

    return { 
      lead, 
      initialActions: mappedActions,
      tipos: tiposList,
      resultados: resultadosList
    };
  },
  component: LeadDetailPage,
  notFoundComponent: () => (
    <AppShell>
      <p className="text-sm text-muted-foreground">Lead no encontrado.</p>
      <Link to="/leads" search={{ segmento: undefined }} className="mt-3 inline-block text-sm font-medium underline">Volver a la lista</Link>
    </AppShell>
  ),
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.lead.name ?? "Lead"} — LeadFlow` },
      { name: "description", content: `Perfil del lead ${loaderData?.lead.name ?? ""}: pipeline, historial y análisis IA.` },
    ],
  }),
});

function LeadDetailPage() {
  const { lead, initialActions, tipos, resultados } = Route.useLoaderData();
  const [actions, setActions] = useState<ActionEntry[]>(initialActions);
  const [modalOpen, setModalOpen] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [status, setStatus] = useState<LeadStatus>(lead.status);
  const [isSaving, setIsSaving] = useState(false);

  const handleDownloadProfile = () => {
    const today = new Date().toLocaleDateString("es-AR");
    const lines: string[] = [];
    lines.push("PERFIL DE LEAD — LeadFlow");
    lines.push("==========================");
    lines.push(`Generado: ${today}`);
    lines.push("");
    lines.push("ENCABEZADO");
    lines.push("----------");
    lines.push(`Nombre: ${lead.name}`);
    lines.push(`Destino: ${lead.destination}`);
    lines.push(`Tipo de viaje: ${lead.tripType}`);
    lines.push(`Estado actual: ${status}`);
    lines.push(`Vendedor asignado: ${lead.assignedTo}`);
    lines.push("");
    lines.push("DATOS DEL LEAD");
    lines.push("--------------");
    lines.push(`WhatsApp: ${lead.whatsapp}`);
    lines.push(`Pasajeros: ${lead.passengers}`);
    lines.push(`Fecha estimada: ${lead.estimatedDate}`);
    lines.push(`Presupuesto: ${lead.budget}`);
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
    lines.push("Diagnóstico:");
    lines.push("El lead muestra interés genuino: respondió positivamente al primer contacto y solicitó cotización. Sin embargo, lleva 1 día sin actividad tras el último mensaje. El presupuesto declarado es ajustado para luna de miel en Cancún en temporada alta de agosto.");
    lines.push("");
    lines.push("Objeciones detectadas:");
    lines.push("• Posible objeción de precio: el rango $1.000–$2.000 USD puede ser insuficiente para 2 pasajeros en agosto. Conviene validar expectativas antes de enviar cotización.");
    lines.push("• Sin objeción de fecha detectada aún.");
    lines.push("");
    lines.push("Señales de interés:");
    lines.push("• Respondió positivo en el primer contacto.");
    lines.push("• Especificó tipo de viaje (luna de miel): hay motivación emocional, no solo precio.");
    lines.push("• Fecha definida (agosto 2026): tiene urgencia real.");
    lines.push("");
    lines.push("Estrategia recomendada:");
    lines.push("Enviar cotización hoy con dos opciones: una dentro de su presupuesto (hotel 4 estrellas) y una opción premium con diferencia de precio clara. El anclaje emocional de luna de miel facilita el upgrade.");
    lines.push("");
    lines.push("Mensaje sugerido:");
    lines.push('"Te armé dos opciones para que elijas según lo que más se ajuste. La segunda incluye detalles especiales para luna de miel que suelen valer la pena..."');

    const safe = lines.join("\n").replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" }[c]!));
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>Perfil — ${lead.name}</title>
<style>body{font-family:-apple-system,Segoe UI,Inter,sans-serif;padding:40px;color:#111;line-height:1.55;max-width:780px;margin:auto;}pre{white-space:pre-wrap;font-family:inherit;font-size:13px;}@media print{body{padding:20px;}}</style>
</head><body><pre>${safe}</pre>
<script>window.onload=()=>setTimeout(()=>window.print(),250);</script></body></html>`;
    const w = window.open("", "_blank");
    if (w) { w.document.write(html); w.document.close(); }
  };

  return (
    <AppShell>
      <div className="mb-4">
        <Link to="/leads" search={{ segmento: undefined }} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Volver
        </Link>
      </div>

      {/* 3.2 Encabezado del lead */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{lead.name}</h1>
          <p className="text-sm text-muted-foreground">{lead.destination} · {lead.tripType}</p>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={status} />
          <button
            onClick={handleDownloadProfile}
            className="inline-flex items-center justify-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-muted"
          >
            <Download className="h-4 w-4" /> Descargar perfil PDF
          </button>
        </div>
      </div>

      {/* Datos del lead */}
      <section className="mb-5 rounded-xl border border-border bg-card p-5">
        <h2 className="mb-4 text-sm font-semibold">Datos del lead</h2>
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Field label="WhatsApp" value={lead.whatsapp} />
          <Field label="Destino" value={lead.destination} />
          <Field label="Tipo de viaje" value={lead.tripType} />
          <Field label="Pasajeros" value={String(lead.passengers)} />
          <Field label="Fecha estimada" value={lead.estimatedDate} />
          <Field label="Presupuesto" value={lead.budget} />
        </dl>
      </section>

      {/* Pipeline */}
      <section className="mb-5 rounded-xl border border-border bg-card p-5">
        <h2 className="mb-4 text-sm font-semibold">Estado en pipeline</h2>
        <PipelineStepper current={status} />
      </section>

      {/* Vendedor */}
      <section className="mb-5 rounded-xl border border-border bg-card p-5">
        <h2 className="mb-3 text-sm font-semibold">Vendedor asignado</h2>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-muted text-xs font-semibold">LG</div>
            <div className="text-sm">{lead.assignedTo}</div>
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

      {showAI && <AIAnalysisPanel leadName={lead.name} />}

      <ActionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        tipos={tipos}
        resultados={resultados}
        isSaving={isSaving}
        onSave={async (data, advance) => {
          setIsSaving(true);
          try {
            const now = new Date();
            // Insertar en Supabase
            const { error } = await supabase.from('acciones_dia').insert({
              id_lead: lead.id,
              id_tipo_accion: data.typeId,
              id_resultado: data.resultId,
              descripcion: data.note,
              fecha_accion: now.toISOString()
            });

            if (error) throw error;

            // Actualizar UI optimista
            const tipoObj = tipos.find(t => t.id_tipo_accion === data.typeId);
            const resObj = resultados.find(r => r.id_resultado === data.resultId);
            
            const newAction: ActionEntry = {
              date: now.toLocaleString("es-AR", { 
                day: '2-digit', month: '2-digit', year: 'numeric', 
                hour: '2-digit', minute: '2-digit' 
              }),
              type: tipoObj?.nombre || String(data.typeId),
              result: resObj?.nombre || String(data.resultId),
              note: data.note || ''
            };

            setActions((prev) => [newAction, ...prev]);

            if (advance) {
              const idx = pipelineSteps.indexOf(status);
              if (idx >= 0 && idx < pipelineSteps.length - 1) {
                setStatus(pipelineSteps[idx + 1]);
                // TODO: Idealmente también actualizar el id_estado del lead en Supabase
              }
            }
            setModalOpen(false);
          } catch (err) {
            console.error("Error guardando acción:", err);
            alert("Error al guardar la acción. Por favor intenta de nuevo.");
          } finally {
            setIsSaving(false);
          }
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
