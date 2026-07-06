'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/context/AuthContext';
import { useCriarDoacaoMutation } from '@/hooks/useDoacoes';
import { criarDoacaoSchema, CriarDoacaoFormData } from '@/schemas';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Gift, Upload, Image as ImageIcon, CheckCircle2, ArrowLeft, Tag, FileText, Sparkles, ShieldCheck } from 'lucide-react';

const CATEGORIAS = ['Vestuário', 'Alimentos', 'Eletrônicos', 'Móveis', 'Brinquedos', 'Livros', 'Eletrodomésticos', 'Outros'];

export default function CriarDoacaoPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [imagemFile, setImagemFile] = useState<File | null>(null);
  const [imagemPreview, setImagemPreview] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState('');

  const criarDoacaoMutation = useCriarDoacaoMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CriarDoacaoFormData>({
    resolver: zodResolver(criarDoacaoSchema),
    defaultValues: {
      nome: '',
      quantidade: 1,
      categoria: 'Vestuário',
      descricao: '',
      motivo: '',
      eNovo: 'N',
    },
  });

  if (authLoading) return null;

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center">
        <Card className="p-8 space-y-4">
          <Gift className="w-16 h-16 text-emerald-600 mx-auto animate-bounce" />
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Acesso Restrito</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Você precisa estar logado em sua conta para cadastrar itens para doação na comunidade.
          </p>
          <div className="pt-4 flex gap-3 justify-center">
            <Link href="/login" className="w-full"><Button variant="glow" size="md" className="w-full">Entrar Agora</Button></Link>
            <Link href="/register" className="w-full"><Button variant="outline" size="md" className="w-full">Criar Conta</Button></Link>
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

  const onSubmit = async (data: CriarDoacaoFormData) => {
    setApiError('');
    
    const dto = {
      itens: [
        {
          nome: data.nome,
          quantidade: Number(data.quantidade) || 1,
          categoria: data.categoria,
          descricao: data.descricao || '',
          motivo: data.motivo || '',
          eNovo: data.eNovo,
        },
      ],
    };

    criarDoacaoMutation.mutate(
      { dto, imagemFile },
      {
        onSuccess: () => {
          setSuccess(true);
          setTimeout(() => {
            router.push('/doacoes');
          }, 1200);
        },
        onError: (err: any) => {
          setApiError(err.response?.data?.mensagem || 'Erro ao cadastrar doação. Verifique os dados informados.');
        },
      }
    );
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-6">
      
      <Link href="/doacoes" className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-emerald-600 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Voltar ao Catálogo
      </Link>

      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <Badge variant="emerald" size="sm" className="bg-white/20 text-white border-none">
            ⚡ Rápido e Gratuito
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Anunciar Item para Doação
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-lg">
            Preencha os detalhes do item que deseja doar. Assim que publicado, pessoas interessadas entrarão na sua lista de seleção!
          </p>
        </div>
      </div>

      <Card className="shadow-2xl border-emerald-500/20">
        {success ? (
          <div className="py-16 text-center space-y-4 animate-in fade-in zoom-in-95 duration-300">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10 animate-bounce" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Doação Cadastrada com Sucesso!</h3>
            <p className="text-sm text-slate-500">Seu item já está visível para a comunidade. Redirecionando...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {apiError && (
              <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 text-rose-600 text-xs font-medium flex items-center gap-2">
                <span>⚠️ {apiError}</span>
              </div>
            )}

            {/* Upload de Imagem */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-emerald-600" /> Foto do Item <span className="text-[11px] text-slate-400 font-normal">(Recomendado)</span>
              </label>
              
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-6 bg-slate-50/50 dark:bg-slate-900/50 hover:border-emerald-500 transition-colors relative group overflow-hidden">
                {imagemPreview ? (
                  <div className="relative w-full aspect-video rounded-xl overflow-hidden max-h-64 flex items-center justify-center bg-black/50">
                    <img src={imagemPreview} alt="Preview" className="h-full object-contain" />
                    <button type="button" onClick={() => { setImagemFile(null); setImagemPreview(null); }} className="absolute top-2 right-2 px-3 py-1 rounded-lg bg-rose-600 text-white text-xs font-bold shadow-md hover:bg-rose-700">
                      Trocar Foto
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer flex flex-col items-center justify-center space-y-2 w-full py-6">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Upload className="w-6 h-6" />
                    </div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Clique para enviar uma imagem ou arraste aqui</span>
                    <span className="text-xs text-slate-400">PNG, JPG ou WEBP até 10MB</span>
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                )}
              </div>
            </div>

            <div className="border-t border-slate-200 dark:border-slate-800 pt-4">
              <h3 className="text-sm font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-4 flex items-center justify-between">
                <span>Informações do Item</span>
                <span className="text-[10px] font-normal text-slate-400 flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-emerald-500" /> Validação Zod Ativa</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Nome do Item *" placeholder="Ex: Mesa de Jantar 4 Lugares" error={errors.nome?.message} {...register('nome')} />
                <Input label="Quantidade *" type="number" min={1} error={errors.quantidade?.message} {...register('quantidade', { valueAsNumber: true })} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Categoria *</label>
                  <select {...register('categoria')} className="w-full rounded-xl bg-slate-50/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700/80 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 outline-none transition-all">
                    {CATEGORIAS.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  {errors.categoria && <p className="text-xs text-rose-500 mt-1">{errors.categoria.message}</p>}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Estado de Conservação *</label>
                  <select {...register('eNovo')} className="w-full rounded-xl bg-slate-50/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700/80 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 outline-none transition-all">
                    <option value="N">Usado em Bom Estado</option>
                    <option value="S">Novo / Sem Uso</option>
                  </select>
                </div>
              </div>

              <div className="mt-4 space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Descrição Detalhada do Item</label>
                  <textarea rows={3} placeholder="Especifique dimensões, cor, marca ou eventuais marcas de uso..." {...register('descricao')} className="w-full rounded-xl bg-slate-50/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700/80 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 p-3 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-none transition-all" />
                </div>

                <Input label="Motivo da Doação (Opcional)" placeholder="Ex: Reforma da casa, mudança de cidade..." error={errors.motivo?.message} {...register('motivo')} />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
              <Button type="submit" variant="glow" size="lg" className="w-full font-bold shadow-xl" isLoading={criarDoacaoMutation.isPending} icon={<Gift className="w-5 h-5" />}>
                Publicar Doação na Comunidade &rarr;
              </Button>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
}
