"use client";
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus, Trash2, Calendar, Loader2 } from 'lucide-react';

interface CategoryForm {
  name: string;
  max_duration_seconds: number;
  base_fee: number;
}

interface CreateFestivalProps {
  onBack: () => void;
}

export default function CreateFestival({ onBack }: CreateFestivalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    start_date: '',
    end_date: '',
    registration_deadline: '',
    payment_cutoff_date: '',
  });

  const [categories, setCategories] = useState<CategoryForm[]>([
    { name: 'Conjunto Hip Hop', max_duration_seconds: 180, base_fee: 150 },
  ]);

  const handleAddCategory = () => {
    setCategories([...categories, { name: '', max_duration_seconds: 180, base_fee: 0 }]);
  };

  const handleRemoveCategory = (index: number) => {
    setCategories(categories.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/festivals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, categories }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Erro ao criar festival');
      }

      alert('Festival criado com sucesso!');
      onBack(); // Voltar para a lista no Dashboard
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <button onClick={onBack} className="inline-flex items-center text-zinc-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Voltar ao Painel
        </button>

        <h1 className="text-4xl md:text-5xl font-title font-black uppercase tracking-tighter mb-2 text-white">Criar Novo Festival</h1>
        <p className="text-zinc-400 mb-8 font-sans">Defina as regras, datas e valores do seu próximo grande evento.</p>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Informações Básicas */}
          <div className="bg-[#0a0a0a] xp-clip-card border border-zinc-900 rounded-none p-6">
            <h2 className="text-2xl font-black mb-4 font-title uppercase tracking-tighter text-white">Informações Gerais</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Nome do Festival</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                  placeholder="Ex: FIH2 2026, Festival de Dança de Joinville"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Descrição / Regulamento (Resumo)</label>
                <textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500 transition-colors h-24"
                  placeholder="Informações importantes para as escolas..."
                />
              </div>
            </div>
          </div>

          {/* Datas */}
          <div className="bg-[#0a0a0a] xp-clip-card border border-zinc-900 rounded-none p-6">
            <h2 className="text-2xl font-black mb-4 font-title uppercase tracking-tighter flex items-center gap-2 text-white">
              <Calendar className="w-5 h-5 text-purple-400" /> Cronograma
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Data de Início do Evento</label>
                <input type="date" required value={formData.start_date} onChange={(e) => setFormData({ ...formData, start_date: e.target.value })} className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Data de Encerramento do Evento</label>
                <input type="date" required value={formData.end_date} onChange={(e) => setFormData({ ...formData, end_date: e.target.value })} className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Fim das Inscrições (Prazo Máximo)</label>
                <input type="datetime-local" required value={formData.registration_deadline} onChange={(e) => setFormData({ ...formData, registration_deadline: e.target.value })} className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Vencimento Máximo de Pagamentos</label>
                <input type="datetime-local" required value={formData.payment_cutoff_date} onChange={(e) => setFormData({ ...formData, payment_cutoff_date: e.target.value })} className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500" />
              </div>
            </div>
          </div>

          {/* Categorias e Produtos */}
          <div className="bg-[#0a0a0a] xp-clip-card border border-zinc-900 rounded-none p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-2xl font-black font-title uppercase tracking-tighter text-white">Categorias / Coreografias</h2>
                <p className="text-sm font-sans text-zinc-400">Defina o que você vai vender e os preços.</p>
              </div>
              <Button type="button" variant="outline" onClick={handleAddCategory} className="border-purple-500 text-purple-400 hover:bg-purple-500/10">
                <Plus className="w-4 h-4 mr-2" /> Adicionar Categoria
              </Button>
            </div>

            <div className="space-y-4">
              {categories.map((cat, index) => (
                <div key={index} className="flex flex-wrap md:flex-nowrap gap-4 items-end bg-black p-4 rounded-lg border border-zinc-800">
                  <div className="flex-1 min-w-[200px]">
                    <label className="block text-xs font-medium text-zinc-500 mb-1">Nome da Categoria</label>
                    <input 
                      type="text" required
                      value={cat.name}
                      onChange={(e) => {
                        const newCats = [...categories];
                        newCats[index].name = e.target.value;
                        setCategories(newCats);
                      }}
                      className="w-full bg-transparent border-b border-zinc-700 p-2 text-white focus:border-purple-500 outline-none"
                      placeholder="Ex: Ballet Solo Profissional"
                    />
                  </div>
                  <div className="w-32">
                    <label className="block text-xs font-medium text-zinc-500 mb-1">Tempo Max (seg)</label>
                    <input 
                      type="number" required
                      value={cat.max_duration_seconds}
                      onChange={(e) => {
                        const newCats = [...categories];
                        newCats[index].max_duration_seconds = parseInt(e.target.value);
                        setCategories(newCats);
                      }}
                      className="w-full bg-transparent border-b border-zinc-700 p-2 text-white focus:border-purple-500 outline-none"
                    />
                  </div>
                  <div className="w-32">
                    <label className="block text-xs font-medium text-zinc-500 mb-1">Preço (R$)</label>
                    <input 
                      type="number" required min="0" step="0.01"
                      value={cat.base_fee}
                      onChange={(e) => {
                        const newCats = [...categories];
                        newCats[index].base_fee = parseFloat(e.target.value);
                        setCategories(newCats);
                      }}
                      className="w-full bg-transparent border-b border-zinc-700 p-2 text-white focus:border-purple-500 outline-none font-bold text-green-400"
                    />
                  </div>
                  <button type="button" onClick={() => handleRemoveCategory(index)} className="p-2 text-zinc-500 hover:text-red-400 transition-colors">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={loading} className="bg-white text-black hover:bg-zinc-200 shadow-glow-purple font-tech tracking-widest uppercase font-bold px-10 py-6 h-14 text-lg">
              {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
              {loading ? 'Salvando...' : 'Criar Festival'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
