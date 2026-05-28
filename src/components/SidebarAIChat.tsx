import { useState, useRef, useEffect } from "react";
import { Sparkles, Search, AlertTriangle, Undo2, ExternalLink } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { supabase } from "@/lib/supabase";
import { leads as mockLeads, Lead, LeadStatus } from "@/lib/mock-data";
import { inferAIAnalysis } from "@/lib/ai-inference";

export function SidebarAIChat() {
  const navigate = useNavigate();

  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // ── Cargar leads ──────────────────────────────────────────────────────────
  useEffect(() => {
    async function loadData() {
      try {
        const [leadsRes, serviciosRes] = await Promise.all([
          supabase.from("leads").select("*"),
          supabase.from("dim_servicios").select("*"),
        ]);

        const data = leadsRes.data || [];
        const servicios = serviciosRes.data || [];

        const mapEstado = (id: any): LeadStatus => {
          if (typeof id === "string" && isNaN(Number(id))) return id as LeadStatus;
          switch (Number(id)) {
            case 1: return "Nuevo";
            case 2: return "Contactado";
            case 3: return "En negociación";
            case 4: return "Comprometido";
            case 5: return "Cerrado ganado";
            case 6: return "Cerrado perdido";
            default: return "Nuevo";
          }
        };

        const mapped: Lead[] = data.map((d: any) => {
          const ultAct = d.ultima_actividad
            ? new Date(d.ultima_actividad)
            : new Date(d.fecha_creacion);
          const diffDays =
            (new Date().getTime() - ultAct.getTime()) / (1000 * 60 * 60 * 24);
          const service = servicios.find((s: any) => s.id_servicio === d.id_servicio);
          const destName = service
            ? service.nombre
            : d.id_servicio
            ? `Servicio #${d.id_servicio}`
            : "Desconocido";

          return {
            id: d.id_lead || d.id || String(Math.random()),
            name: d.nombre || d.name || "Sin nombre",
            destination: destName,
            status: mapEstado(d.id_estado || d.estado || d.status),
            daysInPipeline: diffDays >= 0 ? Math.floor(diffDays) : 0,
            whatsapp: d.contacto || d.whatsapp || "",
            tripType: d.tipo_viaje || d.tripType || "",
            passengers: d.pasajeros || d.passengers || 1,
            estimatedDate: d.fecha_estimada || d.estimatedDate || "",
            budget: d.presupuesto || d.budget || "",
            assignedTo: d.vendedor || d.assignedTo || "",
          };
        });

        setLeads(mapped.length > 0 ? mapped : mockLeads);
      } catch {
        setLeads(mockLeads);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // ── Cerrar dropdown al click fuera ────────────────────────────────────────
  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const suggestions =
    searchQuery.trim() === ""
      ? []
      : leads
          .filter((l) => l.name.toLowerCase().includes(searchQuery.toLowerCase()))
          .slice(0, 5);

  const analysis = selectedLead ? inferAIAnalysis(selectedLead) : null;

  const handleOpenWorkspace = () => {
    navigate({
      to: "/analisis-ia",
      search: selectedLead ? ({ leadId: selectedLead.id } as any) : {},
    });
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col rounded-lg border border-sidebar-border bg-sidebar-accent/15">

      {/* Header */}
      <div className="flex items-center gap-2 border-b border-sidebar-border px-3.5 py-2.5">
        <div className="grid h-6 w-6 place-items-center rounded-md bg-foreground/5 ring-1 ring-foreground/10">
          <Sparkles className="h-3.5 w-3.5 text-foreground" />
        </div>
        <span className="text-xs font-semibold uppercase tracking-wider text-foreground">
          Asistente IA
        </span>
        <span className="ml-auto flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
      </div>

      {/* Contenido */}
      <div className="px-3.5 py-3 space-y-3">
        {!selectedLead ? (
          /* ── Sin lead: buscador ── */
          <div ref={dropdownRef} className="relative">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                placeholder={loading ? "Cargando..." : "Buscar lead..."}
                disabled={loading}
                className="w-full rounded-md border border-input bg-background py-1.5 pl-8 pr-3 text-xs outline-none focus:border-ring disabled:opacity-50 transition-colors"
              />
            </div>

            {showDropdown && searchQuery.trim() !== "" && (
              <div className="absolute left-0 right-0 z-50 mt-1 max-h-44 overflow-y-auto rounded-md border border-border bg-popover shadow-lg">
                {suggestions.length > 0 ? (
                  suggestions.map((lead) => (
                    <button
                      key={lead.id}
                      onClick={() => {
                        setSelectedLead(lead);
                        setSearchQuery("");
                        setShowDropdown(false);
                      }}
                      className="flex w-full flex-col px-3 py-2 text-left hover:bg-accent/80 border-b border-border/40 last:border-b-0"
                    >
                      <span className="text-xs font-semibold text-foreground leading-tight">
                        {lead.name}
                      </span>
                      <span className="text-[10px] text-muted-foreground mt-0.5">
                        {lead.status} · {lead.destination}
                      </span>
                    </button>
                  ))
                ) : (
                  <div className="px-3 py-2 text-center text-xs text-muted-foreground">
                    No encontrado
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          /* ── Lead seleccionado: resumen compacto ── */
          <div className="space-y-2.5">
            {/* Lead + reset */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground truncate max-w-[70%]">
                {selectedLead.name}
              </span>
              <button
                onClick={() => setSelectedLead(null)}
                className="inline-flex items-center gap-0.5 text-[10px] text-muted-foreground hover:text-foreground transition"
              >
                <Undo2 className="h-2.5 w-2.5" /> otro
              </button>
            </div>

            {/* Estado */}
            <div className="text-[10px] text-muted-foreground">
              {selectedLead.status}
              {selectedLead.destination ? ` · ${selectedLead.destination}` : ""}
            </div>

            {/* Objeción */}
            {analysis && (
              <div className="space-y-1 rounded-md border border-amber-500/20 bg-amber-500/5 px-2.5 py-2">
                <div className="flex items-center gap-1 text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wide">
                  <AlertTriangle className="h-3 w-3" />
                  {analysis.objection}
                </div>
                <p className="text-[10px] text-muted-foreground leading-relaxed line-clamp-2">
                  {analysis.recommendation}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Botón principal — siempre visible */}
        <button
          onClick={handleOpenWorkspace}
          className="flex w-full items-center justify-center gap-1.5 rounded-md bg-foreground px-3 py-2 text-xs font-semibold text-background hover:opacity-85 transition-opacity"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Abrir Asistente IA
        </button>
      </div>
    </div>
  );
}
