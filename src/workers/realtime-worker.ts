declare var self: Worker;

import { NotificationJobSchema } from "../types/notification";
import type { NotificationJob } from "../types/notification";
import {channelRouter} from "../channels/channelRouter";
import {getRedisSubscriber,addToRedis, getRedisClient } from "../lib/redis";
import type { RedisClient } from "bun";


const subscriber: RedisClient = getRedisSubscriber();


subscriber.subscribe("notification", async (message, channel) => {
    const notification = JSON.parse(message);

    console.log(`[Realtime Worker] New ${notification.channel} notification received: ${notification.id}`);

    try {
        const validatedData: NotificationJob = NotificationJobSchema.parse(notification);

        let status: boolean = await channelRouter(validatedData);
        addToRedis(notification, status);
    } catch (error) {
        console.error("Error occured: ", error);
    }
});




self.addEventListener("close", () => {
    subscriber.unsubscribe("notification");
});