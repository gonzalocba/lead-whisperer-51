import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { supabase } from "@/lib/supabase";
import { leads as mockLeads, Lead, LeadStatus } from "@/lib/mock-data";
import { inferAIAnalysis } from "@/lib/ai-inference";
import {
  Sparkles,
  Search,
  AlertTriangle,
  Bot,
  User,
  Loader2,
  Send,
  Copy,
  Check,
  Undo2,
  Clock,
  Tag,
  MessageSquare,
  Zap,
  TrendingUp,
  ShieldAlert,
  ArrowRight,
} from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";

// ─── Webhook n8n (URL de pruebas/test — ideal para depuración en n8n) ───────
const N8N_WEBHOOK_URL =
  "https://gonzalocba.app.n8n.cloud/webhook-test/asistenteIA";

// ─── Chips de acción rápida ───────────────────────────────────────────────────
const QUICK_CHIPS = [
  { label: "Mensaje WhatsApp", icon: MessageSquare, text: "Generá un mensaje de WhatsApp para este lead" },
  { label: "Objeción precio", icon: ShieldAlert, text: "¿Cómo manejo la objeción de precio?" },
  { label: "Riesgo comercial", icon: AlertTriangle, text: "Resumí el riesgo comercial de este lead" },
  { label: "Alternativa agresiva", icon: Zap, text: "Generá una alternativa de mensaje más agresiva" },
  { label: "Próximo paso", icon: ArrowRight, text: "¿Cuál es el próximo paso recomendado?" },
  { label: "Análisis de situación", icon: TrendingUp, text: "Hacé un análisis completo de la situación comercial" },
];

// ─── Tipos ────────────────────────────────────────────────────────────────────
interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

// ─── Ruta con search params ───────────────────────────────────────────────────
export const Route = createFileRoute("/analisis-ia")({
  validateSearch: (search: Record<string, unknown>) => ({
    leadId: typeof search.leadId === "string" ? search.leadId : undefined,
  }),
  component: AsistenteIAWorkspace,
  head: () => ({
    meta: [
      { title: "Asistente IA Ventas — LeadFlow" },
      {
        name: "description",
        content:
          "Workspace conversacional del agente IA comercial. Operá leads con contexto completo.",
      },
    ],
  }),
});

// ─── Cargar leads (shared helper) ────────────────────────────────────────────
async function fetchLeads(): Promise<Lead[]> {
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
        punto_interes: Array.isArray(d.punto_interes) ? d.punto_interes : typeof d.punto_interes === 'string' ? [d.punto_interes] : undefined,
        objeciones: Array.isArray(d.objeciones) ? d.objeciones : typeof d.objeciones === 'string' ? [d.objeciones] : undefined,
        observaciones: d.observaciones || d.observacion || "",
      };
    });

    return mapped.length > 0 ? mapped : mockLeads;
  } catch {
    return mockLeads;
  }
}

