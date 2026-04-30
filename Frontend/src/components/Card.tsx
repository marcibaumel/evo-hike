import { type HTMLAttributes, forwardRef } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    variant?: 'glass' | 'solid' | 'ghost';
    hoverEffect?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
    ({ className = '', variant = 'glass', hoverEffect = false, children, ...props }, ref) => {
        const variants = {
            glass: 'bg-brand-card/30 backdrop-blur-md border border-white/5',
            solid: 'bg-brand-card border border-white/5',
            ghost: 'bg-transparent border border-transparent'
        };

        const hoverStyles = hoverEffect
            ? 'transition-all duration-300 hover:bg-brand-card/50 hover:border-white/10 hover:-translate-y-1'
            : '';

        return (
            <div ref={ref} className={`rounded-3xl p-6 ${variants[variant]} ${hoverStyles} ${className}`} {...props}>
                {children}
            </div>
        );
    }
);

Card.displayName = 'Card';