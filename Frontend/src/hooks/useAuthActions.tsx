import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AxiosError } from 'axios';
import { authService } from '../api/authService';
import type { LoginRequest, RegisterRequest } from '../api/authService';
import { useAuth } from '../context/AuthContext';

export const useAuthActions = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { login } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isValidEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const getTranslatedError = (errData: any): string => {
        if (!errData) return t('auth.error_generic');

        if (errData.errors && typeof errData.errors === 'object') {
            const errorKeys = Object.keys(errData.errors);
            if (errorKeys.includes('Password')) return t('auth.error_password_format');
            if (errorKeys.includes('Email')) return t('auth.error_email_invalid');
            if (errorKeys.includes('Username')) return t('auth.error_username_length');
            return t('auth.error_required_fields');
        }

        const msg = errData.message || (typeof errData === 'string' ? errData : '');
        if (msg.includes('already registered')) return t('auth.error_email_taken');
        if (msg.includes('Invalid email or password')) return t('auth.error_invalid');

        return t('auth.error_generic');
    };

    const handleLogin = async (data: LoginRequest) => {
        if (!data.email || !data.password) {
            setError(t('auth.error_required_fields'));
            return;
        }
        if (!isValidEmail(data.email)) {
            setError(t('auth.error_email_invalid'));
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            const { token } = await authService.login(data);
            login(token);
            navigate('/journal');
        } catch (err) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const axiosError = err as AxiosError<any>;
            if (axiosError.response?.status === 401) {
                setError(t('auth.error_invalid'));
            } else {
                setError(getTranslatedError(axiosError.response?.data));
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegister = async (data: RegisterRequest) => {
        if (!data.username || !data.email || !data.password) {
            setError(t('auth.error_required_fields'));
            return;
        }
        if (!isValidEmail(data.email)) {
            setError(t('auth.error_email_invalid'));
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            await authService.register(data);
            navigate('/login');
        } catch (err) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const axiosError = err as AxiosError<any>;
            setError(getTranslatedError(axiosError.response?.data));
        } finally {
            setIsLoading(false);
        }
    };

    return { handleLogin, handleRegister, isLoading, error };
};