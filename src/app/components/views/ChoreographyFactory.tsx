'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { Loader2, Plus, Music, Users, Upload, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';

interface ChoreographyFactoryProps {
  schoolId: string;
}

export default function ChoreographyFactory({ schoolId }: ChoreographyFactoryProps) {
  const [choreographies, setChoreographies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  
  // New Choreo State
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [timeLimit, setTimeLimit] = useState('');

  // Dancers list (for assignment)
  const [schoolDancers, setSchoolDancers] = useState<any[]>([]);
  
  const fetchChoreographies = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('choreographies')
      .select(`
        *,
        choreography_dancers ( dancer_id, profiles ( full_name, avatar_url ) )
      `)
      .eq('school_id', schoolId);
      
    if (error) {
      toast.error('Erro ao buscar coreografias: ' + error.message);
    } else {
      setChoreographies(data || []);
    }
    setLoading(false);
  }, [schoolId]);

  const fetchDancers = useCallback(async () => {
    const { data } = await supabase
      .from('school_dancers')
      .select('dancer_id, profiles(full_name)')
      .eq('school_id', schoolId)
      .eq('status', 'accepted');
    if (data) setSchoolDancers(data);
  }, [schoolId]);

  useEffect(() => {
    if (schoolId) {
      fetchChoreographies();
      fetchDancers();
    }
  }, [schoolId, fetchChoreographies, fetchDancers]);

  const handleCreate = async () => {
    if (!name || !category) {
      toast.error('Preencha o nome e a categoria.');
      return;
    }
    
    // We don't have a festival yet, but category_id is still required in the DB
    // wait, I made festival_id and category_id nullable!
    const { data, error } = await supabase.from('choreographies').insert([{
      school_id: schoolId,
      name,
      category,
      time_limit_seconds: timeLimit ? parseInt(timeLimit) * 60 : 180, // convert minutes to seconds, default 3 min
      status: 'draft'
    }]).select();

    if (error) {
      toast.error('Erro ao criar: ' + error.message);
    } else {
      toast.success('Coreografia criada!');
      setIsCreating(false);
      setName('');
      setCategory('');
      setTimeLimit('');
      fetchChoreographies();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente excluir esta coreografia?')) return;
    const { error } = await supabase.from('choreographies').delete().eq('id', id);
    if (error) toast.error(error.message);
    else fetchChoreographies();
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, choreoId: string) => {
    const file = event.target.files?.[0];
    if (!file) return;

    toast.loading('Enviando áudio...', { id: 'upload' });
    const fileExt = file.name.split('.').pop();
    const fileName = `${schoolId}/${choreoId}-${Math.random()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('choreography_audio')
      .upload(fileName, file);

    if (uploadError) {
      toast.error('Erro no upload: ' + uploadError.message, { id: 'upload' });
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('choreography_audio')
      .getPublicUrl(fileName);

    const { error: updateError } = await supabase
      .from('choreographies')
      .update({ music_url: publicUrl })
      .eq('id', choreoId);

    if (updateError) {
      toast.error('Erro ao salvar URL: ' + updateError.message, { id: 'upload' });
    } else {
      toast.success('Música salva com sucesso!', { id: 'upload' });
      fetchChoreographies();
    }
  };

  const handleToggleDancer = async (choreoId: string, dancerId: string, isAssigned: boolean) => {
    if (isAssigned) {
      await supabase.from('choreography_dancers').delete()
        .eq('choreography_id', choreoId)
        .eq('dancer_id', dancerId);
    } else {
      await supabase.from('choreography_dancers').insert([{
        choreography_id: choreoId,
        dancer_id: dancerId
      }]);
    }
    fetchChoreographies(); // simple refetch to update UI
  };

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-purple-500" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-title text-white tracking-wider">A Fábrica de Coreografias</h3>
          <p className="text-sm text-zinc-400">Crie suas coreografias, envie a música e vincule os bailarinos do seu elenco.</p>
        </div>
        {!isCreating && (
          <Button onClick={() => setIsCreating(true)} className="bg-neon-gradient text-white font-bold">
            <Plus className="w-4 h-4 mr-2" /> Nova Coreografia
          </Button>
        )}
      </div>

      {isCreating && (
        <Card className="bg-[#050505] border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white text-lg">Nova Coreografia</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-zinc-400 uppercase tracking-wider mb-1 block">Nome da Coreografia</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  className="w-full bg-black border border-zinc-800 rounded p-2 text-white text-sm" 
                  placeholder="Ex: Cisne Negro"
                />
              </div>
              <div>
                <label className="text-xs text-zinc-400 uppercase tracking-wider mb-1 block">Estilo / Categoria</label>
                <input 
                  type="text" 
                  value={category} 
                  onChange={e => setCategory(e.target.value)} 
                  className="w-full bg-black border border-zinc-800 rounded p-2 text-white text-sm" 
                  placeholder="Ex: Ballet Clássico de Repertório"
                />
              </div>
              <div>
                <label className="text-xs text-zinc-400 uppercase tracking-wider mb-1 block">Tempo Máximo (minutos)</label>
                <input 
                  type="number" 
                  value={timeLimit} 
                  onChange={e => setTimeLimit(e.target.value)} 
                  className="w-full bg-black border border-zinc-800 rounded p-2 text-white text-sm" 
                  placeholder="Ex: 3"
                />
              </div>
            </div>
            <div className="flex gap-2 justify-end mt-4">
              <Button variant="ghost" className="text-zinc-400" onClick={() => setIsCreating(false)}>Cancelar</Button>
              <Button className="bg-white text-black hover:bg-zinc-200" onClick={handleCreate}>Salvar Coreografia</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {choreographies.length === 0 && !isCreating ? (
        <div className="text-center py-12 border border-dashed border-zinc-800 rounded-xl">
          <p className="text-zinc-500 mb-4">Nenhuma coreografia criada ainda.</p>
          <Button onClick={() => setIsCreating(true)} variant="outline" className="border-zinc-700 text-white hover:bg-zinc-900">
            Comece a criar
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {choreographies.map(choreo => (
            <Card key={choreo.id} className="bg-[#0A0A0A] border-zinc-800 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-purple-500" />
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-2xl font-title text-white font-bold">{choreo.name}</h4>
                    <p className="text-zinc-400 text-sm">{choreo.category}</p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(choreo.id)} className="text-red-500/50 hover:text-red-400 hover:bg-red-500/10">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
                  {/* Music Upload */}
                  <div className="bg-black/50 p-4 rounded-lg border border-zinc-800/50">
                    <div className="flex items-center gap-2 mb-3">
                      <Music className="w-4 h-4 text-purple-400" />
                      <h5 className="text-sm font-bold text-white tracking-wide uppercase">Música</h5>
                    </div>
                    {choreo.music_url ? (
                      <div className="space-y-3">
                        <audio controls src={choreo.music_url} className="w-full h-8" />
                        <label className="text-xs text-zinc-500 cursor-pointer hover:text-purple-400 block text-right">
                          Trocar arquivo
                          <input type="file" className="hidden" accept="audio/*" onChange={(e) => handleFileUpload(e, choreo.id)} />
                        </label>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center border-2 border-dashed border-zinc-700 rounded-lg p-6 cursor-pointer hover:border-purple-500/50 hover:bg-purple-500/5 transition-colors">
                        <Upload className="w-6 h-6 text-zinc-500 mb-2" />
                        <span className="text-xs text-zinc-400">Clique para enviar o .mp3</span>
                        <input type="file" className="hidden" accept="audio/*" onChange={(e) => handleFileUpload(e, choreo.id)} />
                      </label>
                    )}
                  </div>

                  {/* Dancer Assignment */}
                  <div className="bg-black/50 p-4 rounded-lg border border-zinc-800/50">
                    <div className="flex items-center gap-2 mb-3">
                      <Users className="w-4 h-4 text-purple-400" />
                      <h5 className="text-sm font-bold text-white tracking-wide uppercase">Elenco ({choreo.choreography_dancers?.length || 0})</h5>
                    </div>
                    <div className="max-h-32 overflow-y-auto space-y-1 pr-2 custom-scrollbar">
                      {schoolDancers.length === 0 ? (
                        <p className="text-xs text-zinc-600">Nenhum bailarino na escola ainda.</p>
                      ) : (
                        schoolDancers.map(dancer => {
                          const isAssigned = choreo.choreography_dancers?.some((cd: any) => cd.dancer_id === dancer.dancer_id);
                          return (
                            <div key={dancer.dancer_id} className="flex justify-between items-center text-sm p-1 hover:bg-zinc-900 rounded">
                              <span className="text-zinc-300 truncate pr-2">{dancer.profiles?.full_name}</span>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className={`h-6 px-2 text-xs rounded-full ${isAssigned ? 'bg-purple-500/20 text-purple-300' : 'text-zinc-500 border border-zinc-800 hover:text-white'}`}
                                onClick={() => handleToggleDancer(choreo.id, dancer.dancer_id, isAssigned)}
                              >
                                {isAssigned ? 'Remover' : 'Adicionar'}
                              </Button>
                            </div>
                          )
                        })
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
