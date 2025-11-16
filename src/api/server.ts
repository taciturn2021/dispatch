import { healthCheck } from "./routes/admin";
import { handleNotification } from "./routes/notification";
import { config } from "../config";

const server = Bun.serve({
    port: config.port,
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
const realtimeWorker = new Worker("./src/workers/realtime-worker.ts");



// Spawn the queue worker on startup
const queueWorker = new Worker("./src/workers/queue-worker.ts");



// Spawn the retry worker on startup
const retryWorker = new Worker("./src/workers/retry-worker.ts");


console.log(`Server running at ${server.url}`);