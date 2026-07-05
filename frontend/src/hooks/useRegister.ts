import { useMutation } from '@tanstack/react-query';
import { http, type ApiEnvelope } from '@/lib/http';
import type { AuthResponse } from '@/api/auth';
import type { RegisterFormValues } from '@/lib/schemas/registerSchema';

export function useRegister() {
  return useMutation({
    mutationFn: (values: RegisterFormValues) =>
      http.post<ApiEnvelope<AuthResponse>>('/register', values).then((res) => res.data.data!),
  });
}
