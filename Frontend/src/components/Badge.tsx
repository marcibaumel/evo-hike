import type { HTMLAttributes } from 'react';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
    variant?: 'accent' | 'blue' | 'orange' | 'neutral' | 'outline';
}

export const Badge = ({ className = '', variant = 'neutral', children, ...props }: BadgeProps) => {
    const variants = {
        accent: 'bg-brand-accent text-brand-dark border-brand-accent',
        blue: 'bg-blue-500 text-white border-blue-500',
        orange: 'bg-orange-500 text-white border-orange-500',
        neutral: 'bg-gray-600 text-white border-gray-600',
        outline: 'bg-transparent border-white text-white border-2'
    };

    return (
        <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${variants[variant]} ${className}`}
            {...props}>
            {children}
        </span>
    );
};