/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const STORAGE_KEY = 'giritrack_auth';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedAuth = localStorage.getItem(STORAGE_KEY);
      if (savedAuth) {
        const parsed = JSON.parse(savedAuth);
        if (parsed && typeof parsed === 'object' && parsed.isLoggedIn) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to parse giritrack_auth from localStorage:', e);
    }
    const savedRole = localStorage.getItem('giri_role');
    const defaultRole = savedRole === 'admin' || savedRole === 'user' ? savedRole : 'user';
    return {
      email: '',
      name: '',
      role: defaultRole,
      isLoggedIn: false,
    };
  });

  useEffect(() => {
    if (user.isLoggedIn) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
    localStorage.setItem('giri_role', user.role || 'user');
  }, [user]);

  const login = ({ email, role = 'user', name }) => {
    const userRole = role === 'admin' || role === 'user' ? role : 'user';
    const userName = name || (email ? email.split('@')[0] : 'Pendaki Giri');
    const newUserState = {
      email,
      name: userName,
      role: userRole,
      isLoggedIn: true,
    };
    setUser(newUserState);
    return newUserState;
  };

  const logout = () => {
    setUser({
      email: '',
      name: '',
      role: 'user',
      isLoggedIn: false,
    });
    localStorage.removeItem(STORAGE_KEY);
    localStorage.setItem('giri_role', 'user');
  };

  const loginAsDemoAdmin = () => {
    return login({
      email: 'admin@giritrack.id',
      password: 'password123',
      role: 'admin',
      name: 'Admin GiriTrack',
    });
  };

  const loginAsDemoUser = () => {
    return login({
      email: 'pendaki@giritrack.id',
      password: 'password123',
      role: 'user',
      name: 'Rangga Pendaki',
    });
  };

  const toggleRole = () => {
    setUser((prev) => {
      const newRole = prev.role === 'admin' ? 'user' : 'admin';
      return { ...prev, role: newRole };
    });
  };

  const setCurrentRole = (role) => {
    if (role === 'admin' || role === 'user') {
      setUser((prev) => ({ ...prev, role }));
    }
  };

  const currentRole = user.role;
  const isAdmin = user.role === 'admin';
  const isUser = user.role === 'user';
  const isLoggedIn = user.isLoggedIn;

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn,
        currentRole,
        setCurrentRole,
        toggleRole,
        isAdmin,
        isUser,
        login,
        logout,
        loginAsDemoAdmin,
        loginAsDemoUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

