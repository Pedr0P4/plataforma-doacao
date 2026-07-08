'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/context/AuthContext';
import { useCriarCampanhaMutation } from '@/hooks/useCampanhas';
import { criarCampanhaSchema, CriarCampanhaFormData } from '@/schemas';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Building2, Upload, Image as ImageIcon, CheckCircle2, ArrowLeft, Calendar, Users, Sparkles, ShieldCheck } from 'lucide-react';

export default function CriarCampanhaPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [imagemFile, setImagemFile] = useState<File | null>(null);
  const [imagemPreview, setImagemPreview] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState('');

  const criarCampanhaMutation = useCriarCampanhaMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CriarCampanhaFormData>({
    resolver: zodResolver(criarCampanhaSchema),
    defaultValues: {
      titulo: '',
      itensFoco: '',
      descricao: '',
      metaVoluntarios: 10,
      dataInicio: '',
      dataFim: '',
    },
  });

  if (authLoading) return null;

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center">
        <Card className="p-8 space-y-4">
          <Building2 className="w-16 h-16 text-teal-600 mx-auto" />
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Acesso Restrito a Instituições</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Apenas ONGs e Instituições cadastradas podem criar campanhas oficiais de arrecadação na plataforma.
          </p>
          <div className="pt-4 flex gap-3 justify-center">
            <Link href="/login" className="w-full"><Button variant="glow" size="md" className="w-full">Entrar</Button></Link>
            <Link href="/register" className="w-full"><Button variant="outline" size="md" className="w-full">Cadastrar ONG</Button></Link>
          </div>
        </Card>
      </div>
    );
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImagemFile(file);
      setImagemPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data: CriarCampanhaFormData) => {
    setApiError('');
    
    criarCampanhaMutation.mutate(
      { dto: data, imagemFile },
      {
        onSuccess: () => {
          setSuccess(true);
          setTimeout(() => {
            router.push('/campanhas');
          }, 1200);
        },
        onError: (err: any) => {
          setApiError(err.response?.data?.mensagem || 'Erro ao criar campanha. Verifique as permissões.');
        },
      }
    );
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-6">
      
      <Link href="/campanhas" className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-teal-600 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Voltar às Campanhas
      </Link>

      <div className="bg-gradient-to-r from-teal-700 to-emerald-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <Badge variant="teal" size="sm" className="bg-white/20 text-white border-none flex items-center gap-1 w-fit">
            <Building2 className="w-3.5 h-3.5" /> Portal de Arrecadação
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Criar Campanha de Arrecadação
          </h1>
          <p className="text-xs sm:text-sm text-teal-100 max-w-lg">
            Publique a iniciativa da sua instituição. Especifique quais itens vocês estão precisando com urgência e abra vagas para voluntários.
          </p>
        </div>
      </div>

      <Card className="shadow-2xl border-teal-500/20">
        {success ? (
          <div className="py-16 text-center space-y-4 animate-in fade-in zoom-in-95 duration-300">
            <div className="w-16 h-16 bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-teal-400 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10 animate-bounce" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Campanha Publicada com Sucesso!</h3>
            <p className="text-sm text-slate-500">Sua iniciativa já está no ar para toda a comunidade. Redirecionando...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {apiError && (
              <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 text-rose-600 text-xs font-medium">
                <span>⚠️ {apiError}</span>
              </div>
            )}

            {/* Imagem de Capa */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-teal-600" /> Imagem de Capa da Campanha
              </label>
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-6 bg-slate-50/50 dark:bg-slate-900/50 hover:border-teal-500 transition-colors relative group overflow-hidden">
                {imagemPreview ? (
                  <div className="relative w-full aspect-video rounded-xl overflow-hidden max-h-64 flex items-center justify-center bg-black/50">
                    <img src={imagemPreview} alt="Preview" className="h-full object-contain" />
                    <button type="button" onClick={() => { setImagemFile(null); setImagemPreview(null); }} className="absolute top-2 right-2 px-3 py-1 rounded-lg bg-rose-600 text-white text-xs font-bold shadow-md">
                      Trocar Foto
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer flex flex-col items-center justify-center space-y-2 w-full py-6">
                    <div className="w-12 h-12 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Upload className="w-6 h-6" />
                    </div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Clique para selecionar imagem promocional</span>
                    <span className="text-xs text-slate-400">PNG, JPG ou WEBP até 10MB</span>
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                )}
              </div>
            </div>

            <div className="border-t border-slate-200 dark:border-slate-800 pt-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-teal-600 uppercase">Dados da Campanha</span>
                <span className="text-[10px] text-slate-400 flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-emerald-500" /> Zod Schemas Ativo</span>
              </div>
              <Input label="Título da Campanha *" placeholder="Ex: Campanha do Agasalho 2026 - Aqueça um Coração" error={errors.titulo?.message} {...register('titulo')} />

              <Input label="Itens Solicitados (Foco da Arrecadação) *" placeholder="Ex: Cobertores, casacos infantis, meias, luvas..." error={errors.itensFoco?.message} {...register('itensFoco')} />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input label="Meta de Voluntários" type="number" min={0} icon={<Users className="w-4 h-4" />} error={errors.metaVoluntarios?.message} {...register('metaVoluntarios', { valueAsNumber: true })} />
                <Input label="Data de Início" type="date" icon={<Calendar className="w-4 h-4" />} error={errors.dataInicio?.message} {...register('dataInicio')} />
                <Input label="Data de Encerramento" type="date" icon={<Calendar className="w-4 h-4" />} error={errors.dataFim?.message} {...register('dataFim')} />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Descrição Detalhada e Objetivos</label>
                <textarea rows={4} placeholder="Explique para onde irão os itens, como será feita a distribuição e a relevância social da causa..." {...register('descricao')} className="w-full rounded-xl bg-slate-50/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 p-3 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-none transition-all" />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
              <Button type="submit" variant="glow" size="lg" className="w-full font-bold shadow-xl bg-teal-600 hover:bg-teal-500" isLoading={criarCampanhaMutation.isPending} icon={<Building2 className="w-5 h-5" />}>
                Publicar Campanha Oficial &rarr;
              </Button>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
}
