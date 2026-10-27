import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import { useRouter } from 'expo-router';
import api from '@/services/api';

interface User {
  id?: string | number;
  nome: string;
  email: string;
  tipo_usuario?: string;
  avatar?: string; // <--- Ícone do avatar escolhido (ex: "user-graduate", "chalkboard-user", etc.)
}

interface UpdateProfileData {
  nome: string;
  tipo_usuario: string;
  avatar?: string;
}

interface AuthContextData {
  user: User | null;
  signed: boolean;
  loading: boolean;
  signIn: (data: { email: string; token?: string; user?: User }) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: UpdateProfileData) => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function loadStorageData() {
      try {
        const storedToken = await SecureStore.getItemAsync('user_token');
        const storedUser = await SecureStore.getItemAsync('user_data');

        if (storedToken && storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.log('Erro ao carregar dados de autenticação:', error);
      } finally {
        setLoading(false);
      }
    }

    loadStorageData();
  }, []);

  const signIn = async ({ email, token, user: userData }: { email: string; token?: string; user?: User }) => {
    const loggedUser = userData || { nome: 'Usuário', email, tipo_usuario: 'Estudante', avatar: 'user-graduate' };
    const userToken = token || 'token_demo_123';

    await SecureStore.setItemAsync('user_token', userToken);
    await SecureStore.setItemAsync('user_data', JSON.stringify(loggedUser));

    setUser(loggedUser);
    router.replace('/(tabs)/dash' as any);
  };

  const signOut = async () => {
    await SecureStore.deleteItemAsync('user_token');
    await SecureStore.deleteItemAsync('user_data');
    setUser(null);
    router.replace('/(auth)' as any);
  };

  const updateProfile = async (data: UpdateProfileData) => {
    if (!user) return;

    try {
      await api.put(`/usuarios/${user.id}`, data);
    } catch (e) {
      console.log('Servidor offline, atualizando apenas localmente');
    }

    const updatedUser = {
      ...user,
      nome: data.nome,
      tipo_usuario: data.tipo_usuario,
      avatar: data.avatar || user.avatar || 'user',
    };

    await SecureStore.setItemAsync('user_data', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ signed: !!user, user, loading, signIn, signOut, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};