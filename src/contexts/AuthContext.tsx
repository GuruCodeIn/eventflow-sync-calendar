
import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, signupUser, getCurrentUser } from '../api/auth';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
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
    const initializeAuth = async () => {
      console.log('Initializing auth...');
      const token = localStorage.getItem('token');
      
      if (token) {
        console.log('Found token, getting current user');
        try {
          const currentUser = await getCurrentUser();
          console.log('Successfully retrieved current user:', currentUser);
          setUser(currentUser);
        } catch (error) {
          console.error('Failed to get current user:', error);
          localStorage.removeItem('token');
        }
      } else {
        console.log('No token found');
      }
      
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    console.log('AuthContext login called for:', email);
    try {
      const response = await loginUser(email, password);
      console.log('Login successful, storing token and user');
      localStorage.setItem('token', response.token);
      setUser(response.user);
    } catch (error) {
      console.error('Login failed in AuthContext:', error);
      throw error;
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    console.log('AuthContext signup called for:', name, email);
    try {
      const response = await signupUser(name, email, password);
      console.log('Signup successful, storing token and user');
      localStorage.setItem('token', response.token);
      setUser(response.user);
    } catch (error) {
      console.error('Signup failed in AuthContext:', error);
      throw error;
    }
  };

  const logout = () => {
    console.log('Logging out user');
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = {
    user,
    login,
    signup,
    logout,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
