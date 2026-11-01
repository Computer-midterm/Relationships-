import { z } from "zod";
import { MODE_IDS } from "./modes";

export const MAX_USER_CHARS = 6000;
export const MAX_ASSISTANT_CHARS = 16000;

export const contextSchema = z
  .object({
    name: z.string().trim().max(60).optional(),
    partnerName: z.string().trim().max(60).optional(),
    country: z.enum(["US", "UK", "IE", "CA", "AU", "OTHER"]).optional(),
    ageGroup: z.enum(["adult", "under18"]).optional(),
  })
  .strict();

export type UserContext = z.infer<typeof contextSchema>;

const messageSchema = z.discriminatedUnion("role", [
  z.object({ role: z.literal("user"), content: z.string().trim().min(1).max(MAX_USER_CHARS) }),
  z.object({ role: z.literal("assistant"), content: z.string().max(MAX_ASSISTANT_CHARS) }),
]);

export const chatRequestSchema = z.object({
  mode: z.enum(MODE_IDS),
  messages: z.array(messageSchema).min(1).max(400),
  context: contextSchema.optional(),
});

export const rewriteRequestSchema = z.object({
  text: z.string().trim().min(1).max(3000),
  context: z.string().trim().max(400).optional(),
});

export const RewriteSchema = z.object({
  feeling: z.string(),
  gentle: z.string(),
  direct: z.string(),
  brief: z.string(),
  notes: z.array(z.string()),
  safety: z.string().nullable(),
});
export type RewriteResult = z.infer<typeof RewriteSchema>;
