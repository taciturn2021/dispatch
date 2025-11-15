import { NotificationSchema } from "../../types/notification";

export const handleNotification = async (req: Request): Promise<Response> => {
  try {
    console.log("Notification Request Received:");
    const data = await req.json();
    const validatedData = NotificationSchema.parse(data);
    console.log("data:", data);
    return Response.json({ message: "response" }, { status: 200 });
  } catch (error: unknown) {
    console.log("Error in notification:", error);
    return Response.json({ message:error }, { status: 400 });
  }
};