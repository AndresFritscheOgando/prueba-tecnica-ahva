import { useMutation } from '@tanstack/react-query';
import { http, type ApiEnvelope } from '@/lib/http';
import type { AuthResponse } from '@/api/auth';
import type { LoginFormValues } from '@/lib/schemas/loginSchema';

export function useLogin() {
  return useMutation({
    mutationFn: (values: LoginFormValues) =>
      http.post<ApiEnvelope<AuthResponse>>('/login', values).then((res) => res.data.data!),
  });
}
