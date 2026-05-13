import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    icon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, icon, className = '', ...props }, ref) => {
        return (
            <div className="space-y-2">
                {label && (
                    <label className="text-xs font-bold uppercase tracking-wider text-brand-muted flex items-center gap-2 ml-1">
                        {icon} {label}
                    </label>
                )}
                <input
                    ref={ref}
                    className={`w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-brand-accent/50 transition-all placeholder:text-white/20 ${className}`}
                    {...props}
                />
            </div>
        );
    }
)

Input.displayName = 'Input';