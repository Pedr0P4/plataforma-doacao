'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Heart, Gift, Bell, User, LogOut, PlusCircle, Sparkles, Menu, X, Check, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export const Navbar: React.FC = () => {
  const { user, logout, notificacoes, limparNotificacoes, removerNotificacao } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const navLinks = [
    { name: 'Início', href: '/' },
    { name: 'Explorar Doações', href: '/doacoes' },
    { name: 'Campanhas das ONGs', href: '/campanhas' },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30 group-hover:scale-105 transition-transform duration-300">
              <Gift className="w-5 h-5 animate-pulse-subtle" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-emerald-800 via-teal-700 to-emerald-700 dark:from-emerald-400 dark:to-teal-300 bg-clip-text text-transparent">
                Doa+ Brasil
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium -mt-1 flex items-center gap-1">
                Conectando solidariedade <Sparkles className="w-2.5 h-2.5 text-amber-500 inline" />
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive(link.href)
                    ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 font-semibold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/60 dark:hover:bg-slate-800/50'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Auth & User actions */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                {/* Notificações em Tempo Real (SSE) */}
                <div className="relative">
                  <button
                    onClick={() => setNotifOpen(!notifOpen)}
                    className="relative p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Notificações em tempo real"
                  >
                    <Bell className="w-5 h-5" />
                    {notificacoes.length > 0 && (
                      <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping" />
                    )}
                    {notificacoes.length > 0 && (
                      <span className="absolute top-1 right-1 px-1.5 py-0.2 min-w-[18px] h-[18px] bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-md">
                        {notificacoes.length}
                      </span>
                    )}
                  </button>

                  {/* Dropdown de Notificações */}
                  {notifOpen && (
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 glass-card rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                        <div className="flex items-center gap-2">
                          <Bell className="w-4 h-4 text-emerald-600" />
                          <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-100">Notificações ao Vivo</h3>
                        </div>
                        {notificacoes.length > 0 && (
                          <button
                            onClick={limparNotificacoes}
                            className="text-xs text-slate-500 hover:text-rose-500 transition-colors flex items-center gap-1"
                          >
                            <Trash2 className="w-3 h-3" /> Limpar
                          </button>
                        )}
                      </div>
                      
                      <div className="max-h-64 overflow-y-auto mt-2 space-y-2">
                        {notificacoes.length === 0 ? (
                          <div className="py-8 text-center text-slate-400 text-xs">
                            <Sparkles className="w-6 h-6 mx-auto mb-1 opacity-40" />
                            Nenhuma notificação nova no momento.
                          </div>
                        ) : (
                          notificacoes.map((notif, idx) => (
                            <div
                              key={idx}
                              className="p-3 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/40 relative group"
                            >
                              <div className="flex justify-between items-start">
                                <Badge variant="emerald" size="sm">Novo Interesse!</Badge>
                                <span className="text-[10px] text-slate-400">{notif.timestamp}</span>
                              </div>
                              <p className="text-xs text-slate-700 dark:text-slate-200 mt-1.5 font-medium">
                                {notif.mensagem}
                              </p>
                              {notif.doacaoId && (
                                <Link
                                  href={`/doacoes/${notif.doacaoId}`}
                                  onClick={() => setNotifOpen(false)}
                                  className="mt-2 inline-flex items-center text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
                                >
                                  Ver doação e lista de interessados &rarr;
                                </Link>
                              )}
                              <button
                                onClick={() => removerNotificacao(idx)}
                                className="absolute bottom-2 right-2 text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Botões de Ação */}
                <Link href="/doacoes/nova">
                  <Button variant="glow" size="sm" icon={<PlusCircle className="w-4 h-4" />}>
                    Doar Item
                  </Button>
                </Link>

                <Link href="/dashboard">
                  <div className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer border border-slate-200/60 dark:border-slate-700/60">
                    <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                      {user.nome ? user.nome.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 max-w-[100px] truncate">
                      {user.nome.split(' ')[0]}
                    </span>
                  </div>
                </Link>

                <button
                  onClick={logout}
                  className="p-2.5 rounded-xl text-slate-500 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                  title="Sair"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Entrar
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="glow" size="sm">
                    Cadastrar-se
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            {user && (
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative p-2 rounded-lg text-slate-600 dark:text-slate-300"
              >
                <Bell className="w-5 h-5" />
                {notificacoes.length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full" />
                )}
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-200 dark:border-slate-800 space-y-3 animate-in fade-in duration-200">
            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium ${
                    isActive(link.href)
                      ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 font-semibold'
                      : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2 px-2">
              {user ? (
                <>
                  <div className="flex items-center justify-between px-2 py-1">
                    <span className="text-xs font-semibold text-slate-500">Logado como {user.nome}</span>
                    <button onClick={logout} className="text-xs text-rose-500 font-medium flex items-center gap-1">
                      <LogOut className="w-3.5 h-3.5" /> Sair
                    </button>
                  </div>
                  <Link href="/doacoes/nova" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="glow" size="md" className="w-full">Doar Item</Button>
                  </Link>
                  <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" size="md" className="w-full">Meu Painel</Button>
                  </Link>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" size="md" className="w-full">Entrar</Button>
                  </Link>
                  <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="glow" size="md" className="w-full">Cadastrar</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
