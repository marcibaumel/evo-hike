import { useState, useRef, useEffect, useCallback } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { CaretDownIcon } from '@phosphor-icons/react';

function LanguageSwitcher() {
    const { options, currentOption, changeLanguage } = useLanguage();
    const [open, setOpen] = useState<boolean>(false);
    const switcherRef = useRef<HTMLDivElement>(null);

    const handleClickOutside = useCallback((event: MouseEvent) => {
        if (switcherRef.current && !switcherRef.current.contains(event.target as Node)) {
            setOpen(false);
        }
    }, []);

    useEffect(() => {
        if (!open) return;
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [open, handleClickOutside]);

    return (
        <div className="relative z-50" ref={switcherRef}>
            <button
                onClick={() => setOpen((prev) => !prev)}
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

            {open && (
                <div className="absolute right-0 mt-2 w-48 py-2 bg-brand-card/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl origin-top-right animate-in fade-in zoom-in-95 duration-200">
                    <div className="px-3 py-2 text-xs font-semibold text-brand-muted uppercase tracking-wider border-b border-white/5 mb-1">
                        Select Language
                    </div>
                    {options.map((option) => {
                        const isActive = option.code === currentOption.code;
                        return (
                            <button
                                key={option.code}
                                onClick={() => {
                                    changeLanguage(option.code);
                                    setOpen(false);
                                }}
                                disabled={isActive}
                                className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors duration-200
                  ${
                            isActive
                                ? 'bg-brand-accent/10 text-brand-accent cursor-default'
                                : 'text-brand-text hover:bg-white/5'
                            }
                `}>
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
            )}
        </div>
    );
}

export default LanguageSwitcher;
