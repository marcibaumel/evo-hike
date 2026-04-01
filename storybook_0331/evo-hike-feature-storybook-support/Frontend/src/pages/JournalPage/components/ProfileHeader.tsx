import { MountainsIcon } from '@phosphor-icons/react';
import { Card } from '../../../components/Card';
import { ProfileAvatar } from './ProfileAvatar';
import { ProfileUserInfo } from './ProfileUserInfo';
import { ProfileStats } from './ProfileStats';

interface UserStats {
    totalDistance: string;
    elevationGain: string;
    hikesCompleted: number;
}

interface UserProfile {
    name: string;
    level: string;
    avatar: string;
    stats: UserStats;
}

interface ProfileHeaderProps {
    user: UserProfile;
}

export const ProfileHeader = ({ user }: ProfileHeaderProps) => {
    return (
        <Card
            variant="solid"
            className="flex flex-col md:flex-row items-center gap-6 p-8 relative overflow-hidden bg-linear-to-br from-brand-card to-brand-dark">
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                <MountainsIcon size={400} />
            </div>
            <ProfileAvatar avatar={user.avatar} name={user.name} />
            <ProfileUserInfo name={user.name} level={user.level} />
            <ProfileStats
                hikesCompleted={user.stats.hikesCompleted}
                totalDistance={user.stats.totalDistance}
                elevationGain={user.stats.elevationGain}
            />
        </Card>
    );
};