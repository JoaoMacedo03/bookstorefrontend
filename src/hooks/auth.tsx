import React, { createContext, useCallback, useState, useContext } from 'react';
import api from '../services/api';

interface UserObj {
  username: string;
  email: string;
  role: number;
}

interface AuthState {
  token: string;
  user: UserObj;
}

interface SignInCredentials {
  email: string;
  password: string;
}

interface AuthContextData {
  user: UserObj;
  signIn(credentials: SignInCredentials): Promise<void>;
  signOut(): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const AuthProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<AuthState>(() => {
    const token = localStorage.getItem('@BookStore:token');
    const user = localStorage.getItem('@BookStore:user');

    if (token && user) {
      return { token, user: JSON.parse(user) };
    }

    return {} as AuthState;
  });

  const signIn = useCallback(async ({ email, password }) => {
    const response = await api.post('login', { email, password });
    let { token, user } = response.data;
    
    token = token.token
   
    localStorage.setItem('@BookStore:token', token);
    localStorage.setItem('@BookStore:user', JSON.stringify(user));

    setData({ token, user });
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem('@BookStore:token');
    localStorage.removeItem('@BookStore:user');

    setData({} as AuthState);
  }, []);

  return (
    <AuthContext.Provider value={{ user: data.user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}

export { AuthProvider, useAuth };
