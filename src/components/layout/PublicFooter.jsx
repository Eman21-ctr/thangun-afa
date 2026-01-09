import React from 'react'
import { Link } from 'react-router-dom'
import { MapPin, InstagramLogo, WhatsappLogo, YoutubeLogo, FacebookLogo } from '@phosphor-icons/react'
import { useContent } from '../../hooks/useContent'

const PublicFooter = () => {
    const { settings } = useContent()
    const whatsappLink = `https://wa.me/${settings?.whatsapp_number || '6281338398197'}`

    const partners = [
        { name: 'Sayur Sleman', logo: '/images/partners/sayur-sleman.png' },
        { name: 'Equity Initiative', logo: '/images/partners/equity-initiative.png' },
        { name: 'GS Organik', logo: '/images/partners/gs-organik.png' },
        { name: 'Tandurasa', logo: '/images/partners/tandurasa.png' },
    ]

    return (
        <footer className="bg-gray-900 text-white pt-16 pb-10 px-6">
            <div className="max-w-7xl mx-auto space-y-6 md:space-y-12">
                {/* Partners Section */}
                <div className="text-center space-y-8">
                    <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em]">Membangun Bersama Mitra</p>
                    <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700">
                        {partners.map((p) => (
                            <img key={p.name} src={p.logo} alt={p.name} title={p.name} className="h-10 md:h-16 w-auto object-contain brightness-0 invert" />
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-6 md:pt-10 border-t border-gray-800/50">
                    {/* Brand Section */}
                    <div className="space-y-6 text-center md:text-left">
                        <img src="/images/logo-white.png" alt="Thangun Afa" className="h-10 w-auto mx-auto md:mx-0 opacity-80" />
                        <p className="text-gray-400 text-sm leading-relaxed max-w-sm mx-auto md:mx-0">
                            Bersama-sama membangun pertanian di Besmarak. Dari petani muda, untuk bumi yang lebih hijau dan kehidupan yang lebih mandiri.
                        </p>
                    </div>

                    {/* Connect Section */}
                    <div className="space-y-6 text-center md:text-right md:flex md:flex-col md:items-end">
                        <h4 className="text-xs font-black uppercase tracking-widest text-white/50">Terhubung</h4>
                        <div className="flex flex-wrap items-center justify-center md:justify-end gap-4">
                            {/* Location */}
                            <a
                                href="https://www.google.com/maps/place/Biupu/@-10.2389427,123.6677153,857m/data=!3m1!1e3!4m15!1m8!3m7!1s0x2c568587f8a2aeef:0x37df5aba8d48cf5f!2sBesmarak,+Kec.+Nekamese,+Kabupaten+Kupang,+Nusa+Tenggara+Tim.!3b1!8m2!3d-10.2490812!4d123.6707189!16s%2Fg%2F12338fsy!3m5!1s0x2c5685e282424777:0xdf486d260f360251!8m2!3d-10.2401875!4d123.6686875!16s%2Fg%2F11t586z2sd?entry=ttu&g_ep=EgoyMDI2MDEwNi4wIKXMDSoASAFQAw%3D%3D"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group relative"
                            >
                                <div className="p-3 bg-gray-800 rounded-xl text-gray-400 group-hover:bg-primary group-hover:text-white transition-all shadow-lg">
                                    <MapPin size={24} weight="fill" />
                                </div>
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-2 bg-gray-800 text-white text-[10px] rounded shadowing-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                                    {settings?.address || 'Desa Besmarak, NTT'}
                                </div>
                            </a>

                            {/* Socials */}
                            {settings?.instagram_url && (
                                <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="p-3 bg-gray-800 rounded-xl text-gray-400 hover:bg-primary hover:text-white transition-all shadow-lg">
                                    <InstagramLogo size={24} weight="fill" />
                                </a>
                            )}
                            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="p-3 bg-gray-800 rounded-xl text-gray-400 hover:bg-primary hover:text-white transition-all shadow-lg">
                                <WhatsappLogo size={24} weight="fill" />
                            </a>
                            <a href="#" className="p-3 bg-gray-800 rounded-xl text-gray-400 hover:bg-primary hover:text-white transition-all shadow-lg">
                                <YoutubeLogo size={24} weight="fill" />
                            </a>
                            <a href="#" className="p-3 bg-gray-800 rounded-xl text-gray-400 hover:bg-primary hover:text-white transition-all shadow-lg">
                                <FacebookLogo size={24} weight="fill" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="pt-8 border-t border-gray-800/50 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-gray-500 text-[10px] font-medium uppercase tracking-[0.2em]">
                        © 2026 Thangun Afa Besmarak. Hak Cipta Dilindungi.
                    </p>
                    <div className="flex items-center space-x-8 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                        <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
                        <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default PublicFooter