// ─── Componente principal ────────────────────────────────────────────────────
function AsistenteIAWorkspace() {
  const { leadId: initialLeadId } = Route.useSearch();

  // Leads
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loadingLeads, setLoadingLeads] = useState(true);

  // Lead seleccionado
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  // Historial por lead — clave: lead.id o "__free__" si sin lead
  const [chatHistories, setChatHistories] = useState<Record<string, ChatMessage[]>>({});

  // Chat input
  const [chatInput, setChatInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Clave del historial activo
  const historyKey = selectedLead ? String(selectedLead.id) : "__free__";
  const currentMessages = chatHistories[historyKey] ?? [];

  // ── Cargar leads al montar ──────────────────────────────────────────────
  useEffect(() => {
    fetchLeads().then((result) => {
      setLeads(result);
      setLoadingLeads(false);
    });
  }, []);

  // ── Preseleccionar lead por query param ─────────────────────────────────
  useEffect(() => {
    if (!initialLeadId || leads.length === 0) return;
    const found = leads.find((l) => String(l.id) === String(initialLeadId));
    if (found) setSelectedLead(found);
  }, [leads, initialLeadId]);

  // ── Scroll al último mensaje ────────────────────────────────────────────
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentMessages, isSending]);

  // ── Cerrar dropdown al click fuera ─────────────────────────────────────
  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  // ── Sugerencias del buscador ────────────────────────────────────────────
  const suggestions =
    searchQuery.trim() === ""
      ? []
      : leads
          .filter((l) => l.name.toLowerCase().includes(searchQuery.toLowerCase()))
          .slice(0, 7);

  // ── Análisis local del lead ─────────────────────────────────────────────
  const analysis = selectedLead ? inferAIAnalysis(selectedLead) : null;

  // ── Agregar mensaje al historial ────────────────────────────────────────
  const appendMessage = useCallback((key: string, msg: ChatMessage) => {
    setChatHistories((prev) => ({
      ...prev,
      [key]: [...(prev[key] ?? []), msg],
    }));
  }, []);

  // ── Enviar al webhook n8n ───────────────────────────────────────────────
  const handleSend = useCallback(
    async (overrideText?: string) => {
      const text = (overrideText ?? chatInput).trim();
      if (!text || isSending) return;

      if (!overrideText) setChatInput("");

      const key = selectedLead ? String(selectedLead.id) : "__free__";

      appendMessage(key, {
        role: "user",
        content: text,
        timestamp: new Date(),
      });

      setIsSending(true);

      try {
        const payload = {
          message: text,
          lead: selectedLead
            ? {
                name: selectedLead.name,
                status: selectedLead.status,
                destination: selectedLead.destination,
                tripType: selectedLead.tripType,
                daysInPipeline: selectedLead.daysInPipeline,
                budget: selectedLead.budget,
                passengers: selectedLead.passengers,
                whatsapp: selectedLead.whatsapp,
                assignedTo: selectedLead.assignedTo,
              }
            : null,
        };

        const res = await fetch(N8N_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const contentType = res.headers.get("content-type") || "";
        let responseText = "";

        if (contentType.includes("application/json")) {
          const data = await res.json();
          responseText =
            data.output ??
            data.message ??
            data.response ??
            data.text ??
            data.answer ??
            JSON.stringify(data, null, 2);
        } else {
          responseText = await res.text();
        }

        appendMessage(key, {
          role: "assistant",
          content: responseText || "Sin respuesta del agente.",
          timestamp: new Date(),
        });
      } catch (err: any) {
        // Detectar error CORS / red vs error HTTP
        const isCorsOrNetwork =
          err instanceof TypeError &&
          (err.message.includes("NetworkError") ||
            err.message.includes("Failed to fetch") ||
            err.message.includes("fetch"));

        const errorContent = isCorsOrNetwork
          ? `⚠️ Error de conexión con n8n.

Posibles causas:
• El workflow no está activo → activalo con el switch "Active" en n8n
• Falta el header CORS en el nodo Webhook → agregá:
  Access-Control-Allow-Origin: *

URL: ${N8N_WEBHOOK_URL}`
          : `⚠️ Error del agente IA: ${err?.message ?? "Error desconocido"}`;

        appendMessage(key, {
          role: "assistant",
          content: errorContent,
          timestamp: new Date(),
        });
      } finally {
        setIsSending(false);
        setTimeout(() => inputRef.current?.focus(), 50);
      }
    },
    [chatInput, isSending, selectedLead, appendMessage]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const handleSelectLead = (lead: Lead) => {
    setSelectedLead(lead);
    setSearchQuery("");
    setShowDropdown(false);
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <AppShell>
      <div
        className="flex flex-col"
        style={{ height: "calc(100vh - 6.5rem)" }}
      >
        {/* ══════════════════════════════════════════════════════════
            HEADER CONTEXTUAL
        ══════════════════════════════════════════════════════════ */}
        <div className="shrink-0 mb-4">
          {/* Título */}
          <div className="flex items-center gap-3 mb-3">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-foreground/5 ring-1 ring-foreground/10">
              <Sparkles className="h-5 w-5 text-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-semibold tracking-tight leading-tight">
                Asistente IA Ventas
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                Workspace conversacional · operá leads comercialmente
              </p>
            </div>
            <span className="shrink-0 flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>

          {/* Lead selector / chips contextuales */}
          {!selectedLead ? (
            /* Buscador principal */
            <div ref={dropdownRef} className="relative max-w-lg">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowDropdown(true);
                  }}
                  onFocus={() => setShowDropdown(true)}
                  placeholder={
                    loadingLeads
                      ? "Cargando leads..."
                      : "Buscar lead para análisis contextual..."
                  }
                  disabled={loadingLeads}
                  className="w-full rounded-lg border border-input bg-background py-2.5 pl-10 pr-4 text-sm outline-none focus:border-ring disabled:opacity-50 transition-colors"
                />
              </div>
              {showDropdown && searchQuery.trim() !== "" && (
                <div className="absolute left-0 right-0 z-50 mt-1.5 max-h-60 overflow-y-auto rounded-xl border border-border bg-popover shadow-xl">
                  {suggestions.length > 0 ? (
                    suggestions.map((lead) => (
                      <button
                        key={lead.id}
                        onClick={() => handleSelectLead(lead)}
                        className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-accent/70 border-b border-border/40 last:border-b-0 transition-colors"
                      >
                        <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-muted text-xs font-bold text-foreground">
                          {lead.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-foreground leading-tight">
                            {lead.name}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {lead.status} · {lead.destination} · {lead.daysInPipeline}d en pipeline
                          </p>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-sm text-center text-muted-foreground">
                      No encontrado
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            /* Chips contextuales del lead */
            <div className="flex flex-wrap items-center gap-2">
              {/* Nombre — chip primario */}
              <div className="flex items-center gap-1.5 rounded-full bg-foreground px-3 py-1.5 text-xs font-semibold text-background">
                {selectedLead.name}
                <button
                  onClick={() => setSelectedLead(null)}
                  title="Cambiar lead"
                  className="ml-1 opacity-60 hover:opacity-100 transition-opacity"
                >
                  <Undo2 className="h-3 w-3" />
                </button>
              </div>

              {/* Estado */}
              <div className="flex items-center gap-1.5 rounded-full border border-border bg-muted/40 px-3 py-1.5 text-xs text-muted-foreground">
                {selectedLead.status}
              </div>

              {/* Destino */}
              {selectedLead.destination && (
                <div className="flex items-center gap-1.5 rounded-full border border-border bg-muted/40 px-3 py-1.5 text-xs text-muted-foreground">
                  <Tag className="h-3 w-3" />
                  {selectedLead.destination}
                </div>
              )}

              {/* Días en pipeline */}
              <div className="flex items-center gap-1.5 rounded-full border border-border bg-muted/40 px-3 py-1.5 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {selectedLead.daysInPipeline}d pipeline
              </div>

              {/* Presupuesto */}
              {selectedLead.budget && (
                <div className="flex items-center gap-1.5 rounded-full border border-border bg-muted/40 px-3 py-1.5 text-xs text-muted-foreground">
                  {selectedLead.budget}
                </div>
              )}

              {/* Objeción detectada — chip destacado */}
              {analysis && (
                <div className="flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-medium text-amber-700 dark:text-amber-400">
                  <AlertTriangle className="h-3 w-3" />
                  {analysis.objection}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Resumen IA del Lead (Orientación Comercial IA — Lectura Lineal 5s) ── */}
        {selectedLead && (
          <div className="shrink-0 rounded-xl border border-border/50 bg-muted/20 p-4 space-y-3.5 mb-4">
            {/* Título de sección */}
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground/80">
              <Sparkles className="h-3.5 w-3.5 text-emerald-500 animate-pulse" />
              Orientación Comercial IA
            </div>

            {/* Flujo de lectura lineal y vertical */}
            <div className="space-y-2 text-xs leading-relaxed text-foreground">
              <div>
                <span className="font-semibold text-muted-foreground">Situación:</span>{' '}
                <span className="font-medium">
                  {selectedLead.name} muestra interés en {selectedLead.destination}{' '}
                  {selectedLead.tripType ? `(${selectedLead.tripType} para ${selectedLead.passengers} pax)` : ''}{' '}
                  {selectedLead.budget ? `con un presupuesto estimado de ${selectedLead.budget}` : ''}.
                </span>
                {selectedLead.observaciones && (
                  <span className="text-muted-foreground italic block mt-1 pl-3 border-l-2 border-border/40">
                    "{selectedLead.observaciones}"
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="font-semibold text-muted-foreground">Riesgo comercial:</span>{' '}
                {selectedLead.daysInPipeline > 7 ? (
                  <span className="text-amber-600 dark:text-amber-400 font-semibold inline-flex items-center gap-1">
                    ⚠️ Enfriamiento ({selectedLead.daysInPipeline} días en pipeline)
                  </span>
                ) : (
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold inline-flex items-center gap-1">
                    ✅ Óptimo / Contacto reciente ({selectedLead.daysInPipeline}d en pipeline)
                  </span>
                )}
              </div>

              <div>
                <span className="font-semibold text-muted-foreground">Objeciones detectadas:</span>{' '}
                <span className="font-medium text-foreground">
                  {selectedLead.objeciones && selectedLead.objeciones.length > 0
                    ? selectedLead.objeciones.join(', ')
                    : analysis?.objection || 'Ninguna registrada'}
                </span>
              </div>
            </div>

            {/* Foco Principal: Recomendación IA */}
            <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
              <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1 flex items-center gap-1">
                ⚡ ¿Qué hacer ahora? (Recomendación IA)
              </div>
              <p className="text-xs font-semibold text-emerald-950 dark:text-emerald-200 leading-relaxed">
                {analysis?.recommendation || 'Analizando mejor estrategia...'}
              </p>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════
            WORKSPACE CHAT
        ══════════════════════════════════════════════════════════ */}
        <div className="flex-1 min-h-0 flex flex-col rounded-xl border border-border bg-card overflow-hidden">

          {/* ── Zona de mensajes ── */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
            {currentMessages.length === 0 ? (
              /* Estado vacío */
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4 py-8">
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-foreground/5 ring-1 ring-foreground/10">
                  <Sparkles className="h-7 w-7 text-muted-foreground" />
                </div>
                <div className="space-y-1.5 max-w-sm">
                  <p className="text-base font-semibold text-foreground">
                    Agente IA listo para operar
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {selectedLead
                      ? `Contexto cargado para ${selectedLead.name}. Consultá objeciones, mensajes, estrategias o análisis comercial.`
                      : "Seleccioná un lead para análisis contextual, o consultá libremente sobre ventas y estrategias comerciales."}
                  </p>
                </div>
                {!selectedLead && (
                  <p className="text-xs text-muted-foreground/60 mt-2">
                    Segmentos → detecta oportunidades · Perfil Lead → guarda contexto · <span className="text-foreground/70 font-medium">Asistente IA → opera el lead</span>
                  </p>
                )}
              </div>
            ) : (
              /* Mensajes */
              currentMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex gap-3 ${
                    msg.role === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  {/* Avatar */}
                  <div
                    className={`shrink-0 mt-1 grid h-8 w-8 place-items-center rounded-full text-xs ${
                      msg.role === "user"
                        ? "bg-foreground text-background"
                        : "bg-emerald-500/15 ring-1 ring-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                    }`}
                  >
                    {msg.role === "user" ? (
                      <User className="h-4 w-4" />
                    ) : (
                      <Bot className="h-4 w-4" />
                    )}
                  </div>

                  {/* Burbuja */}
                  <div
                    className={`group flex flex-col gap-1.5 max-w-[78%] ${
                      msg.role === "user" ? "items-end" : "items-start"
                    }`}
                  >
                    <div
                      className={`rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap break-words ${
                        msg.role === "user"
                          ? "bg-foreground text-background rounded-tr-sm"
                          : "bg-muted/60 text-foreground border border-border/40 rounded-tl-sm"
                      }`}
                    >
                      {msg.content}
                    </div>

                    {/* Footer mensaje */}
                    <div
                      className={`flex items-center gap-2 px-1 ${
                        msg.role === "user" ? "flex-row-reverse" : "flex-row"
                      }`}
                    >
                      <span className="text-[10px] text-muted-foreground/50">
                        {msg.timestamp.toLocaleTimeString("es-AR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      {/* Copiar — solo respuestas del agente */}
                      {msg.role === "assistant" && (
                        <button
                          onClick={() => handleCopy(msg.content, i)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground"
                        >
                          {copiedIdx === i ? (
                            <>
                              <Check className="h-3 w-3 text-emerald-500" />
                              Copiado
                            </>
                          ) : (
                            <>
                              <Copy className="h-3 w-3" />
                              Copiar
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}

            {/* Indicador escribiendo */}
            {isSending && (
              <div className="flex gap-3 items-start">
                <div className="shrink-0 mt-1 grid h-8 w-8 place-items-center rounded-full bg-emerald-500/15 ring-1 ring-emerald-500/30 text-emerald-600 dark:text-emerald-400">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="flex items-center gap-2.5 rounded-2xl rounded-tl-sm bg-muted/60 border border-border/40 px-4 py-3">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Analizando...
                  </span>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* ── Divisor ── */}
          <div className="shrink-0 border-t border-border/50" />

          {/* ── Chips de acción rápida ── */}
          <div className="shrink-0 px-4 pt-3 pb-2 flex flex-wrap gap-2">
            {QUICK_CHIPS.map((chip) => {
              const Icon = chip.icon;
              return (
                <button
                  key={chip.label}
                  onClick={() => handleSend(chip.text)}
                  disabled={isSending}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/30 px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Icon className="h-3 w-3" />
                  {chip.label}
                </button>
              );
            })}
          </div>

          {/* ── Input persistente ── */}
          <div className="shrink-0 px-4 pb-4">
            <div className="flex items-end gap-3 rounded-xl border border-input bg-background px-4 py-3 focus-within:border-ring transition-colors shadow-sm">
              <textarea
                ref={inputRef}
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  selectedLead
                    ? `Consultá sobre ${selectedLead.name}... (Enter para enviar)`
                    : "Consultá al asistente de ventas... (Enter para enviar)"
                }
                rows={1}
                disabled={isSending}
                className="flex-1 resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 outline-none leading-relaxed max-h-32 disabled:opacity-50"
                style={{ scrollbarWidth: "none" }}
              />
              <button
                onClick={() => handleSend()}
                disabled={!chatInput.trim() || isSending}
                className="shrink-0 grid h-8 w-8 place-items-center rounded-lg bg-foreground text-background transition-opacity hover:opacity-80 disabled:opacity-30 disabled:cursor-not-allowed"
                title="Enviar (Enter)"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>
            <p className="mt-1.5 text-center text-[10px] text-muted-foreground/40">
              Enter para enviar · Shift+Enter nueva línea · Conectado a n8n
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
