# Oxywise AI Agent Guide

This guide is for AI agents working on the Oxywise.ai repository. Follow the levels in order. Do not skip to code changes when the problem may be caused by deployment configuration.

## Operating Rules

- Inspect the existing implementation before changing it.
- State one falsifiable hypothesis before the first edit.
- Prefer the smallest change that tests the hypothesis.
- Never expose secrets from `.env`, Vercel, Railway, Google Cloud, or MongoDB.
- Do not rewrite working authentication, database, or deployment architecture without evidence.
- Treat production failures as environment, URL, routing, or version problems first.
- After every substantive edit, run the narrowest available validation immediately.
- Do not fix unrelated failures while debugging a focused issue.

## Level 0: Understand The Request

Record:

- User-visible symptom
- Affected environment: local, Vercel, Railway, mobile, or all
- Exact URL, route, status code, and timestamp when available
- Last known working behavior
- Files or symbols named by the user

Output a short scope statement and list unknowns that require evidence.

## Level 1: Map The Request Path

Trace the actual path before editing:

```text
Browser
  -> Vercel frontend
  -> API or Socket.IO URL
  -> Railway Express service
  -> route registration
  -> controller/service
  -> MongoDB or external provider
```

For authentication, verify:

- `frontend/lib/api.ts` builds the expected API URL
- `frontend/components/providers/AuthProvider.tsx` loads the expected Google client ID
- login/signup views send the credential to `POST /api/auth/google`
- `backend/src/app.js` mounts `/api/auth`
- `backend/src/routes/authRoutes.js` mounts `POST /google`
- `backend/src/controllers/authController.js` verifies Google and returns a JWT

For chat, verify:

- `frontend/store/useChatStore.ts` uses the public Socket.IO URL
- Railway initializes Socket.IO on the same HTTP server
- the production frontend origin is allowed by CORS

## Level 2: Compare Local And Production Configuration

Check names and structure only. Never print values of secrets.

### Vercel

- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_SOCKET_URL`
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
- deployment branch and latest deployment commit
- whether a redeploy occurred after changing environment variables

Required production URL shape:

```env
NEXT_PUBLIC_API_URL=https://<public-railway-domain>
NEXT_PUBLIC_SOCKET_URL=https://<public-railway-domain>
```

Do not use `localhost`, a Railway internal hostname, a Vercel URL, or an `/api` suffix.

### Railway

- public domain and root directory
- start command and deployed commit
- `CLIENT_URL`
- presence of `MONGODB_URI`, `JWT_SECRET`, `GOOGLE_CLIENT_ID`, and required AI keys
- startup logs and health response

Required production origin shape:

```env
CLIENT_URL=https://<public-vercel-domain>
```

Confirm deployment variables are not overwritten by a tracked local `.env` file.

## Level 3: Use Cheap Discriminating Checks

Run checks in this order:

1. `GET https://<public-railway-domain>/` must return JSON with the backend status.
2. Inspect the deployed browser bundle or Network panel for the actual API request URL.
3. Send a safe route smoke test with no token. A registered Google route should return JSON `400`, not HTML `404`.
4. Check the response content type and CORS headers.
5. Compare the deployed commit with the source commit containing the route.
6. Only then investigate Google token verification, MongoDB, or application logic.

Interpretation:

- Vercel HTML `404`: malformed or incorrect frontend API URL, or a missing Vercel route.
- Railway HTML/JSON `404`: wrong public domain, wrong deployment, missing route, or stale commit.
- CORS error: backend origin configuration or environment precedence problem.
- JSON `400` from the route: routing works; continue to controller/token evidence.
- JSON `401` or Google verification error: routing works; inspect credentials/configuration next.

## Level 4: Implement The Smallest Fix

Before editing, write:

```text
Hypothesis: <one falsifiable explanation>
Evidence: <what supports it>
Disconfirming check: <the cheapest check>
Smallest fix: <one focused change>
```

After editing:

- run the focused lint, typecheck, syntax check, or test
- inspect only the touched diff
- do not broaden the change unless validation disproves the hypothesis

## Level 5: Verify The Complete User Flow

For production auth, verify:

- backend `GET /`
- frontend browser request URL
- Google login with a real credential
- email/password login
- authenticated `GET /api/auth/me`
- MongoDB user lookup or creation
- JWT persistence and session restore
- Socket.IO connection and authenticated chat
- CORS from the deployed frontend origin

For UI changes, verify both desktop and mobile layouts and confirm authenticated and unauthenticated states.

## Level 6: Report And Track

Every debugging report must separate:

- Confirmed facts
- Strong hypotheses
- Unknowns requiring dashboard or browser access
- Changes made
- Validation performed
- Remaining deployment actions
- Confidence level

Use this tracking table:

| Check | Environment | Evidence | Result | Next action | Owner |
| --- | --- | --- | --- | --- | --- |
| Backend health | Railway | URL/status/body shape | Pending | Run `GET /` | Agent |
| API URL | Vercel | Deployed request URL | Pending | Inspect Network | Agent |
| Auth route | Railway | Status/content type | Pending | POST without token | Agent |
| CORS | Browser/Railway | Origin/header/error | Pending | Compare `CLIENT_URL` | Agent |
| Deployment version | Vercel/Railway | Commit SHA | Pending | Compare commits | Owner |
| Full login | Production | User-visible result | Pending | Retry after fix | Owner |

## Reusable Analysis Prompt

```text
Analyze this Oxywise.ai issue as a production debugging engineer.

Symptom:
<exact error, status, URL, and environment>

Expected behavior:
<what should happen>

Trace the request from Browser -> Vercel -> API URL -> Railway -> Express route -> controller -> database/provider.

Rules:
- Inspect existing code before editing.
- Do not rewrite authentication or database architecture.
- Do not expose secrets.
- Treat HTTP 404 as URL, routing, deployment, or version evidence first.
- Separate confirmed facts from hypotheses.

Return:
1. Current request path
2. What local success proves
3. Actual production request and response
4. First point where local and production differ
5. Ranked root causes based only on evidence
6. Cheapest discriminating check for each cause
7. Smallest confirmed fix
8. Verification commands and browser checks
9. Remaining unknowns and confidence
```

## Reusable Tracking Prompt

```text
Track this Oxywise.ai debugging session level by level.

For each level, record:
- status: Not started, In progress, Passed, Failed, or Blocked
- evidence collected
- exact command, URL, file, or dashboard check used
- result without secrets
- next action
- owner

Stop and report when a check disproves the current hypothesis. Do not make the next edit until the new controlling code path is identified.

At the end, produce:
- confirmed root cause
- why local worked
- why production failed
- files changed
- deployment variables required
- validation results
- remaining risks
```

## Repository-Specific References

- Web client: `frontend/`
- API: `backend/`
- Backend startup: `backend/src/server.js`
- Express routes: `backend/src/app.js`
- Auth routes: `backend/src/routes/authRoutes.js`
- Auth controller: `backend/src/controllers/authController.js`
- Frontend API helper: `frontend/lib/api.ts`
- Socket client: `frontend/store/useChatStore.ts`
- Web-specific instructions: `frontend/AGENTS.md`
- Mobile-specific instructions: `OxywiseApp/OxywisefrontendApp/AGENTS.md`
