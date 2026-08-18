import { Link } from "@tanstack/react-router";
import {
  Bot,
  LayoutDashboard,
  Mail,
  NotebookPen,
  ListChecks,
  Search,
  Menu,
  Sparkles,
  ShieldAlert,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/email", label: "Smart Email", icon: Mail },
  { to: "/meeting-notes", label: "Meeting Notes", icon: NotebookPen },
  { to: "/task-planner", label: "Task Planner", icon: ListChecks },
  { to: "/research", label: "Research", icon: Search },
  { to: "/chat", label: "Assistant Chat", icon: Bot },
] as const;

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-1">
      {nav.map(({ to, label, icon: Icon }) => (
        <Link
          key={to}
          to={to}
          onClick={onNavigate}
          activeOptions={{ exact: to === "/" }}
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground/75 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          activeProps={{
            className:
              "bg-sidebar-accent text-sidebar-accent-foreground shadow-[inset_2px_0_0_0_var(--sidebar-primary)]",
          }}
        >
          <Icon className="size-4" aria-hidden />
          {label}
        </Link>
      ))}
    </nav>
  );
}

function SidebarBody({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col gap-6 bg-sidebar p-4">
      <Link
        to="/"
        onClick={onNavigate}
        className="flex items-center gap-2.5 px-2 py-1 text-sidebar-foreground"
      >
        <span className="grid size-9 place-items-center rounded-lg gradient-hero">
          <Sparkles className="size-5 text-primary-foreground" aria-hidden />
        </span>
        <span className="leading-tight">
          <span className="block font-display text-sm font-semibold">Workplace AI</span>
          <span className="block text-xs text-sidebar-foreground/60">Productivity Assistant</span>
        </span>
      </Link>

      <p className="px-3 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/45">
        Workspace
      </p>
      <div className="-mt-4">
        <NavLinks onNavigate={onNavigate} />
      </div>

      <div className="mt-auto rounded-lg border border-sidebar-border p-3 text-xs text-sidebar-foreground/65">
        <span className="mb-1 flex items-center gap-1.5 font-semibold text-sidebar-foreground/85">
          <ShieldAlert className="size-3.5" aria-hidden /> Responsible AI
        </span>
        AI output can be inaccurate. Review and edit everything before sending or sharing.
      </div>
    </div>
  );
}

export function AppShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background lg:grid lg:grid-cols-[268px_1fr]">
      <aside className="sticky top-0 hidden h-screen lg:block">
        <SidebarBody />
      </aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label="Close navigation"
            className="absolute inset-0 bg-foreground/40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-[268px]">
            <SidebarBody onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-col">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-background/85 px-4 py-3 backdrop-blur md:px-8">
          <button
            className="grid size-9 shrink-0 place-items-center rounded-lg border border-border text-foreground lg:hidden"
            onClick={() => setOpen(true)}
            aria-label="Open navigation"
          >
            <Menu className="size-4" aria-hidden />
          </button>
          <div className="min-w-0">
            <h1 className="truncate text-lg font-semibold text-foreground md:text-xl">{title}</h1>
            <p className="truncate text-xs text-muted-foreground md:text-sm">{description}</p>
          </div>
        </header>

        <main className={cn("flex-1 px-4 py-6 md:px-8 md:py-8")}>{children}</main>

        <footer className="border-t border-border px-4 py-4 text-xs text-muted-foreground md:px-8">
          Responsible AI: generated content is a draft assistant, not professional advice. Verify
          facts, protect confidential data, and keep a human in the loop.
        </footer>
      </div>
    </div>
  );
}
