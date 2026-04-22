import { Link, useNavigate, useLocation } from "@tanstack/react-router";
import { LayoutDashboard, Users, User, Sparkles, FileText, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { SidebarAIChat } from "./SidebarAIChat";

const items = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/leads", label: "Lista Leads", icon: Users },
  { to: "/leads/perfil", label: "Perfil Lead", icon: User },
  { to: "/analisis-ia", label: "Análisis IA", icon: Sparkles },
  { to: "/documentacion", label: "Documentación", icon: FileText },
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const isActive = (to: string) => {
    if (to === "/leads/perfil") {
      // Activo en el buscador y también cuando hay un lead seleccionado por id
      return pathname === "/leads/perfil" || /^\/leads\/(?!perfil$)[^/]+$/.test(pathname);
    }
    if (to === "/leads") {
      return pathname === "/leads";
    }
    return pathname === to;
  };

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      {/* Sidebar — desktop persistent, mobile drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 border-r border-border bg-sidebar text-sidebar-foreground transition-transform lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
        <div className="flex h-14 shrink-0 items-center justify-between px-5 border-b border-sidebar-border">
          <Link to="/dashboard" className="flex items-center gap-2 font-semibold tracking-tight">
            <span className="grid h-7 w-7 place-items-center rounded-md bg-primary text-primary-foreground text-xs font-bold">L</span>
            LeadFlow
          </Link>
          <button
            onClick={() => setOpen(false)}
            className="lg:hidden text-muted-foreground hover:text-foreground"
            aria-label="Cerrar menú"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex shrink-0 flex-col gap-0.5 p-3">
          {items.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors ${
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Chat IA — separado del menú con margen y borde superior */}
        <div className="min-h-0 flex-1 overflow-hidden px-3 pb-2 pt-4 mt-4 border-t border-sidebar-border">
          <SidebarAIChat />
        </div>

        <div className="shrink-0 px-3 pb-3 pt-2 border-t border-sidebar-border">
          <button
            onClick={() => navigate({ to: "/" })}
            className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <LogOut className="h-4 w-4" />
            Cerrar sesión
          </button>
        </div>
        </div>
      </aside>

      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur lg:px-6">
          <button
            onClick={() => setOpen(true)}
            className="lg:hidden -ml-1 grid h-9 w-9 place-items-center rounded-md hover:bg-muted"
            aria-label="Abrir menú"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-2 text-sm">
            <div className="grid h-8 w-8 place-items-center rounded-full bg-muted text-xs font-semibold">
              LG
            </div>
            <span className="hidden sm:inline text-muted-foreground">Laura García</span>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
