import { useState, useMemo } from 'react';
import { MagnifyingGlassIcon, PlusIcon } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';
import { TrailCard } from './TrailCard';
import { Button } from '../../../components/Button.tsx';
import backendTrails from '../../../assets/mockData/backendTrails.json';
import { Trail } from '../../../utils/Trail';
import type { DifficultyLevel } from '../../../utils/difficulty';

interface TrailListPanelProps {
    onSelectTrail: (trailId: string) => void;
    onStartCreateRoute: () => void;
}

export default function TrailListPanel({ onSelectTrail, onStartCreateRoute }: TrailListPanelProps) {
    const { t } = useTranslation();
    const [searchTerm, setSearchTerm] = useState('');
    
    const trails = useMemo(() => {
        return backendTrails.map((rawData) => {
            let mappedDifficulty = 0;
            if (rawData.difficulty === 'Easy') mappedDifficulty = 0;
            else if (rawData.difficulty === 'Moderate') mappedDifficulty = 1;
            else if (rawData.difficulty === 'Hard') mappedDifficulty = 2;
            else if (rawData.difficulty === 'Extreme') mappedDifficulty = 3;

            return new Trail({
                ...rawData,
                difficulty: mappedDifficulty as DifficultyLevel,
            });
        });
    }, []);

    // Szűrés a keresőszó alapján
    const filteredTrails = trails.filter((trail) =>
        trail.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex flex-col h-full bg-brand-dark">
            {/* Kereső fejléc */}
            <div className="p-6 border-b border-white/5 bg-brand-dark/95 backdrop-blur-md sticky top-0 z-20">
                <div className="flex gap-3">
                    <div className="relative flex-1">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" size={18} />
                        <input
                            type="text"
                            placeholder={t('route.search_placeholder')}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-brand-muted focus:border-brand-accent/50 outline-none transition-colors"
                        />
                    </div>
                    <Button
                        variant="primary"
                        className="p-2.5 rounded-xl h-auto bg-brand-accent hover:bg-brand-accent/90"
                        onClick={onStartCreateRoute}
                    >
                        <PlusIcon size={20} weight="bold" className="text-brand-dark" />
                    </Button>
                </div>
            </div>

            {/* Görgethető lista */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {filteredTrails.length > 0 ? (
                    filteredTrails.map((trail) => (
                        <TrailCard
                            key={trail.id}
                            trail={trail}
                            onViewDetails={() => onSelectTrail(trail.id)}
                        />
                    ))
                ) : (
                    <div className="text-center py-10 text-brand-muted text-sm italic">
                        {t('trailList.no_results')}
                    </div>
                )}
            </div>
        </div>
    );
}