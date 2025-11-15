import { z } from "zod";

export const NotificationSchema = z.object({
  id: z.string(),
  type: z.enum(["email", "sms", "push", "discord"]),
  content: z.object({
    subject: z.string().optional(),
    message: z.string(),
  }),
  priority: z.enum(["low", "medium", "high"]).optional(),
});

export type Notification = z.infer<typeof NotificationSchema>;
