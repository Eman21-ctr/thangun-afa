import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './context/AuthContext'
import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard'
import Transactions from './pages/Transactions'
import AddTransaction from './pages/AddTransaction'
import Profile from './pages/Profile'
import Reports from './pages/Reports'
import Members from './pages/Members'
import Settings from './pages/Settings'
import Unauthorized from './pages/Unauthorized'
import LandingPage from './pages/LandingPage'
import ContentManagement from './pages/ContentManagement'
import NewsDetail from './pages/NewsDetail'
import AllNews from './pages/AllNews'
import AllGallery from './pages/AllGallery'
import AllProducts from './pages/AllProducts'
import AboutUs from './pages/AboutUs'
import { ProtectedRoute } from './components/ProtectedRoute'
import MainLayout from './components/layout/MainLayout'
import ScrollToTop from './components/layout/ScrollToTop'

const queryClient = new QueryClient()

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <Router>
                    <ScrollToTop />
                    <div className="min-h-screen flex flex-col">
                        <Routes>
                            <Route path="/login" element={<LoginPage />} />
                            <Route
                                path="/dashboard"
                                element={
                                    <ProtectedRoute>
                                        <MainLayout>
                                            <Dashboard />
                                        </MainLayout>
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/transactions"
                                element={
                                    <ProtectedRoute>
                                        <MainLayout>
                                            <Transactions />
                                        </MainLayout>
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/reports"
                                element={
                                    <ProtectedRoute>
                                        <MainLayout>
                                            <Reports />
                                        </MainLayout>
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/transactions/add"
                                element={
                                    <ProtectedRoute>
                                        <AddTransaction />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/profile"
                                element={
                                    <ProtectedRoute>
                                        <MainLayout>
                                            <Profile />
                                        </MainLayout>
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/members"
                                element={
                                    <ProtectedRoute allowedRoles={['super_admin']}>
                                        <MainLayout>
                                            <Members />
                                        </MainLayout>
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/settings"
                                element={
                                    <ProtectedRoute allowedRoles={['super_admin']}>
                                        <MainLayout>
                                            <Settings />
                                        </MainLayout>
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/content-management"
                                element={
                                    <ProtectedRoute allowedRoles={['super_admin']}>
                                        <MainLayout>
                                            <ContentManagement />
                                        </MainLayout>
                                    </ProtectedRoute>
                                }
                            />
                            <Route path="/unauthorized" element={<Unauthorized />} />
                            <Route path="/news/:slug" element={<NewsDetail />} />
                            <Route path="/news" element={<AllNews />} />
                            <Route path="/gallery" element={<AllGallery />} />
                            <Route path="/products" element={<AllProducts />} />
                            <Route path="/about" element={<AboutUs />} />
                            <Route path="/" element={<LandingPage />} />
                        </Routes>
                        <Toaster position="top-center" />
                    </div>
                </Router>
            </AuthProvider>
        </QueryClientProvider>
    )
}

export default App
