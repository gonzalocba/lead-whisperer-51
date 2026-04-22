import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { StatusBadge } from "@/components/StatusBadge";
import { leads } from "@/lib/mock-data";
import { Search, Eye } from "lucide-react";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/leads/perfil")({
  component: PerfilLeadBuscador,
  head: () => ({
    meta: [
      { title: "Perfil Lead — Buscar — LeadFlow" },
      { name: "description", content: "Buscá un lead por nombre para abrir su perfil completo." },
    ],
  }),
});

function PerfilLeadBuscador() {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return leads;
    return leads.filter((l) => l.name.toLowerCase().includes(q));
  }, [search]);

  return (
    <AppShell>
      <div className="mb-5">
        <h1 className="text-2xl font-semibold tracking-tight">Perfil Lead</h1>
        <p className="text-sm text-muted-foreground">Buscá un lead por nombre para abrir su perfil completo.</p>
      </div>

      <div className="relative mb-5 max-w-xl">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          autoFocus
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar lead por nombre..."
          className="w-full rounded-md border border-input bg-background py-2.5 pl-9 pr-3 text-sm outline-none focus:border-ring"
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Nombre</th>
              <th className="px-4 py-3 text-left font-medium">Destino</th>
              <th className="px-4 py-3 text-left font-medium">Estado</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((l) => (
              <tr key={l.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                <td className="px-4 py-3 font-medium">{l.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{l.destination}</td>
                <td className="px-4 py-3"><StatusBadge status={l.status} /></td>
                <td className="px-4 py-3 text-right">
                  <Link
                    to="/leads/$leadId"
                    params={{ leadId: l.id }}
                    className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
                  >
                    <Eye className="h-3.5 w-3.5" /> Abrir perfil
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="p-8 text-center text-sm text-muted-foreground">
            No hay leads que coincidan con "{search}".
          </div>
        )}
      </div>
    </AppShell>
  );
}
