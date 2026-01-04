import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, profile, loading } = useAuth()
    const location = useLocation()

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    // If logged in but profile is still null (fetch failed), show error instead of redirecting
    if (!profile && !loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-cream text-center">
                <p className="text-red-600 font-bold mb-4">Gagal memuat profil pengguna.</p>
                <button onClick={() => window.location.reload()} className="px-4 py-2 bg-primary text-white rounded-lg">Coba Lagi</button>
            </div>
        )
    }

    if (allowedRoles && !allowedRoles.includes(profile?.role)) {
        return <Navigate to="/unauthorized" replace />
    }

    return children
}
