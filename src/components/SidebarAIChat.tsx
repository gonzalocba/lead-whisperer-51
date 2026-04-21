import { useState, useRef, useEffect } from "react";
import { Sparkles, Send, Bot } from "lucide-react";
import { leads, statusCounts, topDestinations } from "@/lib/mock-data";

interface Msg {
  role: "user" | "ai";
  text: string;
}

const suggestions = [
  "¿Qué leads están sin respuesta?",
  "Top destino del mes",
  "¿Cuántos cerrados ganados?",
];

function fakeAnswer(q: string): string {
  const s = q.toLowerCase();
  if (s.includes("sin respuesta") || s.includes("pendien")) {
    const stale = leads.filter((l) => l.status === "Nuevo" || l.status === "Contactado").slice(0, 3);
    return `Hay ${stale.length} leads esperando respuesta: ${stale.map((l) => l.name).join(", ")}.`;
  }
  if (s.includes("destino")) {
    const top = topDestinations[0];
    return `El destino más consultado es ${top.name} (${top.value}% de las consultas).`;
  }
  if (s.includes("cerrado") || s.includes("ganado")) {
    return `Tenés ${statusCounts.Cerrados} leads cerrados ganados este período.`;
  }
  if (s.includes("recompra")) {
    return `${statusCounts.Recompra} clientes están en flujo de recompra activo.`;
  }
  if (s.includes("ana")) {
    const ana = leads.find((l) => l.name.includes("Ana"));
    return ana ? `${ana.name}: ${ana.destination}, ${ana.tripType}, presupuesto ${ana.budget}. Estado: ${ana.status}.` : "No encontré ese lead.";
  }
  return `Analizando tus ${leads.length} leads activos… Tu mejor canal es WhatsApp. Probá retomar contactos con +24h sin respuesta.`;
}

export function SidebarAIChat() {
  const [messages, setMessages] = useState<Msg[]>([
    { role: "ai", text: "Hola Laura 👋 Puedo analizar tus leads. ¿Qué querés saber?" },
  ]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, thinking]);

  const send = (text: string) => {
    const q = text.trim();
    if (!q) return;
    setMessages((m) => [...m, { role: "user", text: q }]);
    setInput("");
    setThinking(true);
    setTimeout(() => {
      setMessages((m) => [...m, { role: "ai", text: fakeAnswer(q) }]);
      setThinking(false);
    }, 700);
  };

  return (
    <div className="flex flex-col rounded-lg border border-sidebar-border bg-sidebar-accent/30">
      <div className="flex items-center gap-2 border-b border-sidebar-border px-3 py-2">
        <div className="grid h-6 w-6 place-items-center rounded-md bg-foreground/5 ring-1 ring-foreground/10">
          <Sparkles className="h-3.5 w-3.5" />
        </div>
        <div className="text-xs font-semibold">Asistente IA</div>
        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-500" />
      </div>

      <div ref={scrollRef} className="max-h-64 min-h-[120px] space-y-2 overflow-y-auto px-3 py-2.5">
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-1.5 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            {m.role === "ai" && <Bot className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />}
            <div
              className={`max-w-[85%] rounded-md px-2 py-1.5 text-xs leading-relaxed ${
                m.role === "user"
                  ? "bg-foreground text-background"
                  : "bg-background text-foreground border border-border"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        {thinking && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Bot className="h-3.5 w-3.5" />
            <span className="inline-flex gap-0.5">
              <span className="h-1 w-1 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]" />
              <span className="h-1 w-1 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]" />
              <span className="h-1 w-1 animate-bounce rounded-full bg-muted-foreground" />
            </span>
          </div>
        )}
      </div>

      {messages.length <= 1 && (
        <div className="flex flex-wrap gap-1 px-3 pb-2">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              className="rounded-full border border-border bg-background px-2 py-0.5 text-[10px] text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="flex items-center gap-1.5 border-t border-sidebar-border p-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Preguntale a la IA…"
          className="min-w-0 flex-1 rounded-md border border-input bg-background px-2 py-1.5 text-xs outline-none focus:border-ring"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="grid h-7 w-7 place-items-center rounded-md bg-foreground text-background disabled:opacity-40"
          aria-label="Enviar"
        >
          <Send className="h-3.5 w-3.5" />
        </button>
      </form>
    </div>
  );
}
