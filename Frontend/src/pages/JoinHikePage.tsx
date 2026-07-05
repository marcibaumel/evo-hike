import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function JoinHikePage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('Joining hike in progress...');

    useEffect(() => {
        const joinHike = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setStatus('Please log in to evoHike first!');
                    return;
                }

                const response = await fetch(`/api/PlannedHikes/${id}/join`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    setStatus('Successfully joined! Redirecting to journal...');
                    setTimeout(() => navigate('/journal'), 2000);
                } else {
                    const errorData = await response.text();
                    setStatus(`Error occurred: ${errorData}`);
                }
            } catch (error) {
                console.error(error);
                setStatus('A network error occurred while joining.');
            }
        };

        if (id) joinHike();
    }, [id, navigate]);

    return (
        <div className="min-h-screen bg-brand-dark flex items-center justify-center pt-20 px-4">
            <div className="bg-white/5 border border-white/10 p-8 rounded-2xl text-center max-w-md w-full">
                <h2 className="text-2xl font-bold text-white mb-4">Join Hike</h2>
                <p className="text-brand-muted">{status}</p>
            </div>
        </div>
    );
}