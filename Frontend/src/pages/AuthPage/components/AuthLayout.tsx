import type { ReactNode } from 'react';
import { Card } from '../../../components/Card';

interface AuthLayoutProps {
    children: ReactNode;
    title: string;
    subtitle: string;
}

export const AuthLayout = ({ children, title, subtitle }: AuthLayoutProps) => (
    <div className="min-h-screen flex items-center justify-center bg-brand-dark px-4 relative overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-brand-accent/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-blue-600/5 rounded-full blur-[100px]" />

        <Card variant="glass" className="w-full max-w-md p-8 relative z-10">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-display font-bold text-white mb-2">{title}</h1>
                <p className="text-brand-muted text-sm uppercase tracking-widest font-bold">
                    {subtitle}
                </p>
            </div>
            {children}
        </Card>
    </div>
);