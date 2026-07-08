'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { doacoesApi, avaliacaoApi } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { Gift, Heart, User, Building2, MapPin, CheckCircle2, ArrowLeft, Tag, Calendar, ShieldCheck, Award, Sparkles, Star, Lock, Zap, AlertTriangle, PartyPopper } from 'lucide-react';

export default function DoacaoDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const id = Number(params.id);

  // Buscar detalhes do item
  const { data: doacao, isLoading, isError } = useQuery({
    queryKey: ['doacao', id],
    queryFn: () => doacoesApi.buscarPorId(id),
    enabled: !isNaN(id),
  });

  const isOwner = user && doacao && user.id === doacao.doadorId;
  const isEfetivada = doacao && doacao.donatarioId !== null && doacao.donatarioId !== undefined;
  const isDonatario = user && doacao && user.id === doacao.donatarioId;
  
  // Buscar interessados se for o doador
  const { data: interessados = [], isLoading: loadingInteressados } = useQuery({
    queryKey: ['interessados', id],
    queryFn: () => doacoesApi.listarInteressados(id),
    enabled: !!isOwner && !isEfetivada,
  });

  // Buscar avaliações se a doação já foi efetivada
  const { data: avaliacoes = [], isLoading: loadingAvaliacoes } = useQuery({
    queryKey: ['avaliacoes', id],
    queryFn: () => avaliacaoApi.listar(id),
    enabled: !!isEfetivada,
  });

  // Estado para Avaliação
  const [nota, setNota] = useState<number>(5);
  const [comentarioAvaliacao, setComentarioAvaliacao] = useState('');
  
  const avaliacaoMutation = useMutation({
    mutationFn: () => avaliacaoApi.avaliar(id, { nota, comentario: comentarioAvaliacao }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['avaliacoes', id] });
      alert('Avaliação enviada com sucesso!');
    },
    onError: (err: any) => {
      alert(err.response?.data?.mensagem || 'Erro ao enviar avaliação.');
    }
  });

  // Estado para efetivação
  const [selectedDonatarioId, setSelectedDonatarioId] = useState<number | null>(null);
  const [localNome, setLocalNome] = useState('Ponto de Encontro Central');
  const [localCep, setLocalCep] = useState('');
  const [localLogradouro, setLocalLogradouro] = useState('');
  const [localBairro, setLocalBairro] = useState('');
  const [localNumero, setLocalNumero] = useState('');
  
  const [efetivando, setEfetivando] = useState(false);
  const [errorEfetivacao, setErrorEfetivacao] = useState('');

  // Mutação para demonstrar interesse
  const interesseMutation = useMutation({
    mutationFn: () => doacoesApi.demonstrarInteresse(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doacao', id] });
      alert('Seu interesse foi registrado! O doador recebeu uma notificação em tempo real.');
    },
    onError: (err: any) => {
      alert(err.response?.data?.mensagem || 'Erro ao registrar interesse.');
    },
  });

  const handleEfetivar = async () => {
    if (!selectedDonatarioId) {
      setErrorEfetivacao('Selecione uma pessoa ou instituição da lista de interessados.');
      return;
    }

    setEfetivando(true);
    setErrorEfetivacao('');

    try {
      await doacoesApi.efetivarDoacao(id, {
        donatarioId: selectedDonatarioId,
        localDoacao: {
          nome: localNome,
          cep: localCep,
          logradouro: localLogradouro,
          bairro: localBairro,
          numero: localNumero,
        },
      });
      queryClient.invalidateQueries({ queryKey: ['doacao', id] });
      alert('Doação efetivada com sucesso! O beneficiário foi selecionado e o item marcado como doado.');
    } catch (err: any) {
      setErrorEfetivacao(err.response?.data?.mensagem || 'Falha ao efetivar doação.');
    } finally {
      setEfetivando(false);
    }
  };

  if (isLoading) {
    return <div className="py-20"><Spinner size="lg" /></div>;
  }

  if (isError || !doacao) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center">
        <Card className="p-8 space-y-4">
          <Gift className="w-16 h-16 text-rose-500 mx-auto" />
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Doação não encontrada</h2>
          <p className="text-sm text-slate-500">Este item pode ter sido removido ou o código é inválido.</p>
          <Link href="/doacoes">
            <Button variant="outline" size="md">Voltar ao Catálogo</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const item = doacao.itens?.[0] || { nome: 'Item sem nome', descricao: 'Sem descrição', categoria: 'Geral', quantidade: 1, eNovo: 'N' };

  const myPapel = isOwner ? 'DOADOR' : (isDonatario ? 'DONATARIO' : null);
  const myAvaliacao = myPapel ? avaliacoes.find((a: any) => a.papelAvaliador === myPapel) : null;
  const otherAvaliacoes = myPapel ? avaliacoes.filter((a: any) => a.papelAvaliador !== myPapel) : avaliacoes;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      
      {/* Botão Voltar */}
      <Link href="/doacoes" className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-emerald-700 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Voltar ao Catálogo de Doações
      </Link>

      {/* Grid Principal do Item */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Esquerda: Foto e Detalhes */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-0 overflow-hidden border border-slate-200/80 dark:border-slate-800">
            <div className="aspect-video w-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center relative">
              {doacao.urlImagem ? (
                <img
                  src={`http://localhost:8080${doacao.urlImagem}`}
                  alt={item.nome}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Gift className="w-20 h-20 text-emerald-600/30" />
              )}
              <div className="absolute top-4 left-4 flex gap-2">
                <Badge variant="emerald" size="md">{item.categoria || 'Geral'}</Badge>
                {isEfetivada ? (
                  <Badge variant="rose" size="md" className="flex items-center gap-1"><Lock className="w-3.5 h-3.5" /> DOADO</Badge>
                ) : (
                  <Badge variant="teal" size="md" className="flex items-center gap-1"><Sparkles className="w-3.5 h-3.5" /> Disponível</Badge>
                )}
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                    {item.nome}
                  </h1>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-emerald-600" /> Quantidade disponível: <span className="font-bold text-slate-800 dark:text-slate-200">{item.quantidade || 1} unidade(s)</span>
                  </p>
                </div>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Descrição do Item
                </h3>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                  {item.descricao || 'Nenhuma descrição adicional foi fornecida.'}
                </p>
              </div>

              {item.motivo && (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60 space-y-1">
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Motivo da Doação:</span>
                  <p className="text-xs text-slate-800 dark:text-slate-200 font-medium">{item.motivo}</p>
                </div>
              )}

              {/* Doador Info */}
              <div className="border-t border-slate-100 dark:border-slate-800 pt-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-bold flex items-center justify-center text-sm shadow-md">
                    {doacao.nomeDoador ? doacao.nomeDoador.charAt(0).toUpperCase() : 'D'}
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Anunciado por</p>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1">
                      {doacao.nomeDoador || 'Usuário'} <ShieldCheck className="w-4 h-4 text-emerald-500 inline" />
                    </p>
                  </div>
                </div>
                <span className="text-xs text-slate-500 font-medium">ID da Doação: #{doacao.id}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Direita: Ação do Doador ou Interessado (REGRA DE NEGÓCIO) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* CASO 1: DOADO / EFETIVADO */}
          {isEfetivada ? (
            <div className="space-y-6">
              <Card className="p-6 border-2 border-emerald-500/30 shadow-xl text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white flex items-center justify-center gap-2">
                  {isDonatario ? <><PartyPopper className="w-6 h-6 text-emerald-500" /> Parabéns!</> : 'Doação Concluída!'}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {isDonatario 
                    ? 'Você foi escolhido para receber esta doação. Verifique o local de entrega abaixo e não esqueça de avaliar a experiência!'
                    : (isOwner 
                        ? 'Você concluiu esta doação com sucesso. Agradecemos a sua solidariedade!'
                        : 'Este item já foi destinado pelo doador a um dos interessados na plataforma.')
                  }
                </p>
                {doacao.nomeDonatario && !isDonatario && (
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Beneficiário Selecionado: <span className="text-emerald-600 dark:text-emerald-400">{doacao.nomeDonatario}</span>
                  </div>
                )}
                {(isOwner || isDonatario) && doacao.localDoacao && doacao.localDoacao.nome && (
                  <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 text-left space-y-2">
                    <h4 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" /> Local de Entrega Combinado
                    </h4>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{doacao.localDoacao.nome}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {doacao.localDoacao.logradouro} {doacao.localDoacao.numero} - {doacao.localDoacao.bairro}
                    </p>
                  </div>
                )}
              </Card>

              {/* Seção de Avaliações */}
              {(isOwner || isDonatario) && (
                <Card className="p-6 space-y-4 border border-slate-200 dark:border-slate-800">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Award className="w-5 h-5 text-emerald-600" />
                    Avalie a Experiência
                  </h3>
                  
                  {!myAvaliacao ? (
                    <div className="space-y-4 pt-2">
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Como foi sua experiência com o {isOwner ? 'beneficiário' : 'doador'}?
                      </p>
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} 
                            onClick={() => setNota(star)}
                            className={`w-8 h-8 cursor-pointer transition-colors ${
                              nota >= star ? 'text-amber-400 fill-amber-400' : 'text-slate-300 dark:text-slate-700'
                            }`}
                          />
                        ))}
                      </div>
                      <Input
                        label="Comentário (opcional)"
                        value={comentarioAvaliacao}
                        onChange={(e) => setComentarioAvaliacao(e.target.value)}
                        placeholder="Deixe um elogio ou observação..."
                      />
                      <Button 
                        variant="glow" 
                        className="w-full font-bold"
                        onClick={() => avaliacaoMutation.mutate()}
                        isLoading={avaliacaoMutation.isPending}
                      >
                        Enviar Avaliação
                      </Button>
                    </div>
                  ) : (
                    <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-100 dark:border-emerald-900/50 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                          Sua Avaliação
                        </span>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                              key={star} 
                              className={`w-4 h-4 ${myAvaliacao.nota >= star ? 'text-amber-400 fill-amber-400' : 'text-slate-300 dark:text-slate-700'}`}
                            />
                          ))}
                        </div>
                      </div>
                      {myAvaliacao.comentario && (
                        <p className="text-sm text-slate-700 dark:text-slate-300 italic">"{myAvaliacao.comentario}"</p>
                      )}
                    </div>
                  )}

                  {otherAvaliacoes.length > 0 && (
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                      <h4 className="text-xs font-bold text-slate-500 uppercase">Avaliação Recebida</h4>
                      {otherAvaliacoes.map((av: any) => (
                        <div key={av.id} className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                              {av.papelAvaliador === 'DOADOR' ? 'O Doador disse:' : 'O Beneficiário disse:'}
                            </span>
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star 
                                  key={star} 
                                  className={`w-3.5 h-3.5 ${av.nota >= star ? 'text-amber-400 fill-amber-400' : 'text-slate-300 dark:text-slate-700'}`}
                                />
                              ))}
                            </div>
                          </div>
                          {av.comentario && (
                            <p className="text-sm text-slate-600 dark:text-slate-400 italic">"{av.comentario}"</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              )}
            </div>
          ) : isOwner ? (
            /* CASO 2: VISAO DO DOADOR -> ESCOLHER BENEFICIÁRIO */
            <Card className="p-6 space-y-6 border-2 border-emerald-500/40 shadow-xl">
              <div className="space-y-1 border-b border-slate-200 dark:border-slate-800 pb-4">
                <Badge variant="emerald" size="sm" className="mb-1 flex items-center gap-1 w-fit"><Zap className="w-3 h-3" /> Área do Doador</Badge>
                <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                  Selecionar Beneficiário
                </h2>
                <p className="text-xs text-slate-500">
                  Veja abaixo quem demonstrou interesse em seu item. Escolha uma pessoa ou ONG e efetive a doação!
                </p>
              </div>

              {loadingInteressados ? (
                <Spinner size="md" />
              ) : interessados.length === 0 ? (
                <div className="py-8 text-center space-y-2">
                  <Heart className="w-10 h-10 text-slate-300 mx-auto" />
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                    Ainda não há interessados nesta doação.
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Assim que alguém clicar em "Tenho Interesse", você receberá uma notificação em tempo real no topo da tela e eles aparecerão aqui.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Interessados ({interessados.length})
                  </h3>

                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    {interessados.map((interessado) => (
                      <label
                        key={interessado.id}
                        onClick={() => setSelectedDonatarioId(interessado.id!)}
                        className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                          selectedDonatarioId === interessado.id
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 ring-2 ring-emerald-500/20'
                            : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-emerald-400'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <input
                            type="radio"
                            name="donatario"
                            checked={selectedDonatarioId === interessado.id}
                            onChange={() => setSelectedDonatarioId(interessado.id!)}
                            className="text-emerald-600 focus:ring-emerald-500"
                          />
                          <div>
                            <p className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1">
                              {interessado.nome}
                              {interessado.tipo === 'INSTITUICAO' ? (
                                <Badge variant="teal" size="sm">ONG</Badge>
                              ) : (
                                <Badge variant="slate" size="sm">PF</Badge>
                              )}
                            </p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400">{interessado.email}</p>
                          </div>
                        </div>
                        <Award className={`w-4 h-4 ${selectedDonatarioId === interessado.id ? 'text-emerald-600' : 'text-slate-300'}`} />
                      </label>
                    ))}
                  </div>

                  {/* Detalhes de Efetivação / Local */}
                  {selectedDonatarioId && (
                    <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3 animate-in fade-in duration-200">
                      <h4 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" /> Local de Entrega / Encontro
                      </h4>
                      <Input
                        label="Nome do Local (ou Endereço)"
                        value={localNome}
                        onChange={(e) => setLocalNome(e.target.value)}
                        placeholder="Ex: Portaria do Prédio, Shopping Central..."
                      />

                      {errorEfetivacao && (
                        <p className="text-xs text-rose-500 font-medium flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5" /> {errorEfetivacao}</p>
                      )}

                      <Button
                        variant="glow"
                        size="lg"
                        className="w-full font-bold shadow-xl"
                        onClick={handleEfetivar}
                        isLoading={efetivando}
                      >
                        Confirmar Beneficiário e Efetivar Doação &rarr;
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </Card>
          ) : (
            /* CASO 3: VISAO DO VISITANTE / INTERESSADO */
            <Card className="p-6 space-y-6 shadow-xl border border-slate-200/80 dark:border-slate-800">
              <div className="space-y-2 text-center pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                  <Heart className="w-6 h-6 fill-emerald-600/20" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Gostou ou precisa deste item?
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Ao clicar em <strong>Tenho Interesse</strong>, seu nome será enviado ao doador. Ele analisará a lista e escolherá a quem entregará a doação!
                </p>
              </div>

              {user ? (
                <Button
                  variant="glow"
                  size="lg"
                  className="w-full font-bold text-base shadow-xl"
                  onClick={() => interesseMutation.mutate()}
                  isLoading={interesseMutation.isPending}
                  icon={<Heart className="w-5 h-5 fill-white" />}
                >
                  Demonstrar Interesse Agora
                </Button>
              ) : (
                <div className="space-y-3 text-center">
                  <Link href="/login">
                    <Button variant="glow" size="lg" className="w-full font-bold">
                      Fazer Login para Pedir Item
                    </Button>
                  </Link>
                  <p className="text-xs text-slate-500 font-medium">
                    Não tem conta? <Link href="/register" className="text-emerald-600 hover:underline">Cadastre-se grátis</Link>
                  </p>
                </div>
              )}

              <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-3.5 text-xs text-slate-700 dark:text-slate-300 space-y-1.5 border border-slate-200/50 dark:border-slate-800/50">
                <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Dica de Segurança:
                </span>
                <p className="text-xs leading-relaxed">
                  Nunca realize pagamentos de frete ou taxas para receber uma doação. Toda a plataforma é 100% gratuita.
                </p>
              </div>
            </Card>
          )}

          {/* Campanhas e Voluntariado Banner lateral */}
          <div className="rounded-2xl p-5 bg-gradient-to-r from-teal-600 to-emerald-600 text-white border-none shadow-lg text-center space-y-3">
            <h4 className="font-bold text-sm">Você representa uma ONG ou Projeto Social?</h4>
            <p className="text-xs text-teal-100 leading-relaxed font-medium">
              Crie uma campanha de arrecadação personalizada e convide voluntários para sua causa.
            </p>
            <Link href="/campanhas/nova">
              <button className="px-4 py-2 rounded-xl bg-white text-teal-900 font-bold text-xs shadow hover:bg-slate-100 transition-all">
                Criar Campanha de ONG &rarr;
              </button>
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
