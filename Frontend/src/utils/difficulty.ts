import { useTranslation } from 'react-i18next';

export type DifficultyLevel = 0 | 1 | 2 | 3;

export const getDifficultyLabel = (level: DifficultyLevel): string => {
    const {t} = useTranslation();
    switch (level) {
    case 0: return t('trail.difficulties.0');
    case 1: return  t('trail.difficulties.1');
    case 2: return  t('trail.difficulties.2');
    case 3: return  t('trail.difficulties.3');
    default: return '';
    }
};

export const ALL_DIFFICULTY_LEVELS: DifficultyLevel[] = [0, 1, 2, 3];