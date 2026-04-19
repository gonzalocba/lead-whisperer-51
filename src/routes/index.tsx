import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/")({
  component: LoginPage,
  head: () => ({
    meta: [
      { title: "LeadFlow — Ingresar" },
      { name: "description", content: "CRM Lite para agencias de viajes. Captá, seguí y cerrá leads en un solo lugar." },
    ],
  }),
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@leadflow.app");
  const [password, setPassword] = useState("••••••••");

  return (
    <div className="grid min-h-screen w-full place-items-center bg-muted/30 px-4">
      <div className="w-full max-w-sm rounded-xl border border-border bg-card p-8 shadow-sm">
        <div className="mb-7 flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground font-bold">L</span>
          <div>
            <h1 className="text-base font-semibold leading-tight">LeadFlow</h1>
            <p className="text-xs text-muted-foreground">CRM Lite para agencias de viajes</p>
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            navigate({ to: "/dashboard" });
          }}
          className="space-y-4"
        >
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
            />
          </div>
          <button
            type="submit"
            className="mt-2 w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
          >
            Ingresar
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Prototipo · Acceso simulado
        </p>
      </div>
    </div>
  );
}
