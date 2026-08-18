import { createFileRoute, Link } from "@tanstack/react-router";
import { Bot, ListChecks, Mail, NotebookPen, Search, ShieldAlert } from "lucide-react";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AI Workplace Productivity Assistant Dashboard" },
      {
        name: "description",
        content:
          "Automate workplace tasks with AI: draft emails, summarize meetings, plan tasks, research topics and chat with an assistant.",
      },
      { property: "og:title", content: "AI Workplace Productivity Assistant" },
      {
        property: "og:description",
        content: "One clean workspace for AI-drafted emails, meeting summaries, plans and research.",
      },
    ],
  }),
  component: Dashboard,
});

const tools = [
  {
    to: "/email",
    icon: Mail,
    name: "Smart Email Generator",
    copy: "Turn a few bullet points into a polished, tone-matched email in seconds.",
  },
  {
    to: "/meeting-notes",
    icon: NotebookPen,
    name: "Meeting Notes Summarizer",
    copy: "Convert raw notes or transcripts into decisions, risks and owned action items.",
  },
  {
    to: "/task-planner",
    icon: ListChecks,
    name: "AI Task Planner",
    copy: "Break a goal into a sequenced plan with priorities, effort and deadlines.",
  },
  {
    to: "/research",
    icon: Search,
    name: "AI Research Assistant",
    copy: "Get structured briefings with key findings, considerations and open questions.",
  },
  {
    to: "/chat",
    icon: Bot,
    name: "AI Chatbot Interface",
    copy: "Think out loud with a work-focused assistant that keeps full conversation context.",
  },
] as const;

function Dashboard() {
  return (
    <AppShell
      title="Dashboard"
      description="Your AI workspace for everyday professional tasks"
    >
      <section className="gradient-hero overflow-hidden rounded-2xl px-6 py-10 text-primary-foreground md:px-10 md:py-14">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground/70">
          Workplace automation
        </p>
        <h2 className="mt-3 max-w-2xl text-2xl font-semibold md:text-4xl">
          Do the work that matters. Let AI handle the drafting.
        </h2>
        <p className="mt-4 max-w-xl text-sm text-primary-foreground/85 md:text-base">
          Five focused assistants with structured prompts and fully editable output — built for
          professionals who ship.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            to="/email"
            className="inline-flex items-center rounded-lg bg-background px-4 py-2 text-sm font-medium text-foreground transition-opacity hover:opacity-90"
          >
            Draft an email
          </Link>
          <Link
            to="/chat"
            className="inline-flex items-center rounded-lg border border-primary-foreground/40 px-4 py-2 text-sm font-medium transition-colors hover:bg-primary-foreground/10"
          >
            Open assistant chat
          </Link>
        </div>
      </section>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {tools.map(({ to, icon: Icon, name, copy }) => (
          <Link key={to} to={to} className="surface-card group p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_-8px_oklch(0.21_0.07_265/0.28)]">
            <span className="grid size-10 place-items-center rounded-lg bg-accent text-accent-foreground">
              <Icon className="size-5" aria-hidden />
            </span>
            <h3 className="mt-4 text-base font-semibold text-foreground">{name}</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">{copy}</p>
            <span className="mt-4 inline-block text-sm font-medium text-primary group-hover:underline">
              Open tool →
            </span>
          </Link>
        ))}
      </div>

      <section className="surface-card mt-8 flex gap-4 p-5">
        <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-accent text-accent-foreground">
          <ShieldAlert className="size-5" aria-hidden />
        </span>
        <div>
          <h3 className="text-base font-semibold text-foreground">Responsible AI disclaimer</h3>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Outputs are AI-generated drafts and may be inaccurate, incomplete or outdated. Do not
            paste confidential or personal data you are not permitted to share, verify all facts and
            figures, and keep a human accountable for every message, plan and decision.
          </p>
        </div>
      </section>
    </AppShell>
  );
}
