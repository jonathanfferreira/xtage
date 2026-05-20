'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Loader2, Music, Building2, Ticket, Award, ChevronLeft } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'motion/react';

type Role = 'dancer' | 'director' | 'organizer' | 'spectator' | null;

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedRole, setSelectedRole] = useState<Role>(null);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  
  // Extra fields for Director
  const [schoolName, setSchoolName] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is logged in
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) {
        router.push('/');
      } else {
        setUserId(session.user.id);
        setUserEmail(session.user.email || '');
        
        // Check if profile already exists and has a role
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', session.user.id).maybeSingle();
        if (profile?.role) {
          router.push('/hub'); // Go to hub instead of doing onboarding again
        }
      }
    });
  }, [router]);

  const handleCreateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole || !userId || !userEmail) return;

    setIsLoading(true);
    setError(null);

    try {
      let dbRole = selectedRole;
      if (selectedRole === 'spectator') {
          dbRole = 'dancer'; 
      }

      const { data: existingProfile } = await supabase.from('profiles').select('id').eq('id', userId).maybeSingle();

      let profileError;
      if (existingProfile) {
        const { error } = await supabase.from('profiles').update({
          role: dbRole,
          full_name: fullName,
          phone: phone,
        }).eq('id', userId);
        profileError = error;
      } else {
        const { error } = await supabase.from('profiles').insert([
          {
            id: userId,
            role: dbRole,
            full_name: fullName,
            phone: phone,
          }
        ]);
        profileError = error;
      }

      if (profileError) throw profileError;

      if (dbRole === 'director' && schoolName) {
        const { error: schoolError } = await supabase.from('schools').insert([{
          director_id: userId,
          name: schoolName,
          cnpj: cnpj,
          city: city,
          state: state
        }]);

        if (schoolError) {
          console.error('Failed to create school:', schoolError);
          // Optional: handle school creation error, but don't block login if profile succeeded.
        }
      }
      
      // Go to dashboard
      router.push('/');
      
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar o perfil.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextStep = () => {
    if (selectedRole) {
      setStep(2);
    }
  };

  const roles = [
    {
      id: 'dancer' as Role,
      title: 'Bailarino',
      description: 'Quero competir e participar de festivais',
      icon: <Music className="w-6 h-6 text-pink-400" />,
      color: 'border-pink-500/50 bg-pink-500/10'
    },
    {
      id: 'director' as Role,
      title: 'Diretor de Escola',
      description: 'Quero gerenciar alunos e coreografias',
      icon: <Building2 className="w-6 h-6 text-purple-400" />,
      color: 'border-purple-500/50 bg-purple-500/10'
    },
    {
      id: 'organizer' as Role,
      title: 'Organizador',
      description: 'Quero criar e gerenciar eventos',
      icon: <Award className="w-6 h-6 text-orange-400" />,
      color: 'border-orange-500/50 bg-orange-500/10'
    },
    {
      id: 'spectator' as Role,
      title: 'Fã / Espectador',
      description: 'Quero comprar ingressos para assistir',
      icon: <Ticket className="w-6 h-6 text-blue-400" />,
      color: 'border-blue-500/50 bg-blue-500/10'
    }
  ];

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 relative overflow-hidden selection:bg-pink-500/30">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-2xl">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-neon-gradient flex items-center justify-center font-bold text-white tracking-widest text-lg">
              X
            </div>
            <span className="text-xl font-bold tracking-tight text-white">XTAGE</span>
          </div>
        </div>

        <Card className="bg-black/80 border-zinc-800 backdrop-blur-xl">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                <CardHeader>
                  <CardTitle className="text-2xl text-white text-center">Como você quer usar a XTAGE?</CardTitle>
                  <CardDescription className="text-zinc-400 text-center">
                    Escolha o seu perfil principal. Você poderá alterar ou adicionar perfis depois.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {roles.map((role) => (
                      <div 
                        key={role.id}
                        onClick={() => setSelectedRole(role.id)}
                        className={`flex flex-col p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          selectedRole === role.id 
                          ? role.color + ' shadow-[0_0_15px_rgba(255,82,0,0.1)]' 
                          : 'border-zinc-800 bg-zinc-900/30 hover:border-zinc-700 hover:bg-zinc-900/80'
                        }`}
                      >
                        <div className="mb-3">{role.icon}</div>
                        <h3 className="font-semibold text-white mb-1">{role.title}</h3>
                        <p className="text-sm text-zinc-400">{role.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full bg-neon-gradient text-white border-0 py-6 text-lg hover:opacity-90 transition-all font-semibold"
                    disabled={!selectedRole}
                    onClick={handleNextStep}
                  >
                    Continuar
                  </Button>
                </CardFooter>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                <form onSubmit={handleCreateProfile}>
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white" onClick={() => setStep(1)}>
                        <ChevronLeft className="h-5 w-5" />
                      </Button>
                      <CardTitle className="text-2xl text-white">Complete seu perfil</CardTitle>
                    </div>
                    <CardDescription className="text-zinc-400 ml-10">
                      Configure suas informações básicas para acessar a plataforma.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 px-10">
                    {error && (
                      <div className="p-3 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-md">
                        {error}
                      </div>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="text-zinc-300">Nome Completo</Label>
                      <Input 
                        id="fullName" 
                        placeholder="Seu nome completo" 
                        required 
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="bg-black border-zinc-800 text-white focus-visible:ring-purple-500"
                      />
                    </div>
                    <div className="space-y-2">
                       <Label htmlFor="phone" className="text-zinc-300">Telefone / WhatsApp</Label>
                       <Input 
                         id="phone" 
                         placeholder="(11) 90000-0000" 
                         value={phone}
                         onChange={(e) => setPhone(e.target.value)}
                         className="bg-black border-zinc-800 text-white focus-visible:ring-purple-500"
                       />
                     </div>

                     {selectedRole === 'director' && (
                       <>
                         <div className="pt-4 pb-2 border-t border-zinc-800/50 mt-4">
                           <h4 className="text-sm font-semibold text-purple-400 uppercase tracking-widest mb-1">Dados da Escola</h4>
                           <p className="text-xs text-zinc-500 -mt-1">Prepare sua escola para inscrever bailarinos.</p>
                         </div>
                         <div className="space-y-2">
                           <Label htmlFor="schoolName" className="text-zinc-300">Nome da Escola / Studio *</Label>
                           <Input 
                             id="schoolName" 
                             required
                             placeholder="Ex: Studio Alpha Dance" 
                             value={schoolName}
                             onChange={(e) => setSchoolName(e.target.value)}
                             className="bg-black border-zinc-800 text-white focus-visible:ring-purple-500"
                           />
                         </div>
                         <div className="grid grid-cols-2 gap-4">
                           <div className="space-y-2">
                             <Label htmlFor="cnpj" className="text-zinc-300">CNPJ (Opcional)</Label>
                             <Input 
                               id="cnpj" 
                               placeholder="00.000.000/0000-00" 
                               value={cnpj}
                               onChange={(e) => setCnpj(e.target.value)}
                               className="bg-black border-zinc-800 text-white focus-visible:ring-purple-500"
                             />
                           </div>
                           <div className="space-y-2">
                             <Label htmlFor="state" className="text-zinc-300">Estado *</Label>
                             <Input 
                               id="state" 
                               required
                               placeholder="Ex: SP" 
                               value={state}
                               onChange={(e) => setState(e.target.value)}
                               className="bg-black border-zinc-800 text-white focus-visible:ring-purple-500"
                             />
                           </div>
                         </div>
                         <div className="space-y-2">
                           <Label htmlFor="city" className="text-zinc-300">Cidade *</Label>
                           <Input 
                             id="city" 
                             required
                             placeholder="Ex: São Paulo" 
                             value={city}
                             onChange={(e) => setCity(e.target.value)}
                             className="bg-black border-zinc-800 text-white focus-visible:ring-purple-500"
                           />
                         </div>
                       </>
                     )}
                   </CardContent>
                  <CardFooter className="px-10 pb-8">
                    <Button 
                      type="submit" 
                      className="w-full bg-neon-gradient text-white border-0 py-6 text-lg hover:opacity-90 mt-4 font-semibold"
                      disabled={isLoading}
                    >
                      {isLoading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : null}
                      Finalizar e Acessar
                    </Button>
                  </CardFooter>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </div>
    </div>
  );
}
