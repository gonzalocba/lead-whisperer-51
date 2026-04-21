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
  const [type, setType] = useState(TYPES[0]);
  const [result, setResult] = useState(RESULTS[0]);
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
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    const date = `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
    onSave({ date, type, result, note: note.trim() || "—" }, advance);
    setNote("");
    setAdvance(false);
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
            <label className="text-xs font-medium text-muted-foreground">Tipo de acción</label>
            <div className="flex flex-wrap gap-1.5">
              {TYPES.map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => setType(t)}
                  className={`rounded-md border px-2.5 py-1.5 text-xs transition ${
                    type === t
                      ? "border-foreground bg-foreground text-background"
                      : "border-border bg-background hover:bg-muted"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Resultado</label>
            <select
              value={result}
              onChange={(e) => setResult(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring"
            >
              {RESULTS.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </div>

          <label className="flex items-center gap-2.5 rounded-md border border-border bg-muted/30 px-3 py-2.5 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={advance}
              onChange={(e) => setAdvance(e.target.checked)}
              className="h-4 w-4 accent-foreground"
            />
            <span>¿Avanzar al siguiente estado del pipeline?</span>
          </label>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Nota (opcional)</label>
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
