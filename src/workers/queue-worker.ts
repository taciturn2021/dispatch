console.log("[Queue Worker] boot");
import { getRedisClient } from "../lib/redis";



const client = getRedisClient();
while (true) {

    const job = await client.brpop('queue:reliable', 5);
    if (!job) {
        continue;
    }
    const notification = JSON.parse(job[1]);

    const status = await client.get(`notification:${notification.id}:status`);

    if (status === "sent") {
        console.log(`[Queue Worker] Notification ${notification.id} already sent!`);
        continue;
    }

    try {
        if (notification.retryCount < 5) {
            console.log(`[Queue Worker] Notification ${notification.id} added to retry queue`);
            const delay = Math.pow(2, notification.retryCount) * 1000;
            await client.zadd("queue:retry", Date.now() + delay, JSON.stringify(notification));
        } else {
            console.log(`[Queue Worker] Notification ${notification.id} added to failed queue`);
            await client.lpush('queue:failed', JSON.stringify({ ...notification, failedAt: Date.now() })); // dead queue no more retries
        }
    }catch(error) {
        console.log(`[Queue Worker] Notification ${notification.id} error occurred: ${error}`);
    }





}