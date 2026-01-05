import { Link } from 'react-router-dom'
import { useContent } from '../hooks/useContent'
import { EnvelopeSimple, LockKey } from '@phosphor-icons/react'
import PublicFooter from '../components/layout/PublicFooter'
import PublicNavbar from '../components/layout/PublicNavbar'

const AboutUs = () => {
    const { settings, isLoading } = useContent()

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-cream">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col bg-cream font-sans">
            {/* Navigation */}
            <PublicNavbar />

            <main className="pt-28 flex-grow">
                <div className="max-w-4xl mx-auto px-6 mb-20">
                    {/* Perjalanan Kami Title */}
                    <div className="text-center mb-8">
                        <h2 className="text-4xl md:text-5xl font-normal text-gray-900 tracking-tight">Perjalanan Kami</h2>
                    </div>

                    {/* Hero Image */}
                    <div className="w-full bg-gray-200 rounded-none overflow-hidden shadow-2xl mb-10">
                        <img
                            src="/images/hero-1.jpg"
                            alt="Kelompok Tani Thangun Afa"
                            className="w-full h-[400px] lg:h-[500px] object-cover"
                        />
                    </div>

                    {/* Content Text */}
                    <div className="prose prose-xl max-w-none text-gray-500 font-normal leading-relaxed whitespace-pre-line text-center lg:text-left">
                        {settings?.about_history || settings?.about_text}
                    </div>
                </div>

                {/* Visi & Misi Section - Dark Green Theme */}
                <div className="bg-primary px-6 py-20 text-white">
                    <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12">
                        {/* Visi */}
                        <div className="space-y-6">
                            <div className="w-12 h-12 flex items-center justify-center text-accent">
                                <EnvelopeSimple size={32} weight="fill" />
                            </div>
                            <h2 className="text-3xl md:text-4xl font-normal tracking-tight">Visi</h2>
                            <p className="text-primary-100 leading-relaxed font-normal text-lg">
                                {settings?.about_vision || "Menjadi kelompok tani mandiri yang mampu mengintegrasikan teknologi modern dengan kearifan lokal NTT."}
                            </p>
                        </div>

                        {/* Misi */}
                        <div className="space-y-6">
                            <div className="w-12 h-12 flex items-center justify-center text-accent">
                                <LockKey size={32} weight="fill" />
                            </div>
                            <h2 className="text-3xl md:text-4xl font-normal tracking-tight">Misi</h2>
                            <div className="text-primary-100 leading-relaxed font-normal text-lg whitespace-pre-line">
                                {settings?.about_mission || "• Menerapkan Smart Farming\n• Meningkatkan kualitas SDM\n• Membangun akses pasar"}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <PublicFooter />
        </div>
    )
}

export default AboutUs
