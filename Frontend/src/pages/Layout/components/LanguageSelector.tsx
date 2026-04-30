import { CaretDownIcon } from '@phosphor-icons/react';
import type { LanguageOptions } from '../../../hooks/useLanguage';

interface LanguageSelectorProps {
    currentOption: LanguageOptions;
    open: boolean;
    onClick: () => void;
}

export const LanguageSelector = ({ currentOption, open, onClick }: LanguageSelectorProps) => {
    return (
        <button
            onClick={onClick}
            className="flex items-center gap-2 p-2 rounded-full hover:bg-white/10 transition-colors duration-200 border border-transparent hover:border-white/10"
            aria-expanded={open}
            aria-haspopup="menu">
            <img
                src={currentOption.flagSource}
                alt="Current language"
                className="w-5 h-5 rounded-full object-cover shadow-sm"
            />
            <span className="hidden lg:block text-sm font-medium text-brand-text/90">{currentOption.short}</span>
            <CaretDownIcon
                size={12}
                className={`text-brand-muted transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
            />
        </button>
    );
};