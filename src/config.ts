import { z } from "zod";

const envSchema = z.object({
  PORT: z.string().optional(),
  REDIS_URL: z.string(),
  COOLDOWN: z.string().optional(),
  RETRY_INTERVAL: z.string().optional(),
  DISCORD_WEBHOOK: z.string().optional(),
});

const env = envSchema.parse(process.env);
console.log("env config loaded successfully");
export const config = {
  port: parseInt(env.PORT || "3000"),
  redisURL: env.REDIS_URL,
  cooldownSeconds: parseInt(env.COOLDOWN || "300"),
  retryInterval: parseInt(env.RETRY_INTERVAL || "5") * 1000,
  discordURL: env.DISCORD_WEBHOOK,
};


