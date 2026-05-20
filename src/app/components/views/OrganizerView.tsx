'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Users, DollarSign, Clock, CheckCircle, Ticket, Calendar, Loader2, ArrowUpRight, ShieldCheck, Wallet, Gavel, Star, ClipboardList, Sparkles, Bot, RefreshCw, X } from 'lucide-react';
import CreateFestival from './CreateFestival';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

type Tab = 'dashboard' | 'finance' | 'evaluation' | 'ai_agents';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
  approved: 'bg-green-500/20 text-green-400 border-green-500/50',
  paid: 'bg-neon-gradient text-white border-transparent',
  cancelled: 'bg-red-500/20 text-red-400 border-red-500/50',
};

const statusLabel: Record<string, string> = {
  pending: 'Pendente',
  approved: 'Aprovado',
  paid: 'Pago',
  cancelled: 'Cancelado',
};

export default function OrganizerView() {
  const [view, setView] = useState<'overview' | 'create'>('overview');
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [festivals, setFestivals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFestival, setSelectedFestival] = useState<any>(null);

  // Metrics
  const [inscriptions, setInscriptions] = useState<any[]>([]);
  const [loadingInscriptions, setLoadingInscriptions] = useState(false);

  // Judges
  const [judges, setJudges] = useState<any[]>([]);
  const [loadingJudges, setLoadingJudges] = useState(false);
  const [newJudgeName, setNewJudgeName] = useState('');
  const [isAddingJudge, setIsAddingJudge] = useState(false);

  // Stripe
  const [connectingStripe, setConnectingStripe] = useState(false);
  const [stripeConnected, setStripeConnected] = useState(false);

  const fetchFestivals = useCallback(async () => {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      const { data } = await supabase
        .from('festivals')
        .select('*')
        .eq('organizer_id', session.user.id)
        .order('created_at', { ascending: false });
      
      if (data) {
        setFestivals(data);
        if (data.length > 0 && !selectedFestival) {
          setSelectedFestival(data[0]);
        }
      }

      // Check Stripe status
      const { data: profile } = await supabase
        .from('profiles')
        .select('stripe_account_id')
        .eq('id', session.user.id)
        .single();
      setStripeConnected(!!profile?.stripe_account_id);
    }
    setLoading(false);
  }, [selectedFestival]);

  const fetchInscriptions = useCallback(async (festivalId: string) => {
    setLoadingInscriptions(true);
    const { data } = await supabase
      .from('inscriptions')
      .select(`
        *,
        profiles!inscriptions_dancer_id_fkey ( full_name ),
        schools ( name )
      `)
      .eq('festival_id', festivalId)
      .order('created_at', { ascending: false });
    setInscriptions(data || []);
    setLoadingInscriptions(false);
  }, []);

  const fetchJudges = useCallback(async (festivalId: string) => {
    setLoadingJudges(true);
    const { data } = await supabase
      .from('festival_judges')
      .select('*')
      .eq('festival_id', festivalId)
      .order('created_at', { ascending: false });
    setJudges(data || []);
    setLoadingJudges(false);
  }, []);

  useEffect(() => {
    if (view === 'overview') {
      fetchFestivals();
    }
  }, [view]);

  useEffect(() => {
    if (selectedFestival) {
      fetchInscriptions(selectedFestival.id);
      fetchJudges(selectedFestival.id);
    }
  }, [selectedFestival, fetchInscriptions, fetchJudges]);

  const handleStripeConnect = async () => {
    setConnectingStripe(true);
    try {
      const resp = await fetch('/api/stripe/connect', { method: 'POST' });
      const data = await resp.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error(data.error || 'Erro ao conectar Stripe');
      }
    } catch {
      toast.error('Erro de rede ao conectar Stripe');
    }
    setConnectingStripe(false);
  };

  const handleAddJudge = async () => {
    if (!newJudgeName.trim() || !selectedFestival) return;
    setIsAddingJudge(true);
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    const { data, error } = await supabase.from('festival_judges').insert([{
      festival_id: selectedFestival.id,
      name: newJudgeName.trim(),
      temp_access_code: code,
      is_active: true,
    }]).select();

    if (error) {
      toast.error('Erro ao adicionar jurado: ' + error.message);
    } else {
      toast.success(`Jurado adicionado! Código de acesso: ${code}`);
      setNewJudgeName('');
      fetchJudges(selectedFestival.id);
    }
    setIsAddingJudge(false);
  };

  const handleDeleteJudge = async (id: string) => {
    await supabase.from('festival_judges').delete().eq('id', id);
    fetchJudges(selectedFestival.id);
  };

  // Metrics
  const totalInscriptions = inscriptions.length;
  const paidInscriptions = inscriptions.filter(i => i.status === 'paid').length;
  const pendingInscriptions = inscriptions.filter(i => i.status === 'pending').length;
  const totalRevenue = inscriptions.filter(i => i.status === 'paid').reduce((sum, i) => sum + Number(i.amount || 0), 0);

  if (view === 'create') {
    return <CreateFestival onBack={() => { setView('overview'); }} />;
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <h2 className="text-4xl md:text-5xl font-title font-black uppercase text-white mb-2 tracking-tighter">Painel do Organizador</h2>
          <p className="text-zinc-400 font-sans">Gerencie seus próximos eventos e seus recebimentos.</p>
        </div>
        <div className="flex gap-2 bg-black overflow-x-auto pb-2">
          {(['dashboard', 'finance', 'evaluation', 'ai_agents'] as Tab[]).map(tab => {
            const icons: Record<Tab, React.ReactNode> = {
              dashboard: null,
              finance: <Wallet className="w-4 h-4 mr-2" />,
              evaluation: <Gavel className="w-4 h-4 mr-2" />,
              ai_agents: <Sparkles className="w-4 h-4 mr-2" />,
            };
            const labels: Record<Tab, string> = {
              dashboard: 'Dashboard',
              finance: 'Financeiro',
              evaluation: 'Avaliação',
              ai_agents: 'Equipe IA',
            };
            const activeStyles: Record<Tab, string> = {
              dashboard: 'bg-zinc-800 text-white',
              finance: 'bg-purple-900/40 text-purple-400',
              evaluation: 'bg-[#FFD700]/20 text-[#FFD700]',
              ai_agents: 'bg-blue-500/20 text-blue-400',
            };
            return (
              <Button
                key={tab}
                variant={activeTab === tab ? 'secondary' : 'ghost'}
                onClick={() => setActiveTab(tab)}
                className={activeTab === tab ? activeStyles[tab] : 'text-zinc-400'}
              >
                {icons[tab]}{labels[tab]}
              </Button>
            );
          })}
        </div>
      </div>

      {/* DASHBOARD TAB */}
      {activeTab === 'dashboard' && (
        <>
          <div className="flex justify-between items-center pt-2">
            <h3 className="font-tech text-3xl font-bold tracking-widest uppercase text-white">Meus Festivais</h3>
            <Button onClick={() => setView('create')} className="bg-neon-gradient text-white border-0 hover:opacity-90 font-tech tracking-widest text-sm shadow-glow-purple">
              <Plus className="w-4 h-4 mr-2" /> Novo Festival
            </Button>
          </div>

          {loading ? (
            <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 text-purple-500 animate-spin" /></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {festivals.map(festival => (
                <Card
                  key={festival.id}
                  onClick={() => setSelectedFestival(festival)}
                  className={`bg-[#0a0a0a] xp-clip-card border-zinc-900 hover:border-purple-500/50 hover:shadow-glow-purple transition-all duration-300 cursor-pointer group ${selectedFestival?.id === festival.id ? 'border-purple-500/50 shadow-glow-purple' : ''}`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <Badge variant="outline" className={festival.status === 'published' ? 'bg-green-500/10 text-green-400 border-green-500/50' : 'bg-zinc-800 text-zinc-400 border-zinc-700'}>
                        {festival.status === 'published' ? 'Inscrições Abertas' : 'Rascunho'}
                      </Badge>
                    </div>
                    <CardTitle className="text-3xl font-title font-black tracking-tighter uppercase text-white mt-3 leading-tight group-hover:text-pink-400 transition-colors">{festival.name}</CardTitle>
                    <div className="flex items-center text-sm text-zinc-500 mt-2">
                      <Calendar className="w-3 h-3 mr-1" />
                      {festival.date_start ? (() => {
                        const [y1, m1, d1] = festival.date_start.split('-');
                        let df = `${d1}/${m1}/${y1}`;
                        if (festival.date_end && festival.date_end !== festival.date_start) {
                          const [y2, m2, d2] = festival.date_end.split('-');
                          df += ` a ${d2}/${m2}/${y2}`;
                        }
                        return df;
                      })() : 'Data a definir'}
                    </div>
                  </CardHeader>
                </Card>
              ))}
              <Card onClick={() => setView('create')} className="bg-transparent xp-clip-card border-2 border-dashed border-zinc-800 hover:border-purple-500/50 hover:shadow-glow-purple hover:bg-purple-900/10 transition-all cursor-pointer flex flex-col items-center justify-center min-h-[220px]">
                <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center mb-3">
                  <Plus className="w-6 h-6 text-zinc-500" />
                </div>
                <span className="text-zinc-400 font-medium">Criar Nova Edição</span>
              </Card>
            </div>
          )}

          {/* Analytics */}
          {selectedFestival && (
            <>
              <div className="flex items-center justify-between pt-4">
                <h3 className="font-tech font-bold text-2xl tracking-widest uppercase text-white">
                  Analytics — <span className="text-purple-400">{selectedFestival.name}</span>
                </h3>
                <Button variant="ghost" size="sm" onClick={() => fetchInscriptions(selectedFestival.id)} className="text-zinc-500 hover:text-white">
                  <RefreshCw className="w-4 h-4 mr-1" /> Atualizar
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-[#050505] border-zinc-800">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-zinc-400">Total de Inscrições</CardTitle>
                    <Users className="w-4 h-4 text-zinc-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">{totalInscriptions}</div>
                    <p className="text-xs text-zinc-500 mt-1">{paidInscriptions} confirmadas</p>
                  </CardContent>
                </Card>

                <Card className="bg-[#050505] border-zinc-800">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-zinc-400">Receita Total</CardTitle>
                    <DollarSign className="w-4 h-4 text-zinc-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">R$ {totalRevenue.toFixed(2).replace('.', ',')}</div>
                    <p className="text-xs text-green-400 mt-1">De pagamentos confirmados</p>
                  </CardContent>
                </Card>

                <Card className="bg-[#050505] border-zinc-800">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-zinc-400">Aguardando Pagamento</CardTitle>
                    <Clock className="w-4 h-4 text-zinc-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">{pendingInscriptions}</div>
                    <p className="text-xs text-zinc-500 mt-1">Ações requeridas</p>
                  </CardContent>
                </Card>

                <Card className="bg-[#050505] border-zinc-800">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-zinc-400">Delegações Pagas</CardTitle>
                    <CheckCircle className="w-4 h-4 text-zinc-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">{paidInscriptions} / {totalInscriptions}</div>
                    <p className="text-xs text-zinc-500 mt-1">{totalInscriptions > 0 ? Math.round((paidInscriptions / totalInscriptions) * 100) : 0}% convertido</p>
                  </CardContent>
                </Card>
              </div>

              {/* Inscriptions Table */}
              <Card className="bg-[#0a0a0a] border-zinc-900">
                <CardHeader>
                  <CardTitle className="text-white font-tech tracking-widest font-bold text-2xl uppercase">Inscrições Recentes</CardTitle>
                  <CardDescription className="text-zinc-400">Últimos bailarinos registrados para {selectedFestival.name}.</CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingInscriptions ? (
                    <div className="flex justify-center p-6"><Loader2 className="w-6 h-6 animate-spin text-zinc-500" /></div>
                  ) : inscriptions.length === 0 ? (
                    <div className="text-center py-8 border border-dashed border-zinc-800 rounded-lg">
                      <p className="text-zinc-500 text-sm">Nenhuma inscrição para este festival ainda.</p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader className="border-zinc-800">
                        <TableRow className="border-zinc-800 hover:bg-zinc-900/50">
                          <TableHead className="text-zinc-400">Bailarino</TableHead>
                          <TableHead className="text-zinc-400">Escola</TableHead>
                          <TableHead className="text-zinc-400 text-right">Valor</TableHead>
                          <TableHead className="text-zinc-400">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {inscriptions.map((ins) => (
                          <TableRow key={ins.id} className="border-zinc-800 hover:bg-zinc-900/50">
                            <TableCell className="font-medium text-zinc-200">{ins.profiles?.full_name || '—'}</TableCell>
                            <TableCell className="text-zinc-400">{ins.schools?.name || '—'}</TableCell>
                            <TableCell className="text-zinc-200 text-right font-mono">R$ {Number(ins.amount || 0).toFixed(2).replace('.', ',')}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className={statusColors[ins.status] || 'bg-zinc-800 text-zinc-400'}>
                                {statusLabel[ins.status] || ins.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </>
      )}

      {/* FINANCE TAB */}
      {activeTab === 'finance' && (
        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-[#100520] to-[#0A0515] border-purple-900/50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-500/20 rounded-xl">
                  <ShieldCheck className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <CardTitle className="text-3xl font-title font-black uppercase tracking-tighter text-white">Receba Direto na sua Conta</CardTitle>
                  <CardDescription className="text-purple-300 font-tech uppercase tracking-widest text-lg">Integração Oficial com Stripe Connect</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {stripeConnected ? (
                <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                  <div>
                    <p className="text-white font-bold">Conta Stripe Conectada!</p>
                    <p className="text-sm text-zinc-400">Você já está configurado para receber pagamentos automaticamente.</p>
                  </div>
                </div>
              ) : (
                <p className="text-zinc-300">
                  A XTAGE processa pagamentos via <strong>Stripe Connect</strong>. O dinheiro pago pelos bailarinos é <strong>dividido automaticamente (split)</strong> no exato momento da transação. Você recebe a sua parte sem passar por nós.
                </p>
              )}

              <div className="bg-black/50 p-5 rounded-lg border border-purple-900/30">
                <h4 className="font-semibold text-white mb-4">Fontes de receita na XTAGE:</h4>
                <ul className="space-y-3">
                  {[
                    { num: '1', color: 'purple', title: 'Inscrições e Coreografias', desc: 'Volume principal! Taxa XTAGE aplicada sobre cada coreografia. Seu valor cai direto e integralmente na sua conta.' },
                    { num: '2', color: 'pink', title: 'Marketplace: Fotos e Vídeos', desc: 'Após o festival, bailarinos compram as mídias. Divisão automática entre Organizador, Fotógrafos e XTAGE.' },
                    { num: '3', color: 'green', title: 'Merchandising e Lojinha', desc: 'Venda merchandising antecipado dentro do app. O bailarino retira no local.' },
                    { num: '4', color: 'blue', title: 'Bilheteria para Espectadores', desc: 'Taxa de conveniência padrão em cada ingresso vendido.' },
                  ].map(item => (
                    <li key={item.num} className="flex items-start gap-3">
                      <div className={`bg-${item.color}-500/20 px-2 py-1 rounded text-${item.color}-400 font-mono text-xs mt-0.5 font-bold`}>{item.num}</div>
                      <div>
                        <span className="text-white font-medium">{item.title}</span>
                        <p className="text-sm text-zinc-400 mt-1">{item.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleStripeConnect}
                disabled={connectingStripe || stripeConnected}
                className="bg-[#635BFF] hover:bg-[#524BDB] text-white font-bold py-6 px-8 rounded-xl shadow-[0_0_20px_rgba(99,91,255,0.4)]"
              >
                {connectingStripe ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <ArrowUpRight className="w-5 h-5 ml-0 mr-2" />}
                {stripeConnected ? 'Conta Já Conectada' : 'Conectar Conta Stripe'}
              </Button>
            </CardFooter>
          </Card>

          {/* Simulador */}
          <Card className="bg-[#050505] border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white font-tech tracking-widest font-bold text-2xl uppercase">Simulador de Recebimento</CardTitle>
              <CardDescription className="text-zinc-400">Exemplo de um carrinho de R$ 100,00.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="text-sm font-bold uppercase tracking-widest text-zinc-500">Exemplo A: Repassar Taxa</h4>
                  <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-lg space-y-3 text-sm">
                    <div className="flex justify-between items-center"><span className="text-zinc-400">Inscrição Solista:</span> <span className="text-white font-mono">R$ 100,00</span></div>
                    <div className="flex justify-between items-center"><span className="text-zinc-400">Taxa XTAGE (8%):</span> <span className="text-pink-400 font-mono text-xs">+ R$ 8,00</span></div>
                    <div className="border-t border-zinc-800 pt-3 flex justify-between items-center font-bold text-base"><span className="text-white">Total Pago pelo Cliente:</span> <span className="text-white font-mono">R$ 108,00</span></div>
                    <div className="flex justify-between font-bold mt-3 items-center"><span className="text-green-400">Você recebe (D+1):</span> <span className="text-green-400 font-mono text-lg">R$ 100,00</span></div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="text-sm font-bold uppercase tracking-widest text-zinc-500">Exemplo B: Absorver Taxa</h4>
                  <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-lg space-y-3 text-sm">
                    <div className="flex justify-between items-center"><span className="text-zinc-400">Sua Inscrição no Sistema:</span> <span className="text-white font-mono">R$ 100,00</span></div>
                    <div className="flex justify-between items-center"><span className="text-zinc-400">Taxa XTAGE (8%):</span> <span className="text-pink-400 font-mono text-xs">- R$ 8,00</span></div>
                    <div className="border-t border-zinc-800 pt-3 flex justify-between items-center font-bold text-base"><span className="text-white">Total Pago pelo Cliente:</span> <span className="text-white font-mono">R$ 100,00</span></div>
                    <div className="flex justify-between font-bold mt-3 items-center"><span className="text-yellow-400">Você recebe (D+1):</span> <span className="text-yellow-400 font-mono text-lg">R$ 92,00</span></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* EVALUATION TAB */}
      {activeTab === 'evaluation' && (
        <div className="space-y-6">
          <div>
            <h3 className="font-tech text-3xl font-bold uppercase tracking-widest text-white">Sistema de Notas e Avaliação</h3>
            <p className="text-zinc-400 mt-1">Configure o método de julgamento e os jurados do festival.</p>
          </div>

          {!selectedFestival ? (
            <div className="text-center py-12 border border-dashed border-zinc-800 rounded-xl">
              <p className="text-zinc-500">Selecione um festival na aba Dashboard primeiro.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Criteria */}
              <Card className="bg-[#050505] border-zinc-800">
                <CardHeader className="pb-3 border-b border-zinc-800/50">
                  <div className="w-10 h-10 bg-zinc-900 rounded-lg flex items-center justify-center mb-3">
                    <ClipboardList className="w-5 h-5 text-[#FFD700]" />
                  </div>
                  <CardTitle className="text-2xl font-title font-black uppercase tracking-tighter text-white">Critérios de Avaliação</CardTitle>
                  <CardDescription className="text-zinc-400">Padrão XTAGE — Personalizável por festival.</CardDescription>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                  <div className="space-y-2">
                    {[
                      { name: 'Técnica', weight: 4 },
                      { name: 'Criatividade / Coreografia', weight: 3 },
                      { name: 'Presença de Palco', weight: 2 },
                      { name: 'Figurino e Trilha Sonora', weight: 1 },
                    ].map(c => (
                      <div key={c.name} className="bg-zinc-900/50 p-3 rounded border border-zinc-800 flex justify-between items-center px-4">
                        <span className="text-sm font-medium text-white">{c.name}</span>
                        <Badge variant="outline" className="text-zinc-400 border-zinc-700 text-xs">Peso {c.weight}</Badge>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full border-zinc-700 bg-transparent text-zinc-300 border-dashed" disabled>
                    <Plus className="w-4 h-4 mr-2" /> Adicionar Critério (em breve)
                  </Button>
                </CardContent>
              </Card>

              {/* Judges */}
              <Card className="bg-[#050505] border-zinc-800">
                <CardHeader className="pb-3 border-b border-zinc-800/50">
                  <div className="w-10 h-10 bg-zinc-900 rounded-lg flex items-center justify-center mb-3">
                    <Gavel className="w-5 h-5 text-purple-400" />
                  </div>
                  <CardTitle className="text-2xl font-title font-black uppercase tracking-tighter text-white">Banca de Jurados</CardTitle>
                  <CardDescription className="text-zinc-400">Gere códigos de acesso exclusivo para o App do Jurado.</CardDescription>
                </CardHeader>
                <CardContent className="pt-4 space-y-3">
                  {loadingJudges ? (
                    <div className="flex justify-center p-4"><Loader2 className="w-5 h-5 animate-spin text-zinc-500" /></div>
                  ) : judges.length === 0 ? (
                    <p className="text-sm text-zinc-500 text-center py-2">Nenhum jurado adicionado.</p>
                  ) : (
                    judges.map(judge => (
                      <div key={judge.id} className="flex items-center justify-between p-3 bg-zinc-900/50 border border-zinc-800 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-purple-900/50 flex items-center justify-center text-xs font-bold text-purple-300">
                            {judge.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">{judge.name}</p>
                            <p className="text-xs font-mono text-zinc-400">Código: <span className="text-purple-400">{judge.temp_access_code}</span></p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={judge.is_active ? 'text-green-400 border-green-500/50 bg-green-500/10' : 'text-zinc-500 border-zinc-700'}>
                            {judge.is_active ? 'Ativo' : 'Inativo'}
                          </Badge>
                          <Button variant="ghost" size="icon" className="text-red-500/50 hover:text-red-400 h-7 w-7" onClick={() => handleDeleteJudge(judge.id)}>
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}

                  <div className="flex gap-2 mt-2">
                    <input
                      type="text"
                      value={newJudgeName}
                      onChange={e => setNewJudgeName(e.target.value)}
                      className="flex-1 bg-black border border-zinc-800 rounded px-3 py-2 text-white text-sm"
                      placeholder="Nome do jurado..."
                      onKeyDown={e => e.key === 'Enter' && handleAddJudge()}
                    />
                    <Button onClick={handleAddJudge} disabled={isAddingJudge || !newJudgeName.trim()} className="bg-purple-600 hover:bg-purple-700 text-white font-bold">
                      {isAddingJudge ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                    </Button>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full border-purple-500/50 bg-purple-500/10 text-purple-400 border-solid mt-2"
                    onClick={() => window.open('/jurado', '_blank')}
                  >
                    <ArrowUpRight className="w-4 h-4 mr-2" /> Testar App do Jurado
                  </Button>
                </CardContent>
              </Card>

              {/* Score Rules */}
              <Card className="bg-[#050505] border-zinc-800 md:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-2xl font-title font-black uppercase tracking-tighter text-white">Regras de Exibição de Notas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
                    <div className="border border-[#FFD700]/20 p-4 rounded-xl flex items-start gap-3 bg-[#FFD700]/5">
                      <Star className="w-5 h-5 text-[#FFD700] mt-0.5" />
                      <div>
                        <h4 className="text-sm font-bold text-white">Descartar Extremos</h4>
                        <p className="text-xs text-zinc-400 mt-1">A maior e a menor nota de cada coreografia serão descartadas do cálculo final.</p>
                        <div className="mt-3 text-xs font-bold text-green-400">Ativo</div>
                      </div>
                    </div>
                    <div className="border border-zinc-800 p-4 rounded-xl flex items-start gap-3 bg-zinc-900/50">
                      <CheckCircle className="w-5 h-5 text-zinc-500 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-bold text-white">Publicação Automática</h4>
                        <p className="text-xs text-zinc-400 mt-1">Notas liberadas no App do Bailarino assim que a coreografia desocupar o palco.</p>
                        <div className="mt-3 text-xs font-bold text-zinc-500">Desativado</div>
                      </div>
                    </div>
                    <div className="border border-zinc-800 p-4 rounded-xl flex items-start gap-3 bg-zinc-900/50">
                      <Clock className="w-5 h-5 text-zinc-500 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-bold text-white">Modo Seletiva (Vídeo)</h4>
                        <p className="text-xs text-zinc-400 mt-1">Jurados avaliam via vídeo antes da fase presencial.</p>
                        <div className="mt-3 text-xs font-bold text-zinc-500">Desativado</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      )}

      {/* AI AGENTS TAB */}
      {activeTab === 'ai_agents' && (
        <div className="space-y-6">
          <div>
            <h3 className="font-tech text-3xl font-bold uppercase tracking-widest text-white">Sua Equipe Assistente (Powered by Gemini)</h3>
            <p className="text-zinc-400 mt-1">Automatize o atendimento e a gestão de tarefas com agentes baseados em IA.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: <Bot className="w-6 h-6 text-blue-400" />, color: 'blue', title: 'Chatbot de Atendimento', desc: 'Responda dúvidas sobre inscrições e regulamento 24h por dia.', stats: [{ icon: <CheckCircle className="w-4 h-4 text-green-400" />, text: 'Treinado com seu regulamento.' }, { icon: <Clock className="w-4 h-4 text-zinc-400" />, text: '+150 perguntas respondidas hoje.' }], btn: 'Configurar Respostas', btnClass: 'bg-blue-600 hover:bg-blue-700', disabled: false },
              { icon: <Sparkles className="w-6 h-6 text-orange-400" />, color: 'orange', title: 'Gerador de Cronograma', desc: 'IA que organiza a ordem das apresentações evitando conflitos.', stats: [{ icon: null, text: 'O agente analisa todos os bailarinos inscritos e gera baterias garantindo tempo mínimo de troca de figurino.' }, { icon: null, text: 'Status: Aguardando encerramento das inscrições.' }], btn: 'Gerar Baterias', btnClass: '', disabled: true },
              { icon: <Sparkles className="w-6 h-6 text-green-400" />, color: 'green', title: 'Avaliador de Mídia', desc: 'Auditoria automática das músicas enviadas pelos bailarinos.', stats: [{ icon: null, text: 'Agente que ouve os arquivos e alerta se houver silêncio prolongado ou áudio corrompido.' }, { icon: null, text: '120/120 Ok' }], btn: 'Ver Relatório', btnClass: '', disabled: false },
            ].map((agent, i) => (
              <Card key={i} className={`bg-[#050505] border-${agent.color}-500/30`}>
                <CardHeader className="pb-3 border-b border-zinc-800/50">
                  <div className={`w-12 h-12 rounded-full bg-${agent.color}-500/20 flex items-center justify-center mb-2`}>
                    {agent.icon}
                  </div>
                  <CardTitle className="text-2xl font-title font-black uppercase tracking-tighter text-white">{agent.title}</CardTitle>
                  <CardDescription className="text-zinc-400">{agent.desc}</CardDescription>
                </CardHeader>
                <CardContent className="pt-4 space-y-3">
                  {agent.stats.map((s, j) => (
                    <div key={j} className="bg-zinc-900/50 p-3 rounded-lg border border-zinc-800 text-sm flex items-center gap-2 text-zinc-300">
                      {s.icon}{s.text}
                    </div>
                  ))}
                </CardContent>
                <CardFooter>
                  <Button disabled={agent.disabled} className={`w-full text-white font-bold ${agent.btnClass || 'bg-zinc-700 hover:bg-zinc-600'}`}>
                    {agent.btn}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
