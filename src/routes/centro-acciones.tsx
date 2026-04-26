import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/centro-acciones")({
  component: CentroAccionesPage,
  head: () => ({
    meta: [
      { title: "Segmentos del día — LeadFlow" },
      {
        name: "description",
        content: "Lista simple de tareas del día priorizadas por urgencia.",
      },
    ],
  }),
});

type Priority = "urgent" | "opportunity" | "scale";

interface ActionItem {
  title: string;
  secondaryLabel: string;
  listHref: string;
}

const priorityMeta: Record<Priority, { dot: string; label: string }> = {
  urgent: { dot: "bg-red-500", label: "Prioridad alta" },
  opportunity: { dot: "bg-amber-500", label: "Oportunidades" },
  scale: { dot: "bg-emerald-500", label: "Escala" },
};

const urgentes: ActionItem[] = [
  { title: "Contactar 5 leads sin respuesta", secondaryLabel: "Ver leads", listHref: "/leads" },
  { title: "Resolver 3 follow-ups vencidos", secondaryLabel: "Ver leads", listHref: "/leads" },
  { title: "Contactar 4 clientes para recompra", secondaryLabel: "Ver clientes", listHref: "/recompra" },
];

const oportunidades: ActionItem[] = [
  { title: "Reactivar 6 leads en negociación", secondaryLabel: "Ver leads", listHref: "/leads" },
  { title: "Contactar 3 leads de alto valor", secondaryLabel: "Ver leads", listHref: "/leads" },
  { title: "Activar 4 leads con alta intención", secondaryLabel: "Ver leads", listHref: "/leads" },
];

const escala: ActionItem[] = [
  { title: "Lanzar recompra a 7 clientes", secondaryLabel: "Ver clientes", listHref: "/recompra" },
  { title: "Contactar 10 leads interesados en Cancún", secondaryLabel: "Ver leads", listHref: "/leads" },
  { title: "Reactivar 8 leads dormidos", secondaryLabel: "Ver leads", listHref: "/leads" },
];

function Section({ priority, items }: { priority: Priority; items: ActionItem[] }) {
  const p = priorityMeta[priority];
  return (
    <section className="mb-10">
      <div className="mb-4 flex items-center gap-2">
        <span className={`inline-block h-2.5 w-2.5 rounded-full ${p.dot}`} aria-hidden />
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          {p.label}
        </h2>
      </div>
      <ul className="divide-y divide-border border-y border-border">
        {items.map((it) => (
          <li
            key={it.title}
            className="flex items-center justify-between gap-4 py-3"
          >
            <span className="text-[15px] text-foreground">{it.title}</span>
            <Link
              to={it.listHref}
              className="shrink-0 text-sm font-medium text-primary hover:underline"
            >
              → {it.secondaryLabel}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

function CentroAccionesPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight">Segmentos del día</h1>
          <p className="text-sm text-muted-foreground">Tu lista de tareas para hoy</p>
        </div>

        <Section priority="urgent" items={urgentes} />
        <Section priority="opportunity" items={oportunidades} />
        <Section priority="scale" items={escala} />
      </div>
    </AppShell>
  );
}
