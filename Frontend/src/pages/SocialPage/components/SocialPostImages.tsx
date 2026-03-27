interface SocialPostImagesProps {
    images: string[];
}

export const SocialPostImages = ({ images }: SocialPostImagesProps) => {
    if (images.length === 0) return null;

    return (
        <div
            className={`grid gap-1 ${images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'
                }`}>
            {images.map((img, idx) => (
                <div
                    key={idx}
                    className={`relative overflow-hidden ${images.length === 3 && idx === 0 ? 'col-span-2 aspect-2/1' : 'aspect-square'
                        }`}>
                    <img
                        src={img}
                        alt="Hike moment"
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    />
                </div>
            ))}
        </div>
    );
};