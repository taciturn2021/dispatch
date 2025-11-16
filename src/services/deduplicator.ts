import {hash} from "bun";
import type { NotificationJob } from "../types/notification";
import { getRedisClient } from "../lib/redis";
import { config } from "../config";

const client = getRedisClient();
const cooldown = config.cooldownSeconds; // 300 sec/ 5 minutes by default

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