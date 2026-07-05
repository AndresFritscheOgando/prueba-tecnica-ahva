import { useIdleSessionManager } from '@/hooks/useIdleSessionManager';
import { IdleSessionWarningModal } from '@/components/idle-session-warning-modal';

export function IdleSessionManager() {
  const { secondsLeft, extendSession } = useIdleSessionManager();
  if (secondsLeft === null) return null;
  return <IdleSessionWarningModal secondsLeft={secondsLeft} onExtend={extendSession} />;
}
