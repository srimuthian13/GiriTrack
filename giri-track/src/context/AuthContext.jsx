/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';

const AuthContext = createContext();

const STORAGE_KEY = 'giritrack_auth';
const USERS_STORAGE_KEY = 'giritrack_users';

const initialUsers = [
  { email: 'admin@giritrack.id', password: 'admin123', name: 'Admin GiriTrack', role: 'admin' },
  { email: 'admin@giritrack.com', password: 'admin123', name: 'Admin GiriTrack', role: 'admin' },
  { email: 'pendaki@giritrack.id', password: 'user123', name: 'Raka Pratama', role: 'user' }
];

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

  const [loadingGoogle, setLoadingGoogle] = useState(false);

  useEffect(() => {
    if (user.isLoggedIn) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
    localStorage.setItem('giri_role', user.role || 'user');
  }, [user]);

  // Load and initialize users from local storage
  const [usersDb, setUsersDb] = useState(() => {
    try {
      const savedUsers = localStorage.getItem(USERS_STORAGE_KEY);
      if (savedUsers) {
        const parsed = JSON.parse(savedUsers);
        // Ensure admin accounts always exist
        let updated = [...parsed];
        initialUsers.forEach(iu => {
          if (!updated.some(u => u.email === iu.email)) {
            updated.push(iu);
          }
        });
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updated));
        return updated;
      }
    } catch (e) {
      console.error('Failed to parse giritrack_users:', e);
    }
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(initialUsers));
    return initialUsers;
  });

  const registerUser = ({ name, email, password }) => {
    const emailExists = usersDb.some((u) => u.email === email);
    if (emailExists) {
      throw new Error('Email sudah terdaftar!');
    }

    const newUser = {
      name,
      email,
      password,
      role: 'user'
    };

    const updatedUsers = [...usersDb, newUser];
    setUsersDb(updatedUsers);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));
    return true;
  };

  const register = registerUser;

  const loginWithGoogle = async () => {
    setLoadingGoogle(true);
    try {
      // Try Firebase Google Sign-In Popup
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;
      
      const googleUser = {
        email: firebaseUser.email || 'user.google@gmail.com',
        name: firebaseUser.displayName || 'Pendaki Google',
        avatar: firebaseUser.photoURL || '',
        role: 'user',
        isLoggedIn: true
      };

      const emailExists = usersDb.some((u) => u.email === googleUser.email);
      if (!emailExists) {
        const updatedUsers = [...usersDb, { ...googleUser, password: 'google_oauth_firebase' }];
        setUsersDb(updatedUsers);
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));
      }

      setUser(googleUser);
      setLoadingGoogle(false);
      return googleUser;
    } catch (err) {
      console.warn('Firebase Sign-In failed or fallback to mock mode:', err.message);
      
      // Fallback mock google user for demo mode when Firebase API key is unconfigured or domain restricted
      const googleUser = {
        email: 'user.google@gmail.com',
        name: 'Pendaki Google',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        role: 'user',
        isLoggedIn: true
      };
      
      const emailExists = usersDb.some((u) => u.email === googleUser.email);
      if (!emailExists) {
        const updatedUsers = [...usersDb, { ...googleUser, password: 'google_oauth_mock' }];
        setUsersDb(updatedUsers);
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));
      }

      setUser(googleUser);
      setLoadingGoogle(false);
      return googleUser;
    }
  };

  const login = ({ email, password }) => {
    const foundUser = usersDb.find(u => u.email === email && u.password === password);
    
    if (!foundUser) {
      throw new Error('Akun belum terdaftar atau kata sandi salah. Silakan buat akun terlebih dahulu!');
    }

    const newUserState = {
      email: foundUser.email,
      name: foundUser.name,
      role: foundUser.role,
      avatar: foundUser.avatar || '',
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
      password: 'admin123',
    });
  };

  const loginAsDemoUser = () => {
    return login({
      email: 'pendaki@giritrack.id',
      password: 'user123',
    });
  };

  const setCurrentRole = (role) => {
    if (role === 'admin' || role === 'user') {
      setUser((prev) => ({ ...prev, role }));
    }
  };

  const updateUserProfile = (updatedData) => {
    if (!user.isLoggedIn) throw new Error('Anda harus login untuk mengubah profil');
    
    const newUserData = { ...user, ...updatedData };
    
    // Update current session
    setUser(newUserData);
    
    // Update users database in localStorage
    const updatedUsersDb = usersDb.map(u => 
      u.email === user.email ? { ...u, ...updatedData } : u
    );
    setUsersDb(updatedUsersDb);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsersDb));
    
    return true;
  };

  /**
   * Protected Action Gate
   * Intercepts unauthenticated actions and returns boolean or executes callback
   */
  const requireAuth = (actionCallback, intendedPath = '/login') => {
    if (user && user.isLoggedIn) {
      if (actionCallback && typeof actionCallback === 'function') {
        actionCallback();
      }
      return true;
    }
    // Save intended path for redirect after login
    localStorage.setItem('giritrack_intended_path', intendedPath);
    return false;
  };

  const currentRole = user.role;
  const isAdmin = user.role === 'admin';
  const isUser = user.role === 'user';
  const isLoggedIn = user.isLoggedIn;
  const currentUser = user.isLoggedIn ? user : null;

  return (
    <AuthContext.Provider
      value={{
        user,
        currentUser,
        isLoggedIn,
        currentRole,
        setCurrentRole,
        isAdmin,
        isUser,
        loadingGoogle,
        login,
        loginWithGoogle,
        registerUser,
        register,
        requireAuth,
        logout,
        loginAsDemoAdmin,
        loginAsDemoUser,
        updateUserProfile,
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


