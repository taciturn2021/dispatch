import { discordHandler } from "./discord";
import type { NotificationJob } from "../types/notification";

export const channelRouter = async (notification:NotificationJob) => {
const channel = notification.channel;
let status = false;
if (channel === "discord") {
    status = await discordHandler(notification);
}
// add rest of the handlers here

return status
}