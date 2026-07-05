import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { http, type ApiEnvelope } from '@/lib/http';
import type { AuthResponse } from '@/api/auth';
import { useAuth } from '@/context/AuthContext';

// Lower these temporarily to QA the feature without waiting real minutes.
const IDLE_WARNING_MS = 19 * 60 * 1000; // warning modal appears (1 min before hard limit)
const IDLE_LIMIT_MS = 20 * 60 * 1000; // hard logout limit
const TICK_MS = 1000;
const EXPIRY_MESSAGE =
  'Su sesión ha expirado debido a inactividad. Por favor, inicie sesión nuevamente.';
const ACTIVITY_EVENTS = ['mousemove', 'keydown', 'scroll', 'touchstart', 'wheel'] as const;

export function useIdleSessionManager() {
  const { accessToken, refreshToken, setSession, clearSession } = useAuth();
  const isAuthenticated = accessToken !== null;

  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);

  const lastActivityRef = useRef(Date.now());
  const warningActiveRef = useRef(false);
  const isExtendingRef = useRef(false);

  const refreshTokenRef = useRef(refreshToken);
  const setSessionRef = useRef(setSession);
  const clearSessionRef = useRef(clearSession);
  useEffect(() => {
    refreshTokenRef.current = refreshToken;
    setSessionRef.current = setSession;
    clearSessionRef.current = clearSession;
  }, [refreshToken, setSession, clearSession]);

  const forceLogout = useCallback(() => {
    warningActiveRef.current = false;
    setSecondsLeft(null);
    clearSessionRef.current();
    toast.error(EXPIRY_MESSAGE);
  }, []);

  const extendSession = useCallback(async () => {
    if (isExtendingRef.current || !refreshTokenRef.current) return;
    isExtendingRef.current = true;
    try {
      const res = await http
        .post<ApiEnvelope<AuthResponse>>('/refresh', { refreshToken: refreshTokenRef.current })
        .then((r) => r.data.data!);
      setSessionRef.current(res);
      refreshTokenRef.current = res.refreshToken;
      lastActivityRef.current = Date.now();
      warningActiveRef.current = false;
      setSecondsLeft(null);
    } catch {
      forceLogout();
    } finally {
      isExtendingRef.current = false;
    }
  }, [forceLogout]);

  useEffect(() => {
    if (!isAuthenticated) {
      setSecondsLeft(null);
      return;
    }

    lastActivityRef.current = Date.now();
    warningActiveRef.current = false;

    const onActivity = () => {
      // Freeze the idle clock once the warning is showing — only an explicit
      // "Extender sesión" click (or the hard timeout) may resolve it.
      if (warningActiveRef.current) return;
      lastActivityRef.current = Date.now();
    };

    ACTIVITY_EVENTS.forEach((evt) =>
      window.addEventListener(evt, onActivity, { passive: true, capture: true }),
    );

    const intervalId = setInterval(() => {
      const idleMs = Date.now() - lastActivityRef.current;

      if (idleMs >= IDLE_LIMIT_MS) {
        if (!isExtendingRef.current) forceLogout();
        return;
      }

      if (idleMs >= IDLE_WARNING_MS) {
        warningActiveRef.current = true;
        setSecondsLeft(Math.max(0, Math.ceil((IDLE_LIMIT_MS - idleMs) / 1000)));
      } else {
        warningActiveRef.current = false;
        setSecondsLeft(null);
      }
    }, TICK_MS);

    return () => {
      ACTIVITY_EVENTS.forEach((evt) =>
        window.removeEventListener(evt, onActivity, { capture: true }),
      );
      clearInterval(intervalId);
    };
  }, [isAuthenticated, forceLogout]);

  return { secondsLeft, extendSession };
}
