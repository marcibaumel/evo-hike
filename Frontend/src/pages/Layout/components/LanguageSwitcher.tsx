import { useState, useRef, useEffect, useCallback } from 'react';
import { useLanguage } from '../../../hooks/useLanguage';
import { LanguageSelector } from './LanguageSelector';
import { LanguageDropdown } from './LanguageDropdown';

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
            <LanguageSelector
                currentOption={currentOption}
                open={open}
                onClick={() => setOpen((prev) => !prev)}
            />
            {open && (
                <LanguageDropdown
                    options={options}
                    currentOption={currentOption}
                    onSelect={(code) => {
                        changeLanguage(code);
                        setOpen(false);
                    }}
                />
            )}
        </div>
    );
}

export default LanguageSwitcher;