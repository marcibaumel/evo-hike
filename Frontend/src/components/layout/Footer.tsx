import { MountainsIcon } from '@phosphor-icons/react';

export const Footer = () => {
    return (
        <footer className="border-t border-white/10 py-12 bg-brand-dark">
            <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-2">
                    <MountainsIcon size={24} weight="duotone" className="text-brand-accent" />
                    <span className="text-xl font-display font-bold text-white">
                        evo<span className="text-brand-accent">Hike</span>
                    </span>
                </div>
                <div className="text-brand-muted text-sm">
                    © {new Date().getFullYear()} evoHike. All rights reserved.
                </div>
                <div className="flex gap-6">
                    <a href="/" className="text-brand-muted hover:text-white transition-colors">
                        Privacy
                    </a>
                    <a href="/" className="text-brand-muted hover:text-white transition-colors">
                        Terms
                    </a>
                    <a href="/" className="text-brand-muted hover:text-white transition-colors">
                        Contact
                    </a>
                </div>
            </div>
        </footer>
    );
};
