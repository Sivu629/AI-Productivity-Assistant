import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ToolWorkspace } from "@/components/ToolWorkspace";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator | Workplace AI" },
      {
        name: "description",
        content:
          "Generate professional workplace emails from short bullet points, with tone, audience and length control.",
      },
      { property: "og:title", content: "Smart Email Generator" },
      {
        property: "og:description",
        content: "Draft tone-matched professional emails in seconds and edit them freely.",
      },
    ],
  }),
  component: EmailPage,
});

function EmailPage() {
  return (
    <AppShell
      title="Smart Email Generator"
      description="From rough bullet points to a send-ready professional email"
    >
      <ToolWorkspace
        system="You are an expert business communication writer. Write clear, courteous, professional emails. Return a subject line followed by the email body. No preamble, no markdown headings, no explanations."
        fields={[
          { name: "recipient", label: "Recipient / audience", placeholder: "e.g. Client CFO, my manager", required: true },
          { name: "purpose", label: "Purpose & key points", type: "textarea", rows: 6, placeholder: "Follow up on the Q3 proposal, ask for feedback by Friday, offer a call Tuesday…", required: true },
          { name: "tone", label: "Tone", type: "select", options: ["Professional", "Friendly", "Formal", "Direct", "Apologetic", "Persuasive"], required: true },
          { name: "length", label: "Length", type: "select", options: ["Very short", "Short", "Medium", "Detailed"], required: true },
          { name: "cta", label: "Desired next step", placeholder: "e.g. Confirm a 30-minute call this week" },
        ]}
        initialValues={{ recipient: "", purpose: "", tone: "Professional", length: "Short", cta: "" }}
        buildPrompt={(v) =>
          [
            "Write a workplace email.",
            `Recipient/audience: ${v.recipient}`,
            `Tone: ${v.tone}`,
            `Length: ${v.length}`,
            v.cta ? `Desired next step: ${v.cta}` : "",
            "Key points to cover:",
            v.purpose,
            "Format: 'Subject: ...' on the first line, then a blank line, then the email body with a greeting and sign-off placeholder [Your name]. Use [brackets] for any detail you do not know instead of inventing it.",
          ]
            .filter(Boolean)
            .join("\n")
        }
        submitLabel="Generate email"
        outputLabel="Email draft (editable)"
        tips="Tip: list facts as bullets — the assistant will never invent names, dates or numbers you did not provide."
      />
    </AppShell>
  );
}
