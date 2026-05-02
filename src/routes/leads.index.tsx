import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { StatusBadge } from "@/components/StatusBadge";
import { supabase } from "@/lib/supabase";
import { Lead } from "@/lib/mock-data";
import { Eye, Search, Loader2, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/leads/")({
  component: LeadsListPage,
  head: () => ({
    meta: [
      { title: "Leads — LeadFlow" },
      { name: "description", content: "Lista completa de leads con filtros por estado y búsqueda por nombre." },
    ],
  }),
});

const STATUS_FILTERS = [
  "Todos",
  "Nuevo",
  "Contactado",
  "En negociación",
  "Comprometido",
  "Cerrado ganado",
  "Cerrado perdido",
  "Recompra",
] as const;

function LeadsListPage() {
  const [statusFilter, setStatusFilter] = useState<string>("Todos");
  const [search, setSearch] = useState("");
  const [leadsData, setLeadsData] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLeads() {
      try {
        const { data, error } = await supabase.from('leads').select('*');
        if (error) throw error;
        
        if (data) {
          const mapEstado = (id: any) => {
            if (typeof id === 'string' && isNaN(Number(id))) return id;
            switch(Number(id)) {
              case 1: return 'Nuevo';
              case 2: return 'Contactado';
              case 3: return 'En negociación'; // mapeado desde 'seguimiento'
              case 4: return 'Cerrado ganado'; // mapeado desde 'cerrado'
              case 5: return 'Cerrado perdido'; // mapeado desde 'perdido'
              default: return 'Nuevo';
            }
          };

          const mapped: Lead[] = data.map((d: any) => ({
            id: d.id_lead || d.id || String(Math.random()),
            name: d.nombre || d.name || 'Sin nombre',
            destination: d.destino || d.destination || (d.id_servicio ? `Servicio #${d.id_servicio}` : 'Desconocido'),
            status: mapEstado(d.id_estado || d.estado || d.status),
            daysInPipeline: d.dias_pipeline || d.daysInPipeline || 0,
            whatsapp: d.contacto || d.whatsapp || '',
            tripType: d.tipo_viaje || d.tripType || '',
            passengers: d.pasajeros || d.passengers || 1,
            estimatedDate: d.fecha_estimada || d.estimatedDate || '',
            budget: d.presupuesto || d.budget || '',
            assignedTo: d.vendedor || d.assignedTo || ''
          }));
          setLeadsData(mapped);
        }
      } catch (err: any) {
        console.error("Error fetching leads:", err);
        setError(err.message || 'Error al cargar leads');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchLeads();
  }, []);

  const filtered = leadsData.filter((l) => {
    const matchStatus = statusFilter === "Todos" || l.status === statusFilter;
    const matchName = l.name.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchName;
  });

  const dynamicStatusCounts = leadsData.reduce((acc, lead) => {
    let key = lead.status;
    if (lead.status === 'Nuevo') key = 'Nuevos';
    else if (lead.status === 'Contactado') key = 'Contactados';
    else if (lead.status === 'Cerrado ganado' || lead.status === 'Cerrado perdido') key = 'Cerrados';
    
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statusCounts = {
    Nuevos: dynamicStatusCounts['Nuevos'] || 0,
    Contactados: dynamicStatusCounts['Contactados'] || 0,
    "En negociación": dynamicStatusCounts['En negociación'] || 0,
    Cerrados: dynamicStatusCounts['Cerrados'] || 0,
    Recompra: dynamicStatusCounts['Recompra'] || 0,
  };

  return (
    <AppShell>
      <div className="mb-5">
        <h1 className="text-2xl font-semibold tracking-tight">Leads</h1>
        <p className="text-sm text-muted-foreground">Todos los contactos que entraron por la landing.</p>
      </div>

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-2 text-sm">Cargando leads...</p>
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-xl border border-destructive/50 bg-destructive/10 p-4 text-destructive flex items-center gap-3">
          <AlertCircle className="h-5 w-5" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {!isLoading && !error && (
        <>

      {/* Status chips */}
      <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
        {Object.entries(statusCounts).map(([label, count]) => (
          <div
            key={label}
            className="flex shrink-0 items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs"
          >
            <span className="text-muted-foreground">{label}</span>
            <span className="font-semibold">{count}</span>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring sm:w-56"
        >
          {STATUS_FILTERS.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>

        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            placeholder="Buscar por nombre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-md border border-input bg-background py-2 pl-9 pr-3 text-sm outline-none focus:border-ring"
          />
        </div>
      </div>

      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-xl border border-border bg-card md:block">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Nombre</th>
              <th className="px-4 py-3 text-left font-medium">Destino</th>
              <th className="px-4 py-3 text-left font-medium">Estado</th>
              <th className="px-4 py-3 text-left font-medium">Días pipeline</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((l) => (
              <tr key={l.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                <td className="px-4 py-3 font-medium">{l.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{l.destination}</td>
                <td className="px-4 py-3"><StatusBadge status={l.status} /></td>
                <td className="px-4 py-3 text-muted-foreground">{l.daysInPipeline} {l.daysInPipeline === 1 ? "día" : "días"}</td>
                <td className="px-4 py-3 text-right">
                  <Link
                    to="/leads/$leadId"
                    params={{ leadId: l.id }}
                    className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
                  >
                    <Eye className="h-3.5 w-3.5" /> Ver
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="grid gap-3 md:hidden">
        {filtered.map((l) => (
          <Link
            key={l.id}
            to="/leads/$leadId"
            params={{ leadId: l.id }}
            className="rounded-xl border border-border bg-card p-4 active:scale-[0.99] transition"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-medium">{l.name}</p>
                <p className="text-xs text-muted-foreground">{l.destination} · {l.daysInPipeline} {l.daysInPipeline === 1 ? "día" : "días"}</p>
              </div>
              <StatusBadge status={l.status} />
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          No hay leads que coincidan con los filtros.
        </div>
      )}
      </>
      )}
    </AppShell>
  );
}
