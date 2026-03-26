import { TbCompassOff } from 'react-icons/tb';
import { FaArrowRight } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

function NotFoundPage() {
    const { t } = useTranslation();
    return (
        <div className="flex flex-col items-center justify-center px-6 py-24 relative overflow-hidden min-h-screen bg-brand-dark">

            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
                <span className="font-display font-bold text-[15rem] md:text-[30rem] leading-none text-white/5 tracking-tighter">
                    404
                </span>
            </div>

            <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mt-12">

                <div className="group mb-8 p-5 bg-brand-accent/5 rounded-full border border-brand-accent/20 text-brand-accent shadow-[0_0_20px_rgba(34,197,94,0.15)]">
                    <TbCompassOff size={64} className="transition-transform duration-300 group-hover:scale-110" />
                </div>

                <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl text-brand-text mb-6 tracking-tight">
                    {t('notFound.title')}
                </h1>


                <p className="font-body text-lg md:text-xl text-brand-muted mb-12 max-w-lg leading-relaxed font-light">
                    {t('notFound.description')}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 items-center">
                    <a href="/" className="group relative px-8 py-3.5 bg-brand-accent text-brand-dark rounded-full font-bold transition-all duration-300 hover:bg-green-400 hover:-translate-y-0.5 active:translate-y-0 shadow-[0_0_20px_rgba(34,197,94,0.2)] hover:shadow-[0_0_30px_rgba(34,197,94,0.4)] flex items-center gap-3">
                        <span className="uppercase tracking-wide text-sm">{t('notFound.backToHome')}</span>
                        <FaArrowRight className="transition-transform group-hover:translate-x-1"/>
                    </a>

                    <button className="px-8 py-3.5 text-brand-muted font-bold uppercase tracking-wide text-sm hover:text-white border border-transparent hover:border-white/10 hover:bg-white/5 rounded-full transition-all duration-300">
                        {t('notFound.contact')}
                    </button>
                </div>
            </div>

            <div className="absolute bottom-20 left-10 hidden xl:flex flex-col gap-2">
                <div className="w-16 h-[1px] bg-brand-muted/40"></div>
                <span className="font-body text-[10px] uppercase tracking-[0.3em] text-brand-muted opacity-60">Error_Code: 0x404_VOID</span>
            </div>

            <div className="absolute top-1/2 right-10 hidden xl:block transform -translate-y-1/2 rotate-90 origin-right">
                <span className="font-body text-[10px] uppercase tracking-[0.3em] text-brand-muted opacity-40">evoHike — Navigation Error</span>
            </div>
        </div>
    );
}

export default NotFoundPage;