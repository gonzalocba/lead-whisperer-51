import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Plane } from "lucide-react";

export const Route = createFileRoute("/landing")({
  component: LandingPage,
  head: () => ({
    meta: [
      { title: "Viajes del Sol — Encontrá tu viaje ideal" },
      { name: "description", content: "Completá el formulario y un asesor te contacta con opciones a medida para tu próximo viaje al Caribe." },
      { property: "og:title", content: "Viajes del Sol — Encontrá tu viaje ideal" },
      { property: "og:description", content: "Asesoramiento personalizado en paquetes turísticos al Caribe y Brasil." },
    ],
  }),
});

const DESTINATIONS = ["Cancún", "Punta Cana", "Cuba", "México", "No lo decidí aún"];
const TRIP_TYPES = ["Luna de miel", "Familia", "Amigos", "Corporativo"];
const PASSENGERS = ["1", "2", "3", "4", "+4"];
const BUDGETS = ["Hasta $500 USD", "$500–$1.000", "$1.000–$2.000", "Más de $2.000"];

function LandingPage() {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [destination, setDestination] = useState(DESTINATIONS[0]);
  const [tripType, setTripType] = useState<string>("");
  const [passengers, setPassengers] = useState("2");
  const [date, setDate] = useState("");
  const [budget, setBudget] = useState<string>("");

  if (submitted) {
    return (
      <main className="grid min-h-screen w-full place-items-center bg-muted/30 px-4">
        <div className="w-full max-w-md rounded-xl border border-border bg-card p-8 text-center shadow-sm">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-success/15 text-success">
            <Check className="h-6 w-6" />
          </div>
          <h1 className="mt-5 text-xl font-semibold tracking-tight">¡Genial!</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Un asesor te va a escribir pronto al WhatsApp con opciones para tu viaje.
          </p>
          <Link
            to="/landing"
            onClick={() => setSubmitted(false)}
            className="mt-6 inline-block text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            ← Volver al formulario
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full bg-muted/30">
      {/* Header */}
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-3xl items-center gap-2.5 px-4 py-4">
          <span className="grid h-8 w-8 place-items-center rounded-md bg-primary text-primary-foreground">
            <Plane className="h-4 w-4" />
          </span>
          <div>
            <p className="text-sm font-semibold leading-tight">Viajes del Sol</p>
            <p className="text-xs text-muted-foreground">Paquetes al Caribe y Brasil</p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-4 py-8 sm:py-12">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Encontrá el viaje ideal para vos
        </h1>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          Completá este formulario y un asesor te contacta con opciones a medida.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitted(true);
          }}
          className="mt-8 space-y-6 rounded-xl border border-border bg-card p-5 sm:p-7"
        >
          {/* Nombre */}
          <Field label="Nombre completo">
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring"
            />
          </Field>

          {/* WhatsApp */}
          <Field label="WhatsApp">
            <input
              required
              type="tel"
              placeholder="+54 9 11 ..."
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring"
            />
          </Field>

          {/* Destino */}
          <Field label="¿A dónde querés viajar?">
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring"
            >
              {DESTINATIONS.map((d) => <option key={d}>{d}</option>)}
            </select>
          </Field>

          {/* Tipo de viaje */}
          <Field label="¿Qué tipo de viaje es?">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {TRIP_TYPES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTripType(t)}
                  className={`rounded-md border px-3 py-2 text-sm transition ${
                    tripType === t
                      ? "border-foreground bg-foreground text-background"
                      : "border-border bg-background hover:bg-muted"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </Field>

          {/* Pasajeros */}
          <Field label="¿Cuántos pasajeros?">
            <div className="flex flex-wrap gap-2">
              {PASSENGERS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPassengers(p)}
                  className={`min-w-[44px] rounded-md border px-3 py-2 text-sm transition ${
                    passengers === p
                      ? "border-foreground bg-foreground text-background"
                      : "border-border bg-background hover:bg-muted"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </Field>

          {/* Fecha */}
          <Field label="¿Cuándo pensás viajar?">
            <input
              type="month"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring"
            />
          </Field>

          {/* Presupuesto */}
          <Field label="¿Cuál es tu presupuesto aproximado por persona?">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {BUDGETS.map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setBudget(b)}
                  className={`rounded-md border px-3 py-2 text-sm text-left transition ${
                    budget === b
                      ? "border-foreground bg-foreground text-background"
                      : "border-border bg-background hover:bg-muted"
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </Field>

          <button
            type="submit"
            className="w-full rounded-md bg-primary px-4 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Quiero que me contacten
          </button>
          <p className="text-center text-xs text-muted-foreground">
            Sin compromiso · Respondemos en menos de 1 hora hábil.
          </p>
        </form>
      </div>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      {children}
    </div>
  );
}
