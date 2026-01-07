import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, useLocation } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { Envelope, LockSimple, CircleNotch, Eye, EyeSlash } from '@phosphor-icons/react'

const LoginPage = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [rememberMe, setRememberMe] = useState(false)
    const [loading, setLoading] = useState(false)
    const { login } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        const savedEmail = localStorage.getItem('rememberedEmail')
        const savedRememberMe = localStorage.getItem('rememberMe') === 'true'
        if (savedRememberMe && savedEmail) {
            setEmail(savedEmail)
            setRememberMe(true)
        }
    }, [])

    const from = location.state?.from?.pathname || '/dashboard'

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            await login(email, password)

            // Handle Remember Me
            if (rememberMe) {
                localStorage.setItem('rememberedEmail', email)
                localStorage.setItem('rememberMe', 'true')
            } else {
                localStorage.removeItem('rememberedEmail')
                localStorage.removeItem('rememberMe')
            }

            toast.success('Login berhasil')
            navigate(from, { replace: true })
        } catch (error) {
            toast.error(error.message || 'Email atau password salah')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-cream font-sans">
            <div className="w-full max-w-sm space-y-8">
                <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                        <img
                            src="/images/logo-icon.png"
                            alt="Thangun Afa Icon"
                            className="w-full h-full object-contain"
                        />
                    </div>
                    <h1 className="text-3xl font-semibold text-gray-800 tracking-tight">Selamat datang</h1>
                    <p className="text-sm text-gray-400 font-medium mt-1">Sistem manajemen Thangun Afa</p>
                </div>

                <div className="p-8 bg-white rounded-[2.5rem] border border-primary-100/30 shadow-2xl shadow-primary/5">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-1.5">
                            <label className="block text-xs font-medium text-gray-400 px-1">Alamat email</label>
                            <div className="relative group">
                                <Envelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} weight="duotone" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-primary-100/30 rounded-2xl focus:ring-4 focus:ring-primary/10 outline-none font-normal text-gray-700 transition-all placeholder:text-gray-300"
                                    placeholder="email@contoh.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-xs font-medium text-gray-400 px-1">Kata sandi</label>
                            <div className="relative group">
                                <LockSimple className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} weight="duotone" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-primary-100/30 rounded-2xl focus:ring-4 focus:ring-primary/10 outline-none font-normal text-gray-700 transition-all placeholder:text-gray-300"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
                                >
                                    {showPassword ? <EyeSlash size={20} weight="bold" /> : <Eye size={20} weight="bold" />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between px-1">
                            <label className="flex items-center space-x-2 cursor-pointer group">
                                <div className="relative flex items-center justify-center">
                                    <input
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={() => setRememberMe(!rememberMe)}
                                        className="sr-only"
                                    />
                                    <div className={`w-5 h-5 border-2 rounded-lg transition-all ${rememberMe ? 'bg-primary border-primary' : 'border-primary-100 group-hover:border-primary/50'}`}>
                                        {rememberMe && (
                                            <svg className="w-3.5 h-3.5 text-white active:scale-125 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                        )}
                                    </div>
                                </div>
                                <span className="text-xs font-medium text-gray-400 group-hover:text-gray-600 transition-colors">Ingat saya</span>
                            </label>
                            <button type="button" className="text-xs font-medium text-primary hover:underline">Lupa password?</button>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 bg-primary text-white font-medium rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center space-x-3 disabled:opacity-50 mt-4 mx-auto max-w-[240px]"
                        >
                            {loading ? (
                                <CircleNotch className="animate-spin" size={20} weight="bold" />
                            ) : (
                                <span>Masuk</span>
                            )}
                        </button>
                    </form>
                </div>

                <div className="text-center">
                    <button
                        onClick={() => navigate('/')}
                        className="text-xs font-medium text-gray-300 hover:text-primary transition-colors"
                    >
                        Kembali ke beranda
                    </button>
                </div>
            </div>
        </div>
    )
}

export default LoginPage
