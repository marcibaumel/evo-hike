import { Card } from '../../../components/Card';
import { SocialPostHeader } from './SocialPostHeader';
import { SocialPostContent } from './SocialPostContent';
import { SocialPostImages } from './SocialPostImages';
import { SocialPostStats } from './SocialPostStats';
import { SocialPostActions } from './SocialPostActions';

export interface SocialUser {
    name: string;
    avatar: string;
    handle: string;
}

export interface SocialStats {
    distance: string;
    elevation: string;
    time: string;
}

export interface SocialEntry {
    id: number;
    user: SocialUser;
    location: string;
    date: string;
    content: string;
    images: string[];
    stats: SocialStats;
    likes: number;
    comments: number;
    isLiked: boolean;
}

interface SocialPostProps {
    entry: SocialEntry;
    onToggleLike: (id: number) => void;
}

export const SocialPost = ({ entry, onToggleLike }: SocialPostProps) => {
    return (
        <Card variant="glass" className="p-0 overflow-hidden hover:border-white/10 transition-colors duration-300">
            <SocialPostHeader user={entry.user} date={entry.date} />
            <SocialPostContent content={entry.content} />
            <SocialPostImages images={entry.images} />
            <SocialPostStats location={entry.location} stats={entry.stats} />
            <SocialPostActions
                id={entry.id}
                likes={entry.likes}
                comments={entry.comments}
                isLiked={entry.isLiked}
                onToggleLike={onToggleLike}
            />
        </Card>
    );
};