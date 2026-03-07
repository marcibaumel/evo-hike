/* eslint-disable no-console */
import { useState, useRef, useEffect } from 'react';
import type { ChangeEvent } from 'react';
import {
    PencilSimpleIcon,
    TimerIcon,
    RulerIcon,
    TextAlignLeftIcon,
    PlusIcon,
    XIcon,
    WarningCircleIcon,
    CaretLeftIcon,
    CaretRightIcon,
    UploadSimpleIcon
} from '@phosphor-icons/react';
import { useRouteForm } from '../../../hooks/useRouteForm';
import { useTranslation } from 'react-i18next';
import { parseGpxToGeoJSON } from '../../../utils/gpxParser';
import type { FeatureCollection } from 'geojson';
import { Button } from '../../../components/Button';

// itt vannak a propsok amiket kapunk
//TODO: Refactor this components
interface RouteEditorPanelProps {
    name: string;
    description: string;
    distance: number; // ez a távolság méterben
    time: number; // ez az idő másodpercben
    onNameChange: (value: string) => void; // ez fut le ha írunk a névbe
    onDescriptionChange: (value: string) => void; // ez fut le ha írunk a leírásba
    onSave: () => void; // ez menti el az útvonalat
    closeRouteEditor: () => void; // Editor bezarasa gombbal
    onGpxLoaded: (data: FeatureCollection | null) => void; // Callback a GPX betöltéshez
    disableGpxUpload?: boolean; // Ha igaz, nem lehet fájlt feltölteni
}

