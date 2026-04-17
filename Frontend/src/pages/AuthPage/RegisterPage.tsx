import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { EnvelopeIcon, LockIcon, UserIcon, WarningCircleIcon, UserPlusIcon } from '@phosphor-icons/react';
import { Button } from '../../components/Button';
import { authService } from '../../api/authService';
import { AuthLayout } from './components/AuthLayout';
import { AuthInput } from './components/AuthInput';

export default function RegisterPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            await authService.register({ username, email, password });

            /** 
             * TODO (HIKE-14): 
             * After registration, you might want to auto-login the user 
             * or show a success toast. For now, we redirect to login.
             */
            navigate('/login');
        } catch (err: any) {
            setError(err.response?.data || t('auth.error_generic'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout title={t('auth.register_title')} subtitle="evoHike">
            <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-fade-in">
                        <WarningCircleIcon size={20} weight="fill" />
                        {error}
                    </div>
                )}

                <AuthInput
                    label={t('auth.username_label')}
                    icon={<UserIcon size={14} />}
                    type="text"
                    value={username}
                    onChange={setUsername}
                    placeholder="HikingLegend99"
                    required
                />

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
                    {t('auth.register_btn')}
                    <UserPlusIcon size={20} className="ml-2 group-hover:scale-110 transition-transform" />
                </Button>
            </form>

            <div className="mt-8 text-center">
                <p className="text-brand-muted text-sm">
                    {t('auth.have_account')}{' '}
                    <Link to="/login" className="text-brand-accent font-bold hover:text-green-400 transition-colors ml-1">
                        {t('auth.link_login')}
                    </Link>
                </p>
            </div>
        </AuthLayout>
    );
}