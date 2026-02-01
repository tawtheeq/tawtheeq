import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSetupRequired, setIsSetupRequired] = useState(false);

    useEffect(() => {
        const checkSetupAndAuth = async () => {
            try {
                // Check if setup is needed
                const setupRes = await api.get('/api/setup/status');
                setIsSetupRequired(setupRes.data.data.setup_required);

                // Check for existing token on mount
                const token = localStorage.getItem('token');
                const savedUser = localStorage.getItem('user');

                if (token && savedUser) {
                    setUser(JSON.parse(savedUser));
                }
            } catch (err) {
                console.error('Initial check error:', err);
            } finally {
                setIsLoading(false);
            }
        };

        checkSetupAndAuth();
    }, []);

    const login = async (email, password) => {
        try {
            const response = await api.post('/api/login', { email, password });
            const { token, user } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            setUser(user);
            return { success: true };
        } catch (error) {
            console.error('Login error:', error);
            return {
                success: false,
                message: error.response?.data || 'حدث خطأ أثناء تسجيل الدخول'
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoading, isSetupRequired }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
