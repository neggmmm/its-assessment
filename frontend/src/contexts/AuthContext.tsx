import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

export interface User {
  id: string | number;
  email: string;
  name: string;
  role: 'admin' | 'hr' | 'employee';
}

interface AuthContextType {
  user: User | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  userRole: User['role'] | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      if (token && storedUser) {
        return JSON.parse(storedUser);
      }
    } catch (error) {
      console.error('Failed to parse stored user:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return null;
  });

  const login = (token: string, user: User) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const isAuthenticated = !!user;
  const userRole = user?.role || null;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, userRole }}>
      {children}
    </AuthContext.Provider>
  );
};