import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/centro-acciones")({
  loader: async () => {
    // 1. Traer data de la BD
    const [{ data: leads }, { data: acciones }] = await Promise.all([
      supabase.from("leads").select("*"),
      supabase.from("acciones_dia").select("*")
    ]);

    const leadsList = leads || [];
    const accionesList = acciones || [];

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // 2. Contadores
    let sinRespuesta = 0;
    let followUpsVencidos = 0;
    let enNegociacion = 0;
    let altoValor = 0;
    let altaIntencion = 0;
    let comprometidos = 0;
    let dormidos = 0;

    // 3. Evaluar cada lead
    leadsList.forEach(lead => {
      const isClient = lead.es_cliente;
      const state = Number(lead.id_estado);
      const ultAct = lead.ultima_actividad ? new Date(lead.ultima_actividad) : new Date(lead.fecha_creacion);

      // PRIORIDAD ALTA
      if (!isClient && (state === 1 || state === 2)) {
        const diffHs = (now.getTime() - ultAct.getTime()) / (1000 * 60 * 60);
        if (diffHs > 24) sinRespuesta++;
      }

      if (!isClient && [2,3,4].includes(state) && lead.proxima_accion_fecha) {
        const proxDate = new Date(lead.proxima_accion_fecha);
        if (proxDate < today) followUpsVencidos++;
      }

      // OPORTUNIDADES
      if (!isClient && state === 3) {
        enNegociacion++;
      }

      if (!isClient && [2,3,4].includes(state) && Number(lead.valor_total_cliente) >= 3000) {
        altoValor++;
      }

      // Para alta intención (último resultado interesado o solicita info -> ids 3,4,5 aprox)
      if (!isClient && state < 5) {
        const lActions = accionesList.filter(a => a.id_lead === lead.id_lead);
        if (lActions.length > 0) {
          lActions.sort((a, b) => new Date(b.fecha_accion).getTime() - new Date(a.fecha_accion).getTime());
          const lastRes = Number(lActions[0].id_resultado);
          if ([3, 4, 5].includes(lastRes)) {
            // Validar que la actividad sea reciente (< 48h)
            const diffHs = (now.getTime() - ultAct.getTime()) / (1000 * 60 * 60);
            if (diffHs <= 48) altaIntencion++;
          }
        }
      }

      // ESCALA
      if (!isClient && state === 4) {
        comprometidos++;
      }

      if (!isClient && [2,3].includes(state)) {
        const diffDays = (now.getTime() - ultAct.getTime()) / (1000 * 60 * 60 * 24);
        if (diffDays >= 5) dormidos++;
      }
    });

    return {
      sinRespuesta,
      followUpsVencidos,
      clientesRecompra: 0, // Pendiente Paso 6
      enNegociacion,
      altoValor,
      altaIntencion,
      lanzarRecompra: 0, // Pendiente Paso 6
      comprometidos,
      dormidos
    };
  },
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
  actionText: string;
  count: number;
  linkText: string;
  listHref: string;
}

const priorityMeta: Record<Priority, { dot: string; label: string }> = {
  urgent: { dot: "bg-red-500", label: "Prioridad alta" },
  opportunity: { dot: "bg-amber-500", label: "Oportunidades" },
  scale: { dot: "bg-emerald-500", label: "Escala" },
};

// Estos arrays estáticos se generan dinámicamente ahora dentro del componente

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
            className="flex items-center gap-4 py-3"
          >
            <span className="flex-1 text-[15px] font-medium text-foreground">{it.title}</span>
            <div className="flex w-32 items-center justify-start gap-1.5 text-[15px]">
              <span className="text-muted-foreground">{it.actionText}</span>
              <span className="font-semibold text-foreground">{it.count}</span>
            </div>
            <Link
              to={it.listHref}
              className="w-28 shrink-0 text-right text-[15px] font-medium text-primary hover:underline"
            >
              → {it.linkText}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

function CentroAccionesPage() {
  const data = Route.useLoaderData();

  const urgentes: ActionItem[] = [
    { title: "Leads sin respuesta", actionText: "Contactar", count: data.sinRespuesta, linkText: "Ver leads", listHref: "/leads?segmento=sin_respuesta" },
    { title: "Follow-ups vencidos", actionText: "Resolver", count: data.followUpsVencidos, linkText: "Ver leads", listHref: "/leads?segmento=follow_ups" },
    { title: "Clientes para recompra", actionText: "Contactar", count: data.clientesRecompra, linkText: "Ver clientes", listHref: "/recompra" },
  ];

  const oportunidades: ActionItem[] = [
    { title: "Leads en negociación", actionText: "Reactivar", count: data.enNegociacion, linkText: "Ver leads", listHref: "/leads?segmento=negociacion" },
    { title: "Leads de alto valor", actionText: "Contactar", count: data.altoValor, linkText: "Ver leads", listHref: "/leads?segmento=alto_valor" },
    { title: "Leads con alta intención", actionText: "Activar", count: data.altaIntencion, linkText: "Ver leads", listHref: "/leads?segmento=alta_intencion" },
  ];

  const escala: ActionItem[] = [
    { title: "Lanzar recompra", actionText: "Clientes", count: data.lanzarRecompra, linkText: "Ver clientes", listHref: "/recompra" },
    { title: "Leads comprometidos", actionText: "Contactar", count: data.comprometidos, linkText: "Ver leads", listHref: "/leads?segmento=comprometidos" },
    { title: "Leads dormidos", actionText: "Reactivar", count: data.dormidos, linkText: "Ver leads", listHref: "/leads?segmento=dormidos" },
  ];

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
