import { useEffect, useState } from "react";
import { X, Loader2 } from "lucide-react";
import type { ActionEntry } from "@/lib/mock-data";

export function ActionModal({
  open,
  onClose,
  onSave,
  tipos,
  resultados,
  isSaving
}: {
  open: boolean;
  onClose: () => void;
  onSave: (data: { typeId: number, resultId: number, note: string }, advance: boolean) => void;
  tipos: any[];
  resultados: any[];
  isSaving?: boolean;
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
    if (!type || !result || isSaving) return;
    onSave({ 
      typeId: Number(type), 
      resultId: Number(result), 
      note: note.trim() 
    }, advance);
    // Nota: El reseteo se manejará desde el padre tras completarse
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
              disabled={isSaving}
            >
              <option value="" disabled>Seleccionar...</option>
              {tipos.map((t) => (
                <option key={t.id_tipo_accion} value={t.id_tipo_accion}>{t.nombre}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Resultado</label>
            <select
              value={result}
              onChange={(e) => setResult(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-ring"
              disabled={isSaving}
            >
              <option value="" disabled>Seleccionar...</option>
              {resultados.map((r) => (
                <option key={r.id_resultado} value={r.id_resultado}>{r.nombre}</option>
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
              disabled={isSaving}
              className="rounded-md border border-border bg-background px-4 py-2 text-sm hover:bg-muted disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
              {isSaving ? "Guardando..." : "Guardar acción"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
