import {hash} from "bun";
import type { NotificationJob } from "../types/notification";
import { getRedisClient } from "../lib/redis";
const client = getRedisClient();
const cooldown = parseInt(process.env.COOLDOWN || "300") ; // 300 seconds or 5 minutes by default

export const deduplicate = async (notification: NotificationJob) => {
const {id, ...dataToHash} = notification;
const dataHash = hash(JSON.stringify(dataToHash));

const dedupkey = `dedup:${notification.userId}:${dataHash}`;
const existingRecord = await client.get(dedupkey);
if (existingRecord) {
    return {
        status: "duplicate",
        notificationId: existingRecord
    }
}

// if none exists then add for future checks
await client.set(dedupkey,notification.id, "EX", cooldown );
return {
    status: "unique"
}
};