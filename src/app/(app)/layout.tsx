'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useProfileStore } from '@/lib/profile-store';
import DiscoveryLayout from '@/app/components/layouts/DiscoveryLayout';
import B2BLayout from '@/app/components/layouts/B2BLayout';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { activeProfile } = useProfileStore();
  const pathname = usePathname();

  // Wizard de criação em tela cheia (sem sidebars ou topnav padrão)
  if (pathname === '/novo-evento') {
    return <>{children}</>;
  }

  // Se for bailarino, mostra a Vitrine (Top Nav). Senão, mostra o Workspace B2B (Sidebar)
  if (activeProfile === 'bailarino') {
    return <DiscoveryLayout>{children}</DiscoveryLayout>;
  }

  return <B2BLayout>{children}</B2BLayout>;
}
