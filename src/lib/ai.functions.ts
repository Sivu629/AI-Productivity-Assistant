import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const ToolInput = z.object({
  system: z.string().min(1),
  prompt: z.string().min(1),
});

const ChatInput = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1),
      }),
    )
    .min(1),
});

/** Generic structured-prompt runner used by every assistant tool. */
export const runAiTool = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ToolInput.parse(input))
  .handler(async ({ data }) => {
    const { streamText } = await import("ai");
    const { getGatewayModel } = await import("./ai-gateway.server");

    const result = streamText({
      model: getGatewayModel(),
      system: data.system,
      prompt: data.prompt,
    });

    return { text: await result.text };
  });

export const runAiChat = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ChatInput.parse(input))
  .handler(async ({ data }) => {
    const { streamText } = await import("ai");
    const { getGatewayModel } = await import("./ai-gateway.server");

    const result = streamText({
      model: getGatewayModel(),
      system:
        "You are the AI Workplace Productivity Assistant. Be concise, practical and professional. Use markdown-free plain text with short paragraphs and dashes for lists. Never invent facts about the user's company; ask for missing details instead.",
      messages: data.messages,
    });

    return { text: await result.text };
  });
