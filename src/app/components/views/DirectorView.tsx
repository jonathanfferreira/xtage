'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { CheckCircle2, UserPlus, CreditCard, Building, Plus, Loader2, Trash2, Music2, Users2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import ChoreographyFactory from './ChoreographyFactory';

type Tab = 'elenco' | 'coreografias';

export default function DirectorView() {
  const [schools, setSchools] = useState<any[]>([]);
  const [selectedSchool, setSelectedSchool] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [isCreatingSchool, setIsCreatingSchool] = useState(false);
  const [newSchoolName, setNewSchoolName] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('elenco');
  
  // Dancers State
  const [dancers, setDancers] = useState<any[]>([]);
  const [loadingDancers, setLoadingDancers] = useState(false);
  const [schoolCode, setSchoolCode] = useState('');

  // Extra Costs
  const [extraCosts, setExtraCosts] = useState<{id: string, name: string, value: number}[]>([]);
  const [isAddingCost, setIsAddingCost] = useState(false);
  const [newCostName, setNewCostName] = useState('');
  const [newCostValue, setNewCostValue] = useState('');
  const [isInvitingDancer, setIsInvitingDancer] = useState(false);

  const fetchSchools = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data } = await supabase
      .from('schools')
      .select('*')
      .eq('director_id', session.user.id);
      
    if (data && data.length > 0) {
      setSchools(data);
      if (!selectedSchool) {
        setSelectedSchool(data[0].id);
      }
    }
    setLoading(false);
  }, [selectedSchool]);

  const fetchDancers = useCallback(async (schoolId: string) => {
    setLoadingDancers(true);
    const { data } = await supabase
      .from('school_dancers')
      .select(`
        status,
        dancer_id,
        profiles (
          full_name,
          avatar_url
        )
      `)
      .eq('school_id', schoolId);
      
    if (data) {
      setDancers(data);
      setSchoolCode(schoolId.split('-')[0].toUpperCase());
    }
    setLoadingDancers(false);
  }, []);

  useEffect(() => {
    fetchSchools();
  }, [fetchSchools]);

  useEffect(() => {
    if (selectedSchool && selectedSchool !== 'create' && selectedSchool !== 'none') {
      fetchDancers(selectedSchool);
    }
  }, [selectedSchool, fetchDancers]);

  const handleCreateSchool = async () => {
    if (!newSchoolName) return;
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      await supabase.from('profiles').upsert([{ 
        id: session.user.id, 
        role: 'director',
        full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Diretor'
      }], { onConflict: 'id' });

      const { data, error } = await supabase.from('schools').insert([{
        director_id: session.user.id,
        name: newSchoolName
      }]).select();

      if (error) {
        toast.error('Erro ao criar escola: ' + error.message);
      } else if (data && data.length > 0) {
        toast.success('Escola criada com sucesso!');
        setIsCreatingSchool(false);
        setNewSchoolName('');
        setSchools(prev => [...prev, data[0]]);
        setSelectedSchool(data[0].id);
      }
    }
    setLoading(false);
  };

  const handleDeleteSchool = async (schoolId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta escola? Todos os vínculos com bailarinos serão perdidos.')) return;
    setLoading(true);
    const { error } = await supabase.from('schools').delete().eq('id', schoolId);
    
    if (error) {
      toast.error('Erro ao excluir escola: ' + error.message);
    } else {
      toast.success('Escola excluída com sucesso!');
      setSchools(prev => prev.filter(s => s.id !== schoolId));
      setSelectedSchool('');
    }
    setLoading(false);
  };

  const handleUpdateDancerStatus = async (dancerId: string, status: 'accepted' | 'rejected') => {
    if (status === 'rejected') {
      const { error } = await supabase.from('school_dancers').delete().eq('dancer_id', dancerId).eq('school_id', selectedSchool);
      if (!error) toast.success('Solicitação recusada.');
    } else {
      const { error } = await supabase.from('school_dancers').update({ status }).eq('dancer_id', dancerId).eq('school_id', selectedSchool);
      if (!error) toast.success('Bailarino aceito no elenco!');
    }
    fetchDancers(selectedSchool);
  };

  const handleAddCost = () => {
    if (newCostName && newCostValue) {
      setExtraCosts([...extraCosts, { id: Math.random().toString(), name: newCostName, value: parseFloat(newCostValue.replace(',', '.')) }]);
      setIsAddingCost(false);
      setNewCostName('');
      setNewCostValue('');
    }
  };

  const calculateTotal = () => {
    const base = 15 + 150;
    const extras = extraCosts.reduce((acc, curr) => acc + curr.value, 0);
    return base + extras;
  };
  
  if (loading) {
     return <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 text-purple-500 animate-spin" /></div>;
  }

  const schoolSelected = selectedSchool && selectedSchool !== 'create' && selectedSchool !== 'none';

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start justify-between gap-4">
        <div>
          <h2 className="text-3xl font-title text-white mb-1">Montar Delegação</h2>
          <p className="text-zinc-400 text-sm">Gerencie seu elenco, aprove solicitações e organize as coreografias.</p>
        </div>
        <div className="flex bg-zinc-900 border border-zinc-800 rounded-lg p-1 items-center gap-2">
            <Building className="w-4 h-4 ml-2 text-zinc-500" />
            <Select value={selectedSchool} onValueChange={(val) => {
              if (val === 'create') {
                setIsCreatingSchool(true);
              } else {
                setSelectedSchool(val || '');
              }
            }}>
              <SelectTrigger className="w-48 bg-transparent border-0 text-white focus:ring-0">
                <SelectValue placeholder="Selecione a Escola" />
              </SelectTrigger>
              <SelectContent className="bg-[#0A0A0A] border-zinc-800 text-white">
                {schools.length > 0 ? schools.map(school => (
                  <SelectItem key={school.id} value={school.id}>{school.name}</SelectItem>
                )) : (
                  <SelectItem value="none" disabled>Nenhuma escola</SelectItem>
                )}
                <SelectItem value="create" className="text-purple-400 font-bold">+ Cadastrar Escola</SelectItem>
              </SelectContent>
            </Select>
            {schoolSelected && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                onClick={() => handleDeleteSchool(selectedSchool)}
                title="Deletar Escola"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
        </div>
      </div>

      {/* Create School inline form */}
      {isCreatingSchool && (
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
          <h3 className="font-title text-xl text-white mb-2">Cadastrar Nova Escola</h3>
          <div className="flex gap-2">
            <input 
              type="text"
              value={newSchoolName}
              onChange={(e) => setNewSchoolName(e.target.value)}
              className="bg-black border border-zinc-800 rounded px-3 py-2 text-white flex-1"
              placeholder="Nome da Escola..."
            />
            <Button onClick={handleCreateSchool} className="bg-purple-600 hover:bg-purple-700 text-white font-bold">
              Salvar
            </Button>
            <Button variant="ghost" onClick={() => setIsCreatingSchool(false)} className="text-zinc-400">
              Cancelar
            </Button>
          </div>
        </div>
      )}

      {/* Invite Code Banner */}
      {schoolSelected && (
        <div className="bg-purple-900/10 border border-purple-500/20 rounded-xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
           <div className="space-y-1">
               <span className="text-xs uppercase font-bold tracking-widest text-purple-400">Código de Convite</span>
               <h3 className="font-mono text-2xl text-white tracking-[0.2em]">{schoolCode}</h3>
               <p className="text-xs text-zinc-400">Envie este código para seus bailarinos entrarem automaticamente.</p>
           </div>
        </div>
      )}

      {/* Tab Navigation */}
      {schoolSelected && (
        <div className="flex gap-1 border-b border-zinc-800">
          <button
            onClick={() => setActiveTab('elenco')}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'elenco'
                ? 'border-purple-500 text-white'
                : 'border-transparent text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Users2 className="w-4 h-4" />
            Elenco
          </button>
          <button
            onClick={() => setActiveTab('coreografias')}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'coreografias'
                ? 'border-purple-500 text-white'
                : 'border-transparent text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Music2 className="w-4 h-4" />
            Coreografias
          </button>
        </div>
      )}

      {/* Elenco Tab */}
      {schoolSelected && activeTab === 'elenco' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-[#050505] border-zinc-800">
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                 <div>
                    <CardTitle className="text-white font-subtitle tracking-wider text-xl">Meu Elenco</CardTitle>
                    <CardDescription className="text-zinc-400">Gerencie solicitações de entrada e membros da escola.</CardDescription>
                 </div>
                 <Button onClick={() => setIsInvitingDancer(true)} size="sm" variant="outline" className="bg-transparent border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800 hidden sm:flex">
                   <UserPlus className="w-4 h-4 mr-2" /> Adicionar Email
                 </Button>
              </CardHeader>
              <CardContent>
                {loadingDancers ? (
                  <div className="flex justify-center py-6"><Loader2 className="w-6 h-6 animate-spin text-zinc-500" /></div>
                ) : dancers.length === 0 ? (
                  <div className="text-center py-6 border border-dashed border-zinc-700 rounded-lg">
                    <p className="text-zinc-400 text-sm">Nenhum bailarino na escola ainda.</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader className="border-zinc-800">
                      <TableRow className="border-zinc-800 hover:bg-zinc-900/50">
                        <TableHead className="text-zinc-400 text-xs uppercase tracking-wider font-semibold">Bailarino</TableHead>
                        <TableHead className="text-zinc-400 text-xs uppercase tracking-wider font-semibold text-right">Status / Ação</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {dancers.map((d) => (
                        <TableRow key={d.dancer_id} className="border-zinc-800 hover:bg-zinc-900/50">
                          <TableCell className="font-medium text-zinc-200">
                            {d.profiles?.full_name || 'Usuário'}
                          </TableCell>
                          <TableCell className="text-right">
                            {d.status === 'pending' ? (
                              <div className="flex justify-end gap-2">
                                <Button size="sm" className="h-7 text-xs bg-green-600 hover:bg-green-700 text-white" onClick={() => handleUpdateDancerStatus(d.dancer_id, 'accepted')}>Aceitar</Button>
                                <Button size="sm" variant="ghost" className="h-7 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10" onClick={() => handleUpdateDancerStatus(d.dancer_id, 'rejected')}>Recusar</Button>
                              </div>
                            ) : (
                              <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/50 gap-1 px-2 py-0.5 rounded text-xs font-bold uppercase">
                                <CheckCircle2 className="w-3 h-3" /> Membro
                              </Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Financial Split */}
          <div className="space-y-6">
            <Card className="bg-[#0A0A0A] border-zinc-700 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-neon-gradient opacity-80" />
              <CardHeader>
                <div className="flex items-center gap-2 mb-1">
                  <CreditCard className="w-5 h-5 text-purple-400" />
                  <CardTitle className="text-white font-subtitle tracking-wider text-xl">Fatura do Bailarino</CardTitle>
                </div>
                <CardDescription className="text-zinc-400 text-xs">A plataforma enviará a cobrança unificada automaticamente (Split) para cada bailarino.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-zinc-900/50 rounded-lg border border-zinc-800 flex justify-between items-center text-sm">
                  <span className="text-zinc-300 font-medium tracking-wide">Taxa de Adesão XTAGE</span>
                  <span className="text-zinc-500">R$ 15,00</span>
                </div>
                <div className="flex justify-between items-center text-sm px-1">
                  <span className="text-zinc-400">Inscrição Festival Médio</span>
                  <span className="text-zinc-200">R$ 150,00</span>
                </div>
                
                {extraCosts.map(cost => (
                  <div key={cost.id} className="flex justify-between items-center text-sm px-1">
                    <span className="text-zinc-400">{cost.name} (Sua Escola)</span>
                    <div className="flex items-center gap-2">
                      <span className="text-zinc-200">R$ {cost.value.toFixed(2).replace('.', ',')}</span>
                      <button onClick={() => setExtraCosts(extraCosts.filter(c => c.id !== cost.id))} className="text-red-500/50 hover:text-red-500 text-xs">x</button>
                    </div>
                  </div>
                ))}

                <div className="flex justify-between items-center text-sm px-1 flex-wrap gap-2 pt-2">
                   <span className="text-zinc-400">Adicionar Custo Extra (Opcional)</span>
                   {!isAddingCost ? (
                     <Button size="sm" variant="ghost" className="h-6 text-xs text-purple-400 hover:text-white p-0" onClick={() => setIsAddingCost(true)}>+ Adicionar</Button>
                   ) : (
                     <div className="w-full flex gap-2 mt-2">
                       <input type="text" placeholder="Ex: Figurino" className="bg-black border border-zinc-800 text-white rounded px-2 w-1/2 text-xs h-8" value={newCostName} onChange={e => setNewCostName(e.target.value)} />
                       <input type="number" placeholder="0.00" className="bg-black border border-zinc-800 text-white rounded px-2 w-1/3 text-xs h-8" value={newCostValue} onChange={e => setNewCostValue(e.target.value)} />
                       <Button size="sm" className="bg-purple-600 hover:bg-purple-700 h-8" onClick={handleAddCost}>OK</Button>
                     </div>
                   )}
                </div>
               
                <Separator className="bg-zinc-800" />
                <div className="flex justify-between items-center px-1">
                  <span className="font-semibold text-white">Projeção por aluno</span>
                  <span className="font-title text-2xl text-purple-400 tracking-wider">
                    R$ {calculateTotal().toFixed(2).replace('.', ',')}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Coreografias Tab */}
      {schoolSelected && activeTab === 'coreografias' && (
        <ChoreographyFactory schoolId={selectedSchool} />
      )}

      {/* Empty state if no school */}
      {!schoolSelected && !isCreatingSchool && (
        <div className="text-center py-20 border border-dashed border-zinc-800 rounded-xl">
          <Building className="w-10 h-10 text-zinc-600 mx-auto mb-4" />
          <p className="text-zinc-400">Selecione ou cadastre uma escola para começar.</p>
          <Button className="mt-4 bg-neon-gradient text-white font-bold" onClick={() => setIsCreatingSchool(true)}>
            <Plus className="w-4 h-4 mr-2" /> Cadastrar Escola
          </Button>
        </div>
      )}
    </div>
  );
}
