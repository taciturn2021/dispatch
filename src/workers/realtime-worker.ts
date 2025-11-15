declare var self: Worker;

import { NotificationJobSchema } from "../types/notification";
import type { NotificationJob } from "../types/notification";
import {discordHandler} from "../channels/discord";
import { getRedisClient, getRedisSubscriber } from "../lib/redis";
import type { RedisClient } from "bun";


const subscriber: RedisClient = getRedisSubscriber();
const client: RedisClient = getRedisClient();


subscriber.subscribe("notification", async (message, channel) => {
    const notification = JSON.parse(message);

    console.log(`New notification received for user: ${notification.userId}`);

    try {
        const validatedData: NotificationJob = NotificationJobSchema.parse(notification);

        if (validatedData.channel === "discord") {
            const status = await discordHandler(validatedData);
            if (status) {
                // Mark as sent in Redis
                await client.set(
                    `notification:${notification.id}:status`,
                    "sent",
                    "EX",
                    86400 
                );
            } else {
                await client.set(
                    `notification:${notification.id}:status`,
                    "failed",
                    "EX",
                    86400 
                );
            }
        }
    } catch (error) {
        console.error("Error occured: ", error);
    }
});

self.addEventListener("close", () => {
    subscriber.unsubscribe("notification");
});