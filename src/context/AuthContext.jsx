import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';

import axiosInstance from '../api/axiosInstance';

const AuthContext = createContext(null);

const TOKEN_KEY = 'rideflow_token';
const USER_KEY = 'rideflow_user';
const EXPIRY_KEY = 'rideflow_expires_at';

function clearStoredSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(EXPIRY_KEY);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    clearStoredSession();
    setToken(null);
    setUser(null);
  }, []);

  // Restore an existing session when the application starts.
  useEffect(() => {
    try {
      const savedToken = localStorage.getItem(TOKEN_KEY);
      const savedUser = localStorage.getItem(USER_KEY);
      const expiresAt = Number(localStorage.getItem(EXPIRY_KEY));

      if (
        !savedToken ||
        !savedUser ||
        !Number.isFinite(expiresAt) ||
        expiresAt <= Date.now()
      ) {
        clearStoredSession();
        return;
      }

      const parsedUser = JSON.parse(savedUser);

      if (
        !parsedUser ||
        typeof parsedUser !== 'object' ||
        !parsedUser.id ||
        !parsedUser.role
      ) {
        clearStoredSession();
        return;
      }

      setToken(savedToken);
      setUser(parsedUser);
    } catch {
      clearStoredSession();
    } finally {
      setLoading(false);
    }
  }, []);

  // Automatically expire the session while the app remains open.
  useEffect(() => {
    if (!token) {
      return;
    }

    const expiresAt = Number(localStorage.getItem(EXPIRY_KEY));
    const remainingTime = expiresAt - Date.now();

    if (!Number.isFinite(remainingTime) || remainingTime <= 0) {
      logout();
      return;
    }

    const timer = window.setTimeout(() => {
      logout();
    }, remainingTime);

    return () => window.clearTimeout(timer);
  }, [token, logout]);

  async function login(credentials) {
    const response = await axiosInstance.post('/api/auth/login', credentials);

    const data = response.data;
    const expiresIn = Number(data.expiresIn);

    if (
      !data.accessToken ||
      !data.user ||
      !data.user.id ||
      !['CUSTOMER', 'DRIVER', 'ADMIN'].includes(data.user.role) ||
      !Number.isFinite(expiresIn) ||
      expiresIn <= 0
    ) {
      throw new Error('Invalid authentication response from server.');
    }

    const expiresAt = Date.now() + expiresIn;

    // Save the session only after validating the response.
    localStorage.setItem(TOKEN_KEY, data.accessToken);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    localStorage.setItem(EXPIRY_KEY, String(expiresAt));

    setToken(data.accessToken);
    setUser(data.user);

    return data.user;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: Boolean(token && user),
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
