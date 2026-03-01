import { ArrowRightIcon, CompassIcon, FootprintsIcon, TrendUpIcon } from '@phosphor-icons/react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export const HeroSection = () => {
    const { t } = useTranslation();

    return (
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=2548&auto=format&fit=crop"
                    alt="Misty Forest"
                    className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-linear-to-t from-brand-dark via-brand-dark/50 to-transparent" />
                <div className="absolute inset-0 bg-linear-to-r from-brand-dark/80 via-transparent to-brand-dark/80" />
            </div>

            {/* Content */}
            <div className="relative z-10 container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-8 animate-slide-up">
                    <Badge
                        variant="neutral"
                        className="px-4 py-2 text-sm font-semibold tracking-wide uppercase backdrop-blur-md">
                        <CompassIcon size={18} weight="bold" />
                        <span>{t('landing.hero.badge')}</span>
                    </Badge>

                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-display leading-[0.9] tracking-tight">
                        {t('landing.hero.title_prefix')} <br />
                        <span className="text-transparent bg-clip-text bg-linear-to-r from-brand-accent to-teal-400">
                            {t('landing.hero.title_suffix')}
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-brand-muted max-w-lg leading-relaxed font-light">
                        {t('landing.hero.description')}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 pt-4">
                        <Link to="/routeplan">
                            <Button size="lg" className="rounded-full group relative overflow-hidden">
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                <span className="relative flex items-center gap-2">
                                    {t('landing.hero.cta_primary')} <ArrowRightIcon weight="bold" />
                                </span>
                            </Button>
                        </Link>

                        <Link to="/social">
                            <Button variant="secondary" size="lg" className="rounded-full backdrop-blur-sm">
                                {t('landing.hero.cta_secondary')}
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Floating Cards (Decorative) */}
                <div className="hidden lg:block relative h-150 w-full perspective-1000">
                    {/* Card 1: Stats */}
                    <Card
                        variant="glass"
                        className="absolute top-1/4 right-10 animate-float z-20 max-w-xs border-brand-accent/20">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-brand-accent/10 rounded-xl text-brand-accent">
                                <FootprintsIcon size={32} weight="fill" />
                            </div>
                            <div>
                                <div className="text-sm text-brand-muted">{t('landing.hero.stat_distance')}</div>
                                <div className="text-2xl font-bold font-display">1,248 km</div>
                            </div>
                        </div>
                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full w-3/4 bg-brand-accent rounded-full" />
                        </div>
                    </Card>

                    {/* Card 2: Elevation */}
                    <Card
                        variant="glass"
                        className="absolute bottom-1/4 left-10 animate-[float_7s_ease-in-out_infinite_1s] z-10 max-w-xs border-brand-orange/20">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-brand-orange/10 rounded-xl text-brand-orange">
                                <TrendUpIcon size={32} weight="fill" />
                            </div>
                            <div>
                                <div className="text-sm text-brand-muted">{t('landing.hero.stat_elevation')}</div>
                                <div className="text-2xl font-bold font-display">8,848 m</div>
                            </div>
                        </div>
                        <div className="flex items-end gap-1 h-10 mt-2 opacity-50">
                            <div className="w-2 h-4 bg-brand-orange rounded-t-sm" />
                            <div className="w-2 h-6 bg-brand-orange rounded-t-sm" />
                            <div className="w-2 h-3 bg-brand-orange rounded-t-sm" />
                            <div className="w-2 h-8 bg-brand-orange rounded-t-sm" />
                            <div className="w-2 h-5 bg-brand-orange rounded-t-sm" />
                            <div className="w-2 h-9 bg-brand-orange rounded-t-sm" />
                        </div>
                    </Card>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-50">
                <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center pt-2">
                    <div className="w-1 h-2 bg-white rounded-full" />
                </div>
            </div>
        </section>
    );
};
