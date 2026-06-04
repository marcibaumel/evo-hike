export type DifficultyLevel = 0 | 1 | 2 | 3;

export const getDifficultyLabel = (level: DifficultyLevel): string => {
    switch (level) {
    case 0: return 'Easy';
    case 1: return 'Moderate';
    case 2: return 'Hard';
    case 3: return 'Expert';
    default: return '';
    }
};

export const ALL_DIFFICULTY_LEVELS: DifficultyLevel[] = [0, 1, 2, 3];