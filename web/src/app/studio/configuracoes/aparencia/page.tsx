'use client';

import { useState, useEffect, useRef } from 'react';
import { Settings, Save, Loader2, Upload, Link as LinkIcon, Camera, CheckCircle } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import Image from 'next/image';

const PRESET_COLORS = [
    '#6324b2', '#eb00bc', '#ff5200', '#00d4aa', '#2563eb',
    '#dc2626', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6',
];

export default function AppearanceSettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingLogo, setUploadingLogo] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [tenantId, setTenantId] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [form, setForm] = useState({
        name: '',
        slug: '',
        brand_color: '#6324b2',
        logo_url: '',
    });

    const supabase = createClient();

    useEffect(() => {
        fetch('/api/studio/tenant')
            .then(res => res.json())
            .then(data => {
                if (data.tenant) {
                    setTenantId(data.tenant.id);
                    setForm({
                        name: data.tenant.name || '',
                        slug: data.tenant.slug || '',
                        brand_color: data.tenant.brand_color || '#6324b2',
                        logo_url: data.tenant.logo_url || '',
                    });
                }
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !tenantId) return;

        const maxSize = 2 * 1024 * 1024; // 2MB
        if (file.size > maxSize) {
            setMessage({ text: 'A imagem deve ter menos de 2MB.', type: 'error' });
            return;
        }

        setUploadingLogo(true);
        setMessage({ text: '', type: '' });

        try {
            const ext = file.name.split('.').pop() || 'png';
            const path = `logos/${tenantId}-${Date.now()}.${ext}`;

            const { error: uploadErr } = await supabase.storage
                .from('public-assets')
                .upload(path, file, { upsert: true, contentType: file.type });

            if (uploadErr) throw uploadErr;

            const { data: { publicUrl } } = supabase.storage
                .from('public-assets')
                .getPublicUrl(path);

            setForm(prev => ({ ...prev, logo_url: publicUrl }));
            setMessage({ text: 'Logo enviado com sucesso!', type: 'success' });
        } catch (err: any) {
            setMessage({ text: err.message || 'Erro ao enviar logo.', type: 'error' });
        } finally {
            setUploadingLogo(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ text: '', type: '' });

        try {
            const res = await fetch('/api/studio/tenant/appearance', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Erro ao salvar');

            setMessage({ text: 'Aparência atualizada! Recarregue para ver as mudanças na sidebar.', type: 'success' });
        } catch (error: any) {
            setMessage({ text: error.message, type: 'error' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="animate-spin text-[#333]" size={32} />
            </div>
        );
    }

    return (
        <div className="max-w-2xl animate-fade-in pb-20">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-display font-bold text-white uppercase tracking-wider mb-1 flex items-center gap-2">
                    <Settings size={28} className="text-[#6324b2]" />
                    Aparência
                </h1>
                <p className="text-[#888] font-mono text-xs uppercase tracking-widest">
                    Personalize a marca da sua escola
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Logo Upload */}
                <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-6 rounded space-y-4">
                    <h2 className="text-white font-bold font-heading uppercase tracking-wide text-sm mb-4">
                        Foto / Logo da Escola
                    </h2>

                    <div className="flex items-center gap-6">
                        {/* Logo Preview Circle */}
                        <div
                            className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-dashed border-[#333] hover:border-primary/50 transition-colors cursor-pointer group shrink-0"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            {form.logo_url ? (
                                <Image src={form.logo_url} alt="Logo" fill className="object-cover" />
                            ) : (
                                <div className="w-full h-full bg-[#111] flex items-center justify-center">
                                    <Camera size={28} className="text-[#444] group-hover:text-primary transition-colors" />
                                </div>
                            )}
                            {/* Overlay on hover */}
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Upload size={20} className="text-white" />
                            </div>
                            {uploadingLogo && (
                                <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                                    <Loader2 size={20} className="text-primary animate-spin" />
                                </div>
                            )}
                        </div>

                        <div className="flex-1">
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploadingLogo}
                                className="flex items-center gap-2 bg-[#111] border border-[#333] hover:border-primary/50 text-white px-4 py-2.5 rounded text-sm font-mono transition-colors disabled:opacity-50"
                            >
                                {uploadingLogo ? (
                                    <><Loader2 size={14} className="animate-spin" /> Enviando...</>
                                ) : (
                                    <><Upload size={14} /> Enviar Foto</>
                                )}
                            </button>
                            <p className="text-[#555] text-[10px] font-mono mt-2">
                                PNG, JPG ou WebP. Máximo 2MB. Será exibida na sidebar e no catálogo.
                            </p>
                        </div>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/png,image/jpeg,image/webp"
                            className="hidden"
                            onChange={handleLogoUpload}
                        />
                    </div>
                </div>

                {/* Info Básica */}
                <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-6 rounded space-y-4">
                    <h2 className="text-white font-bold font-heading uppercase tracking-wide text-sm mb-4">
                        Informações Básicas
                    </h2>

                    <div>
                        <label className="block text-[#888] text-xs font-mono uppercase tracking-widest mb-2">
                            Nome da Escola
                        </label>
                        <input
                            type="text"
                            required
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className="w-full bg-[#111] border border-[#333] rounded px-4 py-2.5 text-white focus:outline-none focus:border-white/50 transition-colors"
                            placeholder="Ex: Academia Xpace"
                        />
                    </div>

                    <div>
                        <label className="block text-[#888] text-xs font-mono uppercase tracking-widest mb-2 flex items-center gap-2">
                            <LinkIcon size={12} /> URL da Vitrine (Slug)
                        </label>
                        <div className="flex bg-[#111] border border-[#333] rounded overflow-hidden focus-within:border-white/50 transition-colors">
                            <span className="bg-[#1a1a1a] text-[#666] px-4 py-2.5 text-sm font-mono border-r border-[#333]">
                                xpace.on/
                            </span>
                            <input
                                type="text"
                                required
                                value={form.slug}
                                onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                                className="w-full bg-transparent px-4 py-2.5 text-white focus:outline-none text-sm font-mono"
                                placeholder="minha-escola"
                            />
                        </div>
                        <p className="text-[#555] text-[10px] font-mono mt-1">
                            Este é o endereço público da sua vitrine de cursos.
                        </p>
                    </div>
                </div>

                {/* Cor da Marca */}
                <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-6 rounded space-y-4">
                    <h2 className="text-white font-bold font-heading uppercase tracking-wide text-sm mb-4">
                        Cor Primária da Marca
                    </h2>

                    <div className="grid grid-cols-5 gap-3 mb-4">
                        {PRESET_COLORS.map(color => (
                            <button
                                key={color}
                                type="button"
                                onClick={() => setForm({ ...form, brand_color: color })}
                                className={`w-full aspect-square rounded border-2 transition-all duration-200 hover:scale-110
                                    ${form.brand_color === color ? 'border-white scale-105' : 'border-transparent'}`}
                                style={{ backgroundColor: color }}
                            />
                        ))}
                    </div>

                    <div className="flex items-center gap-3">
                        <label className="font-sans text-xs text-[#666]">Personalizado:</label>
                        <input
                            type="color"
                            value={form.brand_color}
                            onChange={(e) => setForm({ ...form, brand_color: e.target.value })}
                            className="w-10 h-10 border border-[#333] bg-transparent rounded cursor-pointer"
                        />
                        <input
                            type="text"
                            required
                            value={form.brand_color.toUpperCase()}
                            onChange={(e) => setForm({ ...form, brand_color: e.target.value })}
                            className="bg-[#111] border border-[#333] rounded px-4 py-2 text-white focus:outline-none focus:border-white/50 transition-colors font-mono uppercase text-sm w-32"
                            placeholder="#6324B2"
                            pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
                        />
                    </div>
                </div>

                {/* Submit */}
                <div className="flex items-center justify-between pt-4">
                    {message.text ? (
                        <p className={`text-sm font-mono flex items-center gap-2 ${message.type === 'error' ? 'text-red-400' : 'text-green-400'}`}>
                            {message.type === 'success' && <CheckCircle size={14} />}
                            {message.text}
                        </p>
                    ) : (
                        <div />
                    )}

                    <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center justify-center gap-2 bg-[#6324b2] text-white px-6 py-2.5 rounded text-sm font-mono uppercase tracking-widest hover:bg-[#7a2cd8] transition-colors disabled:opacity-50"
                    >
                        {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                        Salvar Alterações
                    </button>
                </div>
            </form>
        </div>
    );
}
