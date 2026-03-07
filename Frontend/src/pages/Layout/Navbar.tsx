import { Link, NavLink } from 'react-router-dom';
import { useState, useRef, useEffect, useCallback, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './components/LanguageSwitcher';
import { MountainsIcon, ListIcon, XIcon } from '@phosphor-icons/react';

const NavbarLink = ({ to, children }: { to: string; children: ReactNode }) => (
    <NavLink
        to={to}
        className={({ isActive }) =>
            `relative py-2 px-1 text-sm font-medium transition-all duration-300 group tracking-wide ${isActive ? 'text-brand-accent' : 'text-brand-muted hover:text-white'
            }`
        }>
        {({ isActive }) => (
            <>
                <span>{children}</span>
                {/* Animated Underline */}
                <span
                    className={`absolute -bottom-1 left-0 h-0.5 bg-brand-accent transition-all duration-300 ease-out ${isActive ? 'w-full shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'w-0 group-hover:w-full'
                    }`}
                />
            </>
        )}
    </NavLink>
);

function Navbar() {
    const [open, setOpen] = useState(false);
    const { t } = useTranslation();
    const navbarRef = useRef<HTMLDivElement>(null);

    const handleClickOutside = useCallback((event: MouseEvent) => {
        if (navbarRef.current && !navbarRef.current.contains(event.target as Node)) {
            setOpen(false);
        }
    }, []);

    useEffect(() => {
        if (!open) return;
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [open, handleClickOutside]);

    return (
        <nav
            className="fixed w-full z-50 top-0 start-0 border-b border-white/5 bg-brand-dark/60 backdrop-blur-2xl supports-backdrop-filter:bg-brand-dark/60"
            ref={navbarRef}>
            <div className="max-w-7xl flex items-center justify-between mx-auto px-6 h-20">
                {/* Logo Section */}
                <Link to="/" className="flex items-center space-x-3 group">
                    <div className="p-2 bg-linear-to-br from-white/5 to-white/0 rounded-xl border border-white/5 group-hover:border-brand-accent/30 transition-all duration-500 group-hover:shadow-[0_0_20px_rgba(34,197,94,0.15)]">
                        <MountainsIcon
                            size={28}
                            weight="duotone"
                            className="text-brand-accent transition-transform group-hover:scale-110 duration-500"
                        />
                    </div>
                    <span className="text-2xl tracking-tight text-white font-display">
                        evo<span className="text-brand-accent italic">Hike</span>
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-10">
                    <NavbarLink to="/routes">{t('navbarLink1')}</NavbarLink>
                    <NavbarLink to="/weather">{t('navbarLink2')}</NavbarLink>
                    <NavbarLink to="/journal">{t('navbarLink3')}</NavbarLink>
                    <NavbarLink to="/social">{t('navbarLink4')}</NavbarLink>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-4">
                    <div className="hidden md:block">
                        <LanguageSwitcher />
                    </div>

                    <NavLink
                        to="/login"
                        className="hidden md:inline-flex items-center justify-center px-6 py-2.5 text-sm font-bold text-brand-dark bg-brand-accent rounded-full hover:bg-green-400 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 shadow-[0_0_20px_rgba(34,197,94,0.2)] hover:shadow-[0_0_30px_rgba(34,197,94,0.4)]">
                        {t('navbarLink6')}
                    </NavLink>

                    {/* Mobile Toggle */}
                    <button
                        onClick={() => setOpen(!open)}
                        className="p-2 text-brand-muted hover:text-white md:hidden transition-colors">
                        {open ? <XIcon size={28} /> : <ListIcon size={28} />}
                    </button>
                </div>

                {/* Mobile Menu Dropdown */}
                <div
                    className={`absolute top-20 left-0 w-full bg-brand-dark/95 backdrop-blur-3xl border-b border-white/10 md:hidden transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) overflow-hidden ${open ? 'max-h-125 opacity-100 translate-y-0' : 'max-h-0 opacity-0 -translate-y-4'
                    }`}>
                    <ul className="flex flex-col p-6 space-y-4">
                        <li>
                            <NavbarLink to="/routes">{t('navbarLink1')}</NavbarLink>
                        </li>
                        <li>
                            <NavbarLink to="/weather">{t('navbarLink2')}</NavbarLink>
                        </li>
                        <li>
                            <NavbarLink to="/journal">{t('navbarLink3')}</NavbarLink>
                        </li>
                        <li>
                            <NavbarLink to="/social">{t('navbarLink4')}</NavbarLink>
                        </li>
                        <li className="pt-6 border-t border-white/10 flex flex-col gap-6">
                            <NavLink
                                to="/login"
                                className="w-full text-center py-3 rounded-xl bg-brand-accent text-brand-dark font-bold shadow-lg shadow-brand-accent/20">
                                {t('navbarLink6')}
                            </NavLink>
                            <div className="flex justify-center py-2">
                                <LanguageSwitcher />
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
