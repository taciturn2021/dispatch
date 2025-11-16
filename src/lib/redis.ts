import { RedisClient } from "bun";
import type { NotificationJob } from "../types/notification";
import { config } from "../config";

let subscriberInstance: RedisClient | null = null;
let commandInstance: RedisClient | null = null;

export function getRedisSubscriber(): RedisClient {
  if (!subscriberInstance) {
    subscriberInstance = new RedisClient(config.redisURL);
  }
  return subscriberInstance;
}

export function getRedisClient(): RedisClient {
  if (!commandInstance) {
    commandInstance = new RedisClient(config.redisURL);
  }
  return commandInstance;
}

const client = getRedisClient();

export const addToRedis = async (notification: NotificationJob, status: boolean) => {
  if (status) {
      // Mark as sent in Redis
      console.log(`[Realtime Worker] ${notification.channel} Notification sent successfully: ${notification.id}`);
      await client.set(
          `notification:${notification.id}:status`,
          "sent",
          "EX",
          86400 
      );
  } else {
      // Mark as failed to send in redis
      console.log(`[Realtime Worker] Failed to send ${notification.channel} notification: ${notification.id}`);
      await client.set(
          `notification:${notification.id}:failed`,
          `failed`,
          "EX",
          86400 
      );
  }

};