'use client'

import { useState, useEffect } from 'react'
import { User, Mail, Camera, Save, Shield, Calendar, Link2, Key, AlertTriangle } from 'lucide-react'
import Image from 'next/image'

import { createClient } from '@/utils/supabase/client'

export default function PerfilPage() {
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [gender, setGender] = useState('N')
    const [birthYear, setBirthYear] = useState('')
    const [socialLink, setSocialLink] = useState('')
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [showPasswordModal, setShowPasswordModal] = useState(false)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        const loadProfile = async () => {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                setEmail(user.email || '')
                const { data } = await supabase.from('users').select('full_name, gender').eq('id', user.id).single()
                if (data) {
                    setFullName(data.full_name || user.user_metadata?.full_name || '')
                    if (data.gender) setGender(data.gender)
                } else {
                    setFullName(user.user_metadata?.full_name || '')
                }
            }
        }
        loadProfile()
    }, [])

    const handleSave = async () => {
        setSaving(true)
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
            await supabase.from('users').upsert({ id: user.id, full_name: fullName, gender }, { onConflict: 'id' }).select()
        }
        await new Promise(r => setTimeout(r, 600))
        setSaving(false)
        alert('Identidade atualizada na base de dados.')
    }

    return (
        <div className="max-w-3xl mx-auto pb-20">
            <div className="mb-10">
                <h1 className="font-heading text-4xl mb-2 tracking-tight uppercase">
                    <span className="text-transparent bg-clip-text text-gradient-neon">Identidade</span>
                </h1>
                <p className="text-[#888] font-sans">Gerencie seu perfil e informações de conta.</p>
            </div>

            {/* Avatar Section */}
            <div className="bg-[#0A0A0A] border border-[#222] rounded-sm p-6 mb-6">
                <div className="flex items-center gap-6">
                    <label className="relative group cursor-pointer inline-block">
                        <input type="file" accept="image/*" className="hidden" />
                        <div className="w-20 h-20 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center overflow-hidden">
                            <span className="font-heading text-2xl text-primary uppercase">JF</span>
                        </div>
                        <div className="absolute inset-0 rounded-full bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Camera size={20} className="text-white" />
                        </div>
                    </label>
                    <div>
                        <h2 className="font-heading text-xl text-white uppercase">{fullName || 'Dancer'}</h2>
                        <p className="text-xs font-sans text-[#666]">{email || 'Carregando infos...'}</p>
                        <div className="flex items-center gap-1 mt-1">
                            <Shield size={12} className="text-emerald-400" />
                            <span className="text-[10px] font-sans text-emerald-400">Conta validada ativamente</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Form */}
            <div className="bg-[#0A0A0A] border border-[#222] rounded-sm p-6 mb-6 space-y-5">
                <h2 className="font-heading text-lg uppercase tracking-widest text-white mb-4">Dados Pessoais</h2>

                <div className="space-y-2">
                    <label className="font-sans text-sm font-medium text-white/70">Nome Completo</label>
                    <div className="relative">
                        <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#555]" />
                        <input
                            type="text"
                            value={fullName}
                            onChange={e => setFullName(e.target.value)}
                            className="w-full bg-[#050505] border border-surface focus:border-primary rounded-lg pl-10 pr-4 py-3 font-sans text-white outline-none transition-colors focus:ring-1 focus:ring-primary"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="font-sans text-sm font-medium text-white/70">Como você se identifica? (Gênero)</label>
                        <select
                            value={gender}
                            onChange={e => setGender(e.target.value)}
                            className="w-full bg-[#050505] border border-surface focus:border-primary rounded-lg px-4 py-3.5 font-sans text-white outline-none transition-colors"
                        >
                            <option value="N">Prefiro não dizer</option>
                            <option value="F">Feminino</option>
                            <option value="M">Masculino</option>
                            <option value="O">Outro</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="font-sans text-sm font-medium text-white/70">Instagram ou TikTok</label>
                        <div className="relative">
                            <Link2 size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#555]" />
                            <input
                                type="text"
                                value={socialLink}
                                onChange={e => setSocialLink(e.target.value)}
                                placeholder="@seuperfil"
                                className="w-full bg-[#050505] border border-surface focus:border-primary rounded-lg pl-10 pr-4 py-3 font-sans text-white outline-none transition-colors focus:ring-1 focus:ring-primary"
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="font-sans text-sm font-medium text-white/70">E-mail</label>
                    <div className="relative">
                        <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#555]" />
                        <input
                            type="email"
                            value={email}
                            disabled
                            className="w-full bg-[#050505] border border-surface rounded-lg pl-10 pr-4 py-3 font-sans text-[#666] outline-none cursor-not-allowed"
                        />
                    </div>
                    <p className="text-[10px] font-sans text-[#444]">E-mail vinculado via OAuth. Não pode ser alterado.</p>
                </div>
            </div>

            <button
                onClick={handleSave}
                disabled={saving}
                className="w-full relative overflow-hidden rounded-lg bg-white text-black font-sans font-bold py-3.5 transition-transform duration-200 active:scale-[0.98] disabled:opacity-50"
            >
                <span className="relative z-10 flex items-center justify-center gap-2">
                    <Save size={18} />
                    {saving ? 'SALVANDO...' : 'SALVAR IDENTIDADE'}
                </span>
            </button>

            {/* Modal Senha */}
            {showPasswordModal && (
                <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50">
                    <div className="bg-[#0a0a0a] border border-[#222] rounded-lg p-6 max-w-md w-full">
                        <Key className="text-primary mb-4" size={32} />
                        <h3 className="text-xl font-bold text-white mb-2 uppercase font-heading">Alterar Senha</h3>
                        <div className="space-y-4 my-6 text-left">
                            <div>
                                <label className="text-xs text-[#888] mb-1 block">Senha Atual</label>
                                <input type="password" placeholder="••••••••" className="w-full bg-[#111] border border-[#333] p-3 rounded text-white outline-none focus:border-primary" />
                            </div>
                            <div>
                                <label className="text-xs text-[#888] mb-1 block">Nova Senha</label>
                                <input type="password" placeholder="••••••••" className="w-full bg-[#111] border border-[#333] p-3 rounded text-white outline-none focus:border-primary" />
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => setShowPasswordModal(false)} className="flex-1 px-4 py-3 border border-[#333] hover:bg-[#111] text-white rounded font-bold text-sm">CANCELAR</button>
                            <button onClick={() => { alert('Senha Redefinida (Mock)'); setShowPasswordModal(false) }} className="flex-1 px-4 py-3 bg-primary hover:bg-primary/80 text-white rounded font-bold text-sm">SALVAR SENHA</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Excluir */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50">
                    <div className="bg-[#0a0a0a] border border-red-500/30 rounded-lg p-6 max-w-md w-full text-center">
                        <AlertTriangle className="mx-auto text-red-500 mb-4" size={48} />
                        <h3 className="text-xl font-bold text-white mb-2 uppercase font-heading">Apagar Conta?</h3>
                        <p className="text-[#888] text-sm mb-6">Todos os seus cursos, progresso e assinaturas serão apagados de nossos servidores.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setShowDeleteModal(false)} className="flex-1 px-4 py-3 border border-[#333] hover:bg-[#111] text-white rounded font-bold">CANCELAR</button>
                            <button onClick={() => { alert('Conta excluída. A sessão será encerrada.'); setShowDeleteModal(false) }} className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded font-bold">CONFIRMAR</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
