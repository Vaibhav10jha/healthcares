import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { authService, userService } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword?: string;
  }) => Promise<void>;
  logout: () => void;
  updateUser: (updatedData: { name?: string; phone?: string; email?: string }) => Promise<void>;
  isAdmin: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('healthcare_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('healthcare_token');
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('healthcare_token');
      if (storedToken) {
        try {
          const { user: currentUser } = await authService.getCurrentUser();
          setUser(currentUser);
          localStorage.setItem('healthcare_user', JSON.stringify(currentUser));
        } catch (error) {
          console.warn('Session expired or invalid token:', error);
          localStorage.removeItem('healthcare_token');
          localStorage.removeItem('healthcare_user');
          setUser(null);
          setToken(null);
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (credentials: { email: string; password: string }) => {
    const res = await authService.login(credentials);
    setToken(res.token);
    setUser(res.user);
    localStorage.setItem('healthcare_token', res.token);
    localStorage.setItem('healthcare_user', JSON.stringify(res.user));
  };

  const register = async (data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword?: string;
  }) => {
    const res = await authService.register(data);
    setToken(res.token);
    setUser(res.user);
    localStorage.setItem('healthcare_token', res.token);
    localStorage.setItem('healthcare_user', JSON.stringify(res.user));
  };

  const logout = () => {
    localStorage.removeItem('healthcare_token');
    localStorage.removeItem('healthcare_user');
    setToken(null);
    setUser(null);
  };

  const updateUser = async (updatedData: { name?: string; phone?: string; email?: string }) => {
    if (!user) return;
    const res = await userService.updateUserProfile(user._id, updatedData);
    setUser(res.user);
    localStorage.setItem('healthcare_user', JSON.stringify(res.user));
  };

  const isAdmin = user?.role === 'admin';
  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
        updateUser,
        isAdmin,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