// ez a szerkesztő panel a térkép alatt
export default function RouteEditorPanel({
    name,
    description,
    distance,
    time,
    onNameChange,
    onDescriptionChange,
    onSave,
    closeRouteEditor,
    onGpxLoaded,
    disableGpxUpload
}: RouteEditorPanelProps) {
    const { t } = useTranslation();

    // idő formázása
    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        if (h > 0) return `${h} ${t('routeForm.hours')} ${m} ${t('routeForm.minutes')}`;
        return `${m} ${t('routeForm.minutes')}`;
    };

    // távolság formázása
    const formatDistance = (meters: number) => {
        return (meters / 1000).toFixed(2) + ' km';
    };

    const { gpxInputRef, handleGpxChange, triggerGpxInput, gpxFile, clearGpx } = useRouteForm();

    const [images, setImages] = useState<File[]>([]);
    const [showErrors, setShowErrors] = useState(false);
    const totalSlots = Math.max(3, images.length + 1);

    const isNameValid = name.trim().length > 0;
    const isDescValid = description.trim().length > 0;
    const isRouteValid = distance > 0 && time > 0;

    const isFormValid = isNameValid && isDescValid && isRouteValid;

    const handleSubmit = () => {
        if (isFormValid) {
            onSave();
        } else {
            setShowErrors(true);
        }
    };

    const carouselRef = useRef<HTMLDivElement>(null);
    const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const newFile = e.target.files[0];
            if (newFile) {
                // Csak 5MB alatti képek
                if (newFile.size > 5 * 1024 * 1024) {
                    alert(t('routeForm.image_too_big'));
                    return;
                }
                setImages((prev) => [...prev, newFile]);
            }
            setTimeout(() => scrollCarousel(120), 100);
        }
    };
    const scrollCarousel = (offset: number) => {
        if (carouselRef.current) {
            carouselRef.current.scrollBy({
                left: offset,
                behavior: 'smooth'
            });
        }
    };
    const removeImage = (indexToRemove: number) => {
        setImages((prev) => prev.filter((_, index) => index !== indexToRemove));
    };

    // GPX fájl figyelése és beolvasása
    useEffect(() => {
        if (gpxFile) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target?.result;
                if (typeof text === 'string') {
                    if (gpxFile.name.toLowerCase().endsWith('.gpx')) {
                        const geoJson = parseGpxToGeoJSON(text);
                        onGpxLoaded(geoJson);
                    } else {
                        try {
                            const parsed = JSON.parse(text);

                            const geoJson =
                                parsed.type === 'Feature' ? { type: 'FeatureCollection', features: [parsed] } : parsed;

                            onGpxLoaded(geoJson as FeatureCollection);
                        } catch (error) {
                            console.error('Hiba a GeoJSON beolvasásakor:', error);
                            onGpxLoaded(null);
                        }
                    }
                }
            };
            reader.readAsText(gpxFile);
        } else {
            onGpxLoaded(null);
        }
    }, [gpxFile, onGpxLoaded]);

    return (
        <div className="h-full flex flex-col bg-brand-dark overflow-y-auto">
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between sticky top-0 bg-brand-dark/95 backdrop-blur-md z-20">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-brand-accent/10 text-brand-accent">
                        <PencilSimpleIcon size={20} weight="fill" />
                    </div>
                    <h2 className="text-xl font-display font-bold text-white">{t('routeForm.title')}</h2>
                </div>
                <button
                    onClick={closeRouteEditor}
                    className="p-2 rounded-full hover:bg-white/5 text-brand-muted hover:text-white transition-colors"
                    title={t('routeForm.close_menu')}>
                    <XIcon size={20} />
                </button>
            </div>

            <div className="p-6 space-y-6 flex-1">
                {/* Route Name Input */}
                <div className="space-y-2">
                    <label
                        htmlFor="route-name"
                        className="flex items-center gap-2 text-sm font-medium text-brand-muted">
                        {t('routeForm.route_name')}
                        {showErrors && !isNameValid && <WarningCircleIcon size={16} className="text-red-500" />}
                    </label>
                    <input
                        id="route-name"
                        type="text"
                        value={name}
                        onChange={(e) => onNameChange(e.target.value)}
                        placeholder={t('routeForm.name_placeholder')}
                        className={`w-full bg-white/5 border rounded-xl py-3 px-4 text-white placeholder-brand-muted focus:outline-none focus:border-brand-accent/50 transition-colors ${
                            showErrors && !isNameValid ? 'border-red-500/50' : 'border-white/10'
                        }`}
                    />
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-2 gap-4">
                    <div
                        className={`p-4 rounded-xl bg-white/5 border ${showErrors && !isRouteValid ? 'border-red-500/50' : 'border-white/5'}`}>
                        <div className="flex items-center gap-2 text-brand-muted mb-1 text-sm">
                            <RulerIcon size={16} />
                            <span>{t('routeForm.distance')}</span>
                        </div>
                        <div className="text-lg font-bold text-white font-display">{formatDistance(distance)}</div>
                    </div>
                    <div
                        className={`p-4 rounded-xl bg-white/5 border ${showErrors && !isRouteValid ? 'border-red-500/50' : 'border-white/5'}`}>
                        <div className="flex items-center gap-2 text-brand-muted mb-1 text-sm">
                            <TimerIcon size={16} />
                            <span>{t('routeForm.time')}</span>
                        </div>
                        <div className="text-lg font-bold text-white font-display">{formatTime(time)}</div>
                    </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                    <label
                        htmlFor="route-desc"
                        className="flex items-center gap-2 text-sm font-medium text-brand-muted">
                        <TextAlignLeftIcon size={16} />
                        {t('routeForm.description_label')}
                        {showErrors && !isDescValid && <WarningCircleIcon size={16} className="text-red-500" />}
                    </label>
                    <textarea
                        id="route-desc"
                        value={description}
                        onChange={(e) => onDescriptionChange(e.target.value)}
                        placeholder={t('routeForm.description_placeholder')}
                        rows={5}
                        className={`w-full bg-white/5 border rounded-xl py-3 px-4 text-white placeholder-brand-muted focus:outline-none focus:border-brand-accent/50 transition-colors resize-none ${
                            showErrors && !isDescValid ? 'border-red-500/50' : 'border-white/10'
                        }`}
                    />
                </div>

                {/* Image Carousel */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-brand-muted">{t('routeForm.image_alt')}</label>
                        <div className="flex gap-2">
                            <button
                                onClick={() => scrollCarousel(-120)}
                                className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-brand-muted hover:text-white">
                                <CaretLeftIcon size={16} />
                            </button>
                            <button
                                onClick={() => scrollCarousel(120)}
                                className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-brand-muted hover:text-white">
                                <CaretRightIcon size={16} />
                            </button>
                        </div>
                    </div>

                    <div ref={carouselRef} className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x">
                        {[...Array(totalSlots)].map((_, index) => {
                            const image = images[index];
                            return (
                                <div
                                    key={index}
                                    className="flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden relative bg-white/5 border border-white/5 flex items-center justify-center snap-start">
                                    {image ? (
                                        <>
                                            <img
                                                src={URL.createObjectURL(image)}
                                                alt={`Upload ${index}`}
                                                className="w-full h-full object-cover"
                                            />
                                            <button
                                                onClick={() => removeImage(index)}
                                                className="absolute top-1 right-1 p-1 bg-black/50 hover:bg-red-500/80 rounded-full text-white backdrop-blur-sm transition-colors">
                                                <XIcon size={12} />
                                            </button>
                                        </>
                                    ) : (
                                        index === images.length && (
                                            <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer text-brand-muted hover:text-white hover:bg-white/5 transition-colors">
                                                <PlusIcon size={24} />
                                                <input type="file" hidden onChange={handleUpload} accept="image/*" />
                                            </label>
                                        )
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* GPX Upload */}
                <div className="pt-4 border-t border-white/5">
                    <input
                        type="file"
                        ref={gpxInputRef}
                        onChange={handleGpxChange}
                        style={{ display: 'none' }}
                        accept=".gpx,.geojson,.json"
                    />

                    <Button
                        variant="secondary"
                        className="w-full justify-between group"
                        onClick={disableGpxUpload ? () => alert(t('routeForm.manual_nav_active')) : triggerGpxInput}
                        style={{
                            opacity: disableGpxUpload ? 0.6 : 1,
                            cursor: disableGpxUpload ? 'not-allowed' : 'pointer'
                        }}>
                        <span className="flex items-center gap-2">
                            <UploadSimpleIcon size={18} />
                            {gpxFile ? gpxFile.name : t('routeForm.upload_file')}
                        </span>
                        {gpxFile && (
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    clearGpx();
                                }}
                                className="p-1 hover:bg-red-500/20 text-brand-muted hover:text-red-400 rounded-full transition-colors">
                                <XIcon size={16} />
                            </button>
                        )}
                    </Button>
                    <p className="text-xs text-brand-muted text-center mt-2">{t('routeForm.or')}</p>
                </div>

                {/* Save Action */}
                <Button variant="primary" className="w-full py-3 text-base" onClick={handleSubmit}>
                    <PlusIcon size={18} weight="bold" className="mr-2" />
                    {t('routeForm.add_route')}
                </Button>
            </div>
        </div>
    );
}
