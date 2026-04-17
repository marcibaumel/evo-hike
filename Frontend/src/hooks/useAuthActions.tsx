import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { authService } from '../api/authService';
import type { LoginRequest, RegisterRequest } from '../api/authService';

export const useAuthActions = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (data: LoginRequest) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await authService.login(data);

            /** 
             * TODO (HIKE-14): 
             * 1. Save token to Context/LocalStorage 
             * 2. Set global auth state
             */
            console.log('Token:', response.token);

            navigate('/journal');
        } catch (err: any) {
            setError(err.response?.status === 401 ? t('auth.error_invalid') : t('auth.error_generic'));
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
        } catch (err: any) {
            setError(err.response?.data || t('auth.error_generic'));
        } finally {
            setIsLoading(false);
        }
    };

    return { handleLogin, handleRegister, isLoading, error };
};