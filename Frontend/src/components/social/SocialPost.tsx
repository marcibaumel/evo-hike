import {
    HeartIcon,
    ChatCircleIcon,
    ShareNetworkIcon,
    MapPinIcon,
    CalendarBlankIcon,
    MountainsIcon
} from '@phosphor-icons/react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

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
            {/* Header */}
            <div className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <img
                        src={entry.user.avatar}
                        alt={entry.user.name}
                        className="w-10 h-10 rounded-full object-cover border border-white/10"
                    />
                    <div>
                        <h3 className="text-white font-bold text-sm leading-tight">{entry.user.name}</h3>
                        <span className="text-brand-muted text-xs block">{entry.user.handle}</span>
                    </div>
                </div>
                <Badge variant="neutral">
                    <CalendarBlankIcon size={14} />
                    {entry.date}
                </Badge>
            </div>

            {/* Content Text */}
            <div className="px-6 pb-4">
                <p className="text-brand-text/90 leading-relaxed">{entry.content}</p>
            </div>

            {/* Images Grid */}
            {entry.images.length > 0 && (
                <div
                    className={`grid gap-1 ${
                        entry.images.length === 1
                            ? 'grid-cols-1'
                            : entry.images.length === 2
                                ? 'grid-cols-2'
                                : 'grid-cols-2' // For 3+ images
                    }`}>
                    {entry.images.map((img, idx) => (
                        <div
                            key={idx}
                            className={`relative overflow-hidden ${
                                entry.images.length === 3 && idx === 0 ? 'col-span-2 aspect-2/1' : 'aspect-square'
                            }`}>
                            <img
                                src={img}
                                alt="Hike moment"
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                            />
                        </div>
                    ))}
                </div>
            )}

            {/* Stats Bar */}
            <div className="px-6 py-4 bg-black/20 border-b border-white/5 flex justify-between items-center text-xs md:text-sm">
                <div className="flex items-center gap-2 text-brand-muted">
                    <MapPinIcon weight="fill" className="text-brand-accent" />
                    {entry.location}
                </div>
                <div className="flex gap-4">
                    <div className="flex items-center gap-1 text-brand-text font-medium">
                        <span className="text-brand-muted">Dist:</span> {entry.stats.distance}
                    </div>
                    <div className="flex items-center gap-1 text-brand-text font-medium">
                        <span className="text-brand-muted">Elev:</span> {entry.stats.elevation}
                    </div>
                </div>
            </div>

            {/* Action Footer */}
            <div className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => onToggleLike(entry.id)}
                        className={`flex items-center gap-2 text-sm font-bold transition-colors ${
                            entry.isLiked ? 'text-red-500' : 'text-brand-muted hover:text-white'
                        }`}>
                        <HeartIcon
                            size={20}
                            weight={entry.isLiked ? 'fill' : 'regular'}
                            className={entry.isLiked ? 'animate-[bounce_0.5s_ease-in-out]' : ''}
                        />
                        {entry.likes}
                    </button>

                    <button className="flex items-center gap-2 text-sm font-bold text-brand-muted hover:text-white transition-colors">
                        <ChatCircleIcon size={20} />
                        {entry.comments}
                    </button>

                    <button className="flex items-center gap-2 text-sm font-bold text-brand-muted hover:text-white transition-colors">
                        <ShareNetworkIcon size={20} />
                    </button>
                </div>

                <button className="text-brand-accent hover:text-green-300 transition-colors p-2 hover:bg-brand-accent/10 rounded-full">
                    <MountainsIcon size={20} weight="duotone" />
                </button>
            </div>
        </Card>
    );
};
