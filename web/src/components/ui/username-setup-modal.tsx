'use client';

import { useState, useEffect, useCallback } from 'react';
import { AtSign, CheckCircle2, XCircle, Loader2 } from 'lucide-react';

type Status = 'idle' | 'checking' | 'available' | 'taken' | 'invalid';

export function UsernameSetupModal({ onComplete }: { onComplete: (username: string) => void }) {
    const [username, setUsername] = useState('');
    const [status, setStatus] = useState<Status>('idle');
    const [message, setMessage] = useState('');
    const [saving, setSaving] = useState(false);

    const checkAvailability = useCallback(async (value: string) => {
        if (!value || value.length < 3) {
            setStatus('idle');
            setMessage('');
            return;
        }

        setStatus('checking');
        try {
            const res = await fetch(`/api/users/username?username=${encodeURIComponent(value)}`);
            const data = await res.json();
            if (data.available) {
                setStatus('available');
                setMessage('');
            } else {
                setStatus('taken');
                setMessage(data.message || 'Username já em uso.');
            }
        } catch {
            setStatus('idle');
        }
    }, []);

    // Debounce the availability check
    useEffect(() => {
        const timer = setTimeout(() => checkAvailability(username), 400);
        return () => clearTimeout(timer);
    }, [username, checkAvailability]);

    const handleInput = (value: string) => {
        const clean = value.toLowerCase().replace(/[^a-z0-9_]/g, '');
        setUsername(clean);
        if (clean.length > 0 && clean.length < 3) {
            setStatus('invalid');
            setMessage('Mínimo 3 caracteres.');
        } else if (clean.length > 30) {
            return; // block
        } else {
            setStatus('idle');
        }
    };

    const handleConfirm = async () => {
        if (status !== 'available') return;
        setSaving(true);
        try {
            const res = await fetch('/api/users/username', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username }),
            });
            if (!res.ok) {
                const err = await res.json();
                setStatus('taken');
                setMessage(err.error || 'Erro ao salvar.');
                return;
            }
            onComplete(username);
        } catch {
            setMessage('Erro de conexão. Tente novamente.');
        } finally {
            setSaving(false);
        }
    };

    const statusColor = {
        idle: 'border-[#222]',
        checking: 'border-[#333]',
        available: 'border-green-500/50',
        taken: 'border-red-500/50',
        invalid: 'border-amber-500/50',
    }[status];

    const StatusIcon = () => {
        if (status === 'checking') return <Loader2 size={16} className="text-[#555] animate-spin" />;
        if (status === 'available') return <CheckCircle2 size={16} className="text-green-500" />;
        if (status === 'taken' || status === 'invalid') return <XCircle size={16} className="text-red-500" />;
        return null;
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
            <div className="bg-[#080808] border border-[#1a1a1a] rounded-xl p-8 w-full max-w-md shadow-2xl">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-4">
                        <AtSign className="text-primary" size={24} />
                    </div>
                    <h2 className="text-2xl font-heading font-bold text-white uppercase tracking-tight">
                        Escolha seu @
                    </h2>
                    <p className="text-[#666] text-sm mt-2 leading-relaxed">
                        Seu perfil público ficará em<br />
                        <span className="text-white font-mono">xpace.dance/@{username || 'seunome'}</span>
                    </p>
                </div>

                {/* Input */}
                <div className="mb-2">
                    <div className={`relative flex items-center border ${statusColor} rounded-lg bg-[#0a0a0a] transition-colors duration-200`}>
                        <span className="pl-4 text-[#555] font-mono text-sm select-none">@</span>
                        <input
                            type="text"
                            value={username}
                            onChange={e => handleInput(e.target.value)}
                            placeholder="seunome"
                            maxLength={30}
                            autoFocus
                            className="flex-1 bg-transparent py-3 px-2 text-white font-mono text-sm outline-none placeholder:text-[#333]"
                        />
                        <span className="pr-4">
                            <StatusIcon />
                        </span>
                    </div>

                    {/* Feedback message */}
                    <div className="h-5 mt-1.5 pl-1">
                        {message && (
                            <p className={`text-xs font-mono ${status === 'available' ? 'text-green-500' : 'text-red-400'}`}>
                                {message}
                            </p>
                        )}
                        {status === 'available' && !message && (
                            <p className="text-xs font-mono text-green-500">✓ Disponível!</p>
                        )}
                    </div>
                </div>

                <p className="text-[#444] text-xs mb-6 pl-1">
                    Letras minúsculas, números e _ · 3–30 caracteres
                </p>

                {/* Confirm Button */}
                <button
                    onClick={handleConfirm}
                    disabled={status !== 'available' || saving}
                    className="w-full py-3.5 rounded-lg font-mono font-bold text-sm uppercase tracking-widest transition-all duration-200
                        bg-primary text-white hover:bg-primary/90 active:scale-[0.98]
                        disabled:opacity-30 disabled:cursor-not-allowed disabled:scale-100
                        shadow-[0_0_20px_rgba(99,36,178,0)]
                        enabled:shadow-[0_0_20px_rgba(99,36,178,0.3)]"
                >
                    {saving ? (
                        <span className="flex items-center justify-center gap-2">
                            <Loader2 size={16} className="animate-spin" /> Salvando...
                        </span>
                    ) : (
                        `Confirmar @${username || 'username'}`
                    )}
                </button>
            </div>
        </div>
    );
}
