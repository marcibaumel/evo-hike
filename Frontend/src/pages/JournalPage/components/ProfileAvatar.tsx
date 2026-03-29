import { TrophyIcon } from '@phosphor-icons/react';

interface ProfileAvatarProps {
    avatar: string;
    name: string;
}

export const ProfileAvatar = ({ avatar, name }: ProfileAvatarProps) => {
    return (
        <div className="relative">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full p-1 bg-linear-to-tr from-brand-accent to-blue-500">
                <img
                    src={avatar}
                    alt={name}
                    className="w-full h-full rounded-full object-cover border-4 border-brand-dark"
                />
            </div>
            <div className="absolute bottom-0 right-0 bg-brand-dark p-2 rounded-full border border-white/10">
                <TrophyIcon size={20} className="text-yellow-400" weight="fill" />
            </div>
        </div>
    );
};