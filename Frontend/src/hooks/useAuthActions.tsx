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
    const getTranslatedError = (err: AxiosError<any>): string => {
        if (!err.response) return t('auth.error_generic');

        const status = err.response.status;
        const errData = err.response.data;

        switch (status) {
        case 401:
            return t('auth.error_invalid');

        case 409:
            return t('auth.error_email_taken');

        case 400:
            if (errData?.errors && typeof errData.errors === 'object') {
                const errorKeys = Object.keys(errData.errors);
                if (errorKeys.includes('Password')) return t('auth.error_password_format');
                if (errorKeys.includes('Email')) return t('auth.error_email_invalid');
                if (errorKeys.includes('Username')) return t('auth.error_username_length');
                return t('auth.error_required_fields');
            }
            return t('auth.error_generic');

        default:
            return t('auth.error_generic');
        }
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
            setError(getTranslatedError(axiosError));
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegister = async (data: RegisterRequest, confirmPassword?: string) => {
        if (!data.username || !data.email || !data.password || !confirmPassword) {
            setError(t('auth.error_required_fields'));
            return;
        }
        if (!isValidEmail(data.email)) {
            setError(t('auth.error_email_invalid'));
            return;
        }
        if (data.password !== confirmPassword) {
            setError(t('auth.error_passwords_match'));
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
            setError(getTranslatedError(axiosError));
        } finally {
            setIsLoading(false);
        }
    };

    return { handleLogin, handleRegister, isLoading, error };
};