import { Link } from 'react-router-dom'
import { useContent } from '../hooks/useContent'
import { WhatsappLogo, Leaf, ArrowLeft } from '@phosphor-icons/react'
import { clsx } from 'clsx'
import PublicFooter from '../components/layout/PublicFooter'
import PublicNavbar from '../components/layout/PublicNavbar'

const statusConfig = {
    siap_panen: { label: 'Siap Panen', color: 'bg-green-500', textColor: 'text-green-700', bgLight: 'bg-green-50' },
    masa_tanam: { label: 'Masa Tanam', color: 'bg-yellow-500', textColor: 'text-yellow-700', bgLight: 'bg-yellow-50' }
}

const AllProducts = () => {
    const { products, settings, isLoading } = useContent()

    const handleOrder = (product) => {
        const msg = encodeURIComponent(`Halo Thangun Afa, saya tertarik dengan produk *${product.name}*. Apakah tersedia?`)
        const waNumber = settings?.whatsapp_number || '6281338398197'
        window.open(`https://wa.me/${waNumber}?text=${msg}`, '_blank')
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-cream">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col bg-white font-sans">
            <PublicNavbar />

            <main className="pt-28 px-6 flex-grow">
                <div className="max-w-6xl mx-auto mb-20">
                    {/* Header */}
                    <div className="mb-12 text-center">
                        <div className="inline-flex items-center px-4 py-1.5 bg-primary/10 rounded-full text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                            <span>Katalog Lengkap</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-normal text-gray-900 tracking-tight">
                            Semua Produk Kami
                        </h1>
                    </div>

                    {/* Product Grid */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {products.map((product) => {
                            const status = statusConfig[product.status] || statusConfig.siap_panen
                            return (
                                <div
                                    key={product.id}
                                    className="group bg-white/70 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-500"
                                >
                                    {/* Image */}
                                    <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                                        <img
                                            src={product.image_url || '/images/hero-1.jpg'}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                            loading="lazy"
                                        />
                                        {/* Status Badge */}
                                        <div className={clsx("absolute top-4 left-4 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5", status.bgLight, status.textColor)}>
                                            <span className={clsx("w-2 h-2 rounded-full", status.color)}></span>
                                            {status.label}
                                        </div>
                                        {/* Featured Badge */}
                                        {product.is_featured && (
                                            <div className="absolute top-4 right-4 px-2 py-1 rounded-full bg-yellow-400 text-yellow-900 text-[9px] font-black uppercase tracking-wide">
                                                ⭐ Unggulan
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="p-6 space-y-4">
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-900 tracking-tight mb-1">{product.name}</h3>
                                            {product.description && (
                                                <p className="text-sm text-gray-500 line-clamp-2">{product.description}</p>
                                            )}
                                            {product.category && (
                                                <span className="inline-block mt-2 px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-bold uppercase tracking-wide rounded">
                                                    {product.category}
                                                </span>
                                            )}
                                        </div>

                                        <button
                                            onClick={() => handleOrder(product)}
                                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-600 transition-colors shadow-md hover:shadow-lg"
                                        >
                                            <WhatsappLogo size={18} weight="fill" />
                                            <span>Tanya / Pesan</span>
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {/* Back to Home */}
                    <div className="mt-16 text-center">
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 text-primary font-bold hover:underline"
                        >
                            <ArrowLeft size={16} weight="bold" />
                            Kembali ke Beranda
                        </Link>
                    </div>
                </div>
            </main>

            <PublicFooter />
        </div>
    )
}

export default AllProducts
