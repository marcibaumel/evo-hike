import { useState } from 'react';
import { SocialPost, type SocialEntry } from './components/SocialPost';
import { CreatePostWidget } from './components/CreatePostWidget';

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
    }
];

function SocialPage() {
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
