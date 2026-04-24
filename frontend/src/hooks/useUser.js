import { useQuery } from '@tanstack/react-query';
import { getMe } from '../api/authApi';

/**
 * Fetch a user's profile by ID.
 */
export const useUser = (userId) => {
    return useQuery({
        queryKey: ['user', userId],
        queryFn: () => getMe(userId),
        enabled: Boolean(userId),
        staleTime: 1000 * 60 * 5, // 5 minutes
        retry: 1,
    });
};
