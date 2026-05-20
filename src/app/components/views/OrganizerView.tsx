import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Users, DollarSign, Clock, CheckCircle, Ticket, Calendar, Loader2, ArrowUpRight, ShieldCheck, Wallet, Gavel, Star, ClipboardList, Sparkles, Bot } from 'lucide-react';
import CreateFestival from './CreateFestival';
import { supabase } from '@/lib/supabase';

const recentInscriptions = [
  { id: '1', name: 'Ana Silva', school: 'Studio Alpha', category: 'Danças Urbanas', status: 'Aprovado' },
  { id: '2', name: 'João Santos', school: 'Cia de Ballet', category: 'Ballet Clássico', status: 'Pendente' },
  { id: '3', name: 'Mega Crew BR', school: 'Street K', category: 'Danças Urbanas', status: 'Pago' },
  { id: '4', name: 'Carla Dias', school: 'Studio Alpha', category: 'Jazz', status: 'Bloqueado' },
];

const statusColors: Record<string, string> = {
  Aprovado: 'bg-green-500/20 text-green-400 border-green-500/50',
  Pendente: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
  Pago: 'bg-neon-gradient text-white border-transparent',
  Bloqueado: 'bg-red-500/20 text-red-400 border-red-500/50',
};

export default function OrganizerView() {
  const [view, setView] = useState<'overview' | 'create'>('overview');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'finance' | 'evaluation' | 'ai_agents'>('dashboard');
  const [festivals, setFestivals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFestivals = async () => {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      const { data, error } = await supabase
        .from('festivals')
        .select('*')
        .eq('organizer_id', session.user.id)
        .order('created_at', { ascending: false });
      
      if (data) {
        setFestivals(data);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    if (view === 'overview') {
      fetchFestivals();
    }
  }, [view]);

  if (view === 'create') {
    return <CreateFestival onBack={() => { setView('overview'); }} />;
  }

  return (
    <div className="p-6 space-y-8">
      <div className="flex flex-col md:flex-row items-start justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <h2 className="text-4xl md:text-5xl font-title font-black uppercase text-white mb-2 tracking-tighter">Painel do Organizador</h2>
          <p className="text-zinc-400 font-sans">Gerencie seus próximos eventos e seus recebimentos.</p>
        </div>
        <div className="flex gap-2 bg-black overflow-x-auto pb-2">
          <Button 
            variant={activeTab === 'dashboard' ? 'secondary' : 'ghost'} 
            onClick={() => setActiveTab('dashboard')}
            className={activeTab === 'dashboard' ? 'bg-zinc-800 text-white' : 'text-zinc-400'}
          >
            Dashboard
          </Button>
          <Button 
            variant={activeTab === 'finance' ? 'secondary' : 'ghost'} 
            onClick={() => setActiveTab('finance')}
            className={activeTab === 'finance' ? 'bg-purple-900/40 text-purple-400' : 'text-zinc-400'}
          >
            <Wallet className="w-4 h-4 mr-2" /> Financeiro
          </Button>
          <Button 
            variant={activeTab === 'evaluation' ? 'secondary' : 'ghost'} 
            onClick={() => setActiveTab('evaluation')}
            className={activeTab === 'evaluation' ? 'bg-[#FFD700]/20 text-[#FFD700]' : 'text-zinc-400'}
          >
            <Gavel className="w-4 h-4 mr-2" /> Sistema de Notas
          </Button>
          <Button 
            variant={activeTab === 'ai_agents' ? 'secondary' : 'ghost'} 
            onClick={() => setActiveTab('ai_agents')}
            className={activeTab === 'ai_agents' ? 'bg-blue-500/20 text-blue-400' : 'text-zinc-400'}
          >
            <Sparkles className="w-4 h-4 mr-2" /> Equipe IA
          </Button>
        </div>
      </div>

      {activeTab === 'dashboard' && (
        <>
          <div className="flex justify-between items-center pt-2">
            <h3 className="font-tech text-3xl font-bold tracking-widest uppercase text-white">Meus Festivais</h3>
            <Button onClick={() => setView('create')} className="bg-neon-gradient text-white border-0 hover:opacity-90 font-tech tracking-widest text-sm shadow-glow-purple">
              <Plus className="w-4 h-4 mr-2" /> Novo Festival
            </Button>
          </div>

          <div className="space-y-4">
            
            {loading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {festivals.map(festival => (
              <Card key={festival.id} className="bg-[#0a0a0a] xp-clip-card border-zinc-900 hover:border-purple-500/50 hover:shadow-glow-purple transition-all duration-300 cursor-pointer group">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <Badge variant="outline" className={festival.status === 'published' ? 'bg-green-500/10 text-green-400 border-green-500/50' : 'bg-zinc-800 text-zinc-400 border-zinc-700'}>
                      {festival.status === 'published' ? 'Inscrições Abertas' : 'Rascunho'}
                    </Badge>
                  </div>
                  <CardTitle className="text-3xl font-title font-black tracking-tighter uppercase text-white mt-3 leading-tight group-hover:text-pink-400 transition-colors">{festival.name}</CardTitle>
                  <div className="flex items-center text-sm text-zinc-500 mt-2">
                    <Calendar className="w-3 h-3 mr-1" /> 
                    {festival.date_start ? (
                      (() => {
                        const [y1, m1, d1] = festival.date_start.split('-');
                        let df = `${d1}/${m1}/${y1}`;
                        if (festival.date_end && festival.date_end !== festival.date_start) {
                          const [y2, m2, d2] = festival.date_end.split('-');
                          df += ` a ${d2}/${m2}/${y2}`;
                        }
                        return df;
                      })()
                    ) : 'Data a definir'}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center pt-4 border-t border-zinc-800/50">
                     <div className="flex flex-col">
                       <span className="text-xs text-zinc-500 mb-1">Inscritos</span>
                       <span className="text-sm font-medium text-white flex items-center"><Users className="w-3 h-3 mr-1 text-zinc-400" /> 0</span>
                     </div>
                     <div className="flex flex-col items-end">
                       <span className="text-xs text-zinc-500 mb-1">Ticket Médio</span>
                       <span className="text-sm font-medium text-green-400 flex items-center"><Ticket className="w-3 h-3 mr-1" /> R$ 0,00</span>
                     </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {/* Create Card placeholder */}
            <Card onClick={() => setView('create')} className="bg-transparent xp-clip-card border-2 border-dashed border-zinc-800 hover:border-purple-500/50 hover:shadow-glow-purple hover:bg-purple-900/10 transition-all cursor-pointer flex flex-col items-center justify-center min-h-[220px]">
               <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center mb-3">
                  <Plus className="w-6 h-6 text-zinc-500" />
               </div>
               <span className="text-zinc-400 font-medium">Criar Nova Edição</span>
            </Card>
          </div>
        )}
      </div>

      {/* Stats Cards (Aggregated) */}
      <h3 className="font-tech font-bold text-3xl tracking-widest uppercase text-white pt-4">Analytics Global</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-[#050505] border-zinc-800 border-b-neon-gradient">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Total de Inscrições</CardTitle>
            <Users className="w-4 h-4 text-zinc-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">0</div>
            <p className="text-xs text-green-400 mt-1">Nesta semana</p>
          </CardContent>
        </Card>
        
        <Card className="bg-[#050505] border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Receita Total</CardTitle>
            <DollarSign className="w-4 h-4 text-zinc-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">R$ 0,00</div>
            <p className="text-xs text-green-400 mt-1">Nesta semana</p>
          </CardContent>
        </Card>

        <Card className="bg-[#050505] border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Aprovações Pendentes</CardTitle>
            <Clock className="w-4 h-4 text-zinc-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">0</div>
            <p className="text-xs text-zinc-500 mt-1">Zero ações requeridas</p>
          </CardContent>
        </Card>

        <Card className="bg-[#050505] border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Delegações Pagas</CardTitle>
            <CheckCircle className="w-4 h-4 text-zinc-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">0 / 0</div>
            <p className="text-xs text-zinc-500 mt-1">Escolas pendentes</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Inscriptions Table */}
      <Card className="bg-[#0a0a0a] xp-clip-card border-zinc-900">
        <CardHeader>
          <CardTitle className="text-white font-tech tracking-widest font-bold text-2xl uppercase">Inscrições Recentes</CardTitle>
          <CardDescription className="text-zinc-400 font-sans">Últimos bailarinos registrados pelas escolas.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader className="border-zinc-800">
              <TableRow className="border-zinc-800 hover:bg-zinc-900/50">
                <TableHead className="text-zinc-400">Bailarino/Grupo</TableHead>
                <TableHead className="text-zinc-400">Escola</TableHead>
                <TableHead className="text-zinc-400">Categoria</TableHead>
                <TableHead className="text-zinc-400">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentInscriptions.map((inscription) => (
                <TableRow key={inscription.id} className="border-zinc-800 hover:bg-zinc-900/50">
                  <TableCell className="font-medium text-zinc-200">{inscription.name}</TableCell>
                  <TableCell className="text-zinc-400">{inscription.school}</TableCell>
                  <TableCell className="text-zinc-400">{inscription.category}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusColors[inscription.status]}>
                      {inscription.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      </>
    )}

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
              <p className="text-zinc-300">
                A XTAGE processa pagamentos via <strong>Stripe Connect</strong>. 
                Isso significa que o dinheiro pago pelos bailarinos ou espectadores é <strong>dividido automaticamente (split)</strong> no exato momento da transação.
              </p>
              <div className="bg-black/50 p-5 rounded-lg border border-purple-900/30">
                <h4 className="font-semibold text-white mb-4">Como a XTAGE potencializa as vendas e fazemos a divisão:</h4>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="bg-purple-500/20 px-2 py-1 rounded text-purple-400 font-mono text-xs mt-0.5 font-bold">1</div>
                    <div>
                      <span className="text-white font-medium">Inscrições e Coreografias (Principal Fonte)</span>
                      <p className="text-sm text-zinc-400 mt-1">É aqui que o volume acontece! A XTAGE aplica sua taxa sobre cada coreografia registrada e cada bailarino inscrito. O valor que é seu (Organizador) cai direto e integralmente na sua conta, sem passar por nós. A taxa XTAGE já é separada na origem.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="bg-pink-500/20 px-2 py-1 rounded text-pink-400 font-mono text-xs mt-0.5 font-bold">2</div>
                    <div>
                      <span className="text-white font-medium">Marketplace: Venda de Mídia (Fotos e Vídeos)</span>
                      <p className="text-sm text-zinc-400 mt-1">Após o festival, disponibilize os vídeos das coreografias e fotos oficiais na galeria do app. Os bailarinos compram com 1-clique. Dividimos os lucros automaticamente entre Organizador, Fotógrafos e XTAGE.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="bg-green-500/20 px-2 py-1 rounded text-green-400 font-mono text-xs mt-0.5 font-bold">3</div>
                    <div>
                      <span className="text-white font-medium">Marketplace: Merchandising e Lojinha</span>
                      <p className="text-sm text-zinc-400 mt-1">Venda copos, camisetas, bolsas, garrafas e moletons antecipadamente dentro do aplicativo. O bailarino já compra junto com a taxa do festival e só retira no local.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="bg-blue-500/20 px-2 py-1 rounded text-blue-400 font-mono text-xs mt-0.5 font-bold">4</div>
                    <div>
                      <span className="text-white font-medium">Bilheteria para Espectadores</span>
                      <p className="text-sm text-zinc-400 mt-1">A taxa de conveniência padrão da bilheteira (Ticketing) será aplicada a todo ingresso vendido para o público.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="bg-orange-500/20 px-2 py-1 rounded text-orange-400 font-mono text-xs mt-0.5 font-bold">5</div>
                    <div>
                      <span className="text-white font-medium">Repasses das Escolas (B2B)</span>
                      <p className="text-sm text-zinc-400 mt-1">E para ajudar o Diretor da Escola, a XTAGE cobra e repassa a parte deles (como custo da viagem e hospedagem) na fatura única que o bailarino paga, retendo uma pequena fatia pela operação logística.</p>
                    </div>
                  </li>
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="bg-[#635BFF] hover:bg-[#524BDB] text-white font-bold py-6 px-8 rounded-xl shadow-[0_0_20px_rgba(99,91,255,0.4)]">
                Conectar Conta Stripe <ArrowUpRight className="w-5 h-5 ml-2" />
              </Button>
            </CardFooter>
          </Card>

          <Card className="bg-[#050505] border-zinc-800">
             <CardHeader>
                <CardTitle className="text-white font-tech tracking-widest font-bold text-2xl uppercase">Simulador de Recebimento</CardTitle>
                <CardDescription className="text-zinc-400 font-sans">Exemplo de um carrinho de R$ 100,00.</CardDescription>
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

      {activeTab === 'evaluation' && (
        <div className="space-y-6">
          <div>
            <h3 className="font-tech text-3xl font-bold uppercase tracking-widest text-white">Sistema de Notas e Avaliação</h3>
            <p className="text-zinc-400 mt-1 font-sans">Configure o método de julgamento e os links de acesso dos seus jurados.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-[#050505] border-zinc-800">
               <CardHeader className="pb-3 border-b border-zinc-800/50">
                  <div className="w-10 h-10 bg-zinc-900 rounded-lg flex items-center justify-center mb-3">
                    <ClipboardList className="w-5 h-5 text-[#FFD700]" />
                  </div>
                  <CardTitle className="text-2xl font-title font-black uppercase tracking-tighter text-white">Critérios de Avaliação</CardTitle>
                  <CardDescription className="text-zinc-400 font-sans">Personalize os quesitos que serão avaliados pela banca.</CardDescription>
               </CardHeader>
               <CardContent className="pt-4 space-y-4">
                  <div className="space-y-2">
                    <div className="bg-zinc-900/50 p-2 rounded border border-zinc-800 flex justify-between items-center px-4">
                      <span className="text-sm font-medium text-white">Técnica (Peso 4)</span>
                    </div>
                    <div className="bg-zinc-900/50 p-2 rounded border border-zinc-800 flex justify-between items-center px-4">
                      <span className="text-sm font-medium text-white">Criatividade / Coreografia (Peso 3)</span>
                    </div>
                    <div className="bg-zinc-900/50 p-2 rounded border border-zinc-800 flex justify-between items-center px-4">
                      <span className="text-sm font-medium text-white">Presença de Palco (Peso 2)</span>
                    </div>
                    <div className="bg-zinc-900/50 p-2 rounded border border-zinc-800 flex justify-between items-center px-4">
                      <span className="text-sm font-medium text-white">Figurino e Trilha Son. (Peso 1)</span>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full border-zinc-700 bg-transparent text-zinc-300 border-dashed">
                    <Plus className="w-4 h-4 mr-2" /> Adicionar Critério
                  </Button>
               </CardContent>
            </Card>

            <Card className="bg-[#050505] border-zinc-800">
               <CardHeader className="pb-3 border-b border-zinc-800/50">
                  <div className="w-10 h-10 bg-zinc-900 rounded-lg flex items-center justify-center mb-3">
                    <Gavel className="w-5 h-5 text-purple-400" />
                  </div>
                  <CardTitle className="text-2xl font-title font-black uppercase tracking-tighter text-white">Banca de Jurados</CardTitle>
                  <CardDescription className="text-zinc-400 font-sans">Gere e envie convites de acesso exclusivo para o App do Jurado.</CardDescription>
               </CardHeader>
               <CardContent className="pt-4 space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-white">J1</div>
                        <div>
                          <p className="text-sm font-medium text-white">Jurado 1</p>
                          <p className="text-xs text-green-400">Online no App</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="text-zinc-500">Reenviar Link</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-white">J2</div>
                        <div>
                          <p className="text-sm font-medium text-white">Jurado 2</p>
                          <p className="text-xs text-yellow-500">Convite Pendente</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="text-zinc-500">Copiar Link</Button>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full border-zinc-700 bg-transparent text-zinc-300 border-dashed mt-2">
                    <Plus className="w-4 h-4 mr-2" /> Convidar Novo Jurado
                  </Button>
                  <Button variant="outline" className="w-full border-purple-500/50 bg-purple-500/10 text-purple-400 border-solid mt-2" onClick={() => window.open('/jurado', '_blank')}>
                    <ArrowUpRight className="w-4 h-4 mr-2" /> Testar App do Jurado
                  </Button>
               </CardContent>
            </Card>
            
            <Card className="bg-[#050505] border-zinc-800 md:col-span-2">
               <CardHeader className="pb-2">
                  <CardTitle className="text-2xl font-title font-black uppercase tracking-tighter text-white">Regras de Exibição de Notas</CardTitle>
               </CardHeader>
               <CardContent>
                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
                   <div className="border border-zinc-800 p-4 rounded-xl flex items-start gap-3 bg-[#FFD700]/5 border-[#FFD700]/20">
                     <Star className="w-5 h-5 text-[#FFD700] mt-0.5" />
                     <div>
                       <h4 className="text-sm font-bold text-white">Descartar Extremos</h4>
                       <p className="text-xs text-zinc-400 mt-1">A maior e a menor nota de cada coreografia serão descartadas do cálculo final da média.</p>
                       <div className="mt-3 flex items-center gap-2 text-xs font-bold text-green-400">Ativo</div>
                     </div>
                   </div>
                   <div className="border border-zinc-800 p-4 rounded-xl flex items-start gap-3 bg-zinc-900/50">
                     <CheckCircle className="w-5 h-5 text-zinc-500 mt-0.5" />
                     <div>
                       <h4 className="text-sm font-bold text-white">Publicação Automática</h4>
                       <p className="text-xs text-zinc-400 mt-1">Notas liberadas no App do Bailarino assim que a coreografia desocupar o palco.</p>
                       <div className="mt-3 flex items-center gap-2 text-xs font-bold text-zinc-500">Desativado</div>
                     </div>
                   </div>
                   <div className="border border-zinc-800 p-4 rounded-xl flex items-start gap-3 bg-zinc-900/50">
                     <Clock className="w-5 h-5 text-zinc-500 mt-0.5" />
                     <div>
                       <h4 className="text-sm font-bold text-white">Modo Seletiva (Vídeo)</h4>
                       <p className="text-xs text-zinc-400 mt-1">Habilitar fase de triagem digital. Jurados avaliam via vídeo anexado antes do presencial.</p>
                       <div className="mt-3 flex items-center gap-2 text-xs font-bold text-zinc-500">Desativado</div>
                     </div>
                   </div>
                 </div>
               </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'ai_agents' && (
        <div className="space-y-6">
          <div>
            <h3 className="font-tech text-3xl font-bold uppercase tracking-widest text-white">Sua Equipe Assistente (Powered by Gemini)</h3>
            <p className="text-zinc-400 mt-1 font-sans">Automatize o atendimento e a gestão de tarefas com agentes baseados em IA.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-[#050505] border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
              <CardHeader className="pb-3 border-b border-zinc-800/50">
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mb-2">
                  <Bot className="w-6 h-6 text-blue-400" />
                </div>
                <CardTitle className="text-2xl font-title font-black uppercase tracking-tighter text-white">Chatbot de Atendimento</CardTitle>
                <CardDescription className="text-zinc-400 font-sans">Responda dúvidas sobre inscrições e regulamento 24h por dia.</CardDescription>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div className="bg-zinc-900/50 p-3 rounded-lg border border-zinc-800 text-sm flex items-center gap-2 text-zinc-300">
                  <CheckCircle className="w-4 h-4 text-green-400" /> Treinado com seu regulamento.
                </div>
                <div className="bg-zinc-900/50 p-3 rounded-lg border border-zinc-800 text-sm flex items-center gap-2 text-zinc-300">
                   <Clock className="w-4 h-4 text-zinc-400" /> +150 perguntas respondidas hoje.
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold">
                  Configurar Respostas Específicas
                </Button>
              </CardFooter>
            </Card>

            <Card className="bg-[#050505] border-zinc-800">
              <CardHeader className="pb-3 border-b border-zinc-800/50">
                <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center mb-2">
                  <Sparkles className="w-6 h-6 text-orange-400" />
                </div>
                <CardTitle className="text-2xl font-title font-black uppercase tracking-tighter text-white">Gerador de Cronograma</CardTitle>
                <CardDescription className="text-zinc-400 font-sans">IA que organiza a ordem das apresentações evitando conflitos.</CardDescription>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                 <p className="text-sm text-zinc-400">O agente analisa todos os bailarinos inscritos e gera baterias de coreografias garantindo um tempo mínimo de troca de figurino.</p>
                 <div className="bg-zinc-900/50 p-3 rounded-lg border border-zinc-800 text-xs text-zinc-500 mt-2 font-mono">
                   Status: Aguardando encerramento das inscrições.
                 </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full border-zinc-700 text-zinc-300" disabled>
                  Gerar Baterias
                </Button>
              </CardFooter>
            </Card>

            <Card className="bg-[#050505] border-zinc-800">
              <CardHeader className="pb-3 border-b border-zinc-800/50">
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mb-2">
                  <Sparkles className="w-6 h-6 text-green-400" />
                </div>
                <CardTitle className="text-2xl font-title font-black uppercase tracking-tighter text-white">Avaliador de Mídia</CardTitle>
                <CardDescription className="text-zinc-400 font-sans">Auditoria automática das músicas enviadas pelos bailarinos.</CardDescription>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                 <p className="text-sm text-zinc-400">Agente que ouve os arquivos enviados e alerta se houver silêncio prolongado ou áudio corrompido.</p>
                 <div className="bg-green-500/10 p-3 rounded-lg border border-green-500/20 text-xs text-green-400 mt-2 flex items-center justify-between">
                   <span>Ativo processando envios.</span>
                   <span className="font-bold">120/120 Ok</span>
                 </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full border-zinc-700 text-zinc-300">
                   Ver Relatório
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
