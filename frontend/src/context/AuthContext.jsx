import { createContext, useContext, useState, useCallback } from 'react';
import { login as loginApi, logout as logoutApi, signUp as signUpApi } from '../api/authApi';

// Silently clear any stale server-side cookie before attempting login.
// The backend rejects login with 400 if an accessToken cookie is still present.
const clearStaleCookie = async () => {
    try {
        await logoutApi();
    } catch {
        // ignore — cookie may already be gone
    }
};

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        try {
            const stored = localStorage.getItem('user');
            return stored ? JSON.parse(stored) : null;
        } catch {
            return null;
        }
    });

    const [token, setToken] = useState(() => localStorage.getItem('accessToken') || null);

    const login = useCallback(async (credentials) => {
        // Always clear any stale httpOnly cookie first — the backend returns 400
        // if an accessToken cookie is present, even after a frontend logout.
        await clearStaleCookie();

        const result = await loginApi(credentials);
        const { accessToken } = result.data;
        localStorage.setItem('accessToken', accessToken);
        setToken(accessToken);
        return result;
    }, []);

    const register = useCallback(async (payload) => {
        const result = await signUpApi(payload);
        return result;
    }, []);

    const logout = useCallback(async () => {
        try {
            await logoutApi();
        } catch {
            // ignore server errors on logout
        } finally {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('user');
            setToken(null);
            setUser(null);
        }
    }, []);

    const saveUser = useCallback((userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    }, []);

    const isAuthenticated = Boolean(token);

    return (
        <AuthContext.Provider value={{ user, token, isAuthenticated, login, register, logout, saveUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
    return ctx;
};
