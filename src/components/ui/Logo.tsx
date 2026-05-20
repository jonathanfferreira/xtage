import React from 'react';
import { Play } from 'lucide-react';

interface LogoProps {
  className?: string;
}

export function Logo({ className = '' }: LogoProps) {
  return (
    <div className={`flex items-center select-none ${className}`}>
      {/* Símbolo de Palco Digital >|< com Play */}
      <div className="flex items-center text-purple-500 mr-2 relative">
        <span className="text-xl font-tech font-bold text-white tracking-widest leading-none">&gt;</span>
        <div className="mx-0.5 relative flex items-center justify-center">
           <div className="w-0.5 h-5 bg-pink-500 transform rotate-12 absolute opacity-50 blur-[1px]"></div>
           <div className="w-0.5 h-5 bg-purple-500"></div>
           <Play className="w-3 h-3 text-orange-500 absolute ml-[2px] fill-current" />
        </div>
        <span className="text-xl font-tech font-bold text-white tracking-widest leading-none">&lt;</span>
      </div>
      
      {/* Wordmark XTAGE */}
      <div className="font-title font-black tracking-tighter uppercase text-2xl flex items-center pt-1">
        X<span className="text-pink-500 mx-[1px]">T</span>AGE
      </div>
    </div>
  );
}
