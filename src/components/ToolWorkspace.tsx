import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { Copy, Loader2, RotateCcw, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { runAiTool } from "@/lib/ai.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type ToolField = {
  name: string;
  label: string;
  placeholder?: string;
  type?: "text" | "textarea" | "select";
  options?: string[];
  required?: boolean;
  rows?: number;
};

export function ToolWorkspace({
  system,
  fields,
  initialValues,
  buildPrompt,
  submitLabel = "Generate",
  outputLabel = "AI draft (editable)",
  tips,
}: {
  system: string;
  fields: ToolField[];
  initialValues: Record<string, string>;
  buildPrompt: (values: Record<string, string>) => string;
  submitLabel?: string;
  outputLabel?: string;
  tips?: string;
}) {
  const [values, setValues] = useState<Record<string, string>>(initialValues);
  const [output, setOutput] = useState("");
  const generate = useServerFn(runAiTool);

  const mutation = useMutation({
    mutationFn: async () => generate({ data: { system, prompt: buildPrompt(values) } }),
    onSuccess: (result) => setOutput(result.text.trim()),
    onError: (error: Error) => toast.error(error.message || "Generation failed. Please try again."),
  });

  const missing = fields.filter((f) => f.required && !values[f.name]?.trim());

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,9fr)]">
      <section className="surface-card p-5">
        <h2 className="text-base font-semibold text-foreground">Structured prompt</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Fill in the context. Clear inputs produce stronger, on-brand output.
        </p>

        <form
          className="mt-5 flex flex-col gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            if (missing.length) {
              toast.error(`Please complete: ${missing.map((f) => f.label).join(", ")}`);
              return;
            }
            mutation.mutate();
          }}
        >
          {fields.map((field) => (
            <div key={field.name} className="flex flex-col gap-1.5">
              <Label htmlFor={field.name}>{field.label}</Label>
              {field.type === "textarea" ? (
                <Textarea
                  id={field.name}
                  rows={field.rows ?? 5}
                  placeholder={field.placeholder}
                  value={values[field.name] ?? ""}
                  onChange={(e) => setValues((v) => ({ ...v, [field.name]: e.target.value }))}
                />
              ) : field.type === "select" ? (
                <Select
                  value={values[field.name] ?? ""}
                  onValueChange={(next) => setValues((v) => ({ ...v, [field.name]: next }))}
                >
                  <SelectTrigger id={field.name}>
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                  <SelectContent>
                    {(field.options ?? []).map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  id={field.name}
                  placeholder={field.placeholder}
                  value={values[field.name] ?? ""}
                  onChange={(e) => setValues((v) => ({ ...v, [field.name]: e.target.value }))}
                />
              )}
            </div>
          ))}

          <div className="flex flex-wrap gap-2 pt-1">
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? (
                <Loader2 className="size-4 animate-spin" aria-hidden />
              ) : (
                <Sparkles className="size-4" aria-hidden />
              )}
              {mutation.isPending ? "Generating…" : submitLabel}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setValues(initialValues);
                setOutput("");
              }}
            >
              <RotateCcw className="size-4" aria-hidden />
              Reset
            </Button>
          </div>
          {tips ? <p className="text-xs text-muted-foreground">{tips}</p> : null}
        </form>
      </section>

      <section className="surface-card flex min-h-[420px] flex-col p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-semibold text-foreground">{outputLabel}</h2>
            <p className="text-sm text-muted-foreground">
              Edit freely before you use it — you own the final wording.
            </p>
          </div>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={!output}
            onClick={() => {
              void navigator.clipboard.writeText(output);
              toast.success("Copied to clipboard");
            }}
          >
            <Copy className="size-4" aria-hidden />
            Copy
          </Button>
        </div>

        <Textarea
          className="mt-4 min-h-[320px] flex-1 font-sans text-sm leading-relaxed"
          value={output}
          placeholder="Your AI draft will appear here, ready to edit."
          onChange={(e) => setOutput(e.target.value)}
        />
        <p className="mt-3 text-xs text-muted-foreground">
          AI-generated content may contain errors. Review facts, names and numbers before sending.
        </p>
      </section>
    </div>
  );
}
