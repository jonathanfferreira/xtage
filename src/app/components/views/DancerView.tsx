'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { LayoutDashboard, Music, ShieldAlert, QrCode, CheckCircle2, Search, Building2, Loader2, Clock } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export default function DancerView() {
  const [isPaid, setIsPaid] = useState(false);
  const [showCredential, setShowCredential] = useState(false);
  
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState('');
  
  // School logic
  const [schoolState, setSchoolState] = useState<'loading' | 'none' | 'pending' | 'accepted'>('loading');
  const [mySchool, setMySchool] = useState<any>(null);
  
  // Search schools
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUserId(session.user.id);
        fetchUserData(session.user.id);
        fetchMySchool(session.user.id);
      }
    });
  }, []);

  const fetchUserData = async (id: string) => {
    const { data } = await supabase.from('profiles').select('full_name').eq('id', id).single();
    if (data) setUserName(data.full_name);
  };

  const fetchMySchool = async (dancerId: string) => {
    try {
      const { data, error } = await supabase
        .from('school_dancers')
        .select(`
          status,
          schools (
            id,
            name,
            city,
            state
          )
        `)
        .eq('dancer_id', dancerId)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        setSchoolState('none');
      } else {
        setMySchool(data.schools);
        setSchoolState(data.status as 'pending' | 'accepted');
      }
    } catch (err) {
      console.error(err);
      setSchoolState('none');
    }
  };

  const handleSearchSchools = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    const { data, error } = await supabase
      .from('schools')
      .select('id, name, city, state')
      .ilike('name', `%${searchQuery}%`)
      .limit(5);
      
    if (data) setSearchResults(data);
    setIsSearching(false);
  };

  const requestJoinSchool = async (schoolId: string) => {
    if (!userId) return;
    
    try {
      const { error } = await supabase.from('school_dancers').insert([{
        school_id: schoolId,
        dancer_id: userId,
        status: 'pending'
      }]);
      
      if (error) throw error;
      
      toast.success('Solicitação enviada!');
      fetchMySchool(userId);
    } catch (err: any) {
      toast.error('Erro ao solicitar ingresso: ' + err.message);
    }
  };

  const leaveSchool = async () => {
    if (!userId || !mySchool) return;
    
    try {
      const { error } = await supabase.from('school_dancers').delete().eq('dancer_id', userId).eq('school_id', mySchool.id);
      if (error) throw error;
      
      setMySchool(null);
      setSchoolState('none');
      toast.success('Você saiu da escola.');
    } catch (err) {
      toast.error('Erro ao sair da escola.');
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-lg mx-auto md:max-w-4xl space-y-6">
      <div className="flex flex-col gap-2 mb-8">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">Meu Portal</h2>
        <p className="text-zinc-400 text-sm md:text-base">Bem-vindo(a) de volta, {userName || 'Bailarino'}.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="space-y-6">
          
          {/* Minha Escola Card */}
          <Card className="bg-[#050505] border-zinc-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-purple-400" />
                Minha Escola
              </CardTitle>
            </CardHeader>
            <CardContent>
              {schoolState === 'loading' && (
                <div className="flex justify-center p-4"><Loader2 className="w-6 h-6 animate-spin text-zinc-500" /></div>
              )}
              
              {schoolState === 'none' && (
                <div className="space-y-4">
                  <p className="text-sm text-zinc-400">Você ainda não faz parte de nenhuma escola. Procure pelo nome para solicitar ingresso.</p>
                  <form onSubmit={handleSearchSchools} className="flex gap-2">
                    <Input 
                      placeholder="Nome da escola..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-zinc-900 border-zinc-800 text-white"
                    />
                    <Button type="submit" disabled={isSearching} className="bg-zinc-800 text-white hover:bg-zinc-700">
                      {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                    </Button>
                  </form>
                  
                  {searchResults.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {searchResults.map(school => (
                        <div key={school.id} className="p-3 border border-zinc-800 rounded-lg flex items-center justify-between bg-zinc-900/50">
                          <div>
                            <p className="text-sm font-medium text-white">{school.name}</p>
                            <p className="text-xs text-zinc-500">{school.city}, {school.state}</p>
                          </div>
                          <Button size="sm" onClick={() => requestJoinSchool(school.id)} className="bg-purple-600 hover:bg-purple-700 text-white">
                            Solicitar
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {schoolState === 'pending' && mySchool && (
                <div className="flex flex-col items-center justify-center p-6 text-center border border-dashed border-zinc-700 rounded-lg bg-zinc-900/30">
                  <Clock className="w-8 h-8 text-orange-400 mb-2" />
                  <p className="text-sm text-white font-medium">Solicitação Enviada</p>
                  <p className="text-xs text-zinc-400 mt-1 mb-4">Aguardando aprovação do diretor da escola <strong>{mySchool.name}</strong>.</p>
                  <Button variant="outline" size="sm" onClick={leaveSchool} className="border-zinc-700 text-zinc-400 hover:text-red-400 hover:bg-zinc-900">
                    Cancelar Solicitação
                  </Button>
                </div>
              )}

              {schoolState === 'accepted' && mySchool && (
                <div className="flex items-center justify-between p-4 border border-zinc-800 bg-zinc-900/50 rounded-lg">
                  <div>
                    <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/50 mb-1 pointer-events-none">Membro Oficial</Badge>
                    <p className="text-lg font-medium text-white">{mySchool.name}</p>
                    <p className="text-xs text-zinc-400">{mySchool.city}, {mySchool.state}</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={leaveSchool} className="text-zinc-500 hover:text-red-400">Sair</Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card className="bg-[#050505] border-zinc-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-white">Minhas Coreografias</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-6 text-center border border-dashed border-zinc-700 rounded-lg bg-zinc-900/30">
                <Music className="w-6 h-6 text-zinc-600 mx-auto mb-2" />
                <p className="text-sm text-zinc-400">Nenhuma coreografia cadastrada para você ainda.</p>
                <p className="text-xs text-zinc-500 mt-1">Seu diretor precisa adicioná-lo ao elenco da coreografia.</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Stub Checkout for now */}
        <div className="space-y-6">
           <Card className="bg-[#0A0A0A] border-green-500/50 relative overflow-hidden opacity-50">
             <div className="absolute top-0 left-0 w-full h-1 bg-green-500 opacity-80" />
             <CardHeader className="pb-4">
               <div className="flex items-center gap-2 mb-1">
                 <CheckCircle2 className="w-5 h-5 text-green-400" />
                 <CardTitle className="text-white text-lg">Inscrição Aprovada</CardTitle>
               </div>
               <CardDescription className="text-zinc-400 text-sm">
                 Você ainda não possui faturas pendentes de festivais.
               </CardDescription>
             </CardHeader>
           </Card>
        </div>

      </div>
    </div>
  );
}
