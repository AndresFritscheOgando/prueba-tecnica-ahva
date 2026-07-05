import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/api/auth';
import type { RegisterFormValues } from '@/lib/registerSchema';

export function useRegisterMutation() {
  return useMutation({
    mutationFn: (values: RegisterFormValues) =>
      authApi.register(values.username, values.email, values.password),
  });
}
