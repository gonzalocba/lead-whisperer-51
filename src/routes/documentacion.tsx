import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/documentacion")({
  component: () => (
    <AppShell>
      <h1 className="text-xl font-semibold">Documentación</h1>
      <p className="mt-2 text-sm text-muted-foreground">Guía de uso (próximamente).</p>
    </AppShell>
  ),
});
