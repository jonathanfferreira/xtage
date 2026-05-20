'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { CreditCard, QrCode, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';

export default function CheckoutView() {
  const router = useRouter();
  const [method, setMethod] = useState<'credit_card' | 'pix'>('credit_card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handlePayment = () => {
    setIsProcessing(true);
    // Simulate API call and webhook event that changes the dancer's invoice status to 'paid'
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center space-y-6"
        >
          <div className="flex justify-center">
            <CheckCircle2 className="w-20 h-20 text-green-500" />
          </div>
          <h2 className="text-3xl font-title text-white">Pagamento Aprovado!</h2>
          <p className="text-zinc-400">Seu status no evento foi atualizado para Confirmado. Você já pode visualizar suas credenciais.</p>
          <div className="pt-4">
            <Button onClick={() => router.push('/dashboard')} className="w-full bg-neon-gradient text-white font-bold py-6">
              Voltar ao Painel
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <Button variant="ghost" onClick={() => router.back()} className="text-zinc-400 hover:text-white mb-4 -ml-4">
            <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
          </Button>
          <h1 className="text-3xl font-title">Checkout XTAGE</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-[#050505] border-zinc-800">
              <CardHeader>
                <CardTitle className="text-xl">Método de Pagamento</CardTitle>
                <CardDescription>Escolha como deseja pagar de forma segura.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex gap-4">
                  <button 
                    onClick={() => setMethod('credit_card')}
                    className={`flex-1 flex flex-col items-center p-6 rounded-xl border transition-all ${method === 'credit_card' ? 'border-purple-500 bg-purple-500/10' : 'border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800'}`}
                  >
                    <CreditCard className={`w-8 h-8 mb-2 ${method === 'credit_card' ? 'text-purple-400' : 'text-zinc-400'}`} />
                    <span className={`font-semibold ${method === 'credit_card' ? 'text-white' : 'text-zinc-400'}`}>Cartão de Crédito</span>
                  </button>
                  <button 
                    onClick={() => setMethod('pix')}
                    className={`flex-1 flex flex-col items-center p-6 rounded-xl border transition-all ${method === 'pix' ? 'border-green-500 bg-green-500/10' : 'border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800'}`}
                  >
                    <QrCode className={`w-8 h-8 mb-2 ${method === 'pix' ? 'text-green-400' : 'text-zinc-400'}`} />
                    <span className={`font-semibold ${method === 'pix' ? 'text-white' : 'text-zinc-400'}`}>Pix</span>
                  </button>
                </div>

                <AnimatePresence mode="wait">
                  {method === 'credit_card' && (
                    <motion.div 
                      key="credit_card"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-4"
                    >
                      <div className="space-y-2">
                        <Label>Número do Cartão</Label>
                        <Input placeholder="0000 0000 0000 0000" className="bg-black border-zinc-800 focus-visible:ring-purple-500 text-white font-mono" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Validade (MM/AA)</Label>
                          <Input placeholder="12/29" className="bg-black border-zinc-800 focus-visible:ring-purple-500 text-white font-mono" />
                        </div>
                        <div className="space-y-2">
                          <Label>CVC</Label>
                          <Input placeholder="123" className="bg-black border-zinc-800 focus-visible:ring-purple-500 text-white font-mono" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Nome do Titular</Label>
                        <Input placeholder="NOME COMO ESTÁ NO CARTÃO" className="bg-black border-zinc-800 focus-visible:ring-purple-500 text-white uppercase" />
                      </div>
                      <div className="space-y-2">
                        <Label>CPF do Titular</Label>
                        <Input placeholder="000.000.000-00" className="bg-black border-zinc-800 focus-visible:ring-purple-500 text-white font-mono" />
                      </div>
                    </motion.div>
                  )}

                  {method === 'pix' && (
                    <motion.div 
                      key="pix"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-8 text-center bg-zinc-900 rounded-xl"
                    >
                      <div className="w-48 h-48 bg-white rounded-lg mx-auto mb-4 flex items-center justify-center">
                         <QrCode className="w-40 h-40 text-black" />
                      </div>
                      <p className="text-zinc-400 text-sm mb-4">Escaneie o QR Code ou copie o código Pix para pagar.</p>
                      <Button variant="outline" className="border-green-500 text-green-400 hover:bg-green-500 hover:text-white font-mono text-xs w-full">
                        Copiar Código Pix
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>

              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-zinc-900/40 border-zinc-800 sticky top-6">
               <CardHeader>
                 <CardTitle className="text-lg text-white font-subtitle">Resumo do Pedido</CardTitle>
               </CardHeader>
               <CardContent className="space-y-4">
                 <div className="flex justify-between items-start">
                   <div>
                     <span className="block text-white text-sm">Fatura Única</span>
                     <span className="text-xs text-zinc-500">Taxas, Mercado e Repasses</span>
                   </div>
                   <span className="text-white font-mono text-sm">R$ 518,40</span>
                 </div>
                 
                 <Separator className="bg-zinc-800" />
                 
                 <div className="flex justify-between items-center text-lg font-bold">
                   <span className="text-white">Total</span>
                   <span className="text-white font-mono">R$ 518,40</span>
                 </div>

                 <div className="pt-4 text-xs text-zinc-500 text-center">
                   Pagamento 100% seguro processado via <strong>Stripe</strong>.
                 </div>
               </CardContent>
               <CardFooter>
                 {method === 'credit_card' ? (
                    <Button 
                      className="w-full bg-[#635BFF] hover:bg-[#524BDB] text-white font-bold py-6 group relative overflow-hidden"
                      onClick={handlePayment}
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          Pagar R$ 518,40
                        </>
                      )}
                    </Button>
                 ) : (
                    <Button 
                      className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-6 group"
                      onClick={handlePayment}
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>Simular Pagamento Pix</>
                      )}
                    </Button>
                 )}
               </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
