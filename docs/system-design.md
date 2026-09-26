# Oxywise AI System Design

## 1. Current architecture

The current application is a lightweight full-stack system composed of:

- Next.js frontend running in Vercel-style deployment
- Express backend running in a Node.js service
- MongoDB with Mongoose for persistence
- JWT-based authentication and Google OAuth
- Socket.IO-based real-time chat
- OpenWeather and Groq external APIs

The backend is responsible for auth, chat, MongoDB access, AI recommendations, and real-time messaging.

## 2. New architecture

```text
                         INTERNET
                             |
                             v
                    ┌────────────────┐
                    │ Next.js App    │
                    │  Vercel        │
                    └────────┬───────┘
                             │ HTTPS / REST
                             v
                    ┌────────────────┐
                    │ Node.js +       │
                    │ Express API     │
                    │ Railway / host  │
                    └───────┬────────┘
                            │
                ┌───────────┼────────────┐
                │           │            │
                v           v            v
            Redis      MongoDB       External APIs
            Cache      Persistence   AI / Weather / OAuth
```

## 3. Why Redis was introduced

Redis is used as a high-speed, temporary cache and request throttle layer. It reduces repeated expensive calls to MongoDB and external APIs while allowing MongoDB to remain the source of truth for persistent application data.

## 4. Redis use cases

The system uses Redis for:

- weather cache for repeated city lookups
- optional plant and recommendation key normalization for deterministic reuse
- request throttling for authentication and chat-heavy endpoints

It does not replace MongoDB for user records, chat history, or core app state.

## 5. Cache strategy

The backend uses a cache-aside pattern:

1. check Redis for the key
2. return cached data on hit
3. fetch from MongoDB or external API on miss
4. store the result with a TTL
5. return the response

## 6. TTL strategy

- weather: 15 minutes
- plant matching data: 30 minutes if reused
- recommendation data: only when deterministic and non-personalized

Short TTLs prevent stale data from persisting beyond acceptable freshness windows.

## 7. Cache invalidation

For mutable data, Redis entries are invalidated after update or delete actions. The design keeps MongoDB authoritative and clears stale cache keys to avoid permanent drift.

## 8. Rate limiting

Redis-backed request limiting is used for auth and chat endpoints when Redis is configured. It protects login and chat endpoints without blocking normal users in standard deployments.

## 9. Database indexing

The current project uses Mongoose models with a few obvious lookup fields such as `userId`, `email`, `chatId`, and location-related query fields. The project should add indexes on frequently queried fields only when query patterns justify them. For now, the code remains simple and avoids unnecessary index sprawl.

## 10. Socket.IO scaling

The current app runs as a single backend instance. Socket.IO Redis adapter is not added yet because the app does not currently require multi-instance synchronization. If multiple backend instances are later deployed behind a load balancer, a Redis pub/sub adapter can be evaluated then.

## 11. Failure handling

Redis is treated as a non-critical optimization layer:

- if Redis is down, the app continues working
- if weather API fails, it falls back to a controlled error state or cached value
- if MongoDB is unavailable, the backend returns controlled errors
- if AI fails, the backend returns a safe response without exposing internals

## 12. Security

Security is preserved through:

- JWT validation for protected routes
- Google OAuth verification on the server
- trusted CORS origin configuration
- no secrets in logs or responses
- Redis variables accepted from environment only

## 13. Deployment architecture

The project is organized for the standard production split:

- Next.js frontend on Vercel
- Express backend on Railway or similar hosting
- MongoDB Atlas for persistent data
- Redis for transient cache and rate limiting

## 14. Scaling strategy

The design remains simple and interview-friendly:

- add more API instances behind a load balancer when traffic rises
- keep Redis shared for cache and rate limiting
- preserve MongoDB as the primary persistence layer
- keep Socket.IO single-instance unless cross-instance syncing becomes necessary

## 15. Trade-offs

Redis adds performance and protection but introduces another operational dependency. The project treats it as an optimization layer rather than a replacement for MongoDB. Because of that, the architecture stays resilient and easy to explain.

## 16. Future improvements

Possible future upgrades include:

- targeted Mongo index optimization based on real query telemetry
- dedicated recommendation caching for deterministic non-personalized prompts
- Redis-backed session or queue processing if traffic grows
- stricter health and metrics monitoring for API/runtime failures
