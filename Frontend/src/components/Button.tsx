import { type ButtonHTMLAttributes, forwardRef } from 'react';
import { CircleNotchIcon } from '@phosphor-icons/react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className = '', variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
        const baseStyles =
            'inline-flex items-center justify-center font-bold rounded-xl transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none';

        const variants = {
            primary:
                'bg-brand-accent text-brand-dark hover:bg-green-400 hover:shadow-[0_0_20px_rgba(34,197,94,0.3)] border border-transparent',
            secondary: 'bg-white/10 text-white hover:bg-white/20 border border-white/5',
            outline: 'border-2 border-brand-accent text-brand-accent hover:bg-brand-accent/10',
            ghost: 'text-brand-muted hover:text-white hover:bg-white/5'
        };

        const sizes = {
            sm: 'px-4 py-2 text-xs',
            md: 'px-6 py-3 text-sm',
            lg: 'px-8 py-4 text-base'
        };

        return (
            <button
                ref={ref}
                className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
                disabled={isLoading || disabled}
                {...props}>
                {isLoading && <CircleNotchIcon className="animate-spin mr-2" size={18} />}
                {children}
            </button>
        );
    }
);

Button.displayName = 'Button';
