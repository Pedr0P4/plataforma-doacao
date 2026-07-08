'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { campanhasApi } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { Building2, PlusCircle, Calendar, Users, MapPin, ChevronLeft, ChevronRight, Sparkles, HandHeart, Package } from 'lucide-react';

export default function CampanhasCatalogPage() {
  const { user } = useAuth();
  const [page, setPage] = useState(0);

  const { data, isLoading } = useQuery({
    queryKey: ['campanhas', page],
    queryFn: () => campanhasApi.listar(page, 9),
  });

  const campanhas = data?.content || [];
  const totalPages = data?.totalPages || 1;

  const isOng = user && user.tipo === 'INSTITUICAO';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-teal-700 via-emerald-600 to-teal-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-bold uppercase tracking-wider">
            Ações Comunitárias
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Campanhas de Arrecadação de ONGs
          </h1>
          <p className="text-sm text-teal-100 max-w-xl">
            Apoie iniciativas beneficentes de instituições verificadas. Veja os itens que elas mais precisam e candidate-se como voluntário!
          </p>
        </div>

        {/* Botão para criar campanha */}
        <div className="shrink-0 relative z-10 w-full sm:w-auto">
          {isOng ? (
            <Link href="/campanhas/nova">
              <Button variant="glow" size="lg" className="w-full sm:w-auto bg-white text-teal-900 hover:bg-slate-100 font-bold shadow-2xl" icon={<PlusCircle className="w-5 h-5" />}>
                Criar Nova Campanha
              </Button>
            </Link>
          ) : user ? (
            <Link href="/register">
              <Button variant="outline" size="md" className="w-full sm:w-auto text-white border-white/40 hover:bg-white/10">
                Cadastrar ONG / Instituição
              </Button>
            </Link>
          ) : (
            <Link href="/login">
              <Button variant="glow" size="md" className="w-full sm:w-auto bg-white text-teal-900 font-bold">
                Sou uma ONG - Entrar
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Lista de Campanhas */}
      {isLoading ? (
        <Spinner size="lg" />
      ) : campanhas.length === 0 ? (
        <Card className="text-center py-20 border-dashed border-2 border-slate-300 dark:border-slate-700">
          <Building2 className="w-16 h-16 text-slate-400 mx-auto mb-4 animate-bounce" />
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Nenhuma campanha ativa no momento</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-6">
            As instituições parceiras em breve publicarão novas campanhas de arrecadação de agasalhos, alimentos e voluntariado.
          </p>
          {isOng && (
            <Link href="/campanhas/nova">
              <Button variant="glow" size="md">Criar Primeira Campanha &rarr;</Button>
            </Link>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campanhas.map((camp) => (
            <Card key={camp.id} hoverEffect className="flex flex-col justify-between h-full group border border-slate-200/80 dark:border-slate-800">
              <div>
                
                {/* Capa */}
                <div className="aspect-video w-full rounded-2xl bg-gradient-to-br from-teal-100 to-emerald-100 dark:from-teal-950/80 dark:to-emerald-950/80 mb-4 overflow-hidden relative flex items-center justify-center">
                  {camp.urlImagemCapa ? (
                    <img
                      src={`http://localhost:8080${camp.urlImagemCapa}`}
                      alt={camp.titulo}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <Building2 className="w-12 h-12 text-teal-600/40" />
                  )}
                  <div className="absolute top-3 left-3 flex gap-1.5">
                    <Badge variant="teal" size="sm">
                      {camp.status || 'ATIVA'}
                    </Badge>
                  </div>
                </div>

                {/* Info */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1 font-semibold text-teal-600 dark:text-teal-400 truncate">
                      <Building2 className="w-3.5 h-3.5" /> {camp.nomeInstituicao || 'ONG'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {camp.dataFim || 'Contínua'}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-lg text-slate-900 dark:text-white line-clamp-1 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                    {camp.titulo}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                    {camp.descricao || 'Apoie esta instituição doando itens essenciais ou atuando como voluntário social.'}
                  </p>
                </div>

                {/* Itens Foco */}
                {camp.itensFoco && (
                  <div className="p-3 rounded-xl bg-teal-50/80 dark:bg-teal-950/40 border border-teal-200/60 dark:border-teal-800/40 text-xs mb-4">
                    <span className="font-bold text-teal-800 dark:text-teal-300 block mb-0.5 flex items-center gap-1"><Package className="w-3.5 h-3.5" /> Itens Solicitados:</span>
                    <span className="text-slate-600 dark:text-slate-300 line-clamp-1">{camp.itensFoco}</span>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 mt-auto">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                  <Users className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Meta: {camp.metaVoluntarios || 10} voluntários</span>
                </div>
                <Link href={`/campanhas/${camp.id}`}>
                  <Button variant="glow" size="sm" icon={<HandHeart className="w-3.5 h-3.5" />}>
                    Apoiar
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
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
