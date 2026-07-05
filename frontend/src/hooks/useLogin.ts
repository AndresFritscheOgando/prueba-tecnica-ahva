import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/api/auth';
import type { LoginFormValues } from '@/lib/loginSchema';

export function useLoginMutation() {
  return useMutation({
    mutationFn: (values: LoginFormValues) => authApi.login(values.username, values.password),
  });
}
