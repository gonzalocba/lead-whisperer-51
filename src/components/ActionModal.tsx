import { useEffect, useState } from "react";
import { X } from "lucide-react";
import type { ActionEntry } from "@/lib/mock-data";

const TYPES = [
  "Llamada",
  "WhatsApp",
  "Email",
  "Cotización enviada",
  "Seguimiento",
  "Recompra",
];
const RESULTS = [
  "No responde",
  "Responde",
  "Interesado",
  "Solicita información",
  "Cotización enviada",
  "En análisis",
  "Rechazado",
  "Cerrado ganado",
  "Recompra interesado",
  "Recompra no interesado",
  "Recompra cerrado ganado",
];

export function ActionModal({
  open,
  onClose,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (a: ActionEntry, advance: boolean) => void;
}) {
  const [type, setType] = useState("");
  const [result, setResult] = useState("");
  const [advance, setAdvance] = useState(false);
  const [note, setNote] = useState("");

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!type || !result) return;
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    const date = `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
    onSave({ date, type, result, note: note.trim() || "—" }, advance);
    setNote("");
    setAdvance(false);
    setType("");
    setResult("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-0 sm:p-4">
      <div className="w-full max-w-lg rounded-t-2xl sm:rounded-xl border border-border bg-card shadow-lg">
        <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
          <h2 className="text-sm font-semibold">Registrar nueva acción</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground" aria-label="Cerrar">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-5">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Tipo de acción</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-ring"
            >
              <option value="" disabled>Seleccionar...</option>
              {TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Resultado</label>
            <select
              value={result}
              onChange={(e) => setResult(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-ring"
            >
              <option value="" disabled>Seleccionar...</option>
              {RESULTS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">¿Avanzar al siguiente estado?</span>
            <button
              type="button"
              role="switch"
              aria-checked={advance}
              onClick={() => setAdvance((v) => !v)}
              className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
                advance ? "bg-foreground" : "bg-muted"
              }`}
            >
              <span
                className={`inline-block h-5 w-5 rounded-full bg-background shadow transition-transform ${
                  advance ? "translate-x-5" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Nota</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              placeholder="Escribí un comentario..."
              className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring"
            />
          </div>

          <div className="flex justify-end gap-2 border-t border-border pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-border bg-background px-4 py-2 text-sm hover:bg-muted"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Guardar acción
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
