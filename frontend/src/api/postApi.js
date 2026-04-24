import axiosInstance from './axiosInstance';

/** GET /api/post/getAllPosts */
export const getAllPosts = async () => {
    const { data } = await axiosInstance.get('/api/post/getAllPosts');
    return data.data;
};

/** GET /api/post/user/:userId */
export const getPostsByUser = async (userId) => {
    const { data } = await axiosInstance.get(`/api/post/user/${userId}`);
    return data.data;
};

/** GET /api/post/getOnePost/:id */
export const getOnePost = async (id) => {
    const { data } = await axiosInstance.get(`/api/post/getOnePost/${id}`);
    return data.data;
};

/** POST /api/post/createPost — body: { title, content, coverImage? } */
export const createPost = async (payload) => {
    const { data } = await axiosInstance.post('/api/post/createPost', payload);
    return data.data;
};

/** PATCH /api/post/updatePosts/:id — owner only, body: { title, content, coverImage? } */
export const updatePost = async ({ id, ...payload }) => {
    const { data } = await axiosInstance.patch(`/api/post/updatePosts/${id}`, payload);
    return data.data;
};

/** DELETE /api/post/deletePost/:id — owner only */
export const deletePost = async (id) => {
    const { data } = await axiosInstance.delete(`/api/post/deletePost/${id}`);
    return data.data;
};
