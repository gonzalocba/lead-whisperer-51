import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ExternalLink } from "lucide-react";

export const Route = createFileRoute("/documentacion")({
  component: DocsPage,
  head: () => ({
    meta: [
      { title: "Documentación — LeadFlow" },
      { name: "description", content: "Cómo usar LeadFlow: captación, pipeline y agente IA." },
    ],
  }),
});

function DocsPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-3xl">
        <h1 className="text-2xl font-semibold tracking-tight">Documentación</h1>
        <p className="mt-1 text-sm text-muted-foreground">Guía rápida del prototipo.</p>

        <section className="mt-6 space-y-5 text-sm leading-relaxed">
          <Card title="1 · Captación">
            La <Link to="/landing" className="font-medium underline">landing pública</Link> reemplaza al
            "link en bio" genérico. Cada lead llega con destino, fecha y presupuesto ya cargados.
          </Card>
          <Card title="2 · Pipeline">
            Cinco etapas: Nuevo → Contactado → En negociación → Comprometido → Cerrado. Cada acción
            registrada queda en el historial del lead.
          </Card>
          <Card title="3 · Agente IA">
            Por lead: detecta objeciones y sugiere estrategia. <Link to="/analisis-ia" className="font-medium underline">A nivel general</Link>:
            patrones de oferta, mejoras de atención y acciones priorizadas.
          </Card>

          <a
            href="/landing"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground hover:underline"
          >
            Abrir landing pública en nueva pestaña <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </section>
      </div>
    </AppShell>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h2 className="mb-2 text-sm font-semibold">{title}</h2>
      <p className="text-sm text-muted-foreground">{children}</p>
    </div>
  );
}
