import { RedisClient } from "bun";

let subscriberInstance: RedisClient | null = null;
let commandInstance: RedisClient | null = null;

export function getRedisSubscriber(): RedisClient {
  if (!subscriberInstance) {
    if (!process.env.REDIS_URL) {
      console.error("REDIS_URL NOT SET");
      process.exit(1);
    }
    subscriberInstance = new RedisClient(process.env.REDIS_URL);
    console.log("Redis Subscriber Client initialized");
  }
  return subscriberInstance;
}

export function getRedisClient(): RedisClient {
  if (!commandInstance) {
    if (!process.env.REDIS_URL) {
      console.error("REDIS_URL NOT SET");
      process.exit(1);
    }
    commandInstance = new RedisClient(process.env.REDIS_URL);
    console.log("Redis Command Client initialized");
  }
  return commandInstance;
}