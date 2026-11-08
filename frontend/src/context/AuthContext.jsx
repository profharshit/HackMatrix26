import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('aegis_auth_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isAuthOpen, setIsAuthOpen] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('aegis_auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('aegis_auth_user');
    }
  }, [user]);

  const login = (email, role = 'Security Analyst', name = 'Alex Chen') => {
    const newUser = {
      email,
      name: name || email.split('@')[0],
      role,
      avatar: name ? name.charAt(0).toUpperCase() : 'U',
      reputationScore: 98,
      verifiedAuditor: true,
      loginTime: new Date().toISOString(),
    };
    setUser(newUser);
    setIsAuthOpen(false);
  };

  const logout = () => {
    setUser(null);
  };

  const openAuth = () => setIsAuthOpen(true);
  const closeAuth = () => setIsAuthOpen(false);

  return (
    <AuthContext.Provider
      value={{
        user,
        isGuest: !user,
        isAuthOpen,
        openAuth,
        closeAuth,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
