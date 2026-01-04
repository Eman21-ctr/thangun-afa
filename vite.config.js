import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
            manifest: {
                name: 'Thangun Afa Besmarak',
                short_name: 'Thangun Afa',
                description: 'Aplikasi Manajemen Kelompok Tani Thangun Afa Besmarak',
                theme_color: '#2D4F1E',
                background_color: '#F8F9F4',
                display: 'standalone',
                icons: [
                    {
                        src: '/images/logo-icon.png',
                        sizes: '192x192',
                        type: 'image/png'
                    },
                    {
                        src: '/images/logo-icon.png',
                        sizes: '512x512',
                        type: 'image/png'
                    },
                    {
                        src: '/images/logo-icon.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'any maskable'
                    }
                ]
            }
        })
    ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
})
