'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { doacoesApi } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { Search, Filter, Gift, Heart, PlusCircle, MapPin, Tag, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

const CATEGORIAS = ['TODAS', 'Vestuário', 'Alimentos', 'Eletrônicos', 'Móveis', 'Brinquedos', 'Livros', 'Eletrodomésticos', 'Outros'];

export default function DoacoesCatalogPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [busca, setBusca] = useState('');
  const [categoriaAtiva, setCategoriaAtiva] = useState('TODAS');
  const [page, setPage] = useState(0);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['doacoes', page, categoriaAtiva, busca],
    queryFn: () => doacoesApi.listarDisponiveis(page, 9, categoriaAtiva, busca),
  });

  const interesseMutation = useMutation({
    mutationFn: (id: number) => doacoesApi.demonstrarInteresse(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doacoes'] });
      alert('Interesse registrado com sucesso! O doador foi notificado e poderá escolher você para receber o item.');
    },
    onError: (err: any) => {
      alert(err.response?.data?.mensagem || 'Erro ao demonstrar interesse.');
    },
  });

  const doacoes = data?.content || [];
  const totalPages = data?.totalPages || 1;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header e Ação de Criar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-emerald-600 to-teal-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-bold uppercase tracking-wider">
            Vitrine Solidária
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Itens Disponíveis para Doação
          </h1>
          <p className="text-sm text-emerald-100 max-w-xl">
            Navegue pelos itens que pessoas generosas estão querendo doar. Demonstre interesse para entrar na lista de seleção do doador!
          </p>
        </div>
        <Link href="/doacoes/nova" className="shrink-0 relative z-10 w-full sm:w-auto">
          <Button variant="glow" size="lg" className="w-full sm:w-auto bg-white text-emerald-900 hover:bg-slate-100 font-bold shadow-2xl" icon={<PlusCircle className="w-5 h-5" />}>
            Anunciar Novo Item
          </Button>
        </Link>
      </div>

      {/* Barra de Filtros */}
      <Card className="p-4 sm:p-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          
          {/* Input de Busca */}
          <div className="w-full md:w-96">
            <Input
              placeholder="Buscar por nome do item ou descrição..."
              value={busca}
              onChange={(e) => { setBusca(e.target.value); setPage(0); }}
              icon={<Search className="w-4 h-4" />}
            />
          </div>

          {/* Filtro Rápido */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            <span className="text-xs font-semibold text-slate-500 mr-1 flex items-center gap-1 shrink-0">
              <Filter className="w-3.5 h-3.5" /> Categorias:
            </span>
            {CATEGORIAS.map((cat) => (
              <button
                key={cat}
                onClick={() => { setCategoriaAtiva(cat); setPage(0); }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
                  categoriaAtiva === cat
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Grid de Doações */}
      {isLoading ? (
        <Spinner size="lg" />
      ) : doacoes.length === 0 ? (
        <Card className="text-center py-20 border-dashed border-2 border-slate-300 dark:border-slate-700">
          <Gift className="w-16 h-16 text-slate-400 mx-auto mb-4 animate-bounce" />
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Nenhum item encontrado</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-6">
            Não encontramos itens com os filtros selecionados. Tente remover a busca por palavra-chave ou mudar a categoria.
          </p>
          <Button variant="outline" size="md" onClick={() => { setBusca(''); setCategoriaAtiva('TODAS'); }}>
            Limpar Filtros
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doacoes.map((doacao) => {
            const itemPrincipal = doacao.itens?.[0] || { nome: 'Item sem nome', descricao: 'Sem descrição', categoria: 'Geral', quantidade: 1 };
            const isOwer = user && user.id === doacao.doadorId;

            return (
              <Card key={doacao.id} hoverEffect className="flex flex-col justify-between h-full group border border-slate-200/80 dark:border-slate-800">
                <div>
                  
                  {/* Imagem */}
                  <div className="aspect-video w-full rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 mb-4 overflow-hidden relative flex items-center justify-center">
                    {doacao.urlImagem ? (
                      <img
                        src={`http://localhost:8080${doacao.urlImagem}`}
                        alt={itemPrincipal.nome}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <Gift className="w-12 h-12 text-emerald-600/30 dark:text-emerald-400/30" />
                    )}
                    <div className="absolute top-3 left-3 flex gap-1.5">
                      <Badge variant="emerald" size="sm">
                        {itemPrincipal.categoria || 'Geral'}
                      </Badge>
                      {itemPrincipal.eNovo === 'S' && (
                        <Badge variant="amber" size="sm">✨ Novo</Badge>
                      )}
                    </div>
                  </div>

                  {/* Informações */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span className="flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-400">
                        <Tag className="w-3 h-3" /> Qtd: {itemPrincipal.quantidade || 1}
                      </span>
                      <span>#ID-{doacao.id}</span>
                    </div>

                    <h3 className="font-extrabold text-lg text-slate-900 dark:text-white line-clamp-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {itemPrincipal.nome}
                    </h3>

                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                      {itemPrincipal.descricao || 'O doador não adicionou uma descrição detalhada para este item.'}
                    </p>
                  </div>
                </div>

                {/* Footer do Card / Ações */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2 mt-auto">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                      {doacao.nomeDoador ? doacao.nomeDoador.charAt(0).toUpperCase() : 'D'}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200 max-w-[100px] truncate">
                        {doacao.nomeDoador || 'Doador'}
                      </p>
                      <p className="text-[10px] text-slate-400">Doador</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {isOwer ? (
                      <Link href={`/doacoes/${doacao.id}`}>
                        <Button variant="outline" size="sm" className="font-semibold text-emerald-600 border-emerald-500/40">
                          Gerenciar Interessados &rarr;
                        </Button>
                      </Link>
                    ) : (
                      <>
                        <Link href={`/doacoes/${doacao.id}`}>
                          <Button variant="ghost" size="sm">Detalhes</Button>
                        </Link>
                        {user ? (
                          <Button
                            variant="glow"
                            size="sm"
                            onClick={() => interesseMutation.mutate(doacao.id)}
                            isLoading={interesseMutation.isPending}
                            icon={<Heart className="w-3.5 h-3.5 fill-white" />}
                          >
                            Quero
                          </Button>
                        ) : (
                          <Link href="/login">
                            <Button variant="glow" size="sm" icon={<Heart className="w-3.5 h-3.5" />}>
                              Quero
                            </Button>
                          </Link>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            icon={<ChevronLeft className="w-4 h-4" />}
          >
            Anterior
          </Button>
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 px-4">
            Página {page + 1} de {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page === totalPages - 1}
          >
            Próxima <ChevronRight className="w-4 h-4 ml-1 inline" />
          </Button>
        </div>
      )}
    </div>
  );
}
