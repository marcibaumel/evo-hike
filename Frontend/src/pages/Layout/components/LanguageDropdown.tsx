import type { LanguageCode, LanguageOptions } from '../../../hooks/useLanguage';

interface LanguageDropdownProps {
    options: LanguageOptions[];
    currentOption: LanguageOptions;
    onSelect: (code: LanguageCode) => void;
}

export const LanguageDropdown = ({ options, currentOption, onSelect }: LanguageDropdownProps) => {
    return (
        <div className="absolute right-0 mt-2 w-48 py-2 bg-brand-card/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl origin-top-right animate-in fade-in zoom-in-95 duration-200">
            {options.map((option) => {
                const isActive = option.code === currentOption.code;
                return (
                    <button
                        key={option.code}
                        onClick={() => onSelect(option.code)}
                        disabled={isActive}
                        className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors duration-200
                            ${isActive
                                ? 'bg-brand-accent/10 text-brand-accent cursor-default'
                                : 'text-brand-text hover:bg-white/5'
                            }`}>
                        <img
                            src={option.flagSource}
                            alt=""
                            className="w-5 h-5 rounded-full object-cover shadow-sm"
                        />
                        <span className="flex-1 text-left">{option.label}</span>
                        {isActive && (
                            <div className="w-1.5 h-1.5 rounded-full bg-brand-accent shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                        )}
                    </button>
                );
            })}
        </div>
    );
};