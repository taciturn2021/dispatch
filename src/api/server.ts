import { healthCheck } from "./routes/admin";
import { handleNotification } from "./routes/notification";
const server = Bun.serve({
    port: parseInt(process.env.PORT || "3000"),
    routes: {
        // Static routes
        "/api/health": {
            GET: healthCheck,
        },
        "/api/notifications": {
            POST: handleNotification,
        }
        ,
        "/api/*": Response.json({ message: "Not found" }, { status: 404 }),
    },
});



// Spawn the notification worker on startup
const notificationWorker = new Worker("./src/workers/realtime-worker.ts");

notificationWorker.addEventListener("open", () => {
    console.log("✓ Notification worker started");
});


console.log(`Server running at ${server.url}`);