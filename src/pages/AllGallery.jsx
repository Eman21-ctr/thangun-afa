import { Link } from 'react-router-dom'
import { useContent } from '../hooks/useContent'
import { clsx } from 'clsx'
import PublicFooter from '../components/layout/PublicFooter'
import PublicNavbar from '../components/layout/PublicNavbar'

const AllGallery = () => {
    const { gallery, isLoading } = useContent()

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-cream">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col bg-white font-sans">
            {/* Navigation */}
            <PublicNavbar />

            <main className="pt-28 px-6 flex-grow">
                <div className="max-w-6xl mx-auto mb-20">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {gallery.map((photo, i) => {
                            const isLandscape = photo.display_type === 'landscape'
                            return (
                                <div key={photo.id || i} className={clsx("space-y-3", isLandscape ? "col-span-2" : "col-span-1")}>
                                    <div className={clsx(
                                        "bg-white overflow-hidden border border-primary-100/50 shadow-sm group",
                                        isLandscape ? "aspect-[3/2]" : "aspect-[3/4]"
                                    )}>
                                        <img
                                            src={photo.photo_url || `/images/activity-1.jpg`}
                                            alt={photo.caption}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700"
                                        />
                                    </div>
                                    <p className="text-sm font-normal text-gray-600 text-center px-2 leading-relaxed mt-2">
                                        {photo.caption}
                                    </p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </main>
            <PublicFooter />
        </div>
    )
}

export default AllGallery
