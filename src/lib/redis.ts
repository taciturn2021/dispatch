import {RedisClient } from "bun";

let client: RedisClient;

if (process.env.REDIS_URL){
    console.log("Initializing Redis Client...")
    client = new RedisClient(process.env.REDIS_URL);
    console.log("Redis Client initialized successfully!");
}else {
    console.log("REDIS_URL NOT SET IN ENVIRONMENT VARiABLE");
    process.exit(1);
}

export {client}



