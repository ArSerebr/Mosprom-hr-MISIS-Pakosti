'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

// Типы для пользователя и авторизации
export interface User {
  id: number;
  email: string;
  name: string;
  role: 'admin' | 'hr' | 'university';
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, role: 'admin' | 'hr' | 'university') => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// Создаем контекст
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Провайдер контекста
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Проверяем наличие токена при загрузке
  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token');
    if (storedToken) {
      setToken(storedToken);
      // Проверяем валидность токена
      checkAuthStatus(storedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  // Проверка статуса авторизации
  const checkAuthStatus = async (authToken: string) => {
    try {
      const API_URL = typeof window !== 'undefined' 
        ? (window as any).ENV?.NEXT_PUBLIC_API_URL || "http://localhost:7011/api"
        : "http://localhost:7011/api";
        
      const response = await fetch(`${API_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        // Токен недействителен
        localStorage.removeItem('auth_token');
        setToken(null);
        setUser(null);
      }
    } catch (error) {
      console.error('Ошибка проверки авторизации:', error);
      localStorage.removeItem('auth_token');
      setToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Функция логина
  const login = async (email: string, password: string) => {
    try {
      const API_URL = typeof window !== 'undefined' 
        ? (window as any).ENV?.NEXT_PUBLIC_API_URL || "http://localhost:7011/api"
        : "http://localhost:7011/api";
        
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Ошибка входа');
      }

      const data = await response.json();
      const { access_token } = data;

      // Сохраняем токен
      localStorage.setItem('auth_token', access_token);
      setToken(access_token);

      // Получаем данные пользователя
      await checkAuthStatus(access_token);
    } catch (error) {
      console.error('Ошибка входа:', error);
      throw error;
    }
  };

  // Функция регистрации
  const register = async (email: string, password: string, name: string, role: 'admin' | 'hr' | 'university') => {
    try {
      const API_URL = typeof window !== 'undefined' 
        ? (window as any).ENV?.NEXT_PUBLIC_API_URL || "http://localhost:7011/api"
        : "http://localhost:7011/api";
        
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name, role }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Ошибка регистрации');
      }

      // После успешной регистрации автоматически входим
      await login(email, password);
    } catch (error) {
      console.error('Ошибка регистрации:', error);
      throw error;
    }
  };

  // Функция выхода
  const logout = () => {
    localStorage.removeItem('auth_token');
    setToken(null);
    setUser(null);
    router.push('/login');
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    isLoading,
    isAuthenticated: !!user && !!token,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Хук для использования контекста
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth должен использоваться внутри AuthProvider');
  }
  return context;
}
