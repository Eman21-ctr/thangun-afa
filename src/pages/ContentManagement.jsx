import { useState, useEffect } from 'react'
import { useContent } from '../hooks/useContent'
import {
    DeviceMobile, MapPin, Info, Desktop, FloppyDisk,
    CircleNotch, InstagramLogo, TextT, Users, Leaf,
    Image as ImageIcon, Newspaper, Plus, Trash, PencilSimple,
    Drop, Sun, Star, ShoppingBag
} from '@phosphor-icons/react'
import { toast } from 'react-hot-toast'
import { clsx } from 'clsx'
import imageCompression from 'browser-image-compression'
import { supabase } from '../lib/supabase'

const ContentManagement = () => {
    const {
        settings, isLoading, updateSettings,
        gallery, addGallery, updateGallery, deleteGallery,
        team, addTeamMember, updateTeamMember, deleteTeamMember,
        news, addNews, updateNews, deleteNews,
        products, addProduct, updateProduct, deleteProduct
    } = useContent()

    const [editingId, setEditingId] = useState(null)

    const [activeTab, setActiveTab] = useState('umum')
    const [formData, setFormData] = useState({
        hero_title: '',
        hero_description: '',
        about_text: '',
        about_history: '',
        about_vision: '',
        about_mission: '',
        about_philosophy: '',
        whatsapp_number: '',
        address: '',
        instagram_url: '',
        features: [],
        about_subtitle: '',
        about_title: '',
        team_subtitle: '',
        team_title: '',
        news_subtitle: '',
        news_title: '',
        gallery_subtitle: '',
        gallery_title: '',
        dashboard_hero_url: '',
        hero_image_url: '',
        about_image_url: '',
        about_hero_image_url: '',
        dashboard_announcement: ''
    })

    const [newPhoto, setNewPhoto] = useState({ photo_url: '', caption: '', display_type: 'square' })
    const [newMember, setNewMember] = useState({ name: '', position: '', photo_url: '', quote: '' })
    const [newNews, setNewNews] = useState({ title: '', content: '', thumbnail_url: '', is_published: true })
    const [newProduct, setNewProduct] = useState({ name: '', description: '', image_url: '', status: 'siap_panen', category: '' })
    const [isUploading, setIsUploading] = useState(false)

    useEffect(() => {
        if (settings) {
            setFormData({
                hero_title: settings.hero_title || '',
                hero_description: settings.hero_description || '',
                about_text: settings.about_text || '',
                about_history: settings.about_history || '',
                about_vision: settings.about_vision || '',
                about_mission: settings.about_mission || '',
                about_philosophy: settings.about_philosophy || '',
                whatsapp_number: settings.whatsapp_number || '',
                address: settings.address || '',
                instagram_url: settings.instagram_url || '',
                features: settings.features || [],
                about_subtitle: settings.about_subtitle || '',
                about_title: settings.about_title || '',
                team_subtitle: settings.team_subtitle || '',
                team_title: settings.team_title || '',
                news_subtitle: settings.news_subtitle || '',
                news_title: settings.news_title || '',
                gallery_subtitle: settings.gallery_subtitle || '',
                gallery_title: settings.gallery_title || '',
                dashboard_hero_url: settings.dashboard_hero_url || '',
                hero_image_url: settings.hero_image_url || '',
                about_image_url: settings.about_image_url || '',
                about_hero_image_url: settings.about_hero_image_url || '',
                dashboard_announcement: settings.dashboard_announcement || ''
            })
        }
    }, [settings])

    const handleUpdateSettings = async (e) => {
        e.preventDefault()
        try {
            await updateSettings.mutateAsync(formData)
            toast.success('Konten berhasil diperbarui')
        } catch (error) {
            toast.error(error.message || 'Gagal memperbarui konten')
        }
    }

    const handleFeatureChange = (index, field, value) => {
        const newFeatures = [...formData.features]
        newFeatures[index][field] = value
        setFormData({ ...formData, features: newFeatures })
    }

    const handleImageUpload = async (file, type) => {
        if (!file) return

        const options = {
            maxSizeMB: 0.2,
            maxWidthOrHeight: 1200,
            useWebWorker: true
        }

        try {
            setIsUploading(true)
            const compressedFile = await imageCompression(file, options)
            const fileExt = file.name.split('.').pop()
            const fileName = `${Math.random()}.${fileExt}`
            const filePath = `${type}/${fileName}`

            const { error: uploadError } = await supabase.storage
                .from('content')
                .upload(filePath, compressedFile)

            if (uploadError) throw uploadError

            const { data: { publicUrl } } = supabase.storage
                .from('content')
                .getPublicUrl(filePath)

            setIsUploading(false)
            return publicUrl
        } catch (error) {
            console.error('Upload error:', error)
            toast.error('Gagal mengupload gambar')
            setIsUploading(false)
            return null
        }
    }

    const handlePhotoSubmit = async (e) => {
        e.preventDefault()
        if (!newPhoto.photo_url) return toast.error('URL Foto wajib diisi')
        try {
            if (editingId) {
                await updateGallery.mutateAsync({ ...newPhoto, id: editingId })
                toast.success('Foto berhasil diperbarui')
            } else {
                await addGallery.mutateAsync(newPhoto)
                toast.success('Foto berhasil ditambahkan')
            }
            setNewPhoto({ photo_url: '', caption: '', display_type: 'square' })
            setEditingId(null)
        } catch (error) {
            toast.error('Gagal menyimpan foto')
        }
    }

    const handleMemberSubmit = async (e) => {
        e.preventDefault()
        if (!newMember.name || !newMember.position) return toast.error('Nama dan Jabatan wajib diisi')
        try {
            if (editingId) {
                await updateTeamMember.mutateAsync({ ...newMember, id: editingId })
                toast.success('Anggota berhasil diperbarui')
            } else {
                await addTeamMember.mutateAsync(newMember)
                toast.success('Anggota berhasil ditambahkan')
            }
            setNewMember({ name: '', position: '', photo_url: '', quote: '' })
            setEditingId(null)
        } catch (error) {
            toast.error('Gagal menyimpan anggota')
        }
    }

    const handleNewsSubmit = async (e) => {
        e.preventDefault()
        if (!newNews.title || !newNews.content) return toast.error('Judul dan Konten wajib diisi')
        try {
            if (editingId) {
                await updateNews.mutateAsync({ ...newNews, id: editingId })
                toast.success('Berita berhasil diperbarui')
            } else {
                await addNews.mutateAsync(newNews)
                toast.success('Berita berhasil dipublikasikan')
            }
            setNewNews({ title: '', content: '', thumbnail_url: '', is_published: true })
            setEditingId(null)
        } catch (error) {
            toast.error('Gagal menyimpan berita')
        }
    }

    const handleProductSubmit = async (e) => {
        e.preventDefault()
        if (!newProduct.name) return toast.error('Nama produk wajib diisi')
        try {
            if (editingId) {
                await updateProduct.mutateAsync({ ...newProduct, id: editingId })
                toast.success('Produk berhasil diperbarui')
            } else {
                await addProduct.mutateAsync(newProduct)
                toast.success('Produk berhasil ditambahkan')
            }
            setNewProduct({ name: '', description: '', image_url: '', status: 'siap_panen', category: '' })
            setEditingId(null)
        } catch (error) {
            toast.error('Gagal menyimpan produk')
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-cream">
                <CircleNotch className="animate-spin text-primary" size={40} weight="bold" />
            </div>
        )
    }

    const tabs = [
        { id: 'umum', label: 'Umum', icon: Desktop },
        { id: 'tentang', label: 'Tentang Kami', icon: Info },
        { id: 'produk', label: 'Produk', icon: ShoppingBag },
        { id: 'tim', label: 'Tim Kami', icon: Users },
        { id: 'galeri', label: 'Galeri', icon: ImageIcon },
        { id: 'berita', label: 'Berita', icon: Newspaper },
    ]

    return (
        <div className="p-5 space-y-8 font-sans pb-32">
            <div className="flex items-center justify-between px-1">
                <div>
                    <h1 className="text-xl font-semibold text-gray-800 tracking-tight">Kelola Konten</h1>
                    <p className="text-xs text-gray-400 font-normal mt-0.5">Sesuaikan informasi publik di landing page.</p>
                </div>
            </div>

            {/* Tabs Navigation */}
            <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={clsx(
                            "flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all shrink-0 border",
                            activeTab === tab.id
                                ? "bg-primary text-white border-primary shadow-md"
                                : "bg-white text-gray-400 border-gray-100"
                        )}
                    >
                        <tab.icon size={16} weight={activeTab === tab.id ? "fill" : "duotone"} />
                        <span>{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* Content per Tab */}
            <div className="space-y-6">
                {activeTab === 'umum' && (
                    <form onSubmit={handleUpdateSettings} className="space-y-6">
                        {/* Hero Section */}
                        <div className="bg-white p-4 rounded-none border border-primary-100/30 shadow-sm space-y-4">
                            <div className="flex items-center space-x-2 text-primary border-b border-gray-50 pb-2">
                                <TextT size={18} weight="duotone" />
                                <h2 className="text-xs font-semibold uppercase tracking-wider">Bagian Hero</h2>
                            </div>
                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="block text-[10px] font-medium text-gray-400 uppercase tracking-widest px-1">Judul Utama</label>
                                    <input
                                        type="text"
                                        value={formData.hero_title}
                                        onChange={(e) => setFormData({ ...formData, hero_title: e.target.value })}
                                        className="w-full p-3 bg-gray-50/50 border border-primary-100/30 rounded-lg outline-none font-normal text-gray-700 text-sm transition-all"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="block text-[10px] font-medium text-gray-400 uppercase tracking-widest px-1">Deskripsi Singkat</label>
                                    <textarea
                                        rows="2"
                                        value={formData.hero_description}
                                        onChange={(e) => setFormData({ ...formData, hero_description: e.target.value })}
                                        className="w-full p-3 bg-gray-50/50 border border-primary-100/30 rounded-lg outline-none font-normal text-gray-700 text-sm transition-all resize-none"
                                    ></textarea>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="block text-[10px] font-medium text-gray-400 uppercase tracking-widest px-1">Foto Hero (Landing Page)</label>
                                    <div className="flex items-center space-x-3">
                                        <div className="flex-1">
                                            <input
                                                type="text"
                                                value={formData.hero_image_url}
                                                onChange={(e) => setFormData({ ...formData, hero_image_url: e.target.value })}
                                                className="w-full p-3 bg-gray-50/50 border border-primary-100/30 rounded-lg outline-none font-normal text-gray-700 text-xs transition-all"
                                                placeholder="https://images.unsplash.com/..."
                                            />
                                        </div>
                                        <div className="relative">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={async (e) => {
                                                    const url = await handleImageUpload(e.target.files[0], 'site')
                                                    if (url) setFormData({ ...formData, hero_image_url: url })
                                                }}
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                                disabled={isUploading}
                                            />
                                            <div className="p-3 bg-primary text-white rounded-lg shadow-md hover:scale-105 active:scale-95 transition-all">
                                                {isUploading ? <CircleNotch className="animate-spin" size={18} weight="bold" /> : <Plus size={18} weight="bold" />}
                                            </div>
                                        </div>
                                    </div>
                                    {formData.hero_image_url && (
                                        <div className="mt-2 rounded-lg overflow-hidden h-24 border border-gray-100">
                                            <img src={formData.hero_image_url} alt="Preview Landing Hero" className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Judul Konten Beranda */}
                        <div className="bg-white p-4 rounded-none border border-primary-100/30 shadow-sm space-y-5">
                            <div className="flex items-center space-x-2 text-primary border-b border-gray-50 pb-2">
                                <Leaf size={18} weight="duotone" />
                                <h2 className="text-xs font-semibold uppercase tracking-wider">Judul Setiap Bagian</h2>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Tentang Kami */}
                                <div className="space-y-3 p-3 bg-gray-50/50 rounded-lg border border-primary-100/10">
                                    <h3 className="text-[10px] font-semibold text-primary uppercase tracking-widest border-b border-white pb-2">Bagian {activeTab === 'tim' ? 'Tim Kami' : activeTab === 'berita' ? 'Berita' : 'Tentang Kami'}</h3>
                                    <div className="space-y-3">
                                        <div className="space-y-1">
                                            <label className="block text-[9px] font-medium text-gray-400 uppercase tracking-widest px-1">Subtitle</label>
                                            <input type="text" value={formData.about_subtitle} onChange={(e) => setFormData({ ...formData, about_subtitle: e.target.value })} className="w-full p-2.5 bg-white border border-primary-100/30 rounded-md outline-none font-normal text-gray-700 text-sm" placeholder="Subtitle..." />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="block text-[9px] font-medium text-gray-400 uppercase tracking-widest px-1">Judul Besar</label>
                                            <input type="text" value={formData.about_title} onChange={(e) => setFormData({ ...formData, about_title: e.target.value })} className="w-full p-2.5 bg-white border border-primary-100/30 rounded-md outline-none font-normal text-gray-700 text-sm" placeholder="Judul..." />
                                        </div>
                                    </div>
                                </div>

                                {/* Tim Kami */}
                                <div className="space-y-3 p-3 bg-gray-50/50 rounded-lg border border-primary-100/10">
                                    <h3 className="text-[10px] font-semibold text-primary uppercase tracking-widest border-b border-white pb-2">Bagian Tim Kami</h3>
                                    <div className="space-y-3">
                                        <div className="space-y-1">
                                            <label className="block text-[9px] font-medium text-gray-400 uppercase tracking-widest px-1">Subtitle</label>
                                            <input type="text" value={formData.team_subtitle} onChange={(e) => setFormData({ ...formData, team_subtitle: e.target.value })} className="w-full p-2.5 bg-white border border-primary-100/30 rounded-md outline-none font-normal text-gray-700 text-sm" placeholder="Tim Kami" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="block text-[9px] font-medium text-gray-400 uppercase tracking-widest px-1">Judul Besar</label>
                                            <input type="text" value={formData.team_title} onChange={(e) => setFormData({ ...formData, team_title: e.target.value })} className="w-full p-2.5 bg-white border border-primary-100/30 rounded-md outline-none font-normal text-gray-700 text-sm" placeholder="Yang Muda..." />
                                        </div>
                                    </div>
                                </div>

                                {/* Berita */}
                                <div className="space-y-3 p-3 bg-gray-50/50 rounded-lg border border-primary-100/10">
                                    <h3 className="text-[10px] font-semibold text-primary uppercase tracking-widest border-b border-white pb-2">Bagian Berita</h3>
                                    <div className="space-y-3">
                                        <div className="space-y-1">
                                            <label className="block text-[9px] font-medium text-gray-400 uppercase tracking-widest px-1">Subtitle</label>
                                            <input type="text" value={formData.news_subtitle} onChange={(e) => setFormData({ ...formData, news_subtitle: e.target.value })} className="w-full p-2.5 bg-white border border-primary-100/30 rounded-md outline-none font-normal text-gray-700 text-sm" placeholder="Berita & Kegiatan" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="block text-[9px] font-medium text-gray-400 uppercase tracking-widest px-1">Judul Besar</label>
                                            <input type="text" value={formData.news_title} onChange={(e) => setFormData({ ...formData, news_title: e.target.value })} className="w-full p-2.5 bg-white border border-primary-100/30 rounded-md outline-none font-normal text-gray-700 text-sm" placeholder="Update Terbaru..." />
                                        </div>
                                    </div>
                                </div>

                                {/* Galeri */}
                                <div className="space-y-3 p-3 bg-gray-50/50 rounded-lg border border-primary-100/10">
                                    <h3 className="text-[10px] font-semibold text-primary uppercase tracking-widest border-b border-white pb-2">Bagian Galeri</h3>
                                    <div className="space-y-3">
                                        <div className="space-y-1">
                                            <label className="block text-[9px] font-medium text-gray-400 uppercase tracking-widest px-1">Subtitle</label>
                                            <input type="text" value={formData.gallery_subtitle} onChange={(e) => setFormData({ ...formData, gallery_subtitle: e.target.value })} className="w-full p-2.5 bg-white border border-primary-100/30 rounded-md outline-none font-normal text-gray-700 text-sm" placeholder="Momen Berharga" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="block text-[9px] font-medium text-gray-400 uppercase tracking-widest px-1">Judul Besar</label>
                                            <input type="text" value={formData.gallery_title} onChange={(e) => setFormData({ ...formData, gallery_title: e.target.value })} className="w-full p-2.5 bg-white border border-primary-100/30 rounded-md outline-none font-normal text-gray-700 text-sm" placeholder="Galeri Kegiatan" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Internal Dashboard Hero */}
                        <div className="bg-white p-4 rounded-none border border-primary-100/30 shadow-sm space-y-4">
                            <div className="flex items-center space-x-2 text-primary border-b border-gray-50 pb-2">
                                <ImageIcon size={18} weight="duotone" />
                                <h2 className="text-xs font-semibold uppercase tracking-wider">Banner Dashboard Internal</h2>
                            </div>
                            <div className="space-y-4">
                                <div className="space-y-1.5 border-t border-gray-50 pt-4">
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Pengumuman Dashboard (Opsional)</label>
                                    <textarea
                                        value={formData.dashboard_announcement}
                                        onChange={(e) => setFormData({ ...formData, dashboard_announcement: e.target.value })}
                                        className="w-full p-3 bg-gray-50 border border-primary-100/30 rounded-xl text-xs outline-none focus:ring-1 focus:ring-primary/20 min-h-[80px]"
                                        placeholder="Kosongkan untuk menampilkan Quote harian otomatis..."
                                    />
                                    <p className="text-[9px] text-gray-400 px-1 italic">*Jika diisi, teks ini akan muncul di dashboard menggantikan Quote harian harian.</p>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="block text-[10px] font-medium text-gray-400 uppercase tracking-widest px-1">Foto Banner (Beranda Member)</label>
                                    <div className="flex items-center space-x-3">
                                        <div className="flex-1">
                                            <input
                                                type="text"
                                                value={formData.dashboard_hero_url}
                                                onChange={(e) => setFormData({ ...formData, dashboard_hero_url: e.target.value })}
                                                className="w-full p-3 bg-gray-50/50 border border-primary-100/30 rounded-lg outline-none font-normal text-gray-700 text-xs transition-all"
                                                placeholder="https://images.unsplash.com/..."
                                            />
                                        </div>
                                        <div className="relative">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={async (e) => {
                                                    const url = await handleImageUpload(e.target.files[0], 'site')
                                                    if (url) setFormData({ ...formData, dashboard_hero_url: url })
                                                }}
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                                disabled={isUploading}
                                            />
                                            <div className="p-3 bg-primary text-white rounded-lg shadow-md hover:scale-105 active:scale-95 transition-all">
                                                {isUploading ? <CircleNotch className="animate-spin" size={18} weight="bold" /> : <Plus size={18} weight="bold" />}
                                            </div>
                                        </div>
                                    </div>
                                    {formData.dashboard_hero_url && (
                                        <div className="mt-2 rounded-lg overflow-hidden h-24 border border-gray-100">
                                            <img src={formData.dashboard_hero_url} alt="Preview Dashboard Hero" className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Contact */}
                        <div className="bg-white p-4 rounded-none border border-primary-100/30 shadow-sm space-y-4">
                            <div className="flex items-center space-x-2 text-primary border-b border-gray-50 pb-2">
                                <MapPin size={18} weight="duotone" />
                                <h2 className="text-xs font-semibold uppercase tracking-wider">Kontak & Lokasi</h2>
                            </div>
                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="block text-[10px] font-medium text-gray-400 uppercase tracking-widest px-1">Nomor WhatsApp</label>
                                    <input
                                        type="text"
                                        value={formData.whatsapp_number}
                                        onChange={(e) => setFormData({ ...formData, whatsapp_number: e.target.value })}
                                        className="w-full p-3 bg-gray-50/50 border border-primary-100/30 rounded-lg outline-none font-normal text-gray-700 text-sm"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="block text-[10px] font-medium text-gray-400 uppercase tracking-widest px-1">Alamat</label>
                                    <input
                                        type="text"
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        className="w-full p-3 bg-gray-50/50 border border-primary-100/30 rounded-lg outline-none font-normal text-gray-700 text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-4 bg-primary text-white font-semibold uppercase tracking-wider rounded-lg shadow-lg shadow-primary/10 transition-all active:scale-95"
                        >
                            Simpan Perubahan
                        </button>
                    </form>
                )}

                {activeTab === 'tentang' && (
                    <form onSubmit={handleUpdateSettings} className="space-y-6">
                        <div className="bg-white p-4 rounded-none border border-primary-100/30 shadow-sm space-y-4">
                            <div className="flex items-center space-x-2 text-primary border-b border-gray-50 pb-2">
                                <Info size={18} weight="duotone" />
                                <h2 className="text-xs font-semibold uppercase tracking-wider">Halaman Tentang Kami</h2>
                            </div>
                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="block text-[10px] font-medium text-gray-400 uppercase tracking-widest px-1">Ringkasan (Beranda)</label>
                                    <textarea
                                        rows="3"
                                        value={formData.about_text}
                                        onChange={(e) => setFormData({ ...formData, about_text: e.target.value })}
                                        className="w-full p-3 bg-gray-50/50 border border-primary-100/30 rounded-lg outline-none font-normal text-gray-700 text-sm transition-all resize-none"
                                    ></textarea>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="block text-[10px] font-medium text-gray-400 uppercase tracking-widest px-1">Foto Tentang Kami</label>
                                    <div className="flex items-center space-x-3">
                                        <div className="flex-1">
                                            <input
                                                type="text"
                                                value={formData.about_image_url}
                                                onChange={(e) => setFormData({ ...formData, about_image_url: e.target.value })}
                                                className="w-full p-3 bg-gray-50/50 border border-primary-100/30 rounded-lg outline-none font-normal text-gray-700 text-xs transition-all"
                                                placeholder="https://images.unsplash.com/..."
                                            />
                                        </div>
                                        <div className="relative">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={async (e) => {
                                                    const url = await handleImageUpload(e.target.files[0], 'site')
                                                    if (url) setFormData({ ...formData, about_image_url: url })
                                                }}
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                                disabled={isUploading}
                                            />
                                            <div className="p-3 bg-primary text-white rounded-lg shadow-md hover:scale-105 active:scale-95 transition-all">
                                                {isUploading ? <CircleNotch className="animate-spin" size={18} weight="bold" /> : <Plus size={18} weight="bold" />}
                                            </div>
                                        </div>
                                    </div>
                                    {formData.about_image_url && (
                                        <div className="mt-2 rounded-lg overflow-hidden h-24 border border-gray-100">
                                            <img src={formData.about_image_url} alt="Preview About" className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-1.5 border-t border-gray-50 pt-4">
                                    <label className="block text-[10px] font-medium text-gray-400 uppercase tracking-widest px-1">Foto Hero (Halaman Detail Tentang Kami)</label>
                                    <div className="flex items-center space-x-3">
                                        <div className="flex-1">
                                            <input
                                                type="text"
                                                value={formData.about_hero_image_url}
                                                onChange={(e) => setFormData({ ...formData, about_hero_image_url: e.target.value })}
                                                className="w-full p-3 bg-gray-50/50 border border-primary-100/30 rounded-lg outline-none font-normal text-gray-700 text-xs transition-all"
                                                placeholder="https://images.unsplash.com/..."
                                            />
                                        </div>
                                        <div className="relative">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={async (e) => {
                                                    const url = await handleImageUpload(e.target.files[0], 'site')
                                                    if (url) setFormData({ ...formData, about_hero_image_url: url })
                                                }}
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                                disabled={isUploading}
                                            />
                                            <div className="p-3 bg-primary text-white rounded-lg shadow-md hover:scale-105 active:scale-95 transition-all">
                                                {isUploading ? <CircleNotch className="animate-spin" size={18} weight="bold" /> : <Plus size={18} weight="bold" />}
                                            </div>
                                        </div>
                                    </div>
                                    {formData.about_hero_image_url && (
                                        <div className="mt-2 rounded-lg overflow-hidden h-24 border border-gray-100">
                                            <img src={formData.about_hero_image_url} alt="Preview About Hero" className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-1.5">
                                    <label className="block text-[10px] font-medium text-gray-400 uppercase tracking-widest px-1">Sejarah Lengkap</label>
                                    <textarea
                                        rows="4"
                                        value={formData.about_history}
                                        onChange={(e) => setFormData({ ...formData, about_history: e.target.value })}
                                        className="w-full p-3 bg-gray-50/50 border border-primary-100/30 rounded-lg outline-none font-normal text-gray-700 text-sm transition-all resize-none"
                                    ></textarea>
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="block text-[10px] font-medium text-gray-400 uppercase tracking-widest px-1">Visi</label>
                                        <textarea
                                            rows="2"
                                            value={formData.about_vision}
                                            onChange={(e) => setFormData({ ...formData, about_vision: e.target.value })}
                                            className="w-full p-3 bg-gray-50/50 border border-primary-100/30 rounded-lg outline-none font-normal text-gray-700 text-sm transition-all resize-none"
                                        ></textarea>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="block text-[10px] font-medium text-gray-400 uppercase tracking-widest px-1">Misi</label>
                                        <textarea
                                            rows="2"
                                            value={formData.about_mission}
                                            onChange={(e) => setFormData({ ...formData, about_mission: e.target.value })}
                                            className="w-full p-3 bg-gray-50/50 border border-primary-100/30 rounded-lg outline-none font-normal text-gray-700 text-sm transition-all resize-none"
                                        ></textarea>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="w-full py-4 bg-primary text-white font-semibold uppercase tracking-wider rounded-lg shadow-lg shadow-primary/10 transition-all active:scale-95"
                        >
                            Simpan Tentang Kami
                        </button>
                    </form>
                )}

                {activeTab === 'galeri' && (
                    <div className="space-y-6">
                        {/* Photo Form */}
                        <form onSubmit={handlePhotoSubmit} className="bg-white p-4 rounded-none border border-primary-100/30 shadow-sm space-y-4">
                            <div className="flex items-center justify-between border-b border-gray-50 pb-2">
                                <h2 className="text-xs font-semibold uppercase tracking-wider text-primary flex items-center gap-2">
                                    <ImageIcon size={18} weight="duotone" />
                                    {editingId ? 'Edit Foto' : 'Tambah Foto'}
                                </h2>
                                {editingId && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setEditingId(null)
                                            setNewPhoto({ photo_url: '', caption: '', display_type: 'square' })
                                        }}
                                        className="text-[9px] font-semibold uppercase text-gray-400 hover:text-red-500"
                                    >Batal</button>
                                )}
                            </div>
                            <div className="space-y-3">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="URL Foto..."
                                        value={newPhoto.photo_url}
                                        onChange={(e) => setNewPhoto({ ...newPhoto, photo_url: e.target.value })}
                                        className="flex-grow p-3 bg-gray-50/50 border border-primary-100/30 rounded-lg outline-none font-normal text-gray-700 text-sm"
                                    />
                                    <label className="shrink-0 flex items-center justify-center w-12 h-12 bg-primary text-white rounded-lg cursor-pointer hover:bg-primary-600 transition-colors">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={async (e) => {
                                                const url = await handleImageUpload(e.target.files[0], 'gallery')
                                                if (url) setNewPhoto({ ...newPhoto, photo_url: url })
                                            }}
                                        />
                                        {isUploading ? <CircleNotch size={20} className="animate-spin" /> : <Plus size={20} weight="bold" />}
                                    </label>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setNewPhoto({ ...newPhoto, display_type: 'square' })}
                                        className={clsx(
                                            "py-2 rounded-lg border text-[10px] font-semibold uppercase tracking-wider transition-all",
                                            newPhoto.display_type === 'square' ? "bg-primary text-white border-primary shadow-sm" : "bg-white text-gray-400 border-gray-100"
                                        )}
                                    >Persegi</button>
                                    <button
                                        type="button"
                                        onClick={() => setNewPhoto({ ...newPhoto, display_type: 'landscape' })}
                                        className={clsx(
                                            "py-2 rounded-lg border text-[10px] font-semibold uppercase tracking-wider transition-all",
                                            newPhoto.display_type === 'landscape' ? "bg-primary text-white border-primary shadow-sm" : "bg-white text-gray-400 border-gray-100"
                                        )}
                                    >Landscape</button>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Keterangan Foto (Momen)"
                                    value={newPhoto.caption}
                                    onChange={(e) => setNewPhoto({ ...newPhoto, caption: e.target.value })}
                                    className="w-full p-3 bg-gray-50/50 border border-primary-100/30 rounded-lg outline-none font-normal text-gray-700 text-sm"
                                    list="existing-captions"
                                />
                                <datalist id="existing-captions">
                                    {[...new Set(gallery.map(p => p.caption))].filter(Boolean).map(caption => (
                                        <option key={caption} value={caption} />
                                    ))}
                                </datalist>
                                <button type="submit" className="w-full py-3 bg-primary text-white font-semibold uppercase tracking-wider rounded-lg shadow-lg shadow-primary/10">
                                    {editingId ? 'Simpan' : 'Tambah ke Galeri'}
                                </button>
                            </div>
                        </form>

                        {/* Gallery List */}
                        <div className="grid grid-cols-2 gap-4">
                            {gallery.map((photo) => (
                                <div key={photo.id} className="relative group overflow-hidden rounded-[2rem] border border-primary-100/10">
                                    <img src={photo.photo_url} alt={photo.caption} className="w-full h-40 object-cover" />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 text-center">
                                        <p className="text-white text-[10px] font-bold mb-3">{photo.caption}</p>
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => {
                                                    setEditingId(photo.id)
                                                    setNewPhoto({ photo_url: photo.photo_url, caption: photo.caption, display_type: photo.display_type })
                                                    window.scrollTo({ top: 0, behavior: 'smooth' })
                                                }}
                                                className="p-2 bg-white text-primary rounded-xl"
                                            >
                                                <PencilSimple size={16} weight="bold" />
                                            </button>
                                            <button
                                                onClick={() => deleteGallery.mutate(photo.id)}
                                                className="p-2 bg-red-500 text-white rounded-xl"
                                            >
                                                <Trash size={16} weight="bold" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'tim' && (
                    <div className="space-y-6">
                        {/* Member Form */}
                        <form onSubmit={handleMemberSubmit} className="bg-white p-4 rounded-none border border-primary-100/30 shadow-sm space-y-4">
                            <div className="flex items-center justify-between border-b border-gray-50 pb-2">
                                <h2 className="text-xs font-semibold uppercase tracking-wider text-primary flex items-center gap-2">
                                    <Users size={18} weight="duotone" />
                                    {editingId ? 'Edit Anggota' : 'Tambah Anggota'}
                                </h2>
                                {editingId && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setEditingId(null)
                                            setNewMember({ name: '', position: '', photo_url: '', quote: '' })
                                        }}
                                        className="text-[9px] font-semibold uppercase text-gray-400 hover:text-red-500"
                                    >Batal</button>
                                )}
                            </div>
                            <div className="space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                    <input
                                        type="text"
                                        placeholder="Nama Lengkap"
                                        value={newMember.name}
                                        onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                                        className="w-full p-3 bg-gray-50/50 border border-primary-100/30 rounded-lg outline-none font-normal text-gray-700 text-sm"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Jabatan"
                                        value={newMember.position}
                                        onChange={(e) => setNewMember({ ...newMember, position: e.target.value })}
                                        className="w-full p-3 bg-gray-50/50 border border-primary-100/30 rounded-lg outline-none font-normal text-gray-700 text-sm"
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="URL Foto Profil"
                                        value={newMember.photo_url}
                                        onChange={(e) => setNewMember({ ...newMember, photo_url: e.target.value })}
                                        className="flex-grow p-3 bg-gray-50/50 border border-primary-100/30 rounded-lg outline-none font-normal text-gray-700 text-sm"
                                    />
                                    <label className="shrink-0 flex items-center justify-center w-12 h-12 bg-primary text-white rounded-lg cursor-pointer hover:bg-primary-600 transition-colors">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={async (e) => {
                                                const url = await handleImageUpload(e.target.files[0], 'team')
                                                if (url) setNewMember({ ...newMember, photo_url: url })
                                            }}
                                        />
                                        {isUploading ? <CircleNotch size={20} className="animate-spin" /> : <Plus size={20} weight="bold" />}
                                    </label>
                                </div>
                                <button type="submit" className="w-full py-3 bg-primary text-white font-semibold uppercase tracking-wider rounded-lg shadow-lg shadow-primary/10">
                                    {editingId ? 'Simpan' : 'Tambah Anggota'}
                                </button>
                            </div>
                        </form>

                        {/* Team List */}
                        <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
                            {team.map((m) => (
                                <div key={m.id} className="text-center relative group">
                                    <div className="w-14 h-14 md:w-16 md:h-16 mx-auto mb-2 rounded-full overflow-hidden bg-primary-50 ring-2 ring-primary/10 group-hover:ring-primary transition-all">
                                        <img src={m.photo_url || '/images/member-1.jpg'} alt={m.name} className="w-full h-full object-cover grayscale" />
                                    </div>
                                    <h3 className="text-[9px] font-black text-gray-800 line-clamp-1 leading-none">{m.name}</h3>
                                    <p className="text-[7px] font-bold text-primary/60 uppercase mt-0.5 leading-none">{m.position}</p>
                                    <div className="absolute -top-1 -right-1 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => {
                                                setEditingId(m.id)
                                                setNewMember({ name: m.name, position: m.position, photo_url: m.photo_url, quote: m.quote || '' })
                                                window.scrollTo({ top: 0, behavior: 'smooth' })
                                            }}
                                            className="p-1.5 bg-white text-primary rounded-full shadow-lg"
                                        >
                                            <PencilSimple size={10} weight="bold" />
                                        </button>
                                        <button
                                            onClick={() => deleteTeamMember.mutate(m.id)}
                                            className="p-1.5 bg-red-500 text-white rounded-full shadow-lg"
                                        >
                                            <Trash size={10} weight="bold" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {activeTab === 'berita' && (
                    <div className="space-y-6">
                        {/* News Form */}
                        <form onSubmit={handleNewsSubmit} className="bg-white p-4 rounded-none border border-primary-100/30 shadow-sm space-y-4">
                            <div className="flex items-center justify-between border-b border-gray-50 pb-2">
                                <h2 className="text-xs font-semibold uppercase tracking-wider text-primary flex items-center gap-2">
                                    <Newspaper size={18} weight="duotone" />
                                    {editingId ? 'Edit Berita' : 'Buat Berita'}
                                </h2>
                                {editingId && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setEditingId(null)
                                            setNewNews({ title: '', content: '', thumbnail_url: '', is_published: true })
                                        }}
                                        className="text-[9px] font-semibold uppercase text-gray-400 hover:text-red-500"
                                    >Batal</button>
                                )}
                            </div>
                            <div className="space-y-3">
                                <input
                                    type="text"
                                    placeholder="Judul Berita"
                                    value={newNews.title}
                                    onChange={(e) => setNewNews({ ...newNews, title: e.target.value })}
                                    className="w-full p-3 bg-gray-50/50 border border-primary-100/30 rounded-lg outline-none font-normal text-gray-700 text-sm"
                                />
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="URL Gambar Sampul (Opsional)"
                                        value={newNews.thumbnail_url}
                                        onChange={(e) => setNewNews({ ...newNews, thumbnail_url: e.target.value })}
                                        className="flex-grow p-3 bg-gray-50/50 border border-primary-100/30 rounded-lg outline-none font-normal text-gray-700 text-sm"
                                    />
                                    <label className="shrink-0 flex items-center justify-center w-12 h-12 bg-primary text-white rounded-lg cursor-pointer hover:bg-primary-600 transition-colors">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={async (e) => {
                                                const url = await handleImageUpload(e.target.files[0], 'news')
                                                if (url) setNewNews({ ...newNews, thumbnail_url: url })
                                            }}
                                        />
                                        {isUploading ? <CircleNotch size={20} className="animate-spin" /> : <Plus size={20} weight="bold" />}
                                    </label>
                                </div>
                                <textarea
                                    rows="4"
                                    placeholder="Isi Berita..."
                                    value={newNews.content}
                                    onChange={(e) => setNewNews({ ...newNews, content: e.target.value })}
                                    className="w-full p-3 bg-gray-50/50 border border-primary-100/30 rounded-lg outline-none font-normal text-gray-700 text-sm leading-relaxed resize-none"
                                ></textarea>
                                <button type="submit" className="w-full py-3 bg-primary text-white font-semibold uppercase tracking-wider rounded-lg shadow-lg shadow-primary/10 flex items-center justify-center space-x-2">
                                    <FloppyDisk size={18} weight="duotone" />
                                    <span>{editingId ? 'Simpan' : 'Posting Berita'}</span>
                                </button>
                            </div>
                        </form>

                        {/* News List */}
                        <div className="space-y-3">
                            <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-2">Daftar Berita</h2>
                            {news.map((item) => (
                                <div key={item.id} className="bg-white p-4 rounded-3xl border border-primary-100/20 flex items-center justify-between group">
                                    <div className="flex items-center space-x-4 overflow-hidden">
                                        <div className="w-12 h-12 rounded-xl bg-gray-100 shrink-0 overflow-hidden">
                                            <img src={item.thumbnail_url || '/images/hero-2.jpg'} alt="" className="w-full h-full object-cover" />
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="text-xs font-black text-gray-800 truncate px-1">{item.title}</h3>
                                            <p className="text-[10px] font-bold text-gray-400 px-1">{new Date(item.published_at).toLocaleDateString('id-ID')}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <button
                                            onClick={() => {
                                                setEditingId(item.id)
                                                setNewNews({
                                                    title: item.title,
                                                    content: item.content,
                                                    thumbnail_url: item.thumbnail_url,
                                                    is_published: item.is_published
                                                })
                                                window.scrollTo({ top: 0, behavior: 'smooth' })
                                            }}
                                            className="p-3 text-primary hover:bg-primary-50 rounded-xl transition-colors"
                                        >
                                            <PencilSimple size={18} weight="bold" />
                                        </button>
                                        <button
                                            onClick={() => deleteNews.mutate(item.id)}
                                            className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                                        >
                                            <Trash size={18} weight="bold" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* TAB: PRODUK */}
                {activeTab === 'produk' && (
                    <div className="space-y-6">
                        {/* Add/Edit Product Form */}
                        <form onSubmit={handleProductSubmit} className="bg-white p-4 rounded-none border border-primary-100/30 shadow-sm space-y-4">
                            <div className="flex items-center space-x-2 text-primary border-b border-gray-50 pb-2">
                                <ShoppingBag size={18} weight="duotone" />
                                <h2 className="text-xs font-semibold uppercase tracking-wider">{editingId ? 'Edit Produk' : 'Tambah Produk Baru'}</h2>
                            </div>
                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="block text-[10px] font-medium text-gray-400 uppercase tracking-widest px-1">Nama Produk *</label>
                                    <input
                                        type="text"
                                        value={newProduct.name}
                                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                        className="w-full p-3 bg-gray-50/50 border border-primary-100/30 rounded-lg outline-none font-normal text-gray-700 text-sm"
                                        placeholder="Contoh: Cabai Rawit Besmarak"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="block text-[10px] font-medium text-gray-400 uppercase tracking-widest px-1">Deskripsi (Opsional)</label>
                                    <textarea
                                        rows="2"
                                        value={newProduct.description}
                                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                                        className="w-full p-3 bg-gray-50/50 border border-primary-100/30 rounded-lg outline-none font-normal text-gray-700 text-sm resize-none"
                                        placeholder="Deskripsi singkat produk..."
                                    ></textarea>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="block text-[10px] font-medium text-gray-400 uppercase tracking-widest px-1">Status</label>
                                        <select
                                            value={newProduct.status}
                                            onChange={(e) => setNewProduct({ ...newProduct, status: e.target.value })}
                                            className="w-full p-3 bg-gray-50/50 border border-primary-100/30 rounded-lg outline-none font-semibold text-gray-700 text-sm"
                                        >
                                            <option value="siap_panen">🟢 Siap Panen</option>
                                            <option value="masa_tanam">🟡 Masa Tanam</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="block text-[10px] font-medium text-gray-400 uppercase tracking-widest px-1">Kategori (Opsional)</label>
                                        <input
                                            type="text"
                                            value={newProduct.category}
                                            onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                                            className="w-full p-3 bg-gray-50/50 border border-primary-100/30 rounded-lg outline-none font-normal text-gray-700 text-sm"
                                            placeholder="Contoh: Sayuran"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="block text-[10px] font-medium text-gray-400 uppercase tracking-widest px-1">Foto Produk</label>
                                    <div className="flex items-center space-x-3">
                                        <div className="flex-1">
                                            <input
                                                type="text"
                                                value={newProduct.image_url}
                                                onChange={(e) => setNewProduct({ ...newProduct, image_url: e.target.value })}
                                                className="w-full p-3 bg-gray-50/50 border border-primary-100/30 rounded-lg outline-none font-normal text-gray-700 text-xs"
                                                placeholder="https://images.unsplash.com/..."
                                            />
                                        </div>
                                        <div className="relative">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={async (e) => {
                                                    const url = await handleImageUpload(e.target.files[0], 'products')
                                                    if (url) setNewProduct({ ...newProduct, image_url: url })
                                                }}
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                                disabled={isUploading}
                                            />
                                            <div className="p-3 bg-primary text-white rounded-lg shadow-md hover:scale-105 active:scale-95 transition-all">
                                                {isUploading ? <CircleNotch className="animate-spin" size={18} weight="bold" /> : <Plus size={18} weight="bold" />}
                                            </div>
                                        </div>
                                    </div>
                                    {newProduct.image_url && (
                                        <div className="mt-2 rounded-lg overflow-hidden h-24 border border-gray-100">
                                            <img src={newProduct.image_url} alt="Preview Produk" className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                </div>
                                <button type="submit" className="w-full py-3 bg-primary text-white font-semibold uppercase tracking-wider rounded-lg shadow-lg shadow-primary/10 flex items-center justify-center space-x-2">
                                    <FloppyDisk size={18} weight="duotone" />
                                    <span>{editingId ? 'Simpan Perubahan' : 'Tambah Produk'}</span>
                                </button>
                            </div>
                        </form>

                        {/* Products List */}
                        <div className="space-y-3">
                            <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-2">Daftar Produk ({products.length})</h2>
                            {products.map((item) => (
                                <div key={item.id} className="bg-white p-4 rounded-3xl border border-primary-100/20 flex items-center justify-between group">
                                    <div className="flex items-center space-x-4 overflow-hidden">
                                        <div className="w-14 h-14 rounded-xl bg-gray-100 shrink-0 overflow-hidden">
                                            <img src={item.image_url || '/images/hero-1.jpg'} alt="" className="w-full h-full object-cover" />
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="text-xs font-black text-gray-800 truncate px-1">{item.name}</h3>
                                            <p className="text-[10px] font-bold px-1">
                                                <span className={clsx(
                                                    "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px]",
                                                    item.status === 'siap_panen' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                                )}>
                                                    {item.status === 'siap_panen' ? '🟢 Siap Panen' : '🟡 Masa Tanam'}
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <button
                                            onClick={() => {
                                                setEditingId(item.id)
                                                setNewProduct({
                                                    name: item.name,
                                                    description: item.description || '',
                                                    image_url: item.image_url || '',
                                                    status: item.status || 'siap_panen',
                                                    category: item.category || ''
                                                })
                                                window.scrollTo({ top: 0, behavior: 'smooth' })
                                            }}
                                            className="p-3 text-primary hover:bg-primary-50 rounded-xl transition-colors"
                                        >
                                            <PencilSimple size={18} weight="bold" />
                                        </button>
                                        <button
                                            onClick={() => deleteProduct.mutate(item.id)}
                                            className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                                        >
                                            <Trash size={18} weight="bold" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {products.length === 0 && (
                                <div className="text-center py-10 text-gray-300">
                                    <ShoppingBag size={40} weight="duotone" className="mx-auto mb-2" />
                                    <p className="text-xs font-semibold">Belum ada produk. Tambahkan produk pertama!</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ContentManagement
