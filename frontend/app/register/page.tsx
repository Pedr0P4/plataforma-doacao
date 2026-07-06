'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/context/AuthContext';
import { registroPFSchema, registroONGSchema, RegistroPFFormData, RegistroONGFormData } from '@/schemas';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { User, Building2, Mail, Lock, CreditCard, Calendar, MapPin, Globe, UserPlus, Gift, ArrowLeft, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { registrarPessoaFisica, registrarInstituicao } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'PF' | 'ONG'>('PF');
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [success, setSuccess] = useState(false);

  // Form para Pessoa Física
  const {
    register: regPF,
    handleSubmit: submitPF,
    formState: { errors: errorsPF },
    reset: resetPF,
  } = useForm<RegistroPFFormData>({
    resolver: zodResolver(registroPFSchema),
  });

  // Form para ONG / Instituição
  const {
    register: regONG,
    handleSubmit: submitONG,
    formState: { errors: errorsONG },
    reset: resetONG,
  } = useForm<RegistroONGFormData>({
    resolver: zodResolver(registroONGSchema),
  });

  const handleTabChange = (tab: 'PF' | 'ONG') => {
    setActiveTab(tab);
    setApiError('');
    resetPF();
    resetONG();
  };

  const onPFSubmit = async (data: RegistroPFFormData) => {
    setLoading(true);
    setApiError('');
    try {
      const payload = {
        ...data,
        cpf: data.cpf.replace(/\D/g, ''),
        cep: data.cep ? data.cep.replace(/\D/g, '') : undefined,
      };
      await registrarPessoaFisica(payload);
      setSuccess(true);
      setTimeout(() => router.push('/doacoes'), 1200);
    } catch (err: any) {
      setApiError(err.response?.data?.mensagem || 'Erro ao registrar Pessoa Física. Verifique o CPF/E-mail.');
    } finally {
      setLoading(false);
    }
  };

  const onONGSubmit = async (data: RegistroONGFormData) => {
    setLoading(true);
    setApiError('');
    try {
      const payload = {
        ...data,
        cnpj: data.cnpj.replace(/\D/g, ''),
        cep: data.cep ? data.cep.replace(/\D/g, '') : undefined,
      };
      await registrarInstituicao(payload);
      setSuccess(true);
      setTimeout(() => router.push('/campanhas'), 1200);
    } catch (err: any) {
      setApiError(err.response?.data?.mensagem || 'Erro ao registrar ONG. Verifique o CNPJ/E-mail.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-160px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none animate-pulse-subtle" />
      <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none animate-pulse-subtle" />

      <div className="max-w-2xl w-full space-y-8 relative z-10">
        
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-lg">
              <Gift className="w-5 h-5 animate-float" />
            </div>
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
              Doa+ Brasil
            </span>
          </Link>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Crie sua conta gratuita
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Junte-se a uma rede de solidariedade autêntica. Escolha abaixo se você deseja doar/receber como indivíduo ou cadastrar sua organização.
          </p>
        </div>

        {/* Abas de Seleção */}
        <div className="flex p-1.5 rounded-2xl bg-slate-200/80 dark:bg-slate-800/80 border border-slate-300/50 dark:border-slate-700/50 max-w-md mx-auto shadow-inner">
          <button
            type="button"
            onClick={() => handleTabChange('PF')}
            className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
              activeTab === 'PF'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-md scale-[1.02]'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <User className="w-4 h-4" /> Pessoa Física (PF)
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('ONG')}
            className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
              activeTab === 'ONG'
                ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-md scale-[1.02]'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Building2 className="w-4 h-4" /> Instituição / ONG
          </button>
        </div>

        {/* Card Form */}
        <Card className="shadow-2xl border-emerald-500/20 backdrop-blur-xl">
          {success ? (
            <div className="py-16 text-center space-y-4 animate-in fade-in zoom-in-95 duration-300">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10 animate-bounce" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Cadastro Concluído!</h3>
              <p className="text-sm text-slate-500">Bem-vindo à comunidade! Redirecionando para seu painel...</p>
            </div>
          ) : activeTab === 'PF' ? (
            
            /* FORM PESSOA FÍSICA */
            <form onSubmit={submitPF(onPFSubmit)} className="space-y-6">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <User className="w-5 h-5 text-emerald-600" /> Cadastro de Indivíduo (Doador / Donatário)
                </h3>
                <p className="text-xs text-slate-500">Preencha seus dados para começar a doar ou demonstrar interesse em itens.</p>
              </div>

              {apiError && (
                <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 text-rose-600 text-xs font-medium">
                  <span>⚠️ {apiError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Nome Completo *" placeholder="Ex: Pedro Silva" icon={<User className="w-4 h-4" />} error={errorsPF.nome?.message} {...regPF('nome')} />
                <Input label="E-mail *" type="email" placeholder="pedro@exemplo.com" icon={<Mail className="w-4 h-4" />} error={errorsPF.email?.message} {...regPF('email')} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input label="Senha *" type="password" placeholder="Mínimo 6 caracteres" icon={<Lock className="w-4 h-4" />} error={errorsPF.senha?.message} {...regPF('senha')} />
                <Input label="CPF *" placeholder="000.000.000-00" icon={<CreditCard className="w-4 h-4" />} error={errorsPF.cpf?.message} {...regPF('cpf')} />
                <Input label="Data de Nascimento" type="date" icon={<Calendar className="w-4 h-4" />} error={errorsPF.dataNascimento?.message} {...regPF('dataNascimento')} />
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" /> Endereço Principal (Opcional - Facilita os encontros)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Input label="CEP" placeholder="00000-000" error={errorsPF.cep?.message} {...regPF('cep')} />
                  <div className="sm:col-span-2"><Input label="Logradouro / Rua" placeholder="Av. Principal" error={errorsPF.logradouro?.message} {...regPF('logradouro')} /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Bairro" placeholder="Centro" error={errorsPF.bairro?.message} {...regPF('bairro')} />
                  <Input label="Número / Complemento" placeholder="100, Apto 201" error={errorsPF.numero?.message} {...regPF('numero')} />
                </div>
              </div>

              <Button type="submit" variant="glow" size="lg" className="w-full font-bold shadow-xl mt-4" isLoading={loading} icon={<UserPlus className="w-5 h-5" />}>
                Concluir Cadastro PF &rarr;
              </Button>
            </form>

          ) : (

            /* FORM INSTITUIÇÃO / ONG */
            <form onSubmit={submitONG(onONGSubmit)} className="space-y-6">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-teal-600" /> Cadastro de Instituição ou Projeto Social
                </h3>
                <p className="text-xs text-slate-500">Instituições têm acesso à criação de Campanhas e mobilização de Voluntários.</p>
              </div>

              {apiError && (
                <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 text-rose-600 text-xs font-medium">
                  <span>⚠️ {apiError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Nome da Organização / ONG *" placeholder="Ex: Instituto Esperança" icon={<Building2 className="w-4 h-4" />} error={errorsONG.nome?.message} {...regONG('nome')} />
                <Input label="E-mail Corporativo / Oficial *" type="email" placeholder="contato@ong.org" icon={<Mail className="w-4 h-4" />} error={errorsONG.email?.message} {...regONG('email')} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input label="Senha *" type="password" placeholder="Mínimo 6 caracteres" icon={<Lock className="w-4 h-4" />} error={errorsONG.senha?.message} {...regONG('senha')} />
                <Input label="CNPJ *" placeholder="00.000.000/0001-00" icon={<CreditCard className="w-4 h-4" />} error={errorsONG.cnpj?.message} {...regONG('cnpj')} />
                <Input label="Site Oficial" placeholder="https://..." icon={<Globe className="w-4 h-4" />} error={errorsONG.site?.message} {...regONG('site')} />
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-teal-600" /> Sede ou Ponto de Arrecadação Principal
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Input label="CEP" placeholder="00000-000" error={errorsONG.cep?.message} {...regONG('cep')} />
                  <div className="sm:col-span-2"><Input label="Logradouro" placeholder="Rua da Solidariedade" error={errorsONG.logradouro?.message} {...regONG('logradouro')} /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Bairro" placeholder="Centro" error={errorsONG.bairro?.message} {...regONG('bairro')} />
                  <Input label="Número / Sala" placeholder="500, Sala 10" error={errorsONG.numero?.message} {...regONG('numero')} />
                </div>
              </div>

              <Button type="submit" variant="glow" size="lg" className="w-full bg-teal-600 hover:bg-teal-500 font-bold shadow-xl mt-4" isLoading={loading} icon={<Building2 className="w-5 h-5" />}>
                Cadastrar Instituição / ONG &rarr;
              </Button>
            </form>
          )}

          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <Link href="/login" className="inline-flex items-center gap-1 font-semibold text-emerald-600 hover:underline">
              <ArrowLeft className="w-3.5 h-3.5" /> Já tem uma conta? Fazer login
            </Link>
            <span className="flex items-center gap-1 text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-500" /> Validado por Zod Schemas
            </span>
          </div>
        </Card>

      </div>
    </div>
  );
}
