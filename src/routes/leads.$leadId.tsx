import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { StatusBadge } from "@/components/StatusBadge";
import { PipelineStepper } from "@/components/PipelineStepper";
import { ActionModal } from "@/components/ActionModal";
import { AIAnalysisPanel } from "@/components/AIAnalysisPanel";
import { leads, defaultActions, pipelineSteps } from "@/lib/mock-data";
import type { ActionEntry } from "@/lib/mock-data";
import type { LeadStatus } from "@/lib/mock-data";
import { ArrowLeft, Plus, Sparkles, Search } from "lucide-react";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/leads/$leadId")({
  loader: ({ params }) => {
    const lead = leads.find((l) => l.id === params.leadId);
    if (!lead) throw notFound();
    return { lead };
  },
  component: LeadDetailPage,
  notFoundComponent: () => (
    <AppShell>
      <p className="text-sm text-muted-foreground">Lead no encontrado.</p>
      <Link to="/leads" className="mt-3 inline-block text-sm font-medium underline">Volver a la lista</Link>
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
  const { lead } = Route.useLoaderData();
  const navigate = useNavigate();
  const [actions, setActions] = useState<ActionEntry[]>(defaultActions);
  const [modalOpen, setModalOpen] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [status, setStatus] = useState<LeadStatus>(lead.status);
  const [search, setSearch] = useState("");

  const matches = useMemo(() => {
    if (!search.trim()) return [];
    const q = search.toLowerCase();
    return leads.filter((l) => l.name.toLowerCase().includes(q)).slice(0, 6);
  }, [search]);

  return (
    <AppShell>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link to="/leads" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Volver
        </Link>
        {/* 3.1 Búsqueda por nombre */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar lead por nombre..."
            className="w-full rounded-md border border-input bg-background py-2 pl-9 pr-3 text-sm outline-none focus:border-ring"
          />
          {matches.length > 0 && (
            <div className="absolute z-10 mt-1 w-full overflow-hidden rounded-md border border-border bg-popover shadow-md">
              {matches.map((m) => (
                <button
                  key={m.id}
                  onClick={() => {
                    setSearch("");
                    navigate({ to: "/leads/$leadId", params: { leadId: m.id } });
                  }}
                  className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-muted"
                >
                  <span>{m.name}</span>
                  <span className="text-xs text-muted-foreground">{m.destination}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 3.2 Encabezado del lead */}
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{lead.name}</h1>
          <p className="text-sm text-muted-foreground">{lead.destination} · {lead.tripType}</p>
        </div>
        <StatusBadge status={status} />
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
      <div className="mb-5 flex flex-col gap-2 sm:flex-row">
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
        onSave={(a, advance) => {
          setActions((prev) => [a, ...prev]);
          if (advance) {
            const idx = pipelineSteps.indexOf(status);
            if (idx >= 0 && idx < pipelineSteps.length - 1) {
              setStatus(pipelineSteps[idx + 1]);
            }
          }
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
