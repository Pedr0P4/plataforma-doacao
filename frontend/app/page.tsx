'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { doacoesApi, campanhasApi } from '@/services/api';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { Gift, Heart, Users, Sparkles, ArrowRight, ShieldCheck, CheckCircle2, Building2, Calendar, MapPin, HandHeart, Share2, Award, Search } from 'lucide-react';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'doacoes' | 'campanhas' | 'voluntariado'>('doacoes');

  // Buscar doações disponíveis
  const { data: doacoesData, isLoading: loadingDoacoes } = useQuery({
    queryKey: ['doacoes-destaque'],
    queryFn: () => doacoesApi.listarDisponiveis(0, 3),
  });

  // Buscar campanhas de ONGs
  const { data: campanhasData, isLoading: loadingCampanhas } = useQuery({
    queryKey: ['campanhas-destaque'],
    queryFn: () => campanhasApi.listar(0, 3),
  });

  const doacoesList = doacoesData?.content || [];
  const campanhasList = campanhasData?.content || [];

  return (
    <div className="w-full relative overflow-hidden">
      
      {/* Background Decorative Gradient Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-tr from-emerald-500/15 via-teal-500/10 to-transparent rounded-full blur-3xl pointer-events-none -z-10 animate-pulse-subtle" />
      <div className="absolute top-[800px] right-0 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* 1. HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-20 pb-16 text-center lg:text-left">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800/60 text-xs font-semibold text-emerald-700 dark:text-emerald-300 shadow-sm animate-in fade-in slide-in-from-top duration-500">
              <span>Plataforma Oficial de Conexão Solidária</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.1]">
              A generosidade de um encontra a{' '}
              <span className="bg-gradient-to-r from-emerald-800 via-teal-700 to-emerald-700 dark:from-emerald-400 dark:via-teal-300 dark:to-emerald-300 bg-clip-text text-transparent">
                necessidade do outro.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 max-w-2xl leading-relaxed font-normal">
              Uma plataforma inteligente onde você pode anunciar itens para doação ou demonstrar interesse naquilo que precisa. O doador visualiza a lista de interessados e escolhe quem receberá o item com total transparência e segurança.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
              <Link href="/doacoes/nova" className="w-full sm:w-auto">
                <Button variant="glow" size="lg" className="w-full sm:w-auto text-base shadow-xl font-bold">
                  Quero Doar Um Item &rarr;
                </Button>
              </Link>
              <Link href="/doacoes" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto text-base" icon={<Search className="w-4 h-4" />}>
                  Explorar Doações
                </Button>
              </Link>
            </div>

            {/* Destaques rápidos */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-200/80 dark:border-slate-800 max-w-lg mx-auto lg:mx-0 text-left">
              <div>
                <p className="text-2xl font-black text-slate-900 dark:text-white">+1.240</p>
                <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">Itens Doados</p>
              </div>
              <div>
                <p className="text-2xl font-black text-slate-900 dark:text-white">+85</p>
                <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">ONGs Cadastradas</p>
              </div>
              <div>
                <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">100%</p>
                <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">Gratuito & Seguro</p>
              </div>
            </div>
          </div>

          {/* Hero Visual Mockup */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Card Flutuante Principal */}
              <div className="glass-card rounded-3xl p-6 shadow-2xl border border-slate-200/80 dark:border-slate-700/80 relative z-20 animate-float" style={{ animationDuration: '6s' }}>
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="emerald" size="sm">Doação Disponível</Badge>
                  <span className="text-xs text-slate-700 dark:text-slate-300">Há 2 horas</span>
                </div>
                
                <div className="aspect-video w-full rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-950/80 dark:to-teal-950/80 flex items-center justify-center relative overflow-hidden mb-4">
                  <Gift className="w-16 h-16 text-emerald-600/60 dark:text-emerald-400/60" />
                  <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-emerald-400" /> São Paulo, SP
                  </div>
                </div>

                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1">
                  Cadeira de Escritório Ergonômica
                </h3>
                <p className="text-xs text-slate-700 dark:text-slate-300 mb-4 line-clamp-2">
                  Em perfeito estado, com regulagem de altura e apoio lombar. Doando por motivo de mudança para outro estado.
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs">
                      M
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">Mariana S.</p>
                      <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">Doadora Verificada</p>
                    </div>
                  </div>
                  <Button variant="glow" size="sm">
                    Tenho Interesse
                  </Button>
                </div>
              </div>

              {/* Card de Notificação SSE simulado (Flutuante inferior esquerdo) */}
              <div className="absolute -bottom-6 -left-6 z-30 glass-card rounded-2xl p-4 shadow-2xl max-w-xs border border-emerald-500/40 hidden sm:block animate-bounce" style={{ animationDuration: '4s' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center shrink-0">
                    <Heart className="w-5 h-5 fill-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-100">Novo Interessado!</p>
                    <p className="text-[11px] text-slate-700 dark:text-slate-300">
                      ONG Sementes do Futuro demonstrou interesse na sua doação.
                    </p>
                  </div>
                </div>
              </div>

              {/* Card de Campanha simulado (Flutuante superior direito) */}
              <div className="absolute -top-6 -right-6 z-10 glass-card rounded-2xl p-3.5 shadow-xl max-w-[220px] hidden sm:block">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-teal-600" />
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-100">Campanha Ativa</span>
                </div>
                <p className="text-[11px] text-slate-700 dark:text-slate-300 mt-1">Arrecadação de Agasalhos de Inverno &rarr;</p>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 2. COMO FUNCIONA (REGRAS DE NEGÓCIO DA APLICAÇÃO) */}
      <section className="py-20 bg-slate-100/60 dark:bg-slate-900/40 border-y border-slate-200/80 dark:border-slate-800/80 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="teal" size="md" className="mb-3">Simples, Justo e Seguro</Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Como funciona o fluxo de doação na plataforma?
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-700 dark:text-slate-300">
              Desenhamos um modelo justo onde quem doa tem autonomia para escolher quem receberá o item entre os interessados cadastrados.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            
            {/* Passo 1 */}
            <Card hoverEffect className="relative z-10 flex flex-col justify-between h-full bg-white/80 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black text-lg mb-4 shadow-inner">
                  01
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  Anuncie um Item ou Campanha
                </h3>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  Pessoas físicas cadastram itens que desejam doar com foto e descrição. ONGs criam campanhas de arrecadação solicitando itens específicos.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                <Gift className="w-3.5 h-3.5" /> Cadastro ilimitado
              </div>
            </Card>

            {/* Passo 2 */}
            <Card hoverEffect className="relative z-10 flex flex-col justify-between h-full bg-white/80 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-950/80 text-teal-600 dark:text-teal-400 flex items-center justify-center font-black text-lg mb-4 shadow-inner">
                  02
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  Manifestação de Interesse
                </h3>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  Quem precisa do item (seja outra pessoa ou uma instituição beneficente) navega pela vitrine e clica no botão <span className="font-semibold text-teal-600">"Tenho Interesse"</span>.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5 text-[11px] font-semibold text-teal-600 dark:text-teal-400">
                <Heart className="w-3.5 h-3.5" /> Lista de interessados
              </div>
            </Card>

            {/* Passo 3 */}
            <Card hoverEffect className="relative z-10 flex flex-col justify-between h-full bg-white/80 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 border-2 border-emerald-500/40 shadow-xl">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-black text-lg mb-4 shadow-md">
                  03
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="emerald" size="sm">Regra Central</Badge>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  A Escolha é do Doador
                </h3>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  O doador acessa a lista completa de pessoas e ONGs interessadas em seu item. Analisa o perfil e escolhe com quem deseja efetivar a doação.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" /> Autonomia total
              </div>
            </Card>

            {/* Passo 4 */}
            <Card hoverEffect className="relative z-10 flex flex-col justify-between h-full bg-white/80 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center font-black text-lg mb-4 shadow-inner">
                  04
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  Efetivação e Entrega
                </h3>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  A doação é efetivada no sistema, o ponto de coleta ou encontro é combinado e o impacto social acontece!
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5 text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                <HandHeart className="w-3.5 h-3.5" /> Transformação real
              </div>
            </Card>

          </div>
        </div>
      </section>

      {/* 3. VITRINE EM TEMPO REAL (ABAS INTERATIVAS) */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Destaques da Comunidade
            </h2>
            <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">
              Explore o que está acontecendo agora mesmo na plataforma.
            </p>
          </div>

          {/* Abas */}
          <div className="flex p-1 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setActiveTab('doacoes')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all ${
                activeTab === 'doacoes'
                  ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'text-slate-700 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              <Gift className="w-3.5 h-3.5" /> Doações Disponíveis
            </button>
            <button
              onClick={() => setActiveTab('campanhas')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all ${
                activeTab === 'campanhas'
                  ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'text-slate-700 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" /> Campanhas de ONGs
            </button>
            <button
              onClick={() => setActiveTab('voluntariado')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all ${
                activeTab === 'voluntariado'
                  ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'text-slate-700 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              <Users className="w-3.5 h-3.5" /> Voluntariado
            </button>
          </div>
        </div>

        {/* Conteúdo da Aba 1: Doações */}
        {activeTab === 'doacoes' && (
          <div>
            {loadingDoacoes ? (
              <Spinner size="lg" />
            ) : doacoesList.length === 0 ? (
              <Card className="text-center py-16 border-dashed border-2 border-slate-300 dark:border-slate-700">
                <Gift className="w-12 h-12 text-slate-500 dark:text-slate-400 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">Nenhuma doação ativa encontrada</h3>
                <p className="text-xs text-slate-700 dark:text-slate-300 max-w-sm mx-auto mt-1 mb-6">
                  Seja o primeiro a cadastrar um item para doação e dar início a essa onda de solidariedade!
                </p>
                <Link href="/doacoes/nova">
                  <Button variant="glow" size="md">Anunciar Primeiro Item &rarr;</Button>
                </Link>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {doacoesList.map((doacao) => (
                  <Card key={doacao.id} hoverEffect className="flex flex-col justify-between">
                    <div>
                      <div className="aspect-video w-full rounded-xl bg-slate-100 dark:bg-slate-800 mb-4 overflow-hidden relative flex items-center justify-center">
                        {doacao.urlImagem ? (
                          <img
                            src={`http://localhost:8080${doacao.urlImagem}`}
                            alt="Item"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Gift className="w-10 h-10 text-emerald-600/40" />
                        )}
                        <Badge variant="emerald" size="sm" className="absolute top-2 right-2">
                          Disponível
                        </Badge>
                      </div>

                      <h3 className="font-bold text-base text-slate-900 dark:text-white mb-1">
                        {doacao.itens?.[0]?.nome || 'Item para doação'}
                      </h3>
                      <p className="text-xs text-slate-700 dark:text-slate-300 mb-4 line-clamp-2">
                        {doacao.itens?.[0]?.descricao || 'Sem descrição detalhada disponível.'}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                        Por: {doacao.nomeDoador || 'Doador'}
                      </span>
                      <Link href={`/doacoes/${doacao.id}`}>
                        <Button variant="outline" size="sm">Ver Detalhes &rarr;</Button>
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>
            )}
            
            <div className="mt-10 text-center">
              <Link href="/doacoes">
                <Button variant="outline" size="lg" className="font-semibold">
                  Ver Todas as Doações Disponíveis &rarr;
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Conteúdo da Aba 2: Campanhas */}
        {activeTab === 'campanhas' && (
          <div>
            {loadingCampanhas ? (
              <Spinner size="lg" />
            ) : campanhasList.length === 0 ? (
              <Card className="text-center py-16 border-dashed border-2 border-slate-300 dark:border-slate-700">
                <Building2 className="w-12 h-12 text-slate-500 dark:text-slate-400 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">Nenhuma campanha em destaque</h3>
                <p className="text-xs text-slate-700 dark:text-slate-300 max-w-sm mx-auto mt-1 mb-6">
                  As Instituições parceiras publicam suas campanhas de arrecadação de itens aqui.
                </p>
                <Link href="/campanhas">
                  <Button variant="outline" size="md">Explorar Campanhas &rarr;</Button>
                </Link>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {campanhasList.map((camp) => (
                  <Card key={camp.id} hoverEffect className="flex flex-col justify-between border-l-4 border-l-teal-500">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <Badge variant="teal" size="sm">Campanha Ativa</Badge>
                        <span className="text-[10px] text-slate-700 dark:text-slate-300 flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {camp.dataFim || 'Contínua'}
                        </span>
                      </div>

                      <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2">
                        {camp.titulo}
                      </h3>
                      <p className="text-xs text-slate-700 dark:text-slate-300 mb-4 line-clamp-3">
                        {camp.descricao || 'Contribua com esta causa doando os itens solicitados pela instituição.'}
                      </p>

                      {camp.itensFoco && (
                        <div className="p-2.5 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-xs mb-4">
                          <span className="font-semibold text-teal-800 dark:text-teal-300">Itens Solicitados: </span>
                          <span className="text-slate-700 dark:text-slate-300">{camp.itensFoco}</span>
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[120px]">
                        {camp.nomeInstituicao || 'ONG Beneficente'}
                      </span>
                      <Link href={`/campanhas/${camp.id}`}>
                        <Button variant="glow" size="sm">Apoiar Campanha</Button>
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            <div className="mt-10 text-center">
              <Link href="/campanhas">
                <Button variant="outline" size="lg" className="font-semibold">
                  Ver Todas as Campanhas das ONGs &rarr;
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Conteúdo da Aba 3: Voluntariado */}
        {activeTab === 'voluntariado' && (
          <Card className="p-8 sm:p-12 text-center bg-gradient-to-br from-emerald-900/90 to-teal-950 text-white border-none shadow-2xl relative overflow-hidden">
            <div className="max-w-2xl mx-auto space-y-4 relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mx-auto text-emerald-300">
                <Award className="w-8 h-8" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold">Seja um Voluntário Social</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Além de doar bens materiais, você também pode doar seu tempo e talento para ajudar as ONGs a organizarem suas campanhas, eventos de arrecadação e logística de distribuição.
              </p>
              <div className="pt-2">
                <Link href="/campanhas">
                  <Button variant="glow" size="lg" className="bg-white text-emerald-900 hover:bg-slate-100 font-bold">
                    Descobrir Vagas de Voluntário Nas ONGs &rarr;
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        )}
      </section>

      {/* 4. CALL TO ACTION BANNER */}
      <section className="py-16 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:flex sm:items-center sm:justify-between relative z-10">
          <div className="text-left mb-6 sm:mb-0">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Pronto para fazer a diferença na vida de alguém?
            </h2>
            <p className="text-emerald-100 text-sm mt-1">
              Junte-se a milhares de doadores e instituições em todo o Brasil.
            </p>
          </div>
          <div className="flex gap-3 justify-center">
            <Link href="/register">
              <button className="px-6 py-3.5 rounded-xl bg-white text-emerald-800 font-bold text-sm shadow-xl hover:bg-slate-100 transition-all active:scale-95">
                Criar Conta Gratuita &rarr;
              </button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
