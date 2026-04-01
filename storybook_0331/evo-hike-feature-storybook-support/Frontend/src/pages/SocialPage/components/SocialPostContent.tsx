interface SocialPostContentProps {
    content: string;
}

export const SocialPostContent = ({ content }: SocialPostContentProps) => {
    return (
        <div className="px-6 pb-4">
            <p className="text-brand-text/90 leading-relaxed">{content}</p>
        </div>
    );
};