import { z } from "zod";

export const NotificationAPISchema = z.object({
  userId: z.string(),
  channel: z.enum(["email", "sms", "push", "discord"]),
  content: z.object({
    subject: z.string().optional(),
    message: z.string(),
  }),
  priority: z.enum(["low", "medium", "high"]).optional(),
});


export const NotificationJobSchema = z.object({
    userId: z.string(),
    id: z.string(),
    channel: z.enum(["email", "sms", "push", "discord"]),
    content: z.object({
      subject: z.string().optional(),
      message: z.string(),
    }),
    priority: z.enum(["low", "medium", "high"]).optional(),
  });

  export type NotificationJob = z.infer<typeof NotificationJobSchema>;


