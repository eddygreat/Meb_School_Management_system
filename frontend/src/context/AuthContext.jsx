import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/apiClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const navigate = useNavigate();

  // On initial load, try to rehydrate the user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedRole = localStorage.getItem('role');
    const storedToken = localStorage.getItem('token');

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setRole(storedRole || JSON.parse(storedUser).role);
      setToken(storedToken);
    }
  }, []);

  const login = async (credentials) => {
    try {
      const response = await apiClient.post('/auth/login', credentials);
      const { access_token } = response.data;

      setToken(access_token);
      localStorage.setItem('token', access_token);

      // Decode the JWT to get the role.
      const payload = JSON.parse(atob(access_token.split('.')[1]));
      const userRole = payload.role;

      const userData = { email: credentials.email, role: userRole, id: payload.sub };

      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('role', userRole);
      setUser(userData);
      setRole(userRole);

      return true;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const loginWithToken = (accessToken) => {
    try {
      setToken(accessToken);
      localStorage.setItem('token', accessToken);

      const payload = JSON.parse(atob(accessToken.split('.')[1]));
      const userRole = payload.role;
      const userData = { role: userRole, id: payload.sub, email: 'Face Login User' }; // Placeholder email

      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('role', userRole);
      setUser(userData);
      setRole(userRole);
      return true;
    } catch (e) {
      console.error("Invalid token:", e);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    localStorage.removeItem('token');
    setUser(null);
    setRole(null);
    setToken(null);
    navigate('/login');
  };

  const switchRole = (newRole) => {
    localStorage.setItem('role', newRole);
    setRole(newRole);
    navigate(`/${newRole}/dashboard`);
  };

  return (
    <AuthContext.Provider value={{ user, role, token, login, loginWithToken, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);