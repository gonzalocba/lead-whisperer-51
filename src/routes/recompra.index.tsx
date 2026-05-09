import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { RecompraStatusBadge } from "@/components/RecompraStatusBadge";
import { recompraClients, recompraStatusCounts } from "@/lib/recompra-data";
import { Eye, Search } from "lucide-react";
import { useState } from "react";

import { supabase } from "@/lib/supabase";
import { RecompraStatus } from "@/lib/recompra-data";

export const Route = createFileRoute("/recompra/")({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      segmento: search.segmento as string | undefined,
    }
  },
  loader: async () => {
    const { data: recomprasDb, error } = await supabase.from('recompras').select(`
      id_recompra,
      id_lead,
      fecha_trigger,
      fecha_contacto,
      id_estado_recompra,
      proxima_accion_fecha,
      activo,
      leads(nombre, contacto),
      dim_servicios(nombre)
    `).eq("activo", true);
    
    if (error) {
      console.error(error);
      return { clients: [], statusCounts: {} };
    }

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

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    const clients = (recomprasDb || []).map((r: any) => {
      const stateId = Number(r.id_estado_recompra);
      const startD = r.fecha_contacto ? new Date(r.fecha_contacto) : new Date(r.fecha_trigger);
      const diffDays = Math.floor((now.getTime() - startD.getTime()) / (1000 * 60 * 60 * 24));
      
      const tags: string[] = [];
      if (stateId === 1) tags.push("pendientes");
      if ([2,3].includes(stateId) && r.proxima_accion_fecha && new Date(r.proxima_accion_fecha) < today) {
        tags.push("dormidos");
      }

      // Handle Supabase nested joins which return arrays or objects depending on cardinality
      const leadName = Array.isArray(r.leads) ? r.leads[0]?.nombre : (r.leads?.nombre || 'Desconocido');
      const serviceName = Array.isArray(r.dim_servicios) ? r.dim_servicios[0]?.nombre : (r.dim_servicios?.nombre || 'Desconocido');

      return {
        id: r.id_recompra,
        leadId: r.id_lead,
        name: leadName,
        service: serviceName,
        status: mapStatus(stateId),
        daysInRecompra: diffDays >= 0 ? diffDays : 0,
        _tags: tags
      };
    });

    const statusCounts = clients.reduce((acc: any, c: any) => {
      acc[c.status] = (acc[c.status] || 0) + 1;
      return acc;
    }, {});

    const defaultCounts = {
      Pendiente: statusCounts["Pendiente"] || 0,
      Contactado: statusCounts["Contactado"] || 0,
      "En seguimiento": statusCounts["En seguimiento"] || 0,
      Convertido: statusCounts["Convertido"] || 0,
      Descartado: statusCounts["Descartado"] || 0,
    };

    return { clients, statusCounts: defaultCounts };
  },
  component: RecompraListPage,
  head: () => ({
    meta: [
      { title: "Recompra — LeadFlow" },
      { name: "description", content: "Clientes en proceso de recompra: filtros por estado y búsqueda por nombre." },
    ],
  }),
});

const STATUS_FILTERS = [
  "Todos",
  "Pendiente",
  "Contactado",
  "En seguimiento",
  "Convertido",
  "Descartado",
] as const;

function RecompraListPage() {
  const { segmento } = Route.useSearch();
  const { clients: recompraClients, statusCounts: recompraStatusCounts } = Route.useLoaderData();
  const [statusFilter, setStatusFilter] = useState<string>("Todos");
  const [search, setSearch] = useState("");

  const filtered = recompraClients.filter((c: any) => {
    const matchStatus = statusFilter === "Todos" || c.status === statusFilter;
    const matchName = c.name.toLowerCase().includes(search.toLowerCase());
    const matchSegment = segmento ? c._tags?.includes(segmento) : true;
    return matchStatus && matchName && matchSegment;
  });

  return (
    <AppShell>
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Recompra</h1>
          <p className="text-sm text-muted-foreground">Clientes en proceso de recompra</p>
        </div>
        {segmento && (
          <div className="rounded-md bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary">
            Filtrando por segmento: {segmento.replace('_', ' ')}
            <Link to="/recompra" search={{ segmento: undefined }} className="ml-2 hover:underline opacity-80">(Limpiar)</Link>
          </div>
        )}
      </div>

      {/* Status chips */}
      <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
        {Object.entries(recompraStatusCounts).map(([label, count]) => (
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
            placeholder="Buscar por nombre cliente..."
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
              <th className="px-4 py-3 text-left font-medium">Servicio</th>
              <th className="px-4 py-3 text-left font-medium">Estado recompra</th>
              <th className="px-4 py-3 text-left font-medium">Días inicio recompra</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                <td className="px-4 py-3 font-medium">{c.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{c.service}</td>
                <td className="px-4 py-3"><RecompraStatusBadge status={c.status} /></td>
                <td className="px-4 py-3 text-muted-foreground">{c.daysInRecompra} {c.daysInRecompra === 1 ? "día" : "días"}</td>
                <td className="px-4 py-3 text-right">
                  <Link
                    to="/recompra/$clientId"
                    params={{ clientId: c.id }}
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
        {filtered.map((c) => (
          <Link
            key={c.id}
            to="/recompra/$clientId"
            params={{ clientId: c.id }}
            className="rounded-xl border border-border bg-card p-4 active:scale-[0.99] transition"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-medium">{c.name}</p>
                <p className="text-xs text-muted-foreground">{c.service} · {c.daysInRecompra} {c.daysInRecompra === 1 ? "día" : "días"}</p>
              </div>
              <RecompraStatusBadge status={c.status} />
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          No hay clientes que coincidan con los filtros.
        </div>
      )}
    </AppShell>
  );
}
