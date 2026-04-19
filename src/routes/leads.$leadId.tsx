import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/leads/$leadId")({
  component: LeadDetailStub,
});

function LeadDetailStub() {
  const { leadId } = Route.useParams();
  return (
    <AppShell>
      <h1 className="text-xl font-semibold">Detalle del lead #{leadId}</h1>
      <p className="mt-2 text-sm text-muted-foreground">Próxima etapa: perfil completo, modal de acción y análisis IA.</p>
    </AppShell>
  );
}
