import { useEffect, useState } from "react";
import { X } from "lucide-react";
import type { RecompraAction } from "@/lib/recompra-data";

const TYPES = [
  { id: 1, name: "Llamada" },
  { id: 2, name: "WhatsApp" },
  { id: 3, name: "Email" },
  { id: 4, name: "Cotización enviada" },
  { id: 5, name: "Seguimiento" }
];
const RESULTS = [
  { id: 1, name: "Recompra interesado", nextState: 3, daysToNext: 1 },
  { id: 2, name: "Recompra no interesado", nextState: 3, daysToNext: 7 },
  { id: 3, name: "Recompra cerrado ganado", nextState: 4, daysToNext: 0 },
  { id: 4, name: "Sin respuesta", nextState: 1, daysToNext: 3 },
];

export function RecompraActionModal({
  open,
  onClose,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (actionData: any) => void;
}) {
  const [type, setType] = useState("");
  const [result, setResult] = useState("");
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
    
    const selectedResult = RESULTS.find(r => r.id === Number(result));
    const selectedType = TYPES.find(t => t.id === Number(type));

    onSave({
      id_tipo_accion: Number(type),
      id_resultado_recompra: Number(result),
      id_estado_recompra: selectedResult?.nextState || 1,
      dias_proxima_accion: selectedResult?.daysToNext || 1,
      observaciones: note.trim() || null,
      typeName: selectedType?.name,
      resultName: selectedResult?.name
    });
    setNote("");
    setType("");
    setResult("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-0 sm:p-4">
      <div className="w-full max-w-lg rounded-t-2xl sm:rounded-xl border border-border bg-card shadow-lg">
        <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
          <h2 className="text-sm font-semibold">Registrar acción de recompra</h2>
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
              {TYPES.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
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
              {RESULTS.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
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
            <button type="button" onClick={onClose} className="rounded-md border border-border bg-background px-4 py-2 text-sm hover:bg-muted">
              Cancelar
            </button>
            <button type="submit" className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
              Guardar acción
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
