'use client';

import { useState } from 'react';
import { StudioSidebar } from './studio-sidebar';
import { Menu } from 'lucide-react';
import { NotificationBell } from '@/components/layout/notification-bell';
import Image from 'next/image';
import { StudioOnboardingModal } from './onboarding/studio-onboarding';

export function StudioLayoutWrapper({
    children,
    studioUser,
    tenant,
}: {
    children: React.ReactNode;
    studioUser: any;
    tenant: any;
}) {
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex bg-[#050505] min-h-screen text-[#ededed] font-sans selection:bg-primary/30 selection:text-white">
            <StudioOnboardingModal />
            <StudioSidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} tenant={tenant} />

            <main className="flex-1 flex flex-col relative overflow-x-hidden min-w-0">
                {/* Topbar */}
                <header className="h-[64px] border-b border-[#1a1a1a] bg-[#0a0a0a]/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-4 md:px-8">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setSidebarOpen(true)} className="md:hidden mr-2 text-[#888] hover:text-white">
                            <Menu size={20} />
                        </button>
                        <h1 className="font-heading uppercase tracking-widest text-[#555] text-sm">Painel de Curadoria</h1>
                    </div>

                    <div className="flex items-center gap-4 md:gap-6">
                        <NotificationBell />

                        <div className="flex items-center gap-4">
                            <div className="text-right hidden md:block">
                                <p className="text-sm font-bold text-white">
                                    {studioUser?.full_name || 'Criador'}
                                </p>
                                <p className="text-[10px] text-primary font-mono uppercase tracking-widest">
                                    {studioUser?.role === 'admin' ? 'Admin' : 'Escola'}
                                </p>
                            </div>
                            {studioUser?.avatar_url ? (
                                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden relative border border-[#333]">
                                    <Image src={studioUser.avatar_url} alt="" fill className="object-cover" />
                                </div>
                            ) : (
                                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#1a1a1a] border border-[#333]" />
                            )}
                        </div>
                    </div>
                </header>

                <div className="flex-1 p-4 md:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
