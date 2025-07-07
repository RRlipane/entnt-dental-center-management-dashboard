import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User } from '../types/types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login(email: string, password: string): Promise<{ user: User | null; error?: string }>;
  logout(): void;
  updateUser(updatedUser: User): void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const stored = localStorage.getItem('currentUser');
        if (stored) {
          const parsedUser = JSON.parse(stored);
          
          const users = JSON.parse(localStorage.getItem('users') || '[]');
          const userExists = users.some((u: User) => u.id === parsedUser.id);
          if (userExists) {
            setUser(parsedUser);
          } else {
            localStorage.removeItem('currentUser');
          }
        }
      } catch (error) {
        console.error('Failed to initialize auth state:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const found = users.find((u: User) => u.email === email && u.password === password);

      if (!found) {
        return { user: null, error: 'Invalid email or password' };
      }

      localStorage.setItem('currentUser', JSON.stringify(found));
      setUser(found);
      return { user: found };
    } catch (error) {
      console.error('Login failed:', error);
      return { user: null, error: 'An error occurred during login' };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('currentUser');
    setUser(null);
  }, []);

  const updateUser = useCallback((updatedUser: User) => {
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = users.map((u: User) => 
      u.id === updatedUser.id ? updatedUser : u
    );
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    
    
    if (user?.id === updatedUser.id) {
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      setUser(updatedUser);
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};