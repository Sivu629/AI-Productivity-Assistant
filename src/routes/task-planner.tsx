import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ToolWorkspace } from "@/components/ToolWorkspace";

export const Route = createFileRoute("/task-planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner | Workplace AI" },
      {
        name: "description",
        content:
          "Break any work goal into a prioritized, sequenced task plan with effort estimates and milestones.",
      },
      { property: "og:title", content: "AI Task Planner" },
      {
        property: "og:description",
        content: "Turn a goal into a sequenced plan with priorities, owners and milestones.",
      },
    ],
  }),
  component: PlannerPage,
});

function PlannerPage() {
  return (
    <AppShell
      title="AI Task Planner"
      description="Turn a goal into a realistic, prioritized plan"
    >
      <ToolWorkspace
        system="You are a pragmatic project planner. Produce realistic, sequenced plans with priorities and effort estimates. Plain text only, no markdown tables."
        fields={[
          { name: "goal", label: "Goal or project", type: "textarea", rows: 4, placeholder: "Launch the internal onboarding portal", required: true },
          { name: "deadline", label: "Deadline / timeframe", placeholder: "e.g. 6 weeks, or 30 September" },
          { name: "capacity", label: "Time available", placeholder: "e.g. 8 hours per week, team of 3" },
          { name: "constraints", label: "Constraints & dependencies", type: "textarea", rows: 3, placeholder: "Budget limits, approvals needed, blocked on IT…" },
          { name: "style", label: "Plan style", type: "select", options: ["Daily checklist", "Weekly milestones", "Phased roadmap", "Kanban backlog"], required: true },
        ]}
        initialValues={{ goal: "", deadline: "", capacity: "", constraints: "", style: "Weekly milestones" }}
        buildPrompt={(v) =>
          [
            "Create a work plan for the goal below.",
            `Goal: ${v.goal}`,
            v.deadline ? `Timeframe: ${v.deadline}` : "",
            v.capacity ? `Capacity: ${v.capacity}` : "",
            v.constraints ? `Constraints: ${v.constraints}` : "",
            `Plan style: ${v.style}`,
            "Output: OBJECTIVE, then the plan grouped by phase or week. For every task give: task, priority (High/Medium/Low), estimated effort, dependency (if any). Finish with MILESTONES and TOP RISKS with a mitigation each.",
          ]
            .filter(Boolean)
            .join("\n")
        }
        submitLabel="Build plan"
        outputLabel="Task plan (editable)"
        tips="Add real constraints for a plan you can actually execute."
      />
    </AppShell>
  );
}
