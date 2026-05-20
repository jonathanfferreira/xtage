'use client';
import { QRCodeSVG } from 'qrcode.react';

interface DancerCredentialProps {
  dancerId: string;
  dancerName: string;
  schoolName: string;
  choreographies: { name: string; category: string }[];
}

export default function DancerCredential({ dancerId, dancerName, schoolName, choreographies }: DancerCredentialProps) {
  const credentialUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/credencial/${dancerId}`
    : `/credencial/${dancerId}`;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-purple-500/30 bg-gradient-to-br from-[#0d0020] via-[#0a0015] to-[#050505] p-6 shadow-[0_0_40px_rgba(139,92,246,0.15)]">
      {/* Decorative top bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-neon-gradient" />

      <div className="flex flex-col sm:flex-row gap-6 items-start">
        {/* Info */}
        <div className="flex-1 space-y-3">
          <div>
            <span className="text-[10px] text-purple-400 font-bold uppercase tracking-[0.25em]">Credencial Digital XTAGE</span>
            <h3 className="text-2xl font-title font-black text-white mt-1">{dancerName}</h3>
            <p className="text-zinc-400 text-sm">{schoolName}</p>
          </div>

          <div className="space-y-1">
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Coreografias</p>
            {choreographies.length === 0 ? (
              <p className="text-xs text-zinc-600">Nenhuma coreografia atribuída ainda.</p>
            ) : (
              choreographies.map((c, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                  <span className="text-zinc-200">{c.name}</span>
                  <span className="text-zinc-500">· {c.category}</span>
                </div>
              ))
            )}
          </div>

          <div className="pt-2">
            <span className="inline-flex items-center gap-1.5 bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-bold px-3 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Credencial Válida
            </span>
          </div>
        </div>

        {/* QR Code */}
        <div className="flex flex-col items-center gap-2 shrink-0">
          <div className="bg-white p-3 rounded-xl">
            <QRCodeSVG
              value={credentialUrl}
              size={120}
              fgColor="#000000"
              bgColor="#ffffff"
              level="M"
            />
          </div>
          <p className="text-[10px] text-zinc-600 text-center max-w-[120px]">Aponte a câmera para validar no evento</p>
        </div>
      </div>

      {/* Watermark ID */}
      <div className="mt-4 pt-3 border-t border-purple-500/10 flex justify-between items-center">
        <span className="text-[10px] font-mono text-zinc-700">ID: {dancerId.substring(0, 12).toUpperCase()}…</span>
        <span className="text-[10px] text-zinc-700">XTAGE © 2026</span>
      </div>
    </div>
  );
}
