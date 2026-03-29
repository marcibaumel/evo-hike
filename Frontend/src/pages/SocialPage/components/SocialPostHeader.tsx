import { CalendarBlankIcon } from '@phosphor-icons/react';
import { Badge } from '../../../components/Badge';
import type { SocialUser } from './SocialPost';

interface SocialPostHeaderProps {
    user: SocialUser;
    date: string;
}

export const SocialPostHeader = ({ user, date }: SocialPostHeaderProps) => {
    return (
        <div className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover border border-white/10"
                />
                <div>
                    <h3 className="text-white font-bold text-sm leading-tight">{user.name}</h3>
                    <span className="text-brand-muted text-xs block">{user.handle}</span>
                </div>
            </div>
            <Badge variant="neutral">
                <CalendarBlankIcon size={14} />
                {date}
            </Badge>
        </div>
    );
};