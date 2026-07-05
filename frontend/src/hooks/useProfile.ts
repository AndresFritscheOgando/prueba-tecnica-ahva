import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi, type UserProfile } from '@/api/auth';
import { useAuth } from '@/context/AuthContext';

export const profileQueryKey = ['profile'] as const;

export function useProfileQuery(accessToken: string | null) {
  const { authFetch } = useAuth();
  return useQuery({
    queryKey: profileQueryKey,
    queryFn: () => authFetch((token) => authApi.me(token)),
    enabled: !!accessToken,
  });
}

export function useUpdateProfileMutation(_accessToken: string | null) {
  const { authFetch } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (profile: Omit<UserProfile, 'id' | 'username'>) => authFetch((token) => authApi.updateMe(token, profile)),
    onSuccess: (updated) => queryClient.setQueryData(profileQueryKey, updated),
  });
}
