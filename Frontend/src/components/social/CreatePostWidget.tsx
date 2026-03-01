import { ImageIcon, MapPinIcon, PlusIcon } from '@phosphor-icons/react';
import { Card } from '../ui/Card';
import { useTranslation } from 'react-i18next';

export const CreatePostWidget = () => {
    const { t } = useTranslation();

    return (
        <div className="max-w-2xl mx-auto mb-8">
            <Card
                variant="glass"
                className="p-4 flex items-center gap-4 hover:border-brand-accent/30 transition-colors cursor-pointer group">
                <div className="w-10 h-10 rounded-full bg-brand-accent/20 flex items-center justify-center text-brand-accent">
                    <PlusIcon size={20} weight="bold" />
                </div>
                <span className="text-brand-muted group-hover:text-white transition-colors">
                    {t('social_page.create_post_placeholder')}
                </span>
                <div className="ml-auto flex gap-2">
                    <div className="p-2 hover:bg-white/10 rounded-lg text-brand-muted transition-colors">
                        <ImageIcon size={20} />
                    </div>
                    <div className="p-2 hover:bg-white/10 rounded-lg text-brand-muted transition-colors">
                        <MapPinIcon size={20} />
                    </div>
                </div>
            </Card>
        </div>
    );
};
