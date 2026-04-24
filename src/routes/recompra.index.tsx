import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { RecompraStatusBadge } from "@/components/RecompraStatusBadge";
import { recompraClients, recompraStatusCounts } from "@/lib/recompra-data";
import { Eye, Search } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/recompra/")({
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
  const [statusFilter, setStatusFilter] = useState<string>("Todos");
  const [search, setSearch] = useState("");

  const filtered = recompraClients.filter((c) => {
    const matchStatus = statusFilter === "Todos" || c.status === statusFilter;
    const matchName = c.name.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchName;
  });

  return (
    <AppShell>
      <div className="mb-5">
        <h1 className="text-2xl font-semibold tracking-tight">Recompra</h1>
        <p className="text-sm text-muted-foreground">Clientes en proceso de recompra</p>
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
