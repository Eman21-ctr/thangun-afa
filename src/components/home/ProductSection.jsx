import { WhatsappLogo, Leaf, Plant, ArrowRight } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import { clsx } from 'clsx'
import { useReveal } from '../../hooks/useReveal'

const statusConfig = {
    siap_panen: { label: 'Siap Panen', color: 'bg-green-500', textColor: 'text-green-700', bgLight: 'bg-green-50' },
    masa_tanam: { label: 'Masa Tanam', color: 'bg-yellow-500', textColor: 'text-yellow-700', bgLight: 'bg-yellow-50' }
}

const ProductSection = ({ products = [], settings, whatsappLink }) => {
    const [ref, visible] = useReveal()

    if (products.length === 0) return null

    const handleOrder = (product) => {
        const msg = encodeURIComponent(`Halo Thangun Afa, saya tertarik dengan produk *${product.name}*. Apakah tersedia?`)
        const waNumber = settings?.whatsapp_number || '6281338398197'
        window.open(`https://wa.me/${waNumber}?text=${msg}`, '_blank')
    }

    return (
        <section id="produk" ref={ref} className={clsx("py-12 lg:py-24 px-6 bg-gray-50/50 reveal", visible && "active")}>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12 lg:mb-20 space-y-3">
                    <div className="inline-flex items-center px-4 py-1.5 bg-white border border-gray-100 rounded-full text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">
                        <span>{settings?.products_subtitle || 'Produk Unggulan'}</span>
                    </div>
                    <h2 className="text-4xl md:text-6xl lg:text-7xl font-normal text-gray-900 tracking-tight leading-tight">
                        {settings?.products_title || 'Hasil Tani Kami'}
                    </h2>
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
                                </div>

                                {/* Content */}
                                <div className="p-6 space-y-4">
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900 tracking-tight mb-1">{product.name}</h3>
                                        {product.description && (
                                            <p className="text-sm text-gray-500 line-clamp-2">{product.description}</p>
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

                {/* View All Products Link */}
                <div className="mt-12 text-center">
                    <Link
                        to="/products"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 shadow-sm hover:shadow-lg group"
                    >
                        <span>Lihat Semua Produk</span>
                        <ArrowRight size={16} weight="bold" className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </section>
    )
}

export default ProductSection
