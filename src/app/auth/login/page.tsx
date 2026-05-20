'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthModal } from '@/lib/auth-modal-store';

export default function LoginRedirect() {
  const router = useRouter();
  const { open } = useAuthModal();

  useEffect(() => {
    // Abre o modal na home em vez de mostrar a página de login separada
    router.replace('/');
    setTimeout(() => open('login'), 300);
  }, []);

  return null;
}
