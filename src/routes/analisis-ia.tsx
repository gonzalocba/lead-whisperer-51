import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/analisis-ia")({
  component: () => (
    <AppShell>
      <h1 className="text-xl font-semibold">Análisis IA general</h1>
      <p className="mt-2 text-sm text-muted-foreground">Próxima etapa.</p>
    </AppShell>
  ),
});
