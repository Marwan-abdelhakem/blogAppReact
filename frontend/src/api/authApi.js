import axiosInstance from './axiosInstance';


export const signUp = async (payload) => {
    const { data } = await axiosInstance.post('/api/auth/signUP', payload);
    return data;
};

/**
 * Login — sets httpOnly cookies and returns tokens
 * POST /api/auth/login
 */
export const login = async (payload) => {
    const { data } = await axiosInstance.post('/api/auth/login', payload);
    return data;
};

/**
 * Logout — clears cookies server-side
 * POST /api/auth/logout
 */
export const logout = async () => {
    const { data } = await axiosInstance.post('/api/auth/logout');
    return data;
};

/**
 * Get user profile by ID
 * GET /api/auth/getMe/:id
 */
export const getMe = async (id) => {
    const { data } = await axiosInstance.get(`/api/auth/getMe/${id}`);
    return data.data;
};
