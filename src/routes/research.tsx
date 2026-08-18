import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ToolWorkspace } from "@/components/ToolWorkspace";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant | Workplace AI" },
      {
        name: "description",
        content:
          "Get structured research briefings with key findings, trade-offs, risks and open questions for any work topic.",
      },
      { property: "og:title", content: "AI Research Assistant" },
      {
        property: "og:description",
        content: "Structured briefings with findings, considerations and open questions.",
      },
    ],
  }),
  component: ResearchPage,
});

function ResearchPage() {
  return (
    <AppShell
      title="AI Research Assistant"
      description="Structured briefings for decisions and stakeholder updates"
    >
      <ToolWorkspace
        system="You are a rigorous research analyst. Be balanced and explicit about uncertainty. Clearly flag anything that needs verification with a primary source. Plain text with labelled sections."
        fields={[
          { name: "topic", label: "Research question or topic", type: "textarea", rows: 4, placeholder: "How are mid-size firms adopting AI note-taking tools?", required: true },
          { name: "audience", label: "Audience", placeholder: "e.g. exec team, technical peers, client" },
          { name: "depth", label: "Depth", type: "select", options: ["Quick brief", "Standard briefing", "Deep dive"], required: true },
          { name: "angle", label: "Focus areas", placeholder: "e.g. cost, compliance, competitor landscape" },
        ]}
        initialValues={{ topic: "", audience: "", depth: "Standard briefing", angle: "" }}
        buildPrompt={(v) =>
          [
            "Produce a research briefing.",
            `Topic: ${v.topic}`,
            v.audience ? `Audience: ${v.audience}` : "",
            v.angle ? `Focus areas: ${v.angle}` : "",
            `Depth: ${v.depth}`,
            "Sections: EXECUTIVE SUMMARY, KEY FINDINGS, OPPORTUNITIES, RISKS & TRADE-OFFS, RECOMMENDED NEXT STEPS, OPEN QUESTIONS TO VERIFY.",
            "Do not fabricate statistics, citations or sources. Where a number or claim would need a source, mark it as [verify].",
          ]
            .filter(Boolean)
            .join("\n")
        }
        submitLabel="Run research"
        outputLabel="Research briefing (editable)"
        tips="This assistant reasons from model knowledge and does not browse the web — always verify [verify] items."
      />
    </AppShell>
  );
}
