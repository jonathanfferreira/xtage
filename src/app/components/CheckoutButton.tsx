"use client";
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface CheckoutButtonProps {
  type: 'escola' | 'ingresso';
  amount: number;
  className?: string;
  children: React.ReactNode;
}

export function CheckoutButton({ type, amount, className, children }: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticketType: type, amount }),
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Erro ao gerar checkout');
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error: any) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleCheckout} 
      disabled={loading}
      className={className}
    >
      {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
      {loading ? 'Processando...' : children}
    </Button>
  );
}
