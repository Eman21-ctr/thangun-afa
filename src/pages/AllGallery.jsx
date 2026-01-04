import { Link } from 'react-router-dom'
import { useContent } from '../hooks/useContent'
import { ArrowLeft, CircleNotch, Image as ImageIcon } from '@phosphor-icons/react'
import { clsx } from 'clsx'

const AllGallery = () => {
    const { gallery, isLoading } = useContent()

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-cream">
                <CircleNotch className="animate-spin text-primary" size={40} weight="bold" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-cream font-sans pb-20">
            <nav className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-xl border-b border-primary-100/30">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link to="/" className="flex items-center space-x-2 text-primary group">
                        <ArrowLeft size={20} weight="bold" className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-xs font-bold">Kembali</span>
                    </Link>
                    <h1 className="text-sm font-bold text-gray-800">Galeri momen</h1>
                    <img src="/images/logo-color.png" alt="Thangun Afa" className="h-8 w-auto hidden md:block" />
                </div>
            </nav>

            <main className="pt-28 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {gallery.map((photo, i) => {
                            const isLandscape = photo.display_type === 'landscape'
                            return (
                                <div key={photo.id || i} className={clsx("space-y-3", isLandscape ? "col-span-2" : "col-span-1")}>
                                    <div className={clsx(
                                        "bg-white rounded-[2.5rem] overflow-hidden border border-primary-100/50 shadow-sm group",
                                        isLandscape ? "aspect-video" : "aspect-[4/5]"
                                    )}>
                                        <img
                                            src={photo.photo_url || `/images/activity-1.jpg`}
                                            alt={photo.caption}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700"
                                        />
                                    </div>
                                    <p className="text-[10px] font-bold text-gray-500 text-center px-4 leading-relaxed">
                                        {photo.caption}
                                    </p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </main>
        </div>
    )
}

export default AllGallery
