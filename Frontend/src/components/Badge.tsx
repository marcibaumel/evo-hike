import type { HTMLAttributes } from 'react';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
    variant?: 'accent' | 'blue' | 'orange' | 'neutral' | 'outline';
}

export const Badge = ({ className = '', variant = 'neutral', children, ...props }: BadgeProps) => {
    const variants = {
        accent: 'bg-brand-accent/10 text-brand-accent border-brand-accent/20',
        blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        orange: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
        neutral: 'bg-white/5 text-brand-muted border-white/10',
        outline: 'bg-transparent border-white/20 text-brand-muted'
    };

    return (
        <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${variants[variant]} ${className}`}
            {...props}>
            {children}
        </span>
    );
};