import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Send, Bot, User, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { runAiChat } from "@/lib/ai.functions";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Assistant Chat | Workplace AI" },
      {
        name: "description",
        content:
          "Chat with a work-focused AI assistant that keeps full conversation context for drafting, planning and problem solving.",
      },
      { property: "og:title", content: "AI Assistant Chat" },
      {
        property: "og:description",
        content: "A work-focused AI chatbot with full conversation memory.",
      },
    ],
  }),
  component: ChatPage,
});

type Message = { role: "user" | "assistant"; content: string };

const starters = [
  "Help me prepare for a difficult performance conversation.",
  "Rewrite this update so it's clearer for executives.",
  "What should I cover in a weekly team stand-up?",
];

function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  const chat = useServerFn(runAiChat);

  const mutation = useMutation({
    mutationFn: async (history: Message[]) => chat({ data: { messages: history } }),
    onSuccess: (result) =>
      setMessages((prev) => [...prev, { role: "assistant", content: result.text.trim() }]),
    onError: (error: Error) => toast.error(error.message || "The assistant could not reply."),
  });

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, mutation.isPending]);

  const send = (text: string) => {
    const value = text.trim();
    if (!value || mutation.isPending) return;
    const history: Message[] = [...messages, { role: "user", content: value }];
    setMessages(history);
    setInput("");
    mutation.mutate(history);
  };

  return (
    <AppShell title="AI Chatbot Interface" description="A work-focused assistant with full conversation context">
      <div className="surface-card mx-auto flex h-[calc(100vh-13rem)] min-h-[480px] w-full max-w-3xl flex-col overflow-hidden">
        <div className="flex items-center justify-between border-b border-border px-5 py-3">
          <span className="text-sm font-semibold text-foreground">Assistant</span>
          <Button
            variant="ghost"
            size="sm"
            disabled={!messages.length}
            onClick={() => setMessages([])}
          >
            <Trash2 className="size-4" aria-hidden />
            Clear
          </Button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
          {messages.length === 0 ? (
            <div className="mx-auto max-w-md py-8 text-center">
              <span className="mx-auto grid size-12 place-items-center rounded-xl bg-accent text-accent-foreground">
                <Bot className="size-6" aria-hidden />
              </span>
              <h2 className="mt-4 text-base font-semibold text-foreground">
                How can I help with your work today?
              </h2>
              <div className="mt-5 flex flex-col gap-2">
                {starters.map((starter) => (
                  <button
                    key={starter}
                    onClick={() => send(starter)}
                    className="rounded-lg border border-border px-3 py-2 text-left text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                  >
                    {starter}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={
                  message.role === "user" ? "flex justify-end gap-3" : "flex justify-start gap-3"
                }
              >
                {message.role === "assistant" && (
                  <span className="mt-1 grid size-8 shrink-0 place-items-center rounded-lg bg-accent text-accent-foreground">
                    <Bot className="size-4" aria-hidden />
                  </span>
                )}
                <div
                  className={
                    message.role === "user"
                      ? "max-w-[80%] whitespace-pre-wrap rounded-2xl rounded-br-sm bg-primary px-4 py-2.5 text-sm text-primary-foreground"
                      : "max-w-[80%] whitespace-pre-wrap rounded-2xl rounded-bl-sm bg-secondary px-4 py-2.5 text-sm text-secondary-foreground"
                  }
                >
                  {message.content}
                </div>
                {message.role === "user" && (
                  <span className="mt-1 grid size-8 shrink-0 place-items-center rounded-lg bg-secondary text-secondary-foreground">
                    <User className="size-4" aria-hidden />
                  </span>
                )}
              </div>
            ))
          )}

          {mutation.isPending && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" aria-hidden />
              Thinking…
            </div>
          )}
          <div ref={endRef} />
        </div>

        <form
          className="border-t border-border p-4"
          onSubmit={(event) => {
            event.preventDefault();
            send(input);
          }}
        >
          <div className="flex items-end gap-2">
            <Textarea
              value={input}
              rows={2}
              placeholder="Ask anything about your work…"
              className="min-h-[52px] resize-none"
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  send(input);
                }
              }}
            />
            <Button type="submit" size="icon" disabled={mutation.isPending || !input.trim()}>
              <Send className="size-4" aria-hidden />
              <span className="sr-only">Send</span>
            </Button>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            AI can make mistakes. Verify important details and avoid sharing confidential data.
          </p>
        </form>
      </div>
    </AppShell>
  );
}
