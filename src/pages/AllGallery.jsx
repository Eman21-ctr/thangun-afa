import { Link } from 'react-router-dom'
import { useContent } from '../hooks/useContent'
import { clsx } from 'clsx'
import PublicFooter from '../components/layout/PublicFooter'
import PublicNavbar from '../components/layout/PublicNavbar'
import MomentSlider from '../components/gallery/MomentSlider'

const AllGallery = () => {
    const { gallery, isLoading } = useContent()

    // Group gallery by caption into "Moments"
    const moments = gallery.reduce((acc, photo) => {
        const caption = photo.caption || 'Lainnya'
        if (!acc[caption]) {
            acc[caption] = { caption, photos: [], latest: photo.created_at }
        }
        acc[caption].photos.push(photo)
        if (new Date(photo.created_at) > new Date(acc[caption].latest)) {
            acc[caption].latest = photo.created_at
        }
        return acc
    }, {})

    const sortedMoments = Object.values(moments).sort((a, b) =>
        new Date(b.latest) - new Date(a.latest)
    )

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
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
                        {sortedMoments.map((moment, i) => (
                            <MomentSlider key={i} moment={moment} />
                        ))}
                    </div>
                </div>
            </main>
            <PublicFooter />
        </div>
    )
}

export default AllGallery
