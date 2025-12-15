import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../api/axiosConfig'; // ✅ Updated import

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // ✅ Interceptor ab headers handle karega, manual set karne ki zarurat nahi
      validateToken(token);
    } else {
      setLoading(false);
    }
  }, []);

  const validateToken = async (token) => {
    try {
      // ✅ '/api' prefix hata diya kyunki axiosConfig mein already hai
      const response = await api.post('/auth/validate');
      if (response.data.valid) {
        const userData = {
          email: response.data.username,
          role: response.data.role
        };
        setUser(userData);
      } else {
        logout();
      }
    } catch (error) {
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      // ✅ axios ki jagah 'api' use kiya aur '/api' prefix hataya
      const response = await api.post('/auth/login', { username, password });
      const { token, userId, name, email, role } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId);
      
      // Note: Interceptor automatically attaches token from localStorage now
      
      const userData = { userId, name, username, email, role };
      setUser(userData);
      
      return { success: true, data: userData };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Login failed' 
      };
    }
  };

  const register = async (userData) => {
    try {
      // ✅ axios ki jagah 'api' aur '/api' prefix hataya
      const response = await api.post('/auth/register', userData);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Registration failed' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    // Header delete karne ki zarurat nahi, kyunki localStorage clear ho gaya
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

