/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: 'var(--primary)',
                    50: 'var(--primary-50)',
                    100: 'var(--primary-100)',
                    200: 'var(--primary-200)',
                    600: 'var(--primary-600)',
                    900: 'var(--primary-900)',
                },
                accent: {
                    DEFAULT: 'var(--accent)',
                    50: 'var(--accent-50)',
                    100: 'var(--accent-100)',
                    500: 'var(--accent-500)',
                },
                cream: 'var(--cream)'
            },
            fontFamily: {
                sans: ['"Plus Jakarta Sans"', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
