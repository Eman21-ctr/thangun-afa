import { useState } from 'react'
import { CaretLeft, CaretRight } from '@phosphor-icons/react'
import { clsx } from 'clsx'

const MomentSlider = ({ moment, className }) => {
    const [currentIndex, setCurrentIndex] = useState(0)
    const photos = moment.photos || []

    if (photos.length === 0) return null

    const handlePrev = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length)
    }

    const handleNext = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setCurrentIndex((prev) => (prev + 1) % photos.length)
    }

    const currentPhoto = photos[currentIndex]

    return (
        <div className={clsx("flex flex-col space-y-6 w-full max-w-md mx-auto", className)}>
            {/* Image Container */}
            <div className="relative group aspect-square overflow-hidden rounded-xl bg-gray-100 shadow-md border border-gray-100/50">
                {photos.map((photo, index) => (
                    <img
                        key={photo.id || index}
                        src={photo.photo_url}
                        alt={moment.caption}
                        className={clsx(
                            "absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out",
                            index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
                        )}
                    />
                ))}
            </div>

            {/* Navigation & Caption */}
            <div className="flex items-center space-x-2">
                <button
                    onClick={handlePrev}
                    disabled={photos.length <= 1}
                    className={clsx(
                        "w-12 h-12 flex items-center justify-center rounded-full border border-gray-100 bg-white shadow-sm transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed shrink-0",
                        photos.length > 1 && "hover:border-primary/30 hover:shadow-md"
                    )}
                >
                    <CaretLeft size={24} className="text-gray-300" weight="bold" />
                </button>

                <div className="flex-1 text-center min-w-0">
                    <p className="text-[13px] font-normal text-gray-500 leading-relaxed px-1 break-words">
                        {moment.caption || 'Momen kegiatan kelompok tani Thangun Afa.'}
                    </p>
                </div>

                <button
                    onClick={handleNext}
                    disabled={photos.length <= 1}
                    className={clsx(
                        "w-12 h-12 flex items-center justify-center rounded-full border border-gray-100 bg-white shadow-sm transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed shrink-0",
                        photos.length > 1 && "hover:border-primary/30 hover:shadow-md"
                    )}
                >
                    <CaretRight size={24} className="text-primary" weight="bold" />
                </button>
            </div>
        </div>
    )
}

export default MomentSlider
