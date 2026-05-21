import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { EnvelopeIcon, LockIcon, UserIcon, WarningCircleIcon, ArrowRightIcon, UserPlusIcon } from '@phosphor-icons/react';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Input } from '../../components/Input';
import { useAuthActions } from '../../hooks/useAuthActions';

interface AuthPageProps {
    mode: 'login' | 'register';
}

export default function AuthPage({ mode }: AuthPageProps) {
    const { t } = useTranslation();
    const { handleLogin, handleRegister, isLoading, error } = useAuthActions();

    const isLogin = mode === 'login';

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState(import.meta.env.DEV ? 'test@evohike.hu' : '');
    const [password, setPassword] = useState(import.meta.env.DEV ? 'Password123!' : '');
    const [confirmPassword, setConfirmPassword] = useState(import.meta.env.DEV ? 'Password123!' : '');

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isLogin) {
            handleLogin({ email, password });
        } else {
            handleRegister({ username, email, password }, confirmPassword);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-brand-dark px-4 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-brand-accent/5 rounded-full blur-[100px]" />
            <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-blue-600/5 rounded-full blur-[100px]" />

            <Card variant="glass" className="w-full max-w-md p-8 relative z-10">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-display font-bold text-white mb-2">
                        {isLogin ? t('auth.login_title') : t('auth.register_title')}
                    </h1>
                    <p className="text-brand-muted text-sm uppercase tracking-widest font-bold">
                        evo<span className="text-brand-accent">Hike</span>
                    </p>
                </div>

                <form onSubmit={onSubmit} className="space-y-6" noValidate>
                    {error && (
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-fade-in">
                            <WarningCircleIcon size={20} weight="fill" />
                            {error}
                        </div>
                    )}

                    {!isLogin && (
                        <Input
                            label={t('auth.username_label')}
                            icon={<UserIcon size={14} />}
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="HikingLegend99"
                            required
                        />
                    )}

                    <Input
                        label={t('auth.email_label')}
                        icon={<EnvelopeIcon size={14} />}
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="explorer@evohike.hu"
                        required
                    />

                    <Input
                        label={t('auth.password_label')}
                        icon={<LockIcon size={14} />}
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    {!isLogin && (
                        <Input
                            label={t('auth.confirm_password_label')}
                            icon={<LockIcon size={14} />}
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    )}

                    <Button type="submit" className="w-full group" isLoading={isLoading} size="lg">
                        {isLogin ? t('auth.login_btn') : t('auth.register_btn')}
                        {isLogin ? (
                            <ArrowRightIcon className="ml-2 group-hover:translate-x-1 transition-transform" />
                        ) : (
                            <UserPlusIcon size={20} className="ml-2 group-hover:scale-110 transition-transform" />
                        )}
                    </Button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-brand-muted text-sm">
                        {isLogin ? t('auth.no_account') : t('auth.have_account')}{' '}
                        <Link
                            to={isLogin ? '/register' : '/login'}
                            className="text-brand-accent font-bold hover:text-green-400 transition-colors ml-1"
                        >
                            {isLogin ? t('auth.link_register') : t('auth.link_login')}
                        </Link>
                    </p>
                </div>
            </Card>
        </div>
    );
}