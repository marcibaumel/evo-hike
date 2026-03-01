import { useState } from 'react';
import { SocialPost, type SocialEntry } from '../components/social/SocialPost';
import { CreatePostWidget } from '../components/social/CreatePostWidget';
import { useTranslation } from 'react-i18next';

const MOCK_ENTRIES: SocialEntry[] = [
    {
        id: 1,
        user: {
            name: 'Sarah Jenkins',
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop',
            handle: '@sarah_hikes'
        },
        location: 'Bükk Plateau, Hungary',
        date: '2 hours ago',
        content:
            'The morning mist over the plateau was absolutely magical today. Found a new path leading up to the limestone formations. 🌲✨',
        images: [
            'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop'
        ],
        stats: {
            distance: '12.4 km',
            elevation: '450m',
            time: '4h 20m'
        },
        likes: 124,
        comments: 18,
        isLiked: false
    },
    {
        id: 2,
        user: {
            name: 'David Chen',
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974&auto=format&fit=crop',
            handle: '@dchen_explores'
        },
        location: 'Lillafüred Waterfall',
        date: '5 hours ago',
        content:
            "Weekend vibes! The waterfall is roaring after yesterday's rain. Definitely recommend waterproof boots if you're heading this way.",
        images: ['https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?q=80&w=2070&auto=format&fit=crop'],
        stats: {
            distance: '5.2 km',
            elevation: '120m',
            time: '1h 45m'
        },
        likes: 89,
        comments: 6,
        isLiked: true
    },
    {
        id: 3,
        user: {
            name: 'Elena Rodriguez',
            avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1976&auto=format&fit=crop',
            handle: '@elena_wild'
        },
        location: 'Szilvásvárad Forest',
        date: '1 day ago',
        content: 'Just completed the full forest loop! My legs are tired but my soul is full. 🍂🍁',
        images: [
            'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2560&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=2548&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1501854140884-074cf2b21d25?q=80&w=2071&auto=format&fit=crop'
        ],
        stats: {
            distance: '18.1 km',
            elevation: '890m',
            time: '6h 10m'
        },
        likes: 245,
        comments: 42,
        isLiked: false
    }
];

function SocialPage() {
    const { t } = useTranslation();
    const [entries, setEntries] = useState<SocialEntry[]>(MOCK_ENTRIES);

    const toggleLike = (id: number) => {
        setEntries(
            entries.map((entry) => {
                if (entry.id === id) {
                    return {
                        ...entry,
                        isLiked: !entry.isLiked,
                        likes: entry.isLiked ? entry.likes - 1 : entry.likes + 1
                    };
                }
                return entry;
            })
        );
    };

    return (
        <div className="min-h-screen bg-brand-dark pt-28 pb-12 px-4 selection:bg-brand-accent selection:text-brand-dark">
            {/* Page Header */}
            <div className="max-w-2xl mx-auto mb-10 text-center space-y-4">
                <h1 className="text-4xl md:text-5xl font-display font-bold text-white">
                    {t('social_page.page_title')}
                </h1>
                <p className="text-brand-muted text-lg">{t('social_page.page_subtitle')}</p>
            </div>

            <CreatePostWidget />

            {/* Feed */}
            <div className="max-w-2xl mx-auto space-y-8">
                {entries.map((entry) => (
                    <SocialPost key={entry.id} entry={entry} onToggleLike={toggleLike} />
                ))}
            </div>

            {/* Load More Trigger */}
            <div className="max-w-xs mx-auto mt-12 text-center">
                <div className="h-1 w-20 bg-brand-muted/20 rounded-full mx-auto" />
            </div>
        </div>
    );
}

export default SocialPage;
