import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: 'farmer' | 'buyer') => Promise<void>;
  register: (name: string, email: string, password: string, role: 'farmer' | 'buyer') => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user on app load
    const storedUser = localStorage.getItem('agrotraceUser');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('agrotraceUser');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string, role: 'farmer' | 'buyer') => {
    setLoading(true);
    try {
      // Mock authentication - replace with real API call
      const mockUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        name: email.split('@')[0],
        role,
        avatar: `https://images.unsplash.com/photo-${role === 'farmer' ? '1500382017158-c3f9ad0413cf' : '1472099645785-5658abf4ff4e'}?w=150&h=150&fit=crop&crop=face`,
      };
      
      setUser(mockUser);
      localStorage.setItem('agrotraceUser', JSON.stringify(mockUser));
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role: 'farmer' | 'buyer') => {
    setLoading(true);
    try {
      // Mock registration - replace with real API call
      const mockUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        name,
        role,
        avatar: `https://images.unsplash.com/photo-${role === 'farmer' ? '1500382017158-c3f9ad0413cf' : '1472099645785-5658abf4ff4e'}?w=150&h=150&fit=crop&crop=face`,
      };
      
      setUser(mockUser);
      localStorage.setItem('agrotraceUser', JSON.stringify(mockUser));
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('agrotraceUser');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};