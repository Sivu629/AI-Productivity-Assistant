import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ToolWorkspace } from "@/components/ToolWorkspace";

export const Route = createFileRoute("/meeting-notes")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer | Workplace AI" },
      {
        name: "description",
        content:
          "Turn messy meeting notes or transcripts into a clean summary with decisions, action items and owners.",
      },
      { property: "og:title", content: "Meeting Notes Summarizer" },
      {
        property: "og:description",
        content: "Decisions, risks and owned action items extracted from raw meeting notes.",
      },
    ],
  }),
  component: NotesPage,
});

function NotesPage() {
  return (
    <AppShell
      title="Meeting Notes Summarizer"
      description="Raw notes in, decisions and action items out"
    >
      <ToolWorkspace
        system="You are a meticulous executive assistant. Summarize meetings faithfully and never add facts that are not in the notes. Output plain text with clear labelled sections."
        fields={[
          { name: "title", label: "Meeting title", placeholder: "e.g. Q3 roadmap review" },
          { name: "attendees", label: "Attendees", placeholder: "e.g. Sivuyile, Thandi, Client team" },
          { name: "notes", label: "Raw notes or transcript", type: "textarea", rows: 12, placeholder: "Paste your notes, bullet points or transcript here…", required: true },
          { name: "detail", label: "Summary depth", type: "select", options: ["Executive brief", "Balanced", "Detailed minutes"], required: true },
        ]}
        initialValues={{ title: "", attendees: "", notes: "", detail: "Balanced" }}
        buildPrompt={(v) =>
          [
            "Summarize the following meeting notes.",
            v["title"] ? `Meeting: ${v["title"]}` : "",
            v["attendees"] ? `Attendees: ${v["attendees"]}` : "",
            `Depth: ${v["detail"]}`,
            "Use these sections: SUMMARY, KEY DECISIONS, ACTION ITEMS (owner — task — due date if stated), RISKS / BLOCKERS, OPEN QUESTIONS.",
            "If information for a section is missing, write 'None captured'. Do not invent owners or dates.",
            "NOTES:",
            v["notes"],
          ]
            .filter(Boolean)
            .join("\n")
        }
        submitLabel="Summarize notes"
        outputLabel="Meeting summary (editable)"
        tips="Paste the transcript verbatim — the summarizer only uses what you provide."
      />
    </AppShell>
  );
}
