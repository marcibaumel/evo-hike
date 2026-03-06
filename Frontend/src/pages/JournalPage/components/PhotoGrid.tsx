import { CameraIcon, FootprintsIcon } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';

interface PhotoGridProps {
    photos: string[];
}

export const PhotoGrid = ({ photos }: PhotoGridProps) => {
    const { t } = useTranslation();

    return (
        <section>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-display font-bold text-white flex items-center gap-2">
                    <CameraIcon className="text-blue-400" /> {t('dashboard.memories.title')}
                </h2>
                <button className="text-sm text-brand-muted hover:text-white transition-colors">
                    {t('dashboard.memories.view_all')}
                </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {photos.map((photo, idx) => (
                    <div key={idx} className="aspect-square rounded-2xl overflow-hidden relative group">
                        <img
                            src={photo}
                            alt="Memory"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <FootprintsIcon size={24} className="text-white" weight="fill" />
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};
