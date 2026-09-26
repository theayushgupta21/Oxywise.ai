import { getRedisClient } from "../config/redis.js";

function normalizeCacheValue(value) {
    if (value === null || value === undefined) return "";

    if (typeof value === "string") return value.trim().toLowerCase();
    if (typeof value === "number" || typeof value === "boolean") return String(value).toLowerCase();

    if (Array.isArray(value)) {
        return value.map((item) => normalizeCacheValue(item)).join("|");
    }

    if (typeof value === "object") {
        return Object.keys(value)
            .sort()
            .map((key) => `${key}:${normalizeCacheValue(value[key])}`)
            .join("|");
    }

    return String(value).trim().toLowerCase();
}

export function computeCacheKey(prefix, input) {
    const normalized = normalizeCacheValue(input);
    return normalized ? `${prefix}:${normalized}` : `${prefix}:default`;
}

export async function getCacheValue(key, clientOverride = null) {
    const client = clientOverride ?? (await getRedisClient());
    if (!client) return null;

    try {
        const raw = await client.get(key);
        if (!raw) return null;
        return JSON.parse(raw);
    } catch (err) {
        console.warn("⚠️ Cache read failed:", err.message || "unknown cache error");
        return null;
    }
}

export async function setCacheValue(key, value, ttlSeconds = 300, clientOverride = null) {
    const client = clientOverride ?? (await getRedisClient());
    if (!client) return false;

    try {
        await client.set(key, JSON.stringify(value), { EX: Number(ttlSeconds) || 300 });
        return true;
    } catch (err) {
        console.warn("⚠️ Cache write failed:", err.message || "unknown cache error");
        return false;
    }
}

export async function deleteCacheValue(key, clientOverride = null) {
    const client = clientOverride ?? (await getRedisClient());
    if (!client) return false;

    try {
        await client.del(key);
        return true;
    } catch (err) {
        console.warn("⚠️ Cache invalidation failed:", err.message || "unknown cache error");
        return false;
    }
}

export async function getOrSetCache(key, fetcher, ttlSeconds = 300, clientOverride = null) {
    const cached = await getCacheValue(key, clientOverride);
    if (cached !== null) {
        return { value: cached, hit: true };
    }

    const value = await fetcher();
    await setCacheValue(key, value, ttlSeconds, clientOverride);
    return { value, hit: false };
}
