"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Wallet, CheckCircle, ArrowRight, AlertCircle } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { useSearchParams } from 'next/navigation';

function FinanceViewContent() {
  const [loading, setLoading] = useState(false);
  const [stripeAccount, setStripeAccount] = useState<string | null>(null);
  const supabase = createClient();
  const searchParams = useSearchParams();
  const status = searchParams.get('status');

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from('profiles').select('stripe_account_id').eq('id', user.id).single();
        if (data) {
          setStripeAccount(data.stripe_account_id);
        }
      }
    }
    loadProfile();
  }, [supabase]);

  const handleConnect = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/stripe/connect', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erro ao conectar com Stripe');
      }
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error: any) {
      console.error('Error connecting to Stripe:', error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 animate-in text-white">
      <div>
        <h1 className="font-heading text-4xl mb-2">Carteira XTAGE</h1>
        <p className="text-zinc-400 font-sans">Gerencie seus recebimentos de inscrições e vendas de ingressos.</p>
      </div>

      {status === 'success' && (
        <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-lg flex items-center gap-3">
          <CheckCircle className="w-5 h-5" />
          <p>Conta bancária conectada com sucesso! Você já pode receber pagamentos.</p>
        </div>
      )}

      {status === 'refresh' && (
        <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 p-4 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5" />
          <p>O processo de conexão foi interrompido. Por favor, tente novamente.</p>
        </div>
      )}

      <div className="glass-panel rounded-2xl p-8 border border-white/10">
        <div className="flex flex-col md:flex-row items-start gap-6">
          <div className="w-16 h-16 rounded-2xl bg-purple-500/20 flex items-center justify-center border border-purple-500/30 shrink-0">
            <Wallet className="w-8 h-8 text-purple-400" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-heading mb-2">Recebimentos Automatizados</h2>
            <p className="text-zinc-400 mb-6 font-sans leading-relaxed">
              A XTAGE utiliza a infraestrutura global do Stripe para garantir que o dinheiro das inscrições do seu festival caia direto na sua conta bancária (Split de Pagamento Automático).
            </p>

            {stripeAccount ? (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-lg max-w-sm">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                  <div>
                    <span className="font-bold text-green-400 block text-lg">Conta Conectada</span>
                    <span className="text-xs text-green-400/80">Stripe Express</span>
                  </div>
                </div>
                <p className="text-sm text-zinc-500">Seus repasses acontecerão automaticamente para a conta configurada.</p>
              </div>
            ) : (
              <Button 
                onClick={handleConnect} 
                disabled={loading}
                className="bg-white text-black hover:bg-zinc-200 font-bold px-8 py-6 h-auto text-lg rounded-xl flex items-center gap-2 transition-all w-full sm:w-auto"
              >
                {loading ? 'Redirecionando ao Banco...' : 'Conectar Conta Bancária'} 
                {!loading && <ArrowRight className="w-5 h-5" />}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FinanceView() {
  return (
    <Suspense fallback={<div className="p-8">Carregando carteira...</div>}>
      <FinanceViewContent />
    </Suspense>
  );
}
