import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function JoinHikePage() {
    const { t } = useTranslation();
    const { id } = useParams();
    const navigate = useNavigate();

    const [status, setStatus] = useState(t('joinHike.in_progress'));
    useEffect(() => {
        const joinHike = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setStatus(t('joinHike.login_required'));
                    return;
                }

                const response = await fetch(`/api/PlannedHikes/${id}/join`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    setStatus(t('joinHike.success'));
                    setTimeout(() => navigate('/journal'), 2000);
                } else {
                    const errorData = await response.text();
                    setStatus(`${t('joinHike.error_prefix')}${errorData}`);
                }
            } catch (error) {
                console.error(error);
                setStatus(t('joinHike.network_error'));
            }
        };

        if (id) joinHike();
    }, [id, navigate, t]);

    return (
        <div className="min-h-screen bg-brand-dark flex items-center justify-center pt-20 px-4">
            <div className="bg-white/5 border border-white/10 p-8 rounded-2xl text-center max-w-md w-full">
                <h2 className="text-2xl font-bold text-white mb-4">{t('joinHike.title')}</h2>
                <p className="text-brand-muted">{status}</p>
            </div>
        </div>
    );
}