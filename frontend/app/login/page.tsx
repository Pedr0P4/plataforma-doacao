'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/context/AuthContext';
import { loginSchema, LoginFormData } from '@/schemas';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Mail, Lock, LogIn, Gift, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    setApiError('');

    try {
      await login(data);
      setSuccess(true);
      setTimeout(() => {
        router.push('/doacoes');
      }, 800);
    } catch (err: any) {
      const msg = err.response?.data?.mensagem || 'Falha ao realizar login. Verifique suas credenciais.';
      setApiError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-160px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Background Decorative Blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none animate-pulse-subtle" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none animate-pulse-subtle" />

      <div className="max-w-md w-full space-y-8 relative z-10">
        
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-6 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-xl shadow-emerald-500/30 group-hover:scale-105 transition-transform">
              <Gift className="w-6 h-6 animate-float" />
            </div>
          </Link>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Bem-vindo de volta!
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Acesse sua conta para continuar transformando vidas e ajudando quem precisa.
          </p>
        </div>

        {/* Card do Formulário */}
        <Card className="shadow-2xl border-emerald-500/20 backdrop-blur-xl">
          {success ? (
            <div className="py-12 text-center space-y-4 animate-in fade-in zoom-in-95 duration-300">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10 animate-bounce" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Login Concluído!</h3>
              <p className="text-xs text-slate-500">Redirecionando você para a plataforma...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              
              {apiError && (
                <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-300 text-xs font-medium flex items-center gap-2 animate-in fade-in duration-200">
                  <span>⚠️ {apiError}</span>
                </div>
              )}

              <Input
                label="E-mail"
                type="email"
                placeholder="seu.email@exemplo.com"
                icon={<Mail className="w-4 h-4" />}
                error={errors.email?.message}
                {...register('email')}
              />

              <div>
                <Input
                  label="Senha"
                  type="password"
                  placeholder="••••••••"
                  icon={<Lock className="w-4 h-4" />}
                  error={errors.senha?.message}
                  {...register('senha')}
                />
                <div className="flex justify-end mt-1.5">
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      alert('Para redefinir sua senha, solicite ao suporte.');
                    }}
                    className="text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    Esqueceu sua senha?
                  </a>
                </div>
              </div>

              <Button
                type="submit"
                variant="glow"
                size="lg"
                className="w-full mt-2 font-bold"
                isLoading={loading}
                icon={<LogIn className="w-5 h-5" />}
              >
                Entrar na Plataforma
              </Button>
            </form>
          )}

          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800 text-center">
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Ainda não faz parte da comunidade?{' '}
              <Link
                href="/register"
                className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-0.5"
              >
                Cadastre-se gratuitamente <ArrowRight className="w-3 h-3" />
              </Link>
            </p>
          </div>
        </Card>

        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-[11px] font-medium text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/40">
            <Sparkles className="w-3 h-3 text-amber-500" /> Autenticação Segura por JWT Cookies (Axios & Zod)
          </span>
        </div>
      </div>
    </div>
  );
}
