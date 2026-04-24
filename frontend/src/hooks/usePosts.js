import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllPosts, getPostsByUser, createPost, updatePost, deletePost } from '../api/postApi';

/** Fetch all posts — enabled only when authenticated */
export const useAllPosts = (enabled = true) => {
    return useQuery({
        queryKey: ['posts', 'all'],
        queryFn: getAllPosts,
        enabled,
        staleTime: 1000 * 60 * 2,
        retry: 1,
    });
};

/** Fetch posts for a specific user */
export const useUserPosts = (userId) => {
    return useQuery({
        queryKey: ['posts', 'user', userId],
        queryFn: () => getPostsByUser(userId),
        enabled: Boolean(userId),
        staleTime: 1000 * 60 * 2,
        retry: 1,
    });
};

/** Create a post — invalidates all feed caches on success */
export const useCreatePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createPost,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts', 'all'] });
            queryClient.invalidateQueries({ queryKey: ['posts', 'user'] });
        },
    });
};

/**
 * Update a post — optimistically updates the cache so the UI
 * reflects the change instantly, then syncs on settle.
 */
export const useUpdatePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updatePost,
        onSuccess: (updatedPost) => {
            // Patch the post in-place inside the 'all' cache
            queryClient.setQueryData(['posts', 'all'], (old) =>
                old?.map((p) => (p._id === updatedPost._id ? updatedPost : p)) ?? old
            );
            // Invalidate user-specific caches
            queryClient.invalidateQueries({ queryKey: ['posts', 'user'] });
        },
    });
};

/**
 * Delete a post — removes it from the cache immediately so the
 * card disappears without a refetch round-trip.
 */
export const useDeletePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deletePost,
        onSuccess: (_data, deletedId) => {
            queryClient.setQueryData(['posts', 'all'], (old) =>
                old?.filter((p) => p._id !== deletedId) ?? old
            );
            queryClient.invalidateQueries({ queryKey: ['posts', 'user'] });
        },
    });
};
