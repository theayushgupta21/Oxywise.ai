import test from "node:test";
import assert from "node:assert/strict";

import {
  computeCacheKey,
  getCacheValue,
  setCacheValue,
  deleteCacheValue,
} from "../src/services/cacheService.js";

test("computeCacheKey normalizes repeated inputs deterministically", () => {
  const first = computeCacheKey("weather", { city: "  Delhi  ", country: "IN" });
  const second = computeCacheKey("weather", { city: "delhi", country: "in" });

  assert.equal(first, "weather:delhi:in");
  assert.equal(second, first);
});

test("cache lookup falls back cleanly when Redis is unavailable", async () => {
  const result = await getCacheValue("weather:delhi", null);
  assert.equal(result, null);
});

test("cache write and delete works with a fake Redis client", async () => {
  const store = new Map();
  const fakeRedis = {
    async get(key) {
      return store.has(key) ? JSON.stringify(store.get(key)) : null;
    },
    async set(key, value, options = {}) {
      store.set(key, JSON.parse(value));
      if (options.EX) {
        store.set(`${key}:ttl`, options.EX);
      }
      return "OK";
    },
    async del(key) {
      store.delete(key);
      store.delete(`${key}:ttl`);
      return 1;
    },
  };

  const payload = { tempC: 28, condition: "Clear" };
  const key = "weather:delhi";

  await setCacheValue(key, payload, 300, fakeRedis);
  const cached = await getCacheValue(key, fakeRedis);
  assert.deepEqual(cached, payload);

  await deleteCacheValue(key, fakeRedis);
  assert.equal(await getCacheValue(key, fakeRedis), null);
});
