import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { StatusBadge } from "@/components/StatusBadge";
import { supabase } from "@/lib/supabase";
import { Lead, LeadStatus } from "@/lib/mock-data";
import { Eye, Search, Loader2, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/leads/")({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      segmento: search.segmento as string | undefined,
    }
  },
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
  const { segmento } = Route.useSearch();
  const [statusFilter, setStatusFilter] = useState<string>("Todos");
  const [search, setSearch] = useState("");
  const [leadsData, setLeadsData] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLeads() {
      try {
        const [leadsRes, serviciosRes, accionesRes] = await Promise.all([
          supabase.from('leads').select('*'),
          supabase.from('dim_servicios').select('*'),
          supabase.from('acciones_dia').select('*')
        ]);
        
        if (leadsRes.error) throw leadsRes.error;
        
        const data = leadsRes.data || [];
        const servicios = serviciosRes.data || [];
        const acciones = accionesRes.data || [];

        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        const mapEstado = (id: any): LeadStatus => {
          if (typeof id === 'string' && isNaN(Number(id))) return id as LeadStatus;
          switch(Number(id)) {
            case 1: return 'Nuevo';
            case 2: return 'Contactado';
            case 3: return 'En negociación';
            case 4: return 'Comprometido';
            case 5: return 'Cerrado ganado';
            case 6: return 'Cerrado perdido';
            default: return 'Nuevo';
          }
        };

        const mapped: Lead[] = data.map((d: any) => {
          const stateId = Number(d.id_estado);
          const isClient = d.es_cliente;
          const ultAct = d.ultima_actividad ? new Date(d.ultima_actividad) : new Date(d.fecha_creacion);
          const diffHs = (now.getTime() - ultAct.getTime()) / (1000 * 60 * 60);
          const diffDays = (now.getTime() - ultAct.getTime()) / (1000 * 60 * 60 * 24);
          
          const tags: string[] = [];

          if (!isClient && (stateId === 1 || stateId === 2) && diffHs > 24) tags.push("sin_respuesta");
          if (!isClient && [2,3,4].includes(stateId) && d.proxima_accion_fecha && new Date(d.proxima_accion_fecha) < today) tags.push("follow_ups");
          if (!isClient && stateId === 3) tags.push("negociacion");
          if (!isClient && [2,3,4].includes(stateId) && Number(d.valor_total_cliente) >= 3000) tags.push("alto_valor");
          
          if (!isClient && stateId < 5) {
            const lActions = acciones.filter(a => a.id_lead === d.id_lead);
            if (lActions.length > 0) {
              lActions.sort((a, b) => new Date(b.fecha_accion).getTime() - new Date(a.fecha_accion).getTime());
              const lastRes = Number(lActions[0].id_resultado);
              if ([3, 4, 5].includes(lastRes) && diffHs <= 48) tags.push("alta_intencion");
            }
          }

          if (!isClient && stateId === 4) tags.push("comprometidos");
          if (!isClient && [2,3].includes(stateId) && diffDays >= 5) tags.push("dormidos");

          const service = servicios.find(s => s.id_servicio === d.id_servicio);
          const destName = service ? service.nombre : (d.id_servicio ? `Servicio #${d.id_servicio}` : 'Desconocido');

          return {
            id: d.id_lead || d.id || String(Math.random()),
            name: d.nombre || d.name || 'Sin nombre',
            destination: destName,
            status: mapEstado(d.id_estado || d.estado || d.status),
            daysInPipeline: diffDays >= 0 ? Math.floor(diffDays) : 0,
            whatsapp: d.contacto || d.whatsapp || '',
            tripType: d.tipo_viaje || d.tripType || '',
            passengers: d.pasajeros || d.passengers || 1,
            estimatedDate: d.fecha_estimada || d.estimatedDate || '',
            budget: d.presupuesto || d.budget || '',
            assignedTo: d.vendedor || d.assignedTo || '',
            _tags: tags // hidden property for segment filtering
          };
        });
        setLeadsData(mapped);
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
    const matchSegment = segmento ? (l as any)._tags?.includes(segmento) : true;
    return matchStatus && matchName && matchSegment;
  });

  const dynamicStatusCounts = leadsData.reduce((acc, lead) => {
    const key = lead.status;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statusCounts = {
    Nuevo: dynamicStatusCounts['Nuevo'] || 0,
    Contactado: dynamicStatusCounts['Contactado'] || 0,
    "En negociación": dynamicStatusCounts['En negociación'] || 0,
    Comprometido: dynamicStatusCounts['Comprometido'] || 0,
    "Cerrado ganado": dynamicStatusCounts['Cerrado ganado'] || 0,
  };

  return (
    <AppShell>
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Leads</h1>
          <p className="text-sm text-muted-foreground">Todos los contactos que entraron por la landing.</p>
        </div>
        {segmento && (
          <div className="rounded-md bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary">
            Filtrando por segmento: {segmento.replace('_', ' ')}
            <Link to="/leads" search={{ segmento: undefined }} className="ml-2 hover:underline opacity-80">(Limpiar)</Link>
          </div>
        )}
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
