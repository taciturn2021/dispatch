import { NotificationAPISchema, type NotificationJob } from "../../types/notification";
import { getRedisClient } from "../../lib/redis";
import { randomUUIDv7, RedisClient } from "bun";

const client: RedisClient = getRedisClient();

export const handleNotification = async (req: Request): Promise<Response> => {
  try {
    console.log("Notification Request Received:");
    const data = await req.json();
    const validatedData = NotificationAPISchema.parse(data);
    console.log("data:", data);
    //to implement: rate limiting logic
    //to implemenmt: deduplication logic
    // to implement: user preferences


    // publish job for worker:
    const id = randomUUIDv7();
    const jobMessage: NotificationJob = {id, ...validatedData};
    console.log("Publishing job for user: ", jobMessage.userId);
    client.publish(`notification`, JSON.stringify(jobMessage));



    return Response.json({ message: "Success!" }, { status: 200 });
  } catch (error: unknown) {
    console.log("Error in notification:", error);
    return Response.json({ message:error }, { status: 400 });
  }
};