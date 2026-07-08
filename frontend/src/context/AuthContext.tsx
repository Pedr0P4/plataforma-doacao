'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UsuarioDTO, LoginDTO, PessoaFisicaDTO, InstituicaoDTO, NotificacaoSSE } from '@/types';
import { authApi, createSseConnection } from '@/services/api';

interface AuthContextType {
  user: UsuarioDTO | null;
  loading: boolean;
  notificacoes: NotificacaoSSE[];
  login: (data: LoginDTO) => Promise<void>;
  registrarPessoaFisica: (data: PessoaFisicaDTO) => Promise<void>;
  registrarInstituicao: (data: InstituicaoDTO) => Promise<void>;
  logout: () => Promise<void>;
  limparNotificacoes: () => void;
  removerNotificacao: (index: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UsuarioDTO | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [notificacoes, setNotificacoes] = useState<NotificacaoSSE[]>([]);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await authApi.verificarSessao();
        if (res && res.usuario) {
          setUser(res.usuario);
        } else {
          setUser(null);
        }
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  // Conectar SSE quando usuário estiver logado
  useEffect(() => {
    if (!user || !user.id) return;

    let sse: EventSource | null = null;
    try {
      sse = createSseConnection((novaNotificacao) => {
        setNotificacoes((prev) => [
          {
            ...novaNotificacao,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
          ...prev,
        ]);
      });
    } catch (e) {
      console.error('Falha ao iniciar SSE', e);
    }

    return () => {
      if (sse) {
        sse.close();
      }
    };
  }, [user]);

  const login = async (data: LoginDTO) => {
    const res = await authApi.login(data);
    setUser(res);
  };

  const registrarPessoaFisica = async (data: PessoaFisicaDTO) => {
    const res = await authApi.registrarPessoaFisica(data);
    setUser(res);
  };

  const registrarInstituicao = async (data: InstituicaoDTO) => {
    const res = await authApi.registrarInstituicao(data);
    setUser(res);
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (e) {
      console.error('Erro ao fazer logout', e);
    } finally {
      setUser(null);
      setNotificacoes([]);
    }
  };

  const limparNotificacoes = () => setNotificacoes([]);

  const removerNotificacao = (index: number) => {
    setNotificacoes((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        notificacoes,
        login,
        registrarPessoaFisica,
        registrarInstituicao,
        logout,
        limparNotificacoes,
        removerNotificacao,
      }}
    >
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
