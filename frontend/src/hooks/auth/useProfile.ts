import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { http, type ApiEnvelope } from '@/lib/http';
import type { UserProfile } from '@/api/auth';
import { useAuth } from '@/context/AuthContext';

export const profileQueryKey = ['profile'] as const;

export function useMe(accessToken: string | null) {
  const { authFetch } = useAuth();
  return useQuery({
    queryKey: profileQueryKey,
    queryFn: () =>
      authFetch((token) =>
        http
          .get<ApiEnvelope<UserProfile>>('/me', { headers: { Authorization: `Bearer ${token}` } })
          .then((res) => res.data.data!),
      ),
    enabled: !!accessToken,
  });
}

export function useUpdateMe(_accessToken: string | null) {
  const { authFetch } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (profile: Omit<UserProfile, 'id' | 'username'>) =>
      authFetch((token) =>
        http
          .put<ApiEnvelope<UserProfile>>('/me', profile, { headers: { Authorization: `Bearer ${token}` } })
          .then((res) => res.data.data!),
      ),
    onSuccess: (updated) => queryClient.setQueryData(profileQueryKey, updated),
  });
}
