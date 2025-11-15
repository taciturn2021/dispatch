import type { NotificationJob } from "../types/notification";
export const discordHandler = async (notification: NotificationJob): Promise<boolean> => {
    const WEBHOOK_URL = process.env.DISCORD_WEBHOOK;
    
    const payload = {
      content: notification.content.message,
      username: "Dispatch Bot",
      // Optional: Add embeds for richer formatting
      embeds: notification.priority ? [
        {
          title: `[${notification.priority.toUpperCase()}] ${notification.content.subject || "Notification"}`,
          description: notification.content.message,
          color: getPriorityColor(notification.priority), // 16711680 for red (high), 16776960 for yellow (medium), etc.
        }
      ] : undefined,
      // Query params
      wait: true,  // Wait for Discord's confirmation
    };
  
    try {
      const response = await fetch(WEBHOOK_URL + "?wait=true", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        console.error("Discord webhook failed:", response.status);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error("Discord handler error:", error);
      return false;
    }
  };
  
  // Helper for priority colors
  const getPriorityColor = (priority: string): number => {
    const colors: Record<string, number> = {
      low: 3066993,      // Green
      medium: 16776960,  // Yellow
      high: 16711680,    // Red
    };
    return colors[priority] || 3066993;
  };

  