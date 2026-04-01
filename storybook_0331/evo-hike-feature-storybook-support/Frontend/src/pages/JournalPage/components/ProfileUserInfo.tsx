interface ProfileUserInfoProps {
    name: string;
    level: string;
}

export const ProfileUserInfo = ({ name, level }: ProfileUserInfoProps) => {
    return (
        <div className="text-center md:text-left z-10">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-1">{name}</h1>
            <p className="text-brand-accent font-semibold tracking-wide uppercase text-sm">{level}</p>
        </div>
    );
};