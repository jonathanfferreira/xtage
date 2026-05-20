'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Check, ChevronRight, Save, Ticket, Loader2, MapPin, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';

const STEPS = [
  { id: 1, label: 'Informações Básicas' },
  { id: 2, label: 'Data e Local' },
  { id: 3, label: 'Produtor & Ingressos' },
];

interface FormData {
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  venue_name: string;
  city: string;
  state: string;
  full_address: string;
  producer_name: string;
  producer_description: string;
}

const INITIAL_FORM: FormData = {
  name: '',
  description: '',
  start_date: '',
  end_date: '',
  venue_name: '',
  city: '',
  state: '',
  full_address: '',
  producer_name: '',
  producer_description: '',
};

// Componente de autocompletar endereço usando ViaCEP + busca textual
function AddressAutocomplete({ onSelect }: { onSelect: (data: { city: string; state: string; full_address: string }) => void }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Usa a API pública do OpenStreetMap/Nominatim para geocoding (sem chave necessária)
  const searchAddress = useCallback(async (text: string) => {
    if (text.length < 5) { setSuggestions([]); return; }
    setLoading(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(text)}&countrycodes=br&limit=5&addressdetails=1`,
        { headers: { 'Accept-Language': 'pt-BR' } }
      );
      const data = await res.json();
      setSuggestions(data.map((r: any) => r.display_name));

      // Guarda dados estruturados para preenchimento automático
      (window as any).__nominatim_cache__ = data;
      setShowDropdown(true);
    } catch {
      // fallback silencioso
    } finally {
      setLoading(false);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => searchAddress(val), 600);
  };

  const handleSelect = (displayName: string) => {
    const cache = (window as any).__nominatim_cache__ || [];
    const found = cache.find((r: any) => r.display_name === displayName);
    const addr = found?.address || {};
    onSelect({
      city: addr.city || addr.town || addr.village || addr.municipality || '',
      state: addr.state || '',
      full_address: displayName,
    });
    setQuery(displayName);
    setShowDropdown(false);
  };

  return (
    <div className="relative">
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
        <input
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
          placeholder="Ex: Teatro Guaíra, Curitiba..."
          className="w-full bg-zinc-900/50 border border-zinc-800 focus:border-purple-500 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none transition-colors"
        />
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 animate-spin" />
        )}
      </div>

      {showDropdown && suggestions.length > 0 && (
        <ul className="absolute z-50 top-full left-0 right-0 mt-1 bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl">
          {suggestions.map((s, i) => (
            <li
              key={i}
              onMouseDown={() => handleSelect(s)}
              className="px-4 py-3 text-sm text-zinc-300 hover:bg-zinc-800 cursor-pointer flex items-start gap-2 border-b border-zinc-800/50 last:border-none"
            >
              <MapPin className="w-3 h-3 text-zinc-500 mt-0.5 flex-shrink-0" />
              <span className="line-clamp-2">{s}</span>
            </li>
          ))}
        </ul>
      )}
      <p className="text-xs text-zinc-600 mt-2">Busca automática de endereços no Brasil via OpenStreetMap</p>
    </div>
  );
}

export default function NovoEventoWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const update = (field: keyof FormData, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleNext = () => {
    if (currentStep < STEPS.length) setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    // Verifica sessão
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError('Você precisa estar autenticado para criar um evento.');
      setLoading(false);
      return;
    }

    const locationString = [form.venue_name, form.city, form.state].filter(Boolean).join(', ');

    const { data, error: insertError } = await supabase
      .from('festivals')
      .insert({
        organizer_id: user.id,
        name: form.name,
        description: form.description,
        start_date: form.start_date || null,
        end_date: form.end_date || null,
        location: locationString,
        status: 'published',
      })
      .select()
      .single();

    if (insertError) {
      setError(`Erro ao publicar: ${insertError.message}`);
      setLoading(false);
      return;
    }

    setLoading(false);
    router.push('/');
  };

  const inputClass = "w-full bg-zinc-900/50 border border-zinc-800 focus:border-purple-500 rounded-xl px-4 py-3 text-white focus:outline-none transition-colors";

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col">
      {/* Header */}
      <header className="h-20 border-b border-zinc-900 bg-black/80 flex items-center px-4 md:px-8 sticky top-0 z-50 backdrop-blur-md">
        <div className="flex-1 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full bg-zinc-900 hover:bg-zinc-800 flex items-center justify-center transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-zinc-400" />
          </button>
          <h1 className="font-title text-xl font-black uppercase tracking-widest">
            Criar Evento Presencial
          </h1>
        </div>

        {/* Stepper Visual */}
        <div className="hidden md:flex items-center gap-2 mr-8">
          {STEPS.map((step, idx) => (
            <React.Fragment key={step.id}>
              <div className={`flex items-center gap-2 ${currentStep >= step.id ? 'text-white' : 'text-zinc-600'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  currentStep > step.id ? 'bg-purple-600 text-white' :
                  currentStep === step.id ? 'bg-zinc-100 text-black' : 'bg-zinc-900 text-zinc-500 border border-zinc-800'
                }`}>
                  {currentStep > step.id ? <Check className="w-3 h-3" /> : step.id}
                </div>
                <span className="text-xs font-tech tracking-widest uppercase">{step.label}</span>
              </div>
              {idx < STEPS.length - 1 && <ChevronRight className="w-4 h-4 text-zinc-800" />}
            </React.Fragment>
          ))}
        </div>
      </header>

      {/* Main Form */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 md:p-8">
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">

          {/* Error Banner */}
          {error && (
            <div className="bg-red-950/50 border border-red-800 rounded-xl px-4 py-3 flex items-start gap-3 text-sm text-red-300">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* STEP 1: Informações Básicas */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-title font-black text-white uppercase mb-1">Informações do Evento</h2>
                <p className="text-zinc-400 text-sm">Preencha os detalhes fundamentais para atrair bailarinos e público.</p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-tech tracking-widest uppercase text-zinc-500 mb-2">Nome do Evento *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => update('name', e.target.value)}
                    placeholder="Ex: Festival Internacional de Hip Hop"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-tech tracking-widest uppercase text-zinc-500 mb-2">Descrição</label>
                  <textarea
                    rows={4}
                    value={form.description}
                    onChange={(e) => update('description', e.target.value)}
                    placeholder="Conte sobre as categorias, premiações e diferenciais da sua produção!"
                    className={`${inputClass} resize-none`}
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Data & Local */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-title font-black text-white uppercase mb-1">Onde e Quando?</h2>
                <p className="text-zinc-400 text-sm">Defina as datas de acontecimento e o local exato do teatro ou ginásio.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-tech tracking-widest uppercase text-zinc-500 mb-2">Data de Início *</label>
                  <input
                    type="date"
                    value={form.start_date}
                    onChange={(e) => update('start_date', e.target.value)}
                    className={`${inputClass} [color-scheme:dark]`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-tech tracking-widest uppercase text-zinc-500 mb-2">Data de Término *</label>
                  <input
                    type="date"
                    value={form.end_date}
                    onChange={(e) => update('end_date', e.target.value)}
                    className={`${inputClass} [color-scheme:dark]`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-tech tracking-widest uppercase text-zinc-500 mb-2">Buscar Local do Evento *</label>
                <AddressAutocomplete
                  onSelect={({ city, state, full_address }) => {
                    update('city', city);
                    update('state', state);
                    update('full_address', full_address);
                  }}
                />
              </div>

              {/* Campos manuais (preenchidos pelo autocomplete ou pelo usuário) */}
              <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-4 space-y-4">
                <p className="text-xs font-tech tracking-widest uppercase text-zinc-600">Confirmar / editar manualmente</p>
                <input
                  type="text"
                  value={form.venue_name}
                  onChange={(e) => update('venue_name', e.target.value)}
                  placeholder="Nome do Teatro ou Ginásio"
                  className="w-full bg-transparent border-b border-zinc-800 focus:border-purple-500 pb-2 text-white focus:outline-none transition-colors"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) => update('city', e.target.value)}
                    placeholder="Cidade"
                    className="w-full bg-transparent border-b border-zinc-800 focus:border-purple-500 pb-2 text-white focus:outline-none transition-colors"
                  />
                  <input
                    type="text"
                    value={form.state}
                    onChange={(e) => update('state', e.target.value)}
                    placeholder="Estado (UF)"
                    className="w-full bg-transparent border-b border-zinc-800 focus:border-purple-500 pb-2 text-white focus:outline-none transition-colors"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Produtor */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-title font-black text-white uppercase mb-1">Produtor e Configurações</h2>
                <p className="text-zinc-400 text-sm">Informações públicas de quem assina o evento.</p>
              </div>

              <div className="p-6 border border-zinc-800 rounded-2xl bg-zinc-900/20 space-y-4">
                <h3 className="text-sm font-bold text-white">Sobre o Produtor</h3>
                <input
                  type="text"
                  value={form.producer_name}
                  onChange={(e) => update('producer_name', e.target.value)}
                  placeholder="Nome da Produtora ou Organizador"
                  className={inputClass}
                />
                <textarea
                  rows={2}
                  value={form.producer_description}
                  onChange={(e) => update('producer_description', e.target.value)}
                  placeholder="Descrição da empresa (opcional)"
                  className={`${inputClass} resize-none`}
                />
              </div>

              <div className="p-6 border border-purple-500/30 rounded-2xl bg-purple-900/10">
                <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                  <Ticket className="w-5 h-5 text-purple-400" /> Ingressos & Taxas
                </h3>
                <p className="text-xs text-zinc-400 mb-4">
                  Os lotes de inscrição e o split de pagamento serão configurados no painel do evento após a publicação.
                </p>
                <div className="flex items-center gap-2 text-sm text-zinc-300 bg-black/40 p-3 rounded-lg border border-zinc-800">
                  <div className="w-4 h-4 rounded-full border border-purple-500 flex-shrink-0 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-purple-500" />
                  </div>
                  Modo Visibilidade: Público — aparece no Hub de Descoberta
                </div>
              </div>

              {/* Resumo */}
              {form.name && (
                <div className="p-4 border border-zinc-800 rounded-xl bg-zinc-900/20 space-y-2">
                  <p className="text-xs font-tech tracking-widest uppercase text-zinc-600">Resumo do Evento</p>
                  <p className="text-white font-bold">{form.name}</p>
                  {form.start_date && <p className="text-sm text-zinc-400">{form.start_date}{form.end_date && ` → ${form.end_date}`}</p>}
                  {(form.city || form.venue_name) && (
                    <p className="text-sm text-zinc-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {[form.venue_name, form.city, form.state].filter(Boolean).join(', ')}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Bottom Bar */}
      <div className="h-20 border-t border-zinc-900 bg-black/90 backdrop-blur-md sticky bottom-0 z-50 flex items-center justify-between px-4 md:px-8">
        <Button
          variant="ghost"
          onClick={handlePrev}
          disabled={currentStep === 1 || loading}
          className="text-zinc-400 hover:text-white"
        >
          Voltar etapa
        </Button>

        <div className="flex items-center gap-4">
          {currentStep < STEPS.length ? (
            <Button
              onClick={handleNext}
              disabled={currentStep === 1 && !form.name}
              className="bg-white text-black hover:bg-zinc-200 px-8 disabled:opacity-40"
            >
              Avançar
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Publicando...</>
              ) : (
                <><Save className="w-4 h-4 mr-2" /> Publicar Evento</>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
