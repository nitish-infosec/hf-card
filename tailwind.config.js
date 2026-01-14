/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        './components/**/*.{js,vue,ts}',
        './layouts/**/*.vue',
        './pages/**/*.vue',
        './plugins/**/*.{js,ts}',
        './app.vue',
        './error.vue'
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            colors: {
                // Custom color palette
                primary: {
                    50: '#f0f9ff',
                    100: '#e0f2fe',
                    200: '#bae6fd',
                    300: '#7dd3fc',
                    400: '#38bdf8',
                    500: '#0ea5e9',
                    600: '#0284c7',
                    700: '#0369a1',
                    800: '#075985',
                    900: '#0c4a6e',
                    950: '#082f49',
                },
                dark: {
                    100: '#1e293b',
                    200: '#1a2234',
                    300: '#151b29',
                    400: '#111827',
                    500: '#0d1117',
                    600: '#080b10',
                },
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
                // Deep Ocean gradient
                'deep-ocean': 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
                // ADMN Gradient (Abu Dhabi Media Network theme)
                'admn-gradient': 'linear-gradient(135deg, #002b50 0%, #005a87 50%, #0088a3 100%)',
                // Mesh Gradient
                'mesh-gradient': 'radial-gradient(at 40% 20%, hsla(267, 50%, 30%, 1) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(287, 50%, 35%, 1) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(250, 50%, 35%, 1) 0px, transparent 50%), radial-gradient(at 80% 50%, hsla(270, 50%, 25%, 1) 0px, transparent 50%), radial-gradient(at 0% 100%, hsla(280, 50%, 30%, 1) 0px, transparent 50%), radial-gradient(at 80% 100%, hsla(260, 50%, 25%, 1) 0px, transparent 50%)',
                // Hybrid gradient
                'hybrid-gradient': 'linear-gradient(135deg, rgba(26, 26, 46, 0.9) 0%, rgba(22, 33, 62, 0.9) 50%, rgba(15, 52, 96, 0.9) 100%), radial-gradient(at 50% 50%, hsla(267, 50%, 30%, 0.3) 0px, transparent 50%)',
            },
            boxShadow: {
                'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
                'card-hover': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                'card-dark': '0 4px 20px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                'glow': '0 0 20px rgba(14, 165, 233, 0.3)',
            },
            animation: {
                'fade-in': 'fadeIn 0.3s ease-out',
                'slide-up': 'slideUp 0.3s ease-out',
                'slide-down': 'slideDown 0.3s ease-out',
                'scale-in': 'scaleIn 0.2s ease-out',
                'flip-in': 'flipIn 0.5s ease-in-out',
                'swipe-left': 'swipeLeft 0.3s ease-out forwards',
                'swipe-right': 'swipeRight 0.3s ease-out forwards',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideDown: {
                    '0%': { opacity: '0', transform: 'translateY(-20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                scaleIn: {
                    '0%': { opacity: '0', transform: 'scale(0.95)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                },
                flipIn: {
                    '0%': { transform: 'rotateY(-90deg)', opacity: '0' },
                    '100%': { transform: 'rotateY(0deg)', opacity: '1' },
                },
                swipeLeft: {
                    '0%': { transform: 'translateX(0) rotate(0deg)', opacity: '1' },
                    '100%': { transform: 'translateX(-150%) rotate(-15deg)', opacity: '0' },
                },
                swipeRight: {
                    '0%': { transform: 'translateX(0) rotate(0deg)', opacity: '1' },
                    '100%': { transform: 'translateX(150%) rotate(15deg)', opacity: '0' },
                },
            },
            transitionTimingFunction: {
                'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
            },
        },
    },
    plugins: [],
}
