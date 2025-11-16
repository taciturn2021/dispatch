import { getRedisClient, addToRedis } from "../lib/redis"
import { channelRouter } from "../channels/channelRouter";
import type { NotificationJob } from "../types/notification";
import { NotificationJobSchema } from "../types/notification";
import { config } from "../config";
const client = getRedisClient();


const retryInterval = config.retryInterval;

const retry = async () => {
    const jobs = await client.zrangebyscore("queue:retry", 0, Date.now(), 'LIMIT', 0, 10);

    for (let job of jobs) {
        try {
        const notification = JSON.parse(job);
        const dupe = await client.get(`notification:${notification.id}:status`);
        if (dupe === "sent") {
            await client.zrem('queue:retry', job);
            console.log(`[Retry Worker] DISCARDING! Duplicate detected for notification: ${notification.id}`);
            continue;
        }
        console.log(`[Retry Worker] Retrying job for notification: ${notification.id}`);
        const notificationJob: NotificationJob = NotificationJobSchema.parse(notification);
        let status = await channelRouter(notificationJob);
        if (status){
            console.log(`[Retry Worker] Retry job succeeded for notification: ${notification.id}`);
            await client.zrem('queue:retry', job);
        }else {
            console.log(`[Retry Worker] Retry job failed for notification: ${notification.id}`);
            await client.zrem('queue:retry', job);
            await client.lpush(`queue:reliable`, JSON.stringify({...notification,retryCount: notification.retryCount+1}));

        }
        }catch(error) {
            const notification = JSON.parse(job);
            console.log(`[Retry Worker] Error occurred for notification: ${notification.id}, readding to queue`);
            await client.zrem('queue:retry', job);
            await client.lpush(`queue:reliable`, JSON.stringify({...notification,retryCount: notification.retryCount+1}));
        }
    }



};



setInterval(retry, retryInterval);