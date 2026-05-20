import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PlayCircle, CheckCircle, Clock, Save, FileText } from 'lucide-react';

const mockChoreographies = [
  { id: '1', name: 'Vento em Popa', school: 'Studio Alpha', category: 'Jazz - Avançado', status: 'now_playing' },
  { id: '2', name: 'Lago dos Cisnes (Ato II)', school: 'Cia de Ballet', category: 'Ballet Clássico', status: 'next' },
  { id: '3', name: 'Urban Revolution', school: 'Street K', category: 'Danças Urbanas', status: 'pending' },
  { id: '4', name: 'Silêncio', school: 'Studio Alpha', category: 'Dança Contemporânea', status: 'evaluated' },
];

export default function JudgeView() {
  const [selectedChoreo, setSelectedChoreo] = useState<string | null>('1');
  
  // Mocked criteria
  const [scores, setScores] = useState<Record<string, string>>({
    'Técnica': '0.0',
    'Coreografia': '0.0',
    'Presença': '0.0',
    'Figurino': '0.0'
  });

  const handleScoreChange = (criteria: string, value: string) => {
    // Only allow numbers and one decimal dot, max length of 4 (e.g. 10.0 or 9.75 mostly standard max length 4)
    let val = value.replace(/[^0-9.]/g, '');
    if (val.split('.').length > 2) val = val.substring(0, val.length - 1);
    
    // Limits
    const num = parseFloat(val);
    if (num > 10) val = '10.0';

    setScores(prev => ({ ...prev, [criteria]: val }));
  };

  const selectedData = mockChoreographies.find(c => c.id === selectedChoreo);

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <Badge variant="outline" className="bg-purple-500/10 text-purple-400 border-purple-500/50 mb-2">
            Módulo Jurado
          </Badge>
          <h2 className="text-3xl font-title text-white mb-2">Litoral em Dança 2026</h2>
          <p className="text-muted-foreground text-sm">Avaliando: Categoria Geral • Mesa Jurado 1</p>
        </div>
        <div className="flex bg-[#050505] border border-zinc-800 rounded-lg p-2 gap-4">
           <div className="text-center px-4 border-r border-zinc-800">
             <p className="text-[10px] text-zinc-500 font-bold uppercase">Avaliadas</p>
             <p className="text-xl font-mono text-white">12</p>
           </div>
           <div className="text-center px-2">
             <p className="text-[10px] text-zinc-500 font-bold uppercase">Restantes</p>
             <p className="text-xl font-mono text-purple-400">45</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col - Queue */}
        <div className="space-y-4">
          <h3 className="font-subtitle text-xl text-white flex items-center gap-2">
             <Clock className="w-5 h-5 text-zinc-400" /> Fila de Apresentação
          </h3>
          <div className="space-y-3">
             {mockChoreographies.map(choreo => (
               <div 
                 key={choreo.id}
                 onClick={() => setSelectedChoreo(choreo.id)}
                 className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col gap-2 ${
                   selectedChoreo === choreo.id 
                    ? 'bg-purple-500/10 border-purple-500/50 relative overflow-hidden' 
                    : 'bg-[#050505] border-zinc-800 hover:border-zinc-700'
                 }`}
               >
                 {selectedChoreo === choreo.id && (
                   <div className="absolute top-0 left-0 w-1 h-full bg-purple-500" />
                 )}
                 <div className="flex justify-between items-start">
                   <h4 className={`font-bold text-sm ${selectedChoreo === choreo.id ? 'text-white' : 'text-zinc-300'}`}>{choreo.name}</h4>
                   {choreo.status === 'now_playing' && <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/30 text-[10px] uppercase animate-pulse">No Palco</Badge>}
                   {choreo.status === 'evaluated' && <CheckCircle className="w-4 h-4 text-green-500" />}
                 </div>
                 <div className="text-xs text-zinc-500">{choreo.category}</div>
               </div>
             ))}
          </div>
        </div>

        {/* Right Col - Evaluation */}
        <div className="lg:col-span-2 space-y-6">
           {selectedData ? (
             <Card className="bg-[#050505] border-zinc-800 relative overflow-hidden">
               {selectedData.status === 'evaluated' && (
                 <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
                   <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                     <CheckCircle className="w-8 h-8 text-green-500" />
                   </div>
                   <h3 className="text-xl font-bold text-white mb-2">Coreografia Avaliada</h3>
                   <p className="text-zinc-400 mb-6 text-sm">As notas já foram enviadas para o sistema.</p>
                   <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:text-white" onClick={() => {
                     // Hacky mock reset for demo
                     const cm = [...mockChoreographies];
                     const idx = cm.findIndex(c => c.id === selectedData.id);
                     if(idx >= 0) cm[idx].status = 'pending';
                   }}>Editar Notas</Button>
                 </div>
               )}
               <CardHeader className="pb-4 border-b border-zinc-800/50">
                 <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded bg-zinc-900 border border-zinc-800">
                      <PlayCircle className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl text-white">{selectedData.name}</CardTitle>
                      <CardDescription className="text-purple-300 font-medium">{selectedData.school}</CardDescription>
                    </div>
                 </div>
                 <Badge variant="outline" className="bg-zinc-900 text-zinc-400 border-zinc-800 mt-2 self-start">{selectedData.category}</Badge>
               </CardHeader>
               <CardContent className="pt-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Scores Inputs */}
                    <div className="space-y-4">
                       <h4 className="text-sm font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                         <FileText className="w-4 h-4" /> Critérios (0 a 10)
                       </h4>
                       
                       <div className="space-y-3">
                         {Object.keys(scores).map((criteria) => (
                           <div key={criteria} className="flex items-center justify-between bg-zinc-900/50 border border-zinc-800 p-3 rounded-lg">
                             <div className="flex flex-col">
                               <span className="text-sm font-semibold text-white">{criteria}</span>
                               <span className="text-xs text-zinc-500">Nota mínima: 0.0</span>
                             </div>
                             <input 
                               type="text" 
                               value={scores[criteria] || ''} 
                               onChange={(e) => handleScoreChange(criteria, e.target.value)}
                               className="w-20 text-center bg-black border-2 border-zinc-700 focus:border-purple-500 rounded-md py-2 text-white font-mono text-lg font-bold outline-none transition-colors"
                               placeholder="0.0"
                             />
                           </div>
                         ))}
                       </div>
                    </div>

                    {/* Quick Rules / Info */}
                    <div className="space-y-4">
                       <h4 className="text-sm font-bold uppercase tracking-widest text-purple-500/50">Regras de Julgamento</h4>
                       <div className="bg-purple-900/10 border border-purple-500/20 p-4 rounded-xl text-sm text-zinc-300 space-y-3">
                         <p>
                           <strong className="text-purple-300">Técnica (Peso 4):</strong> Avalie salto, giro, postura, limpeza dos movimentos e afinação corporal.
                         </p>
                         <p>
                           <strong className="text-purple-300">Coreografia (Peso 3):</strong> Avalie a criatividade, uso do espaço, formações e transições.
                         </p>
                         <p>
                           <strong className="text-zinc-400 font-normal italic">Lembrete: Use notas quebrem em decimais (ex: 9.8, 8.5) para evitar empates.</strong>
                         </p>
                       </div>
                    </div>
                 </div>

                 {/* Private Note */}
                 <div className="mt-8 space-y-2">
                    <label className="text-sm font-bold text-zinc-400 pl-1">Feedback Privado (opcional, entregue ao diretor)</label>
                    <textarea 
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors min-h-[100px] resize-y"
                      placeholder="Deixe um comentário construtivo sobre a coreografia..."
                    ></textarea>
                 </div>
               </CardContent>
               <CardFooter className="bg-zinc-900/30 border-t border-zinc-800 p-4 flex justify-end">
                  <Button className="bg-[#FFD700] hover:bg-[#FFD700]/90 text-black font-bold px-8 shadow-[0_0_15px_rgba(255,215,0,0.3)]">
                    <Save className="w-4 h-4 mr-2" />
                    Enviar Notas Oficiais
                  </Button>
               </CardFooter>
             </Card>
           ) : (
             <div className="h-full min-h-[300px] border-2 border-dashed border-zinc-800 rounded-xl flex items-center justify-center flex-col text-zinc-500">
                <PlayCircle className="w-12 h-12 mb-2 opacity-50" />
                <p>Selecione uma coreografia na fila.</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
