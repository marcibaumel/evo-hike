export interface PlannedHikeRequest {
    routeId: number;
    start: string;
    end: string;
    checklistItems?: string[];
}

export const getPlannedHikes = async () => {
    const token = localStorage.getItem('token');

    const response = await fetch('/api/PlannedHikes?includeTrail=true', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error('Failed to load planned hikes');
    }

    return response.json();
};

export const planNewHike = async (hikeData: PlannedHikeRequest) => {
    const token = localStorage.getItem('token');

    const response = await fetch('/api/PlannedHikes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(hikeData)
    });

    if (!response.ok) {
        const errorMsg = await response.text();
        throw new Error(errorMsg || 'Failed to save planned hike');
    }

    return response.json();
};