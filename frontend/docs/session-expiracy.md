# Session expiry — how it works

Two separate timers protect the session. They solve different problems, and neither knows about the other.

| Timer | Length | Who controls it | What it protects against |
|---|---|---|---|
| **Access token** | 15 min | Backend (`Jwt:ExpiresInMinutes`) | Stolen tokens being usable forever |
| **Idle timeout** | 20 min of no activity | Frontend | A logged-in laptop left unattended |

## The happy path (user is active)

The access token dies every 15 minutes no matter what. If an API call (e.g. saving the profile) gets a `401` because the token just expired, the app doesn't show an error — it silently asks the backend for a new token using the refresh token, retries the call once, and the user never notices. This lives in `authFetch` in `AuthContext.tsx`.

If the *refresh* token is also dead (expired or revoked), that's treated the same as an idle timeout: the user is logged out and sees the "session expired" toast.

## The idle path (user walks away)

```
0min ───────────────────── 19min ──────────── 20min
 |       (using the app)      |   (warning)      |
 |                             ▼                  ▼
 |                     modal + 60s countdown    auto logout
 |                       "Extender sesión"      + toast
 |                                               + back to login
```

1. Any mouse move, key press, scroll, or touch resets an internal "last activity" clock.
2. After **19 minutes** of zero activity, a modal appears: *"Su sesión está a punto de expirar"*, counting down from 60 seconds.
3. Clicking **"Extender sesión"** refreshes the token and resets the clock — back to normal.
4. If nobody clicks anything and the countdown hits 0 (i.e. **20 minutes** total idle), the session is cleared locally, a toast appears (*"Su sesión ha expirado debido a inactividad..."*), and the app falls back to the login screen automatically (no router — clearing the token *is* the redirect).

While the warning modal is showing, moving the mouse over it does **not** cancel the countdown — only clicking the button (or letting it hit 0) resolves it. This is intentional: it forces an explicit "yes I'm here" decision.

## Where the code lives

- `frontend/src/hooks/useIdleSessionManager.ts` — all the timing logic (activity tracking, countdown, forced logout). Constants `IDLE_WARNING_MS` / `IDLE_LIMIT_MS` at the top.
- `frontend/src/components/idle-session-warning-modal.tsx` — the modal itself (copy, styling).
- `frontend/src/components/idle-session-manager.tsx` — thin wrapper that mounts the modal when needed.
- `frontend/src/context/AuthContext.tsx` — `authFetch` (refresh-on-401) and `clearSession` (local-only logout, no network call).
- `frontend/src/App.tsx` — where `<IdleSessionManager />` is mounted globally.

## Testing it without waiting 20 minutes

Temporarily lower the constants in `useIdleSessionManager.ts`, e.g.:

```ts
const IDLE_WARNING_MS = 10_000; // 10s
const IDLE_LIMIT_MS = 15_000;   // 15s
```

Run `npm run dev`, log in, stay idle, watch the modal appear and count down. Revert the constants before committing.
