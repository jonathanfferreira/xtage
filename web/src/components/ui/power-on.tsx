'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

export function PowerOnPreloader({ children }: { children: React.ReactNode }) {
    const [isPoweringUp, setIsPoweringUp] = useState(true);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        // Skip if already loaded in this session
        if (sessionStorage.getItem('xpace-loaded')) {
            setIsPoweringUp(false);
            return;
        }

        // Automatic sleek loading sequence
        const timer1 = setTimeout(() => {
            setIsPoweringUp(false);
            sessionStorage.setItem('xpace-loaded', 'true');
        }, 2500);

        return () => clearTimeout(timer1);
    }, []);

    if (!isMounted) return null; // Avoid hydration mismatch flash

    return (
        <>
            <AnimatePresence>
                {isPoweringUp && (
                    <motion.div 
                        key="preloader"
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="fixed inset-0 z-[999999] bg-[#020202] flex flex-col items-center justify-center overflow-hidden"
                    >
                        {/* Background Ambient Glow */}
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 2, ease: "easeOut" }}
                            className="absolute w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen"
                        />

                        {/* Logo Animation */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="relative z-10 flex flex-col items-center"
                        >
                            <div className="relative w-48 h-12 md:w-64 md:h-16 mb-8 overflow-hidden">
                                <Image
                                    src="/images/xpace-logo-branca.png"
                                    alt="XPACE"
                                    fill
                                    className="object-contain"
                                    priority
                                />
                                {/* Light Sweep Effect over the Logo */}
                                <motion.div 
                                    initial={{ x: '-100%' }}
                                    animate={{ x: '200%' }}
                                    transition={{ duration: 1.5, delay: 0.3, ease: "easeInOut" }}
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                                />
                            </div>

                            {/* Sleek Loading Bar */}
                            <div className="w-56 md:w-72 h-[1px] bg-white/10 overflow-hidden relative">
                                <motion.div
                                    initial={{ x: '-100%' }}
                                    animate={{ x: '0%' }}
                                    transition={{ duration: 1.8, delay: 0.2, ease: [0.8, 0, 0.2, 1] }}
                                    className="absolute inset-0 bg-gradient-to-r from-primary to-[#ff0080]"
                                />
                            </div>
                            
                            {/* Loading Text */}
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6 }}
                                className="mt-8 text-[#555] font-mono text-[9px] uppercase tracking-[0.4em]"
                            >
                                Inicializando Ecossistema
                            </motion.div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* The actual page underneath */}
            {children}
        </>
    );
}
