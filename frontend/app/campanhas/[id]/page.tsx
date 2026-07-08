'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { campanhasApi, vagasApi, inscricoesApi } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { Building2, Calendar, MapPin, Users, Plus, Trash2, ArrowLeft, Heart, HandHeart, ShieldCheck, CheckCircle2, Award, Package, Clock, UserCheck, XCircle } from 'lucide-react';
import { CriarVagaDTO } from '@/types';

export default function CampanhaDetailsPage() {
  const params = useParams();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const router = useRouter();

  const id = Number(params.id);

  const { data: campanha, isLoading, isError } = useQuery({
    queryKey: ['campanha', id],
    queryFn: () => campanhasApi.buscarPorId(id),
    enabled: !isNaN(id),
  });

  const isOwner = user && campanha && user.id === campanha.instituicaoId;

  // Buscar vagas da campanha
  const { data: vagas = [], refetch: refetchVagas } = useQuery({
    queryKey: ['vagas', id],
    queryFn: () => vagasApi.listarPorCampanha(id),
    enabled: !isNaN(id),
  });

  // Buscar inscrições do usuário atual
  const { data: minhasInscricoes = [], refetch: refetchInscricoes } = useQuery({
    queryKey: ['minhas-inscricoes'],
    queryFn: () => inscricoesApi.listarMinhas(),
    enabled: !!user && !isOwner,
  });

  // Estado para criar vaga
  const [addingVaga, setAddingVaga] = useState(false);
  const [loadingVaga, setLoadingVaga] = useState(false);
  const [vagaForm, setVagaForm] = useState<CriarVagaDTO>({
    funcao: '',
    descricaoAtividades: '',
    quantidadeVagas: 1,
    cargaHorariaSemanal: 0
  });

  // Estado para gerenciar inscritos (Owner)
  const [vagaSelecionadaParaInscritos, setVagaSelecionadaParaInscritos] = useState<number | null>(null);
  const { data: inscritosVagaSelecionada = [], refetch: refetchInscritos, isFetching: loadingInscritos } = useQuery({
    queryKey: ['inscritos-vaga', id, vagaSelecionadaParaInscritos],
    queryFn: () => inscricoesApi.listarPorVaga(id, vagaSelecionadaParaInscritos!),
    enabled: !!(vagaSelecionadaParaInscritos && isOwner),
  });

  // Estado para adicionar local
  const [addingLocal, setAddingLocal] = useState(false);
  const [nomeLocal, setNomeLocal] = useState('');
  const [cep, setCep] = useState('');
  const [logradouro, setLogradouro] = useState('');
  const [bairro, setBairro] = useState('');
  const [numero, setNumero] = useState('');
  const [loadingLocal, setLoadingLocal] = useState(false);

  const handleAddLocal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nomeLocal) return;

    setLoadingLocal(true);
    try {
      await campanhasApi.adicionarLocal(id, {
        nome: nomeLocal,
        cep: cep.replace(/\D/g, ''),
        logradouro,
        bairro,
        numero,
      });
      queryClient.invalidateQueries({ queryKey: ['campanha', id] });
      setAddingLocal(false);
      setNomeLocal(''); setCep(''); setLogradouro(''); setBairro(''); setNumero('');
      alert('Ponto de arrecadação adicionado com sucesso!');
    } catch (err: any) {
      alert(err.response?.data?.mensagem || 'Erro ao adicionar local.');
    } finally {
      setLoadingLocal(false);
    }
  };

  const handleRemoveLocal = async (localId: number) => {
    if (confirm('Tem certeza que deseja remover este endereço?')) {
      try {
        await campanhasApi.removerLocal(id, localId);
        queryClient.invalidateQueries({ queryKey: ['campanha', id] });
      } catch (err) {
        alert('Erro ao remover local.');
      }
    }
  };

  const handleAddVaga = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vagaForm.funcao || !vagaForm.descricaoAtividades) return;

    setLoadingVaga(true);
    try {
      await vagasApi.criar(id, vagaForm);
      refetchVagas();
      setAddingVaga(false);
      setVagaForm({ funcao: '', descricaoAtividades: '', quantidadeVagas: 1, cargaHorariaSemanal: 0 });
      alert('Vaga criada com sucesso!');
    } catch (err: any) {
      alert(err.response?.data?.mensagem || 'Erro ao criar vaga.');
    } finally {
      setLoadingVaga(false);
    }
  };

  const handleRemoverVaga = async (codigoVaga: number) => {
    if (confirm('Tem certeza que deseja remover esta vaga?')) {
      try {
        await vagasApi.remover(id, codigoVaga);
        refetchVagas();
      } catch (err) {
        alert('Erro ao remover vaga.');
      }
    }
  };

  const handleInscrever = async (codigoVaga: number) => {
    if (!user) {
      router.push('/login');
      return;
    }
    try {
      await inscricoesApi.inscrever(id, codigoVaga);
      refetchInscricoes();
      alert('Inscrição realizada com sucesso! Aguarde a aprovação da ONG.');
    } catch (err: any) {
      alert(err.response?.data?.mensagem || 'Erro ao realizar inscrição.');
    }
  };

  const handleAtualizarStatusInscricao = async (codigoVaga: number, pessoaFisicaId: number, status: string) => {
    try {
      await inscricoesApi.atualizarStatus(id, codigoVaga, pessoaFisicaId, status);
      refetchInscritos();
    } catch (err) {
      alert('Erro ao atualizar status da inscrição.');
    }
  };

  if (isLoading) return <div className="py-20"><Spinner size="lg" /></div>;

  if (isError || !campanha) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center">
        <Card className="p-8 space-y-4">
          <Building2 className="w-16 h-16 text-rose-500 mx-auto" />
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Campanha não encontrada</h2>
          <p className="text-sm text-slate-500">A campanha pode ter sido encerrada ou não existe.</p>
          <Link href="/campanhas"><Button variant="outline" size="md">Ver Todas as Campanhas</Button></Link>
        </Card>
      </div>
    );
  }

  const locais = campanha.locais || [];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      
      {/* Voltar */}
      <Link href="/campanhas" className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-teal-600 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Voltar às Campanhas
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Principal */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="p-0 overflow-hidden border border-slate-200/80 dark:border-slate-800">
            
            {/* Capa */}
            <div className="aspect-video w-full bg-gradient-to-br from-teal-100 to-emerald-100 dark:from-teal-950 dark:to-emerald-950 flex items-center justify-center relative">
              {campanha.urlImagemCapa ? (
                <img src={`http://localhost:8080${campanha.urlImagemCapa}`} alt={campanha.titulo} className="w-full h-full object-cover" />
              ) : (
                <Building2 className="w-20 h-20 text-teal-600/30" />
              )}
              <div className="absolute top-4 left-4">
                <Badge variant="teal" size="md">{campanha.status || 'ATIVA'}</Badge>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-teal-600 dark:text-teal-400 mb-1">
                  <Building2 className="w-4 h-4" /> {campanha.nomeInstituicao || 'Instituição Beneficente'}
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                  {campanha.titulo}
                </h1>
                <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Fim: {campanha.dataFim || 'Período contínuo'}</span>
                </p>
              </div>

              {campanha.itensFoco && (
                <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200/60 dark:border-teal-800/60">
                  <h4 className="text-xs font-bold text-teal-800 dark:text-teal-300 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Package className="w-3.5 h-3.5" /> Itens de Maior Necessidade Nesta Campanha:
                  </h4>
                  <p className="text-sm text-slate-700 dark:text-slate-200 font-medium">
                    {campanha.itensFoco}
                  </p>
                </div>
              )}

              <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Sobre a Campanha e Objetivos
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                  {campanha.descricao || 'Nenhuma descrição detalhada fornecida pela ONG.'}
                </p>
              </div>
            </div>
          </Card>

          {/* Locais de Arrecadação */}
          <Card className="p-6 sm:p-8 space-y-6 border border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-teal-600" /> Pontos de Arrecadação e Coleta
                </h3>
                <p className="text-xs text-slate-500">Leve suas doações em qualquer um dos endereços abaixo</p>
              </div>
              {isOwner && (
                <Button variant="outline" size="sm" icon={<Plus className="w-4 h-4" />} onClick={() => setAddingLocal(!addingLocal)}>
                  {addingLocal ? 'Cancelar' : 'Adicionar Ponto'}
                </Button>
              )}
            </div>

            {/* Form Adicionar Local (Se dono) */}
            {addingLocal && (
              <form onSubmit={handleAddLocal} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-4 animate-in fade-in duration-200">
                <h4 className="text-xs font-bold text-teal-600 uppercase">Novo Ponto de Coleta</h4>
                <Input label="Nome do Local *" placeholder="Ex: Sede da ONG, Igreja São João..." value={nomeLocal} onChange={(e) => setNomeLocal(e.target.value)} required />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Input label="CEP" placeholder="00000-000" value={cep} onChange={(e) => setCep(e.target.value)} />
                  <div className="sm:col-span-2"><Input label="Logradouro" placeholder="Ex: Av. Brasil" value={logradouro} onChange={(e) => setLogradouro(e.target.value)} /></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Input label="Bairro" placeholder="Centro" value={bairro} onChange={(e) => setBairro(e.target.value)} />
                  <Input label="Número" placeholder="100" value={numero} onChange={(e) => setNumero(e.target.value)} />
                </div>
                <Button type="submit" variant="glow" size="md" isLoading={loadingLocal}>Salvar Ponto de Arrecadação</Button>
              </form>
            )}

            {locais.length === 0 ? (
              <div className="py-6 text-center text-slate-400 text-xs">
                Nenhum endereço físico de coleta cadastrado no momento. Entre em contato com a instituição.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {locais.map((local, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800 flex justify-between items-start relative group">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-teal-600 shrink-0" /> {local.nome}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                        {local.logradouro ? `${local.logradouro}, ${local.numero || 'S/N'}` : 'Endereço principal'}
                      </p>
                      {local.bairro && <p className="text-[11px] text-slate-400">Bairro: {local.bairro} - CEP: {local.cep}</p>}
                    </div>
                    {isOwner && local.id && (
                      <button onClick={() => handleRemoveLocal(local.id!)} className="text-slate-400 hover:text-rose-500 p-1">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Lateral: Apoiar ou Voluntariar */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="p-6 space-y-6 border-2 border-teal-500/40 shadow-xl text-center">
            <div className="w-14 h-14 bg-teal-100 dark:bg-teal-950 rounded-2xl flex items-center justify-center mx-auto text-teal-600">
              <HandHeart className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Quer apoiar com doações?</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Você pode doar os itens que a instituição solicitou para ajudar.
              </p>
            </div>
            <div className="pt-2">
              <Link href="/doacoes/nova" className="block">
                <Button variant="glow" size="lg" className="w-full font-bold shadow-lg" icon={<Heart className="w-4 h-4" />}>
                  Doar Itens para a Campanha
                </Button>
              </Link>
            </div>
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center text-xs text-emerald-600 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" /> ONG Verificada e Segura
            </div>
          </Card>

          {/* VAGAS DE VOLUNTARIADO (ROLE-BASED) */}
          <Card className="p-6 border-2 border-slate-200/80 dark:border-slate-800 shadow-lg">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-teal-600" /> Voluntariado
              </h3>
              {isOwner && (
                <Button variant="outline" size="sm" icon={<Plus className="w-3.5 h-3.5" />} onClick={() => setAddingVaga(!addingVaga)}>
                  {addingVaga ? 'Cancelar' : 'Nova Vaga'}
                </Button>
              )}
            </div>

            {/* Owner: Form to create Vaga */}
            {isOwner && addingVaga && (
              <form onSubmit={handleAddVaga} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 mb-6 space-y-3 animate-in fade-in">
                <Input label="Função *" placeholder="Ex: Motorista Solidário" value={vagaForm.funcao} onChange={(e) => setVagaForm({...vagaForm, funcao: e.target.value})} required />
                <Input label="Descrição *" placeholder="O que fará..." value={vagaForm.descricaoAtividades} onChange={(e) => setVagaForm({...vagaForm, descricaoAtividades: e.target.value})} required />
                <div className="grid grid-cols-2 gap-3">
                  <Input label="Quantidade" type="number" min={1} value={vagaForm.quantidadeVagas} onChange={(e) => setVagaForm({...vagaForm, quantidadeVagas: parseInt(e.target.value)})} required />
                  <Input label="Horas/Semana" type="number" min={0} value={vagaForm.cargaHorariaSemanal} onChange={(e) => setVagaForm({...vagaForm, cargaHorariaSemanal: parseInt(e.target.value)})} />
                </div>
                <Button type="submit" variant="glow" size="sm" className="w-full" isLoading={loadingVaga}>Cadastrar Vaga</Button>
              </form>
            )}

            {/* List Vagas */}
            {vagas.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-xs text-slate-400">Esta campanha ainda não possui vagas de voluntariado abertas.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {vagas.map(vaga => {
                  const isInscrito = !isOwner && minhasInscricoes.find(i => i.codigoVaga === vaga.codigoVaga);

                  return (
                    <div key={vaga.codigoVaga} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 relative">
                      {isOwner && (
                        <button onClick={() => handleRemoverVaga(vaga.codigoVaga!)} className="absolute top-3 right-3 text-slate-400 hover:text-rose-500 transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <h4 className="font-bold text-slate-900 dark:text-white pr-6">{vaga.funcao}</h4>
                      <p className="text-xs text-slate-500 mt-1 mb-3">{vaga.descricaoAtividades}</p>
                      
                      <div className="flex flex-wrap gap-2 text-[10px] font-semibold text-teal-700 dark:text-teal-400 mb-4">
                        <span className="bg-teal-50 dark:bg-teal-950 px-2 py-1 rounded-md flex items-center gap-1"><Users className="w-3 h-3"/> {vaga.quantidadeVagas} vagas</span>
                        <span className="bg-teal-50 dark:bg-teal-950 px-2 py-1 rounded-md flex items-center gap-1"><Clock className="w-3 h-3"/> {vaga.cargaHorariaSemanal || 0}h semanais</span>
                      </div>

                      {/* Action Button based on Role */}
                      {!isOwner ? (
                        isInscrito ? (
                          <div className={`p-2 rounded-lg border text-xs font-bold text-center flex items-center justify-center gap-1.5 ${
                            isInscrito.status === 'APROVADA' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                            isInscrito.status === 'REJEITADA' ? 'bg-rose-50 text-rose-700 border-rose-200' : 
                            'bg-amber-50 text-amber-700 border-amber-200'
                          }`}>
                            {isInscrito.status === 'APROVADA' && <UserCheck className="w-4 h-4" />}
                            {isInscrito.status === 'REJEITADA' && <XCircle className="w-4 h-4" />}
                            {isInscrito.status === 'PENDENTE' && <Clock className="w-4 h-4" />}
                            Inscrição: {isInscrito.status}
                          </div>
                        ) : (
                          <Button variant="outline" size="sm" className="w-full text-teal-600 border-teal-500/40 hover:bg-teal-50 dark:hover:bg-teal-950/40" onClick={() => handleInscrever(vaga.codigoVaga!)}>
                            Quero me Inscrever
                          </Button>
                        )
                      ) : (
                        <div>
                          <Button 
                            variant="secondary" 
                            size="sm" 
                            className="w-full text-xs" 
                            onClick={() => setVagaSelecionadaParaInscritos(vagaSelecionadaParaInscritos === vaga.codigoVaga ? null : vaga.codigoVaga!)}
                          >
                            {vagaSelecionadaParaInscritos === vaga.codigoVaga ? 'Esconder Inscritos' : 'Ver Inscritos'}
                          </Button>

                          {/* Show applicants if selected */}
                          {vagaSelecionadaParaInscritos === vaga.codigoVaga && (
                            <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                              {loadingInscritos ? (
                                <Spinner size="sm" />
                              ) : inscritosVagaSelecionada.length === 0 ? (
                                <p className="text-xs text-slate-400 text-center py-2">Nenhum voluntário inscrito ainda.</p>
                              ) : (
                                inscritosVagaSelecionada.map(inscrito => (
                                  <div key={inscrito.pessoaFisicaId} className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900 text-xs flex items-center justify-between">
                                    <div>
                                      <p className="font-bold text-slate-800 dark:text-slate-200">{inscrito.nomePessoaFisica}</p>
                                      <p className="text-[10px] text-slate-500">{inscrito.status}</p>
                                    </div>
                                    {inscrito.status === 'PENDENTE' && (
                                      <div className="flex gap-1">
                                        <button onClick={() => handleAtualizarStatusInscricao(vaga.codigoVaga!, inscrito.pessoaFisicaId!, 'APROVADA')} className="p-1.5 rounded bg-emerald-100 text-emerald-700 hover:bg-emerald-200" title="Aprovar"><UserCheck className="w-3.5 h-3.5"/></button>
                                        <button onClick={() => handleAtualizarStatusInscricao(vaga.codigoVaga!, inscrito.pessoaFisicaId!, 'REJEITADA')} className="p-1.5 rounded bg-rose-100 text-rose-700 hover:bg-rose-200" title="Rejeitar"><XCircle className="w-3.5 h-3.5"/></button>
                                      </div>
                                    )}
                                  </div>
                                ))
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>

      </div>
    </div>
  );
}
