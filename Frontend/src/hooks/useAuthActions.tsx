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
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { login } = useAuth();

    const handleLogin = async (data: LoginRequest) => {
        setIsLoading(true);
        setError(null);
        try {
            const { token } = await authService.login(data);
            navigate('/journal');
            login(token);
        } catch (err) {
            const axiosError = err as AxiosError<string>;
            setError(axiosError.response?.status === 401 ? t('auth.error_invalid') : t('auth.error_generic'));
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegister = async (data: RegisterRequest) => {
        setIsLoading(true);
        setError(null);
        try {
            await authService.register(data);
            navigate('/login');
        } catch (err) {
            const axiosError = err as AxiosError<string>;
            setError(axiosError.response?.data || t('auth.error_generic'));
        } finally {
            setIsLoading(false);
        }
    };

    return { handleLogin, handleRegister, isLoading, error };
};