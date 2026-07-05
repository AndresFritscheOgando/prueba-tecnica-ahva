import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi, type UserProfile } from '@/api/auth';

export const profileQueryKey = ['profile'] as const;

export function useProfileQuery(accessToken: string | null) {
  return useQuery({
    queryKey: profileQueryKey,
    queryFn: () => authApi.me(accessToken!),
    enabled: !!accessToken,
  });
}

export function useUpdateProfileMutation(accessToken: string | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (profile: Omit<UserProfile, 'id' | 'username'>) => authApi.updateMe(accessToken!, profile),
    onSuccess: (updated) => queryClient.setQueryData(profileQueryKey, updated),
  });
}
