import type { ReactNode } from 'react';

interface AuthInputProps {
    label: string;
    icon: ReactNode;
    type: string;
    value: string;
    onChange: (val: string) => void;
    placeholder?: string;
    required?: boolean;
}

export const AuthInput = ({ label, icon, type, value, onChange, placeholder, required }: AuthInputProps) => (
    <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-brand-muted flex items-center gap-2 ml-1">
            {icon} {label}
        </label>
        <input
            type={type}
            required={required}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-brand-accent/50 transition-all placeholder:text-white/20"
        />
    </div>
);