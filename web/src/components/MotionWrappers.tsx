"use client";
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface WrapperProps {
    children: ReactNode;
    delay?: number;
    className?: string;
}

export function FadeIn({ children, delay = 0, className = "" }: WrapperProps) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

export function SlideUp({ children, delay = 0, className = "" }: WrapperProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay, type: "spring", stiffness: 100, damping: 20 }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

export function ScaleIn({ children, delay = 0, className = "" }: WrapperProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay, type: "spring" }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

export function StaggerContainer({ children, delay = 0, className = "" }: WrapperProps) {
    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
                visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: delay } },
                hidden: { opacity: 0 }
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

export function StaggerItem({ children, className = "" }: WrapperProps) {
    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
            }}
            transition={{ duration: 0.5 }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
