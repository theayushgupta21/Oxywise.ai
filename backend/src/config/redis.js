import { createClient } from "redis";

let redisClient = null;

export async function connectRedis() {
    if (redisClient) return redisClient;

    if (!process.env.REDIS_URL) {
        console.info("ℹ️ REDIS_URL not configured; Redis cache disabled");
        return null;
    }

    try {
        redisClient = createClient({ url: process.env.REDIS_URL });
        redisClient.on("error", (err) => {
            console.warn("⚠️ Redis warning:", err.message || "Redis connection error");
        });

        await redisClient.connect();
        console.log("✅ Redis connected");
        return redisClient;
    } catch (err) {
        console.warn("⚠️ Redis unavailable; continuing without cache");
        redisClient = null;
        return null;
    }
}

export async function getRedisClient() {
    if (!redisClient && process.env.REDIS_URL) {
        return connectRedis();
    }
    return redisClient;
}

export function getRedisStatus() {
    return process.env.REDIS_URL ? (redisClient?.isOpen ? "connected" : "configured") : "disabled";
}
