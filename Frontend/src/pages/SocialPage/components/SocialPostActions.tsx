import { HeartIcon, ChatCircleIcon, ShareNetworkIcon, MountainsIcon } from '@phosphor-icons/react';

interface SocialPostActionsProps {
    id: number;
    likes: number;
    comments: number;
    isLiked: boolean;
    onToggleLike: (id: number) => void;
}

export const SocialPostActions = ({ id, likes, comments, isLiked, onToggleLike }: SocialPostActionsProps) => {
    return (
        <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-6">
                <button
                    onClick={() => onToggleLike(id)}
                    className={`flex items-center gap-2 text-sm font-bold transition-colors ${isLiked ? 'text-red-500' : 'text-brand-muted hover:text-white'
                    }`}>
                    <HeartIcon
                        size={20}
                        weight={isLiked ? 'fill' : 'regular'}
                        className={isLiked ? 'animate-[bounce_0.5s_ease-in-out]' : ''}
                    />
                    {likes}
                </button>
                <button className="flex items-center gap-2 text-sm font-bold text-brand-muted hover:text-white transition-colors">
                    <ChatCircleIcon size={20} />
                    {comments}
                </button>
                <button className="flex items-center gap-2 text-sm font-bold text-brand-muted hover:text-white transition-colors">
                    <ShareNetworkIcon size={20} />
                </button>
            </div>
            <button className="text-brand-accent hover:text-green-300 transition-colors p-2 hover:bg-brand-accent/10 rounded-full">
                <MountainsIcon size={20} weight="duotone" />
            </button>
        </div>
    );
};