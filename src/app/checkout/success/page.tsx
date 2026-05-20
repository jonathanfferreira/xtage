import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight } from 'lucide-react';

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
      <div className="w-20 h-20 bg-green-500/20 border border-green-500/30 rounded-full flex items-center justify-center mb-8 animate-in zoom-in">
        <CheckCircle className="w-10 h-10 text-green-400" />
      </div>
      
      <h1 className="text-4xl md:text-6xl font-heading text-white tracking-tight mb-4">
        Pagamento Confirmado!
      </h1>
      
      <p className="text-xl text-zinc-400 max-w-lg mx-auto mb-12 font-sans">
        Sua transação foi aprovada e processada de forma segura pela XTAGE e Stripe. 
        O organizador do festival já recebeu o pagamento e sua vaga está garantida.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Link href="/">
          <Button className="bg-white text-black hover:bg-zinc-200 font-bold px-8 py-6 h-auto text-lg rounded-xl flex items-center gap-2">
            Ver meus Ingressos <ArrowRight className="w-5 h-5" />
          </Button>
        </Link>
        <Link href="/">
          <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-900 font-bold px-8 py-6 h-auto text-lg rounded-xl">
            Voltar ao Início
          </Button>
        </Link>
      </div>
    </div>
  );
}
