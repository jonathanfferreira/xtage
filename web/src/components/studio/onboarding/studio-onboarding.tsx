'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/utils/supabase/client';
import {
    ArrowRight, ArrowLeft, CheckCircle2, Layout,
    Palette, Link as LinkIcon, PlayCircle,
    DollarSign, Rocket
} from 'lucide-react';
import Image from 'next/image';

const STEPS = [
    {
        id: 'welcome',
        title: 'Bem-vindo ao Studio',
        description: 'Parabéns! Você agora faz parte do XTAGE. Vamos configurar sua vitrine de cursos em menos de 2 minutos.',
        icon: <Layout className="text-primary" size={40} />,
        color: '#6324b2'
    },
    {
        id: 'brand',
        title: 'Sua Identidade',
        description: 'Personalize sua escola com sua logo e cor da marca. Isso cria confiança e profissionalismo para seus alunos.',
        icon: <Palette className="text-secondary" size={40} />,
        color: '#eb00bc'
    },
    {
        id: 'url',
        title: 'Seu Endereço Único',
        description: 'Defina seu slug (ex: xtage.app/sua-escola). É através deste link que você fará todas as suas vendas.',
        icon: <LinkIcon className="text-blue-400" size={40} />,
        color: '#2563eb'
    },
    {
        id: 'content',
        title: 'Crie seu Primeiro Curso',
        description: 'O coração da plataforma. Suba seus vídeos, organize módulos e defina se será assinatura ou venda única.',
        icon: <PlayCircle className="text-green-400" size={40} />,
        color: '#10b981'
    },
    {
        id: 'finance',
        title: 'Configure seus Recebimentos',
        description: 'Vá em Financeiro para ativar sua conta no Asaas. Sem isso, você não consegue processar pagamentos de alunos.',
        icon: <DollarSign className="text-amber-400" size={40} />,
        color: '#f59e0b'
    },
    {
        id: 'ready',
        title: 'Tudo Pronto!',
        description: 'Agora a pista é sua. Explore o painel, crie conteúdos incríveis e transforme a vida dos seus alunos através da dança.',
        icon: <Rocket className="text-primary animate-bounce" size={40} />,
        color: '#6324b2'
    }
];

export function StudioOnboardingModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const checkOnboarding = async () => {
            const hasDoneLocal = localStorage.getItem('xtage_studio_onboarding_done');
            if (hasDoneLocal) return;

            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                const isComplete = user.user_metadata?.studio_onboarding_completed;
                if (!isComplete) {
                    setIsOpen(true);
                } else {
                    localStorage.setItem('xtage_studio_onboarding_done', 'true');
                }
            }
        };
        checkOnboarding();
    }, []);

    const handleNext = () => {
        if (currentStep < STEPS.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            handleComplete();
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const handleComplete = async () => {
        setLoading(true);
        try {
            const supabase = createClient();
            await supabase.auth.updateUser({
                data: {
                    studio_onboarding_completed: true
                }
            });
            localStorage.setItem('xtage_studio_onboarding_done', 'true');
            setIsOpen(false);
        } catch (error) {
            console.error('Error completing onboarding:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    const step = STEPS[currentStep];
    const progress = ((currentStep + 1) / STEPS.length) * 100;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/95 backdrop-blur-xl"
                />

                {/* Modal Container */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="relative w-full max-w-xl bg-[#0a0a0a] border border-[#222] rounded-3xl overflow-hidden shadow-[0_0_150px_rgba(99,36,178,0.2)]"
                >
                    {/* Top Progress Bar */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-[#151515]">
                        <motion.div
                            className="h-full bg-primary"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.5 }}
                        />
                    </div>

                    <div className="p-8 sm:p-12">
                        {/* Icon Area */}
                        <div className="flex justify-center mb-8">
                            <motion.div
                                key={step.id}
                                initial={{ scale: 0.5, rotate: -20, opacity: 0 }}
                                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                                transition={{ type: 'spring', damping: 10 }}
                                className="w-24 h-24 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center shadow-inner"
                            >
                                {step.icon}
                            </motion.div>
                        </div>

                        {/* Text Content */}
                        <div className="text-center space-y-4 mb-10">
                            <motion.div
                                key={`title-${step.id}`}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.1 }}
                            >
                                <span className="text-[10px] font-mono text-primary uppercase tracking-[0.3em] font-bold">Passo {currentStep + 1} de {STEPS.length}</span>
                                <h2 className="text-3xl font-bold font-heading text-white uppercase tracking-tight mt-2">
                                    {step.title}
                                </h2>
                            </motion.div>

                            <motion.p
                                key={`desc-${step.id}`}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="text-[#888] text-sm leading-relaxed max-w-sm mx-auto"
                            >
                                {step.description}
                            </motion.p>
                        </div>

                        {/* Navigation Buttons */}
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={handleNext}
                                disabled={loading}
                                className="w-full h-14 bg-white text-black hover:bg-primary hover:text-white transition-all duration-300 font-bold rounded-2xl flex items-center justify-center gap-2 uppercase tracking-widest text-xs disabled:opacity-50 group"
                            >
                                {loading ? 'Carregando...' : (
                                    <>
                                        {currentStep === STEPS.length - 1 ? 'Começar Agora' : 'Próximo Passo'}
                                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>

                            {currentStep > 0 && (
                                <button
                                    onClick={handleBack}
                                    className="w-full h-12 text-[#555] hover:text-[#888] transition-colors font-mono uppercase tracking-widest text-[10px] flex items-center justify-center gap-2"
                                >
                                    <ArrowLeft size={14} /> Voltar
                                </button>
                            )}
                        </div>

                        {/* Footer Help */}
                        <div className="mt-10 pt-8 border-t border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 size={14} className="text-green-500" />
                                <span className="text-[10px] font-mono text-[#444] uppercase tracking-widest">Setup Inteligente</span>
                            </div>
                            <div className="flex gap-1">
                                {STEPS.map((_, i) => (
                                    <div
                                        key={i}
                                        className={`w-1.5 h-1.5 rounded-full transition-colors ${i === currentStep ? 'bg-primary' : 'bg-[#222]'}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
