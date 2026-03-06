'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Play, Loader2, CheckCircle } from 'lucide-react';

interface CourseActionButtonsProps {
    courseId: string;
    hasAccess: boolean;
    firstLessonId: string | null;
    pricingType: string;
    brandColor: string;
}

export function CourseActionButtons({ courseId, hasAccess, firstLessonId, pricingType, brandColor }: CourseActionButtonsProps) {
    const router = useRouter();
    const [enrolling, setEnrolling] = useState(false);
    const [message, setMessage] = useState('');
    const [enrolled, setEnrolled] = useState(hasAccess);

    const handleEnroll = async () => {
        // For paid courses, redirect to the full checkout page
        if (pricingType !== 'free') {
            router.push(`/checkout/${courseId}`);
            return;
        }

        // Free courses: enroll directly
        setEnrolling(true);
        setMessage('');

        try {
            const res = await fetch('/api/courses/enroll', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ course_id: courseId }),
            });

            const data = await res.json();

            if (res.status === 200 && data.enrollment) {
                setEnrolled(true);
                setMessage('✅ Você já está matriculado!');
                return;
            }

            if (!res.ok) {
                setMessage(data.error || 'Erro ao matricular.');
                return;
            }

            setEnrolled(true);
            setMessage('🎉 Matrícula realizada! +50 XP');

            if (firstLessonId) {
                setTimeout(() => router.push(`/dashboard/aula/${firstLessonId}`), 1500);
            } else {
                setTimeout(() => router.refresh(), 1500);
            }
        } catch {
            setMessage('Erro de conexão. Tente novamente.');
        } finally {
            setEnrolling(false);
        }
    };

    if (enrolled) {
        return (
            <div className="space-y-3">
                <button
                    onClick={() => firstLessonId ? router.push(`/dashboard/aula/${firstLessonId}`) : null}
                    className="w-full flex items-center justify-center gap-2 py-4 rounded-lg font-bold uppercase tracking-wider text-sm transition-colors text-white"
                    style={{ backgroundColor: brandColor }}
                >
                    <Play size={18} fill="currentColor" /> Continuar Estudando
                </button>
                {message && (
                    <p className="text-green-400 text-xs font-mono text-center flex items-center justify-center gap-2">
                        <CheckCircle size={12} /> {message}
                    </p>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <button
                onClick={handleEnroll}
                disabled={enrolling}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-lg font-bold uppercase tracking-wider text-sm transition-all text-white hover:opacity-90 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60"
                style={{ backgroundColor: brandColor }}
            >
                {enrolling ? (
                    <><Loader2 size={18} className="animate-spin" /> Processando...</>
                ) : (
                    <>
                        <ShoppingCart size={18} />
                        {pricingType === 'free' ? 'Matricular Grátis' : 'Comprar Acesso'}
                    </>
                )}
            </button>
            {message && (
                <p className={`text-xs font-mono text-center ${message.includes('Erro') || message.includes('💳') ? 'text-yellow-400' : 'text-green-400'}`}>
                    {message}
                </p>
            )}
        </div>
    );
}

interface TrailerButtonProps {
    courseId: string;
    hasAccess: boolean;
    firstLessonId: string | null;
    brandColor: string;
}

export function TrailerButton({ courseId, hasAccess, firstLessonId, brandColor }: TrailerButtonProps) {
    const router = useRouter();
    const [showMessage, setShowMessage] = useState(false);

    const handleClick = () => {
        if (hasAccess && firstLessonId) {
            router.push(`/dashboard/aula/${firstLessonId}`);
        } else if (!hasAccess) {
            // User doesn't have access — redirect to checkout
            router.push(`/checkout/${courseId}`);
        } else {
            setShowMessage(true);
            setTimeout(() => setShowMessage(false), 3000);
        }
    };

    return (
        <div className="relative z-10 flex flex-col items-center gap-3">
            <button
                onClick={handleClick}
                className="flex flex-col items-center gap-3 group"
            >
                <div
                    className="w-20 h-20 rounded-full flex items-center justify-center pl-1 border-2 border-white/30 backdrop-blur-md transition-transform group-hover:scale-110"
                    style={{ backgroundColor: brandColor + '80' }}
                >
                    <Play size={36} className="text-white" fill="currentColor" />
                </div>
                <span className="text-white/70 text-xs font-mono uppercase tracking-widest">
                    {hasAccess ? 'Assistir Agora' : 'Ver Prévia'}
                </span>
            </button>
            {showMessage && (
                <p className="bg-black/80 px-4 py-2 rounded text-white text-xs font-mono animate-fade-in">
                    Nenhum vídeo disponível ainda.
                </p>
            )}
        </div>
    );
}
