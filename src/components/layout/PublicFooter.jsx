import { Link } from 'react-router-dom'
import { MapPin, InstagramLogo, WhatsappLogo, YoutubeLogo, FacebookLogo, ArrowUpRight } from '@phosphor-icons/react'
import { useContent } from '../../hooks/useContent'

const PublicFooter = () => {
    const { settings } = useContent()
    const whatsappLink = `https://wa.me/${settings?.whatsapp_number || '6281338398197'}`
    const mapsLink = "https://www.google.com/maps/place/Biupu/@-10.2389427,123.6677153,857m/data=!3m1!1e3!4m15!1m8!3m7!1s0x2c568587f8a2aeef:0x37df5aba8d48cf5f!2sBesmarak,+Kec.+Nekamese,+Kabupaten+Kupang,+Nusa+Tenggara+Tim.!3b1!8m2!3d-10.2490812!4d123.6707189!16s%2Fg%2F12338fsy!3m5!1s0x2c5685e282424777:0xdf486d260f360251!8m2!3d-10.2401875!4d123.6686875!16s%2Fg%2F11t586z2sd?entry=ttu&g_ep=EgoyMDI2MDEwNi4wIKXMDSoASAFQAw%3D%3D"

    const partners = [
        { name: 'Sayur Sleman', logo: '/images/partners/sayur-sleman.png' },
        { name: 'Equity Initiative', logo: '/images/partners/equity-initiative.png' },
        { name: 'GS Organik', logo: '/images/partners/gs-organik.png' },
        { name: 'Tandurasa', logo: '/images/partners/tandurasa.png' },
        { name: 'GARAMIN', logo: '/images/partners/garamin.png' },
    ]

    return (
        <footer className="bg-primary-900 text-white pt-16 pb-8 px-6">
            <div className="max-w-7xl mx-auto space-y-10">
                {/* Partners Section */}
                <div className="text-center space-y-8 pb-10 border-b border-white/10">
                    <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em]">Membangun Bersama Mitra</p>
                    <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700">
                        {partners.map((p) => (
                            <img key={p.name} src={p.logo} alt={p.name} title={p.name} className="h-10 md:h-16 w-auto object-contain brightness-0 invert" />
                        ))}
                    </div>
                </div>

                {/* Main Footer Content - 4 Columns */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-10 pt-4">
                    {/* Col 1: Brand */}
                    <div className="col-span-2 md:col-span-1 space-y-4">
                        <img src="/images/logo-white.png" alt="Thangun Afa" className="h-9 w-auto opacity-90" />
                        <p className="text-white/50 text-sm leading-relaxed max-w-xs">
                            Kelompok Tani Muda Besmarak. Dari petani muda, untuk bumi yang lebih hijau.
                        </p>
                        <div className="flex items-center gap-3 pt-2">
                            <a href={settings?.instagram_url || 'https://www.instagram.com/thangunafa?igsh=MXViejBic2cybTN4ZA=='} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white/10 rounded-lg text-white/60 hover:bg-primary hover:text-white transition-all">
                                <InstagramLogo size={18} weight="fill" />
                            </a>
                            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white/10 rounded-lg text-white/60 hover:bg-primary hover:text-white transition-all">
                                <WhatsappLogo size={18} weight="fill" />
                            </a>
                            <a href="#" className="p-2.5 bg-white/10 rounded-lg text-white/60 hover:bg-primary hover:text-white transition-all">
                                <YoutubeLogo size={18} weight="fill" />
                            </a>
                        </div>
                    </div>

                    {/* Col 2: Resources */}
                    <div className="space-y-4">
                        <h4 className="text-xs font-black uppercase tracking-[0.2em] text-white/40">Pusat Informasi</h4>
                        <ul className="space-y-2.5">
                            <li>
                                <Link to="/news" className="text-sm text-white/60 hover:text-white transition-colors flex items-center gap-1 group">
                                    Blog & Artikel <ArrowUpRight size={12} weight="bold" className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                </Link>
                            </li>
                            <li>
                                <Link to="/gallery" className="text-sm text-white/60 hover:text-white transition-colors flex items-center gap-1 group">
                                    Galeri Momen <ArrowUpRight size={12} weight="bold" className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                </Link>
                            </li>
                            <li>
                                <a href={mapsLink} target="_blank" rel="noopener noreferrer" className="text-sm text-white/60 hover:text-white transition-colors flex items-center gap-1 group">
                                    Lokasi Kami <ArrowUpRight size={12} weight="bold" className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Col 3: About */}
                    <div className="space-y-4">
                        <h4 className="text-xs font-black uppercase tracking-[0.2em] text-white/40">Tentang Kami</h4>
                        <ul className="space-y-2.5">
                            <li>
                                <Link to="/about" className="text-sm text-white/60 hover:text-white transition-colors flex items-center gap-1 group">
                                    Kisah Kami <ArrowUpRight size={12} weight="bold" className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                </Link>
                            </li>
                            <li>
                                <Link to="/#tim" className="text-sm text-white/60 hover:text-white transition-colors flex items-center gap-1 group">
                                    Tim <ArrowUpRight size={12} weight="bold" className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                </Link>
                            </li>
                            <li>
                                <Link to="/#produk" className="text-sm text-white/60 hover:text-white transition-colors flex items-center gap-1 group">
                                    Produk <ArrowUpRight size={12} weight="bold" className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Col 4: Contact */}
                    <div className="space-y-4">
                        <h4 className="text-xs font-black uppercase tracking-[0.2em] text-white/40">Kontak</h4>
                        <ul className="space-y-2.5">
                            <li className="text-sm text-white/60">
                                <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                                    {settings?.whatsapp_number ? `+${settings.whatsapp_number.replace(/^62/, '62 ').replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')}` : '+62 813-3839-8197'}
                                </a>
                            </li>
                            <li className="text-sm text-white/60">
                                {settings?.address || 'Desa Besmarak, NTT'}, Indonesia
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-white/30 text-[10px] font-medium uppercase tracking-[0.2em]">
                        © 2026 Thangun Afa Besmarak. Hak Cipta Dilindungi.
                    </p>
                    <div className="flex items-center space-x-8 text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
                        <Link to="/privacy" className="hover:text-white transition-colors">Kebijakan Privasi</Link>
                        <Link to="/terms" className="hover:text-white transition-colors">Syarat & Ketentuan</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default PublicFooter
