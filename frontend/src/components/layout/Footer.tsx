import React from 'react';
import Link from 'next/link';
import { Gift, Heart, Sparkles, Globe, Share2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-white dark:bg-slate-900/80 border-t border-slate-200 dark:border-slate-800/80 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand info */}
          <div className="md:col-span-1 space-y-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
                <Gift className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                Doa+ Brasil
              </span>
            </Link>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              A plataforma definitiva para conectar generosidade a quem realmente precisa. Promovendo economia circular, solidariedade e impacto socioambiental na sua comunidade.
            </p>
            <div className="flex gap-3 pt-2 text-slate-400">
              <a href="#" className="hover:text-emerald-500 transition-colors"><Globe className="w-4 h-4" /></a>
              <a href="#" className="hover:text-emerald-500 transition-colors"><Share2 className="w-4 h-4" /></a>
            </div>
          </div>

          {/* Links rápidos */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">Navegação</h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li><Link href="/" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Início</Link></li>
              <li><Link href="/doacoes" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Explorar Doações</Link></li>
              <li><Link href="/campanhas" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Campanhas de ONGs</Link></li>
              <li><Link href="/register" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Cadastre-se</Link></li>
            </ul>
          </div>

          {/* Categorias de Doação */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">Categorias Populares</h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li><Link href="/doacoes?categoria=Vestuário" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Roupas e Agasalhos</Link></li>
              <li><Link href="/doacoes?categoria=Eletrônicos" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Eletrônicos e Informática</Link></li>
              <li><Link href="/doacoes?categoria=Alimentos" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Alimentos Não Perecíveis</Link></li>
              <li><Link href="/doacoes?categoria=Móveis" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Móveis e Eletrodomésticos</Link></li>
            </ul>
          </div>

          {/* Newsletter / Impacto */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">Faça a Diferença Hoje</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 leading-relaxed">
              Tem um item parado em casa? Cadastre agora em menos de 1 minuto e mude o dia de alguém!
            </p>
            <Link href="/doacoes/nova">
              <button className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs shadow-lg shadow-emerald-600/20 transition-all">
                Quero Doar Um Item &rarr;
              </button>
            </Link>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4">
          <p>&copy; {new Date().getFullYear()} Doa+ Brasil. Todos os direitos reservados.</p>
          <p className="flex items-center gap-1">
            Feito com <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> para transformar o mundo.
          </p>
        </div>
      </div>
    </footer>
  );
};
