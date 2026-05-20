import type {Metadata} from 'next';
import './globals.css';

import { Chatbot } from '@/components/ui/Chatbot';
import AuthModalWrapper from '@/app/components/AuthModalWrapper';

export const metadata: Metadata = {
  title: 'XTAGE',
  description: 'Sistema Operacional para Festivais de Dança',
};

import { Toaster } from 'sonner';

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="pt-BR" className="dark font-sans">
      <body suppressHydrationWarning className="bg-[#050505] text-white antialiased">
         {children}
         <AuthModalWrapper />
         <Chatbot />
         <Toaster theme="dark" position="top-center" richColors />
      </body>
    </html>
  );
}
