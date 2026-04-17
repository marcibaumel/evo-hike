import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { EnvelopeIcon, LockIcon, WarningCircleIcon, ArrowRightIcon } from '@phosphor-icons/react';
import { Button } from '../../components/Button';
import { AuthLayout } from './components/AuthLayout';
import { AuthInput } from './components/AuthInput';
import { useAuthActions } from '../../hooks/useAuthActions';

export default function LoginPage() {
    const { t } = useTranslation();
    const { handleLogin, isLoading, error } = useAuthActions();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleLogin({ email, password });
    };

    return (
        <AuthLayout title={t('auth.login_title')} subtitle="evoHike">
            <form onSubmit={onSubmit} className="space-y-6">
                {error && (
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-fade-in">
                        <WarningCircleIcon size={20} weight="fill" />
                        {error}
                    </div>
                )}

                <AuthInput
                    label={t('auth.email_label')}
                    icon={<EnvelopeIcon size={14} />}
                    type="email"
                    value={email}
                    onChange={setEmail}
                    placeholder="explorer@evohike.hu"
                    required
                />

                <AuthInput
                    label={t('auth.password_label')}
                    icon={<LockIcon size={14} />}
                    type="password"
                    value={password}
                    onChange={setPassword}
                    required
                />

                <Button type="submit" className="w-full group" isLoading={isLoading} size="lg">
                    {t('auth.login_btn')}
                    <ArrowRightIcon className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
            </form>

            <div className="mt-8 text-center">
                <p className="text-brand-muted text-sm">
                    {t('auth.no_account')}{' '}
                    <Link to="/register" className="text-brand-accent font-bold hover:text-green-400 transition-colors ml-1">
                        {t('auth.link_register')}
                    </Link>
                </p>
            </div>
        </AuthLayout>
    );
}