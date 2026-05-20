'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PlayCircle, CheckCircle, Clock, Save, FileText, Loader2, Lock } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

// Critérios padrão XTAGE (peso fixo por enquanto)
const DEFAULT_CRITERIA = [
  { id: 'tecnica', name: 'Técnica', weight: 4, description: 'Salto, giro, postura, limpeza dos movimentos e afinação corporal.' },
  { id: 'coreografia', name: 'Criatividade / Coreografia', weight: 3, description: 'Criatividade, uso do espaço, formações e transições.' },
  { id: 'presenca', name: 'Presença de Palco', weight: 2, description: 'Expressividade, conexão com a música e domínio do palco.' },
  { id: 'figurino', name: 'Figurino e Trilha Sonora', weight: 1, description: 'Adequação do figurino e escolha da trilha ao estilo.' },
];

interface JudgeViewProps {
  accessCode?: string; // código temporário vindo da URL
}

export default function JudgeView({ accessCode }: JudgeViewProps) {
  const [judgeData, setJudgeData] = useState<any>(null);
  const [festival, setFestival] = useState<any>(null);
  const [choreographies, setChoreographies] = useState<any[]>([]);
  const [selectedChoreo, setSelectedChoreo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [evaluatedIds, setEvaluatedIds] = useState<Set<string>>(new Set());

  // Code login
  const [code, setCode] = useState(accessCode || '');
  const [codeError, setCodeError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Scores state: { criteriaId: value }
  const [scores, setScores] = useState<Record<string, string>>(() =>
    Object.fromEntries(DEFAULT_CRITERIA.map(c => [c.id, '']))
  );
  const [notes, setNotes] = useState('');

  const loginWithCode = useCallback(async (inputCode: string) => {
    setLoading(true);
    setCodeError('');
    const { data, error } = await supabase
      .from('festival_judges')
      .select('*, festivals(*)')
      .eq('temp_access_code', inputCode.trim().toUpperCase())
      .eq('is_active', true)
      .maybeSingle();

    if (error || !data) {
      setCodeError('Código inválido ou expirado. Verifique com o organizador.');
      setLoading(false);
      return;
    }

    setJudgeData(data);
    setFestival(data.festivals);
    setIsAuthenticated(true);
    fetchChoreographies(data.festival_id, data.id);
  }, []);

  const fetchChoreographies = useCallback(async (festivalId: string, judgeId: string) => {
    const { data: choreos } = await supabase
      .from('choreographies')
      .select(`
        *,
        schools ( name )
      `)
      .eq('festival_id', festivalId)
      .order('created_at', { ascending: true });

    // Fetch already evaluated by this judge
    const { data: existing } = await supabase
      .from('scores')
      .select('choreography_id')
      .eq('judge_id', judgeId);

    const evaluated = new Set((existing || []).map((s: any) => s.choreography_id));
    setEvaluatedIds(evaluated);
    setChoreographies(choreos || []);

    // Select the first non-evaluated one by default
    const first = (choreos || []).find(c => !evaluated.has(c.id));
    if (first) setSelectedChoreo(first);

    setLoading(false);
  }, []);

  // If accessCode is provided, try auto-login
  useEffect(() => {
    if (accessCode) {
      loginWithCode(accessCode);
    } else {
      setLoading(false);
    }
  }, [accessCode, loginWithCode]);

  const handleScoreChange = (criteriaId: string, value: string) => {
    let val = value.replace(/[^0-9.]/g, '');
    const parts = val.split('.');
    if (parts.length > 2) val = parts[0] + '.' + parts[1];
    const num = parseFloat(val);
    if (!isNaN(num) && num > 10) val = '10';
    setScores(prev => ({ ...prev, [criteriaId]: val }));
  };

  const calculateWeightedAverage = () => {
    let totalWeight = 0;
    let weightedSum = 0;
    for (const c of DEFAULT_CRITERIA) {
      const val = parseFloat(scores[c.id] || '0');
      weightedSum += val * c.weight;
      totalWeight += c.weight;
    }
    return totalWeight > 0 ? (weightedSum / totalWeight).toFixed(2) : '0.00';
  };

  const handleSubmit = async () => {
    if (!selectedChoreo || !judgeData) return;
    const allFilled = DEFAULT_CRITERIA.every(c => scores[c.id] !== '');
    if (!allFilled) {
      toast.error('Preencha todas as notas antes de enviar.');
      return;
    }

    setSubmitting(true);
    // Insert one score per criterion
    const rows = DEFAULT_CRITERIA.map(c => ({
      choreography_id: selectedChoreo.id,
      judge_id: judgeData.id,
      criteria_id: c.id, // using local id since we don't have real DB criteria rows
      score_value: parseFloat(scores[c.id]),
      judge_notes: notes || null,
    }));

    const { error } = await supabase.from('scores').insert(rows);

    if (error) {
      // If unique constraint, means already evaluated
      if (error.code === '23505') {
        toast.error('Você já avaliou esta coreografia.');
      } else {
        toast.error('Erro ao enviar notas: ' + error.message);
      }
    } else {
      toast.success('Notas enviadas com sucesso!');
      setEvaluatedIds(prev => new Set([...prev, selectedChoreo.id]));
      setScores(Object.fromEntries(DEFAULT_CRITERIA.map(c => [c.id, ''])));
      setNotes('');
      // Move to next non-evaluated
      const next = choreographies.find(c => !evaluatedIds.has(c.id) && c.id !== selectedChoreo.id);
      setSelectedChoreo(next || null);
    }
    setSubmitting(false);
  };

  // --- LOGIN SCREEN ---
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] p-6">
        <Card className="bg-[#050505] border-zinc-800 w-full max-w-sm">
          <CardHeader className="text-center">
            <div className="w-16 h-16 rounded-full bg-[#FFD700]/10 border border-[#FFD700]/30 flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-[#FFD700]" />
            </div>
            <CardTitle className="text-white text-2xl font-title">Acesso Restrito</CardTitle>
            <CardDescription className="text-zinc-400">Digite o código de acesso fornecido pelo organizador do festival.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="flex justify-center p-4"><Loader2 className="w-6 h-6 animate-spin text-zinc-500" /></div>
            ) : (
              <>
                <input
                  type="text"
                  value={code}
                  onChange={e => setCode(e.target.value.toUpperCase())}
                  className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white text-center font-mono text-xl tracking-[0.4em] focus:border-[#FFD700] focus:outline-none transition-colors"
                  placeholder="XXXXXX"
                  maxLength={8}
                  onKeyDown={e => e.key === 'Enter' && loginWithCode(code)}
                />
                {codeError && <p className="text-red-400 text-sm text-center">{codeError}</p>}
                <Button
                  onClick={() => loginWithCode(code)}
                  disabled={code.length < 4}
                  className="w-full bg-[#FFD700] hover:bg-[#FFD700]/90 text-black font-bold"
                >
                  Entrar como Jurado
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // --- LOADING ---
  if (loading) {
    return <div className="flex justify-center p-16"><Loader2 className="w-8 h-8 animate-spin text-[#FFD700]" /></div>;
  }

  const evaluated = evaluatedIds.size;
  const remaining = choreographies.length - evaluated;

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <Badge variant="outline" className="bg-purple-500/10 text-purple-400 border-purple-500/50 mb-2">
            Módulo Jurado
          </Badge>
          <h2 className="text-3xl font-title text-white mb-1">{festival?.name || 'Festival'}</h2>
          <p className="text-zinc-400 text-sm">Bem-vindo(a), <span className="text-white font-medium">{judgeData?.name}</span> · Mesa de Avaliação</p>
        </div>
        <div className="flex bg-[#050505] border border-zinc-800 rounded-lg p-3 gap-6">
          <div className="text-center">
            <p className="text-[10px] text-zinc-500 font-bold uppercase">Avaliadas</p>
            <p className="text-2xl font-mono text-green-400">{evaluated}</p>
          </div>
          <div className="w-px bg-zinc-800" />
          <div className="text-center">
            <p className="text-[10px] text-zinc-500 font-bold uppercase">Restantes</p>
            <p className="text-2xl font-mono text-[#FFD700]">{remaining}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Queue */}
        <div className="space-y-3">
          <h3 className="font-subtitle text-lg text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-zinc-400" /> Fila de Apresentação
          </h3>
          {choreographies.length === 0 ? (
            <div className="text-center py-8 border border-dashed border-zinc-800 rounded-xl">
              <p className="text-zinc-500 text-sm">Nenhuma coreografia inscrita neste festival ainda.</p>
            </div>
          ) : (
            choreographies.map(choreo => {
              const isEvaluated = evaluatedIds.has(choreo.id);
              const isSelected = selectedChoreo?.id === choreo.id;
              return (
                <div
                  key={choreo.id}
                  onClick={() => !isEvaluated && setSelectedChoreo(choreo)}
                  className={`p-4 rounded-xl border relative overflow-hidden transition-all ${
                    isSelected
                      ? 'bg-purple-500/10 border-purple-500/50'
                      : isEvaluated
                        ? 'bg-zinc-900/30 border-zinc-800 opacity-60 cursor-default'
                        : 'bg-[#050505] border-zinc-800 hover:border-zinc-600 cursor-pointer'
                  }`}
                >
                  {isSelected && <div className="absolute top-0 left-0 w-1 h-full bg-purple-500" />}
                  <div className="flex justify-between items-start gap-2">
                    <h4 className={`font-bold text-sm ${isSelected ? 'text-white' : 'text-zinc-300'}`}>{choreo.name}</h4>
                    {isEvaluated
                      ? <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                      : <Badge variant="outline" className="bg-zinc-800 text-zinc-400 border-zinc-700 text-[10px]">Pendente</Badge>
                    }
                  </div>
                  <p className="text-xs text-zinc-500 mt-1">{choreo.category}</p>
                  {choreo.schools?.name && (
                    <p className="text-xs text-zinc-600 mt-0.5">{choreo.schools.name}</p>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Evaluation Panel */}
        <div className="lg:col-span-2">
          {!selectedChoreo ? (
            <div className="h-full min-h-[300px] border-2 border-dashed border-zinc-800 rounded-xl flex items-center justify-center flex-col text-zinc-500">
              {remaining === 0 && evaluated > 0
                ? <>
                    <CheckCircle className="w-12 h-12 mb-3 text-green-500" />
                    <p className="font-bold text-white">Todas as coreografias avaliadas!</p>
                    <p className="text-sm mt-1">Obrigado pelo seu trabalho, {judgeData?.name}.</p>
                  </>
                : <>
                    <PlayCircle className="w-12 h-12 mb-3 opacity-30" />
                    <p>Selecione uma coreografia na fila.</p>
                  </>
              }
            </div>
          ) : (
            <Card className="bg-[#050505] border-zinc-800">
              <CardHeader className="pb-4 border-b border-zinc-800/50">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded bg-zinc-900 border border-zinc-800 shrink-0">
                    <PlayCircle className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-white">{selectedChoreo.name}</CardTitle>
                    <CardDescription className="text-purple-300 font-medium">{selectedChoreo.schools?.name || 'Escola'}</CardDescription>
                    <Badge variant="outline" className="bg-zinc-900 text-zinc-400 border-zinc-800 mt-2 text-xs">{selectedChoreo.category}</Badge>
                  </div>
                </div>
                {selectedChoreo.music_url && (
                  <audio controls src={selectedChoreo.music_url} className="w-full h-8 mt-4" />
                )}
              </CardHeader>

              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Score Inputs */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                      <FileText className="w-4 h-4" /> Critérios (0 a 10)
                    </h4>
                    <div className="space-y-3">
                      {DEFAULT_CRITERIA.map(c => (
                        <div key={c.id} className="flex items-center justify-between bg-zinc-900/50 border border-zinc-800 p-3 rounded-lg">
                          <div>
                            <p className="text-sm font-semibold text-white">{c.name}</p>
                            <p className="text-xs text-zinc-500">Peso {c.weight}</p>
                          </div>
                          <input
                            type="number"
                            min="0"
                            max="10"
                            step="0.1"
                            value={scores[c.id]}
                            onChange={e => handleScoreChange(c.id, e.target.value)}
                            className="w-20 text-center bg-black border-2 border-zinc-700 focus:border-[#FFD700] rounded-md py-2 text-white font-mono text-lg font-bold outline-none transition-colors"
                            placeholder="—"
                          />
                        </div>
                      ))}
                    </div>

                    {/* Weighted average preview */}
                    <div className="flex justify-between items-center px-2 pt-2 border-t border-zinc-800">
                      <span className="text-sm text-zinc-400">Média Ponderada</span>
                      <span className="text-2xl font-title text-[#FFD700] font-bold">{calculateWeightedAverage()}</span>
                    </div>
                  </div>

                  {/* Notes & Rules */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold uppercase tracking-widest text-purple-500/50">Guia Rápido</h4>
                    <div className="bg-purple-900/10 border border-purple-500/20 p-4 rounded-xl text-sm text-zinc-300 space-y-2">
                      {DEFAULT_CRITERIA.map(c => (
                        <p key={c.id}><strong className="text-purple-300">{c.name} (×{c.weight}):</strong> {c.description}</p>
                      ))}
                      <p className="text-zinc-500 italic text-xs mt-2">Use decimais (ex: 9.8, 8.5) para evitar empates.</p>
                    </div>
                  </div>
                </div>

                {/* Private Note */}
                <div className="mt-6 space-y-2">
                  <label className="text-sm font-bold text-zinc-400">Feedback Privado (opcional — entregue ao diretor)</label>
                  <textarea
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white text-sm focus:outline-none focus:border-[#FFD700] transition-colors min-h-[80px] resize-y"
                    placeholder="Deixe um comentário construtivo sobre a coreografia..."
                  />
                </div>
              </CardContent>

              <CardFooter className="bg-zinc-900/30 border-t border-zinc-800 p-4 flex justify-between items-center">
                <p className="text-xs text-zinc-500">As notas são registradas imediatamente e não podem ser alteradas.</p>
                <Button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="bg-[#FFD700] hover:bg-[#FFD700]/90 text-black font-bold px-8 shadow-[0_0_15px_rgba(255,215,0,0.3)]"
                >
                  {submitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  Enviar Notas Oficiais
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
