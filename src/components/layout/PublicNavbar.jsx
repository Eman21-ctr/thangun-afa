import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { List, X } from '@phosphor-icons/react'
import clsx from 'clsx'

const PublicNavbar = ({ isHome = false }) => {
    const [menuOpen, setMenuOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const location = useLocation()
    const isActuallyHome = location.pathname === '/'

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // If we're not on home, we always want the white/scrolled state
    const displayScrolled = !isActuallyHome || scrolled

    const navLinks = [
        { name: 'Beranda', href: '/' },
        { name: 'Tentang', href: '/#tentang' },
        { name: 'Produk', href: '/#produk' },
        { name: 'Tim', href: '/#tim' },
        { name: 'Blog', href: '/#berita' },
        { name: 'Galeri', href: '/#galeri' },
    ]

    const handleLinkClick = (e, href) => {
        setMenuOpen(false)

        // If it's a hash link and we are already on home, handle it with scroll
        if (href.startsWith('/#') && isActuallyHome) {
            e.preventDefault()
            const id = href.split('#')[1]
            const element = document.getElementById(id)
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' })
                window.history.pushState(null, '', href)
            }
        }
    }

    return (
        <nav className={clsx(
            "fixed top-0 inset-x-0 z-[100] transition-all duration-500",
            displayScrolled
                ? "bg-white/95 backdrop-blur-xl border-b border-primary-100/20 py-3 shadow-sm"
                : "bg-transparent py-5"
        )}>
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                <div className="flex items-center space-x-12">
                    <Link to="/" className="flex items-center">
                        <img
                            src="/images/logo-color.png"
                            alt="Thangun Afa"
                            className={clsx(
                                "h-9 w-auto transition-all duration-500",
                                !displayScrolled && "brightness-0 invert"
                            )}
                        />
                    </Link>

                    {/* Desktop Links */}
                    <div className="hidden lg:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.href}
                                onClick={(e) => handleLinkClick(e, link.href)}
                                className={clsx(
                                    "text-sm font-bold transition-colors duration-300",
                                    displayScrolled ? "text-gray-600 hover:text-primary" : "text-white/90 hover:text-accent"
                                )}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="flex items-center space-x-4">
                    {/* Google Translate Widget */}
                    <div id="google_translate_element" className="hidden lg:block"></div>

                    <Link
                        to="/login"
                        className={clsx(
                            "hidden lg:block px-6 py-2 text-xs font-bold rounded-xl transition-all duration-500",
                            displayScrolled
                                ? "bg-primary text-white shadow-lg shadow-primary/20 hover:scale-105"
                                : "bg-white/20 text-white backdrop-blur-md border border-white/20 hover:bg-white hover:text-primary"
                        )}
                    >
                        Masuk
                    </Link>

                    {/* Hamburger for mobile */}
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className={clsx(
                            "lg:hidden p-2 transition-colors duration-500",
                            displayScrolled ? "text-primary" : "text-white"
                        )}
                    >
                        {menuOpen ? <X size={28} weight="bold" /> : <List size={28} weight="bold" />}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation Menu */}
            {menuOpen && (
                <div className="absolute top-full left-0 right-0 bg-white border-b border-primary-100 shadow-2xl lg:hidden max-h-[80vh] overflow-y-auto">
                    <div className="p-6 space-y-6">
                        <div className="grid grid-cols-1 gap-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.href}
                                    onClick={(e) => handleLinkClick(e, link.href)}
                                    className="px-4 py-3 text-sm font-bold text-gray-700 hover:bg-primary-50 hover:text-primary rounded-xl transition-all"
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <Link
                                to="/login"
                                onClick={() => setMenuOpen(false)}
                                className="px-4 py-4 bg-primary text-white text-sm font-bold rounded-xl text-center shadow-lg shadow-primary/20"
                            >
                                Masuk Ke Dashboard
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    )
}

export default PublicNavbar
