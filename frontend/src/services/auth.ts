import { User } from '../types';

export const authService = {
  async login(email: string, password: string, role: 'farmer' | 'buyer'): Promise<User> {
    // Mock API call - replace with actual API endpoint
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: Math.random().toString(36).substr(2, 9),
          email,
          name: email.split('@')[0],
          role,
          avatar: `https://images.unsplash.com/photo-${role === 'farmer' ? '1500382017158-c3f9ad0413cf' : '1472099645785-5658abf4ff4e'}?w=150&h=150&fit=crop&crop=face`,
        });
      }, 1000);
    });
  },

  async register(name: string, email: string, password: string, role: 'farmer' | 'buyer'): Promise<User> {
    // Mock API call - replace with actual API endpoint
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: Math.random().toString(36).substr(2, 9),
          email,
          name,
          role,
          avatar: `https://images.unsplash.com/photo-${role === 'farmer' ? '1500382017158-c3f9ad0413cf' : '1472099645785-5658abf4ff4e'}?w=150&h=150&fit=crop&crop=face`,
        });
      }, 1000);
    });
  },

  async logout(): Promise<void> {
    // Mock API call - replace with actual API endpoint
    return new Promise((resolve) => {
      setTimeout(resolve, 500);
    });
  },
};