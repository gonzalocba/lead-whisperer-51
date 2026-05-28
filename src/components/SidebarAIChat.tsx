import { useState, useRef, useEffect } from "react";
import { Sparkles, Search, AlertTriangle, Clock, Undo2, Copy, Check } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { leads as mockLeads, Lead, LeadStatus } from "@/lib/mock-data";

interface AICopilotAnalysis {
  objection: string;
  objectionDetail: string;
  recommendation: string;
  suggestedMessage: string;
}

// Lógica de inferencia táctica determinista basada en datos comerciales reales del lead
function inferAIAnalysis(lead: Lead): AICopilotAnalysis {
  const isStale = lead.daysInPipeline >= 3;
  const destination = lead.destination || "el viaje";
  const tripType = lead.tripType?.toLowerCase() || "";
  const name = lead.name;
  
  let objection = "Precio";
  let objectionDetail = `El presupuesto de ${lead.budget || "$1.000-$2.000 USD"} es muy ajustado para las comodidades que busca en ${destination}. Teme pagar de más.`;
  let recommendation = "Refuerzo valor + urgencia. Ofrecer desglose comparando hotel estándar vs todo incluido.";
  let suggestedMessage = `¡Hola ${name}! ¿Cómo estás? Estuve revisando opciones para tu viaje a ${destination}. Armé una opción que se ajusta súper bien a tu presupuesto, y otra premium que tiene unos beneficios espectaculares. ¿Te gustaría que te las envíe por WhatsApp para que las compares?`;

  // Lógica de negocio por tipo de viaje
  if (tripType.includes("boda") || tripType.includes("miel") || tripType.includes("pareja") || tripType.includes("romantico")) {
    objection = "Precio Resort Premium";
    objectionDetail = "Al ser Luna de Miel, valora mucho la calidad del hotel pero le asusta exceder su presupuesto. Le preocupa que un hotel económico arruine la ocasión especial.";
    recommendation = "Refuerzo valor + anclaje emocional. Destacar beneficios Todo Incluido (All-Inclusive) y detalles de bodas de cortesía.";
    suggestedMessage = `¡Hola ${name}! 👋 ¿Cómo va todo? Quería contarte que para tu viaje de Luna de Miel a ${destination} conseguí un paquete especial All-Inclusive que incluye un upgrade de habitación y atenciones especiales de cortesía. ¡Es ideal para no tener ningún gasto extra allá! ¿Te parece si te comparto la propuesta por WhatsApp?`;
  } else if (tripType.includes("familia") || tripType.includes("niño") || tripType.includes("hijo")) {
    objection = "Disponibilidad de Vuelo/Hotel";
    objectionDetail = "Viajar con la familia (pasajeros: ${lead.passengers}) requiere gran coordinación logística. Le preocupa no conseguir habitaciones contiguas y que las tarifas de grupo aumenten si demora la reserva.";
    recommendation = "Garantizar disponibilidad + preventa. Ofrecer pre-reserva inmediata bloqueando tarifas de grupo sin costo por 48h.";
    suggestedMessage = `¡Hola ${name}! ¿Cómo están? Sé que planificar un viaje familiar a ${destination} requiere coordinar bien las fechas. Bloqueé provisoriamente los cupos de avión y una habitación familiar todo incluido para asegurar la tarifa de preventa. ¿Te gustaría que te envíe los detalles para que lo vean tranquilos en familia hoy?`;
  } else if (tripType.includes("corporativo") || tripType.includes("trabajo") || tripType.includes("negocio")) {
    objection = "Flexibilidad de fechas";
    objectionDetail = "El cliente de negocios requiere flexibilidad absoluta de agenda. Teme incurrir en penalidades severas ante cancelaciones o reprogramaciones imprevistas de última hora.";
    recommendation = "Ofrecer tarifa flexible + seguro. Presentar la cotización con opción de cambios ilimitados y seguro de viaje total.";
    suggestedMessage = `Estimado ${name}, buenas tardes. Preparé el presupuesto para el viaje corporativo a ${destination}. Esta cotización incluye flexibilidad total de cambios y un seguro de asistencia completo. ¿Le queda bien que le envíe la cotización formal por mail o prefiere ver un resumen express por WhatsApp?`;
  } else if (tripType.includes("amigo") || tripType.includes("grupo")) {
    objection = "Consenso de precios del grupo";
    objectionDetail = "En viajes de amigos es difícil ponerse de acuerdo en lo financiero. Le preocupa que la propuesta sea costosa para alguno de los integrantes.";
    recommendation = "Desglose por persona + facilidades. Proponer opciones económicas y detallar el precio dividido por pasajero.";
    suggestedMessage = `¡Hola ${name}! ¿Cómo va? Estuve analizando las mejores opciones para el viaje del grupo a ${destination}. Diseñé una propuesta con un precio excelente por persona y opciones de pago divididas para facilitar la organización. ¿Te las comparto para que las reenvíes al grupo de WhatsApp?`;
  }

  // Ajustes por inactividad comercial
  if (isStale) {
    objection = "Enfriamiento del interés";
    objectionDetail = "Lleva más de 3 días sin registrar actividades en el pipeline. Podría estar analizando ofertas de competidores o postergando el viaje.";
    recommendation = "Pregunta abierta + gancho promocional. Reactivar con cupos de última hora o cierre inminente de preventa.";
    suggestedMessage = `¡Hola ${name}! ¿Cómo estás? Quería comentarte que acaban de abrirse 2 cupos promocionales con vuelo directo para ${destination} en las fechas que consultaste. Las tarifas de preventa cierran mañana. ¿Seguís con planes de realizar este viaje?`;
  }

  return {
    objection,
    objectionDetail,
    recommendation,
    suggestedMessage
  };
}

export function SidebarAIChat() {
  // Estados de leads de Supabase / Fallback
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados de control de UI minimalista
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeAction, setActiveAction] = useState<"message" | "objection" | null>(null);
  const [copied, setCopied] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Cargar leads desde Supabase
  useEffect(() => {
    async function loadData() {
      try {
        const [leadsRes, serviciosRes] = await Promise.all([
          supabase.from('leads').select('*'),
          supabase.from('dim_servicios').select('*')
        ]);

        const data = leadsRes.data || [];
        const servicios = serviciosRes.data || [];

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
          const ultAct = d.ultima_actividad ? new Date(d.ultima_actividad) : new Date(d.fecha_creacion);
          const now = new Date();
          const diffDays = (now.getTime() - ultAct.getTime()) / (1000 * 60 * 60 * 24);
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
            assignedTo: d.vendedor || d.assignedTo || ''
          };
        });

        if (mapped.length > 0) {
          setLeads(mapped);
        } else {
          setLeads(mockLeads);
        }
      } catch (err) {
        console.error("Error loading leads for individual copilot:", err);
        setLeads(mockLeads);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Filtrar sugerencias del buscador
  const suggestions = searchQuery.trim() === ""
    ? []
    : leads.filter(l => l.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5);

  // Cerrar buscador dropdown al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Copiar al portapapeles
  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Computar análisis IA contextual sobre el lead seleccionado
  const aiAnalysis = selectedLead ? inferAIAnalysis(selectedLead) : null;

  return (
    <div className="flex flex-col h-full rounded-lg border border-sidebar-border bg-sidebar-accent/15">
      {/* Header Fijo */}
      <div className="flex items-center gap-2 border-b border-sidebar-border px-3.5 py-2.5">
        <div className="grid h-6 w-6 place-items-center rounded-md bg-foreground/5 ring-1 ring-foreground/10">
          <Sparkles className="h-3.5 w-3.5 text-foreground" />
        </div>
        <div className="text-xs font-semibold uppercase tracking-wider text-foreground">Análisis Lead</div>
        <span className="ml-auto flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
      </div>

      {/* Contenedor Minimalista de Contenido */}
      <div className="flex-1 overflow-y-auto px-3.5 py-3.5 space-y-4 max-h-[460px] min-h-[160px]">
        
        {!selectedLead ? (
          /* ================================================= */
          /* ESTADO INICIAL (BÚSQUEDA MINIMALISTA)              */
          /* ================================================= */
          <div className="space-y-4 pt-1">
            <p className="text-xs text-muted-foreground leading-relaxed">
              Busca un lead y analiza el contexto según estado comercial, detectá objeciones y generá el mejor mensaje de prospección.
            </p>

            {/* Buscador de Lead */}
            <div ref={dropdownRef} className="relative mt-2">
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
                  placeholder="Buscar lead..."
                  className="w-full rounded-md border border-input bg-background py-1.5 pl-8 pr-3 text-xs outline-none focus:border-ring"
                />
              </div>

              {/* Dropdown de sugerencias de autocompletado */}
              {showDropdown && searchQuery.trim() !== "" && (
                <div className="absolute left-0 right-0 z-50 mt-1 max-h-48 overflow-y-auto rounded-md border border-border bg-popover text-popover-foreground shadow-lg">
                  {suggestions.length > 0 ? (
                    suggestions.map((lead) => (
                      <button
                        key={lead.id}
                        onClick={() => {
                          setSelectedLead(lead);
                          setSearchQuery("");
                          setShowDropdown(false);
                          setActiveAction(null);
                        }}
                        className="flex w-full flex-col px-3 py-2 text-left hover:bg-accent/80 hover:text-accent-foreground border-b border-border/40 last:border-b-0"
                      >
                        <span className="text-xs font-semibold text-foreground leading-tight">{lead.name}</span>
                        <span className="text-[10px] text-muted-foreground mt-0.5">
                          {lead.status} • {lead.destination}
                        </span>
                      </button>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-center text-xs text-muted-foreground">
                      No se encontraron leads
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* ================================================= */
          /* ESTADO LEAD SELECCIONADO                          */
          /* ================================================= */
          <div className="space-y-3.5">
            
            {/* Cabecera y Botón Reset Buscar Otro */}
            <div className="flex items-center justify-between border-b border-sidebar-border/40 pb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">Contexto Lead</span>
              <button
                onClick={() => setSelectedLead(null)}
                className="inline-flex items-center gap-1 text-[10px] font-medium text-muted-foreground hover:text-foreground transition"
              >
                <Undo2 className="h-3 w-3" /> Buscar otro...
              </button>
            </div>

            {/* Ficha Comercial de Lead */}
            <div className="space-y-1">
              <div className="text-xs font-semibold text-foreground">
                Lead: <span className="font-normal text-muted-foreground">{selectedLead.name}</span>
              </div>
              <div className="text-xs font-semibold text-foreground">
                Estado: <span className="font-normal text-muted-foreground">{selectedLead.status}</span>
              </div>
            </div>

            {/* Separador */}
            <div className="border-t border-sidebar-border/40" />

            {/* Objeción Detectada (IA) */}
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-[11px] font-bold text-amber-700 dark:text-amber-500 uppercase tracking-wide">
                <AlertTriangle className="h-3.5 w-3.5" /> Objeción
              </div>
              <p className="text-[11px] font-semibold text-foreground leading-snug">{aiAnalysis?.objection}</p>
              <p className="text-[10px] text-muted-foreground leading-relaxed">{aiAnalysis?.objectionDetail}</p>
            </div>

            {/* Recomendación IA */}
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-[11px] font-bold text-foreground uppercase tracking-wide">
                <Sparkles className="h-3.5 w-3.5 text-foreground" /> Recomendación
              </div>
              <p className="text-[10px] text-muted-foreground leading-relaxed">{aiAnalysis?.recommendation}</p>
            </div>

            {/* Acciones Rápidas */}
            <div className="space-y-2 pt-2">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setActiveAction(activeAction === "message" ? null : "message")}
                  className={`rounded-md border py-2 text-[11px] font-medium transition cursor-pointer flex items-center justify-center gap-1 ${
                    activeAction === "message"
                      ? "bg-foreground text-background border-foreground font-semibold"
                      : "bg-background text-foreground border-border hover:bg-muted"
                  }`}
                >
                  Generar mensaje
                </button>
                <button
                  onClick={() => setActiveAction(activeAction === "objection" ? null : "objection")}
                  className={`rounded-md border py-2 text-[11px] font-medium transition cursor-pointer flex items-center justify-center gap-1 ${
                    activeAction === "objection"
                      ? "bg-foreground text-background border-foreground font-semibold"
                      : "bg-background text-foreground border-border hover:bg-muted"
                  }`}
                >
                  Analizar objeción
                </button>
              </div>

              {/* Contenido Expandido: Generar mensaje */}
              {activeAction === "message" && aiAnalysis && (
                <div className="rounded-lg border border-border bg-background p-3 space-y-2 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Propuesta WhatsApp</span>
                    <button
                      onClick={() => handleCopyText(aiAnalysis.suggestedMessage)}
                      className="inline-flex items-center gap-1 text-[10px] font-semibold text-foreground hover:underline"
                      title="Copiar mensaje"
                    >
                      {copied ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-500" /> Copiado!
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" /> Copiar mensaje
                        </>
                      )}
                    </button>
                  </div>
                  <div className="rounded border border-border bg-muted/30 p-2 text-[10px] leading-relaxed text-foreground select-all font-mono whitespace-pre-wrap">
                    {aiAnalysis.suggestedMessage}
                  </div>
                </div>
              )}

              {/* Contenido Expandido: Analizar objeción */}
              {activeAction === "objection" && aiAnalysis && (
                <div className="rounded-lg border border-border bg-background p-3 space-y-2 animate-fadeIn">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">Estrategia para rebatir</span>
                  <div className="text-[10px] leading-relaxed text-foreground space-y-2">
                    <div>
                      <span className="font-semibold block">¿Por qué duda?</span>
                      <span className="text-muted-foreground block mt-0.5">{aiAnalysis.objectionDetail}</span>
                    </div>
                    <div className="border-t border-border/50 pt-2">
                      <span className="font-semibold block">Táctica comercial:</span>
                      <span className="text-muted-foreground block mt-0.5">{aiAnalysis.recommendation}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
