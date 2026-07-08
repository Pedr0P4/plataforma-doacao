'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { doacoesApi, campanhasApi } from '@/services/api';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { Gift, Heart, Building2, PlusCircle, User, ShieldCheck, CheckCircle2, ArrowRight, Sparkles, Award } from 'lucide-react';

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<'anunciadas' | 'recebidas' | 'campanhas'>('anunciadas');

  const isOng = user && user.tipo === 'INSTITUICAO';

  // Buscar minhas doações anunciadas
  const { data: minhasDoacoes = [], isLoading: loadingMinhas } = useQuery({
    queryKey: ['minhas-doacoes'],
    queryFn: () => doacoesApi.listarMinhas(),
    enabled: !!user,
  });

  // Buscar doações recebidas
  const { data: recebidas = [], isLoading: loadingRecebidas } = useQuery({
    queryKey: ['recebidas'],
    queryFn: () => doacoesApi.listarRecebidas(),
    enabled: !!user,
  });

  // Buscar minhas campanhas (se ONG)
  const { data: minhasCampanhas = [], isLoading: loadingCampanhas } = useQuery({
    queryKey: ['minhas-campanhas'],
    queryFn: () => campanhasApi.listarMinhas(),
    enabled: !!isOng,
  });

  if (authLoading) return null;

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center">
        <Card className="p-8 space-y-4">
          <User className="w-16 h-16 text-emerald-600 mx-auto" />
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Acesso Restrito</h2>
          <p className="text-sm text-slate-600">Faça login para visualizar seu painel de controle solidário.</p>
          <Link href="/login"><Button variant="glow" size="md">Entrar Agora</Button></Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header Profile Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-black text-2xl sm:text-3xl shadow-inner border border-white/30">
            {user.nome.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/20">
                {isOng ? '🏢 Instituição / ONG' : '👤 Pessoa Física'}
              </span>
              <span className="text-xs flex items-center gap-0.5 font-medium text-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5" /> Conta Verificada
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold">{user.nome}</h1>
            <p className="text-xs text-emerald-100">{user.email}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 relative z-10 w-full sm:w-auto justify-start sm:justify-end">
          <Link href="/doacoes/nova" className="w-full sm:w-auto">
            <Button variant="glow" size="md" className="w-full sm:w-auto bg-white text-emerald-900 font-bold shadow-lg" icon={<PlusCircle className="w-4 h-4" />}>
              Doar Novo Item
            </Button>
          </Link>
          {isOng && (
            <Link href="/campanhas/nova" className="w-full sm:w-auto">
              <Button variant="outline" size="md" className="w-full sm:w-auto text-white border-white/40 hover:bg-white/10 font-bold" icon={<Building2 className="w-4 h-4" />}>
                Nova Campanha
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Estatísticas do Usuário */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="p-5 flex items-center gap-4 border border-slate-200/80 dark:border-slate-800">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center shrink-0">
            <Gift className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900 dark:text-white">{minhasDoacoes.length}</p>
            <p className="text-xs text-slate-500 font-medium">Itens Anunciados</p>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4 border border-slate-200/80 dark:border-slate-800">
          <div className="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-950 text-teal-600 flex items-center justify-center shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900 dark:text-white">{recebidas.length}</p>
            <p className="text-xs text-slate-500 font-medium">Doações Recebidas</p>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4 border border-slate-200/80 dark:border-slate-800">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center shrink-0">
            <Heart className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900 dark:text-white">{isOng ? minhasCampanhas.length : '100%'}</p>
            <p className="text-xs text-slate-500 font-medium">{isOng ? 'Campanhas Ativas' : 'Índice de Solidariedade'}</p>
          </div>
        </Card>
      </div>

      {/* Abas de Navegação */}
      <div className="space-y-6">
        <div className="flex p-1 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 max-w-lg">
          <button
            onClick={() => setActiveTab('anunciadas')}
            className={`flex-1 py-2 px-4 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'anunciadas'
                ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            🎁 Anunciados ({minhasDoacoes.length})
          </button>
          <button
            onClick={() => setActiveTab('recebidas')}
            className={`flex-1 py-2 px-4 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'recebidas'
                ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            🙌 Recebidos ({recebidas.length})
          </button>
          {isOng && (
            <button
              onClick={() => setActiveTab('campanhas')}
              className={`flex-1 py-2 px-4 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'campanhas'
                  ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              🏢 Campanhas ({minhasCampanhas.length})
            </button>
          )}
        </div>

        {/* Conteúdo Aba 1: Anunciadas */}
        {activeTab === 'anunciadas' && (
          <div>
            {loadingMinhas ? (
              <Spinner size="lg" />
            ) : minhasDoacoes.length === 0 ? (
              <Card className="text-center py-16 border-dashed border-2">
                <Gift className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">Você ainda não anunciou nenhum item</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                  Desapegue daquelas roupas, livros ou móveis que você não usa mais e mude o dia de alguém!
                </p>
                <Link href="/doacoes/nova"><Button variant="glow" size="sm">Anunciar Meu Primeiro Item &rarr;</Button></Link>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {minhasDoacoes.map((doacao) => {
                  const item = doacao.itens?.[0] || { nome: 'Item', descricao: '' };
                  const isEfetivada = doacao.donatarioId !== null && doacao.donatarioId !== undefined;

                  return (
                    <Card key={doacao.id} hoverEffect className="flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-xs font-semibold text-slate-400">ID #{doacao.id}</span>
                          {isEfetivada ? (
                            <Badge variant="rose" size="sm">🔒 Doado para {doacao.nomeDonatario || 'Beneficiário'}</Badge>
                          ) : (
                            <Badge variant="emerald" size="sm">✨ Disponível</Badge>
                          )}
                        </div>
                        <h3 className="font-extrabold text-base text-slate-900 dark:text-white mb-1">{item.nome}</h3>
                        <p className="text-xs text-slate-500 line-clamp-2 mb-4">{item.descricao || 'Sem descrição'}</p>
                      </div>
                      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                        <Link href={`/doacoes/${doacao.id}`}>
                          <Button variant={isEfetivada ? 'outline' : 'glow'} size="sm" className="w-full">
                            {isEfetivada ? 'Ver Detalhes & Beneficiário' : 'Gerenciar Interessados & Escolher Beneficiário'}
                          </Button>
                        </Link>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Conteúdo Aba 2: Recebidas */}
        {activeTab === 'recebidas' && (
          <div>
            {loadingRecebidas ? (
              <Spinner size="lg" />
            ) : recebidas.length === 0 ? (
              <Card className="text-center py-16 border-dashed border-2">
                <Heart className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">Você ainda não recebeu doações</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                  Explore o catálogo de itens disponíveis e demonstre interesse nos itens que você precisa.
                </p>
                <Link href="/doacoes"><Button variant="outline" size="sm">Explorar Vitrine &rarr;</Button></Link>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {recebidas.map((doacao) => {
                  const item = doacao.itens?.[0] || { nome: 'Item', descricao: '' };
                  return (
                    <Card key={doacao.id} className="border-l-4 border-l-emerald-500">
                      <div className="flex justify-between items-center mb-2">
                        <Badge variant="emerald" size="sm">🎉 Recebido com Sucesso</Badge>
                        <span className="text-[10px] text-slate-400">ID #{doacao.id}</span>
                      </div>
                      <h3 className="font-extrabold text-base text-slate-900 dark:text-white mb-1">{item.nome}</h3>
                      <p className="text-xs text-slate-500 mb-4">Doador: <strong className="text-slate-700 dark:text-slate-200">{doacao.nomeDoador || 'Generoso(a)'}</strong></p>
                      <Link href={`/doacoes/${doacao.id}`}>
                        <Button variant="outline" size="sm" className="w-full">Ver Resumo e Local</Button>
                      </Link>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Conteúdo Aba 3: Campanhas (Se ONG) */}
        {isOng && activeTab === 'campanhas' && (
          <div>
            {loadingCampanhas ? (
              <Spinner size="lg" />
            ) : minhasCampanhas.length === 0 ? (
              <Card className="text-center py-16 border-dashed border-2">
                <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">Nenhuma campanha publicada</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                  Abra uma campanha para divulgar os itens essenciais que sua instituição precisa arrecadar.
                </p>
                <Link href="/campanhas/nova"><Button variant="glow" size="sm">Publicar Nova Campanha &rarr;</Button></Link>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {minhasCampanhas.map((camp) => (
                  <Card key={camp.id} hoverEffect className="flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <Badge variant="teal" size="sm">{camp.status || 'ATIVA'}</Badge>
                        <span className="text-[10px] text-slate-400">ID #{camp.id}</span>
                      </div>
                      <h3 className="font-extrabold text-base text-slate-900 dark:text-white mb-1">{camp.titulo}</h3>
                      <p className="text-xs text-slate-500 line-clamp-2 mb-3">{camp.descricao}</p>
                    </div>
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                      <Link href={`/campanhas/${camp.id}`}>
                        <Button variant="outline" size="sm" className="w-full">Gerenciar Pontos de Coleta &rarr;</Button>
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
}
