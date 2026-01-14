import type { AnimationStyle, BackgroundStyle, CardDesignStyle, AppSettings } from '~/types/training'

const defaultSettings: AppSettings = {
    animationStyle: 'flip',
    backgroundStyle: 'admn',
    cardDesign: 'corporate',
    language: 'en'
}

export const useSettings = () => {
    const settings = useState<AppSettings>('settings', () => ({ ...defaultSettings }))

    const animationStyle = computed(() => settings.value.animationStyle)
    const backgroundStyle = computed(() => settings.value.backgroundStyle)
    const cardDesign = computed(() => settings.value.cardDesign)
    const language = computed(() => settings.value.language)

    const setAnimationStyle = (style: AnimationStyle) => {
        settings.value.animationStyle = style
    }

    const setBackgroundStyle = (style: BackgroundStyle) => {
        settings.value.backgroundStyle = style
    }

    const setCardDesign = (style: CardDesignStyle) => {
        settings.value.cardDesign = style
    }

    const setLanguage = (lang: string) => {
        settings.value.language = lang
    }

    const resetSettings = () => {
        settings.value = { ...defaultSettings }
    }

    // Background CSS class based on style
    const backgroundClass = computed(() => {
        const classMap: Record<BackgroundStyle, string> = {
            'deep-ocean': 'bg-style-deep-ocean',
            'admn': 'bg-style-admn',
            'mesh': 'bg-style-mesh',
            'hybrid': 'bg-style-hybrid'
        }
        return classMap[settings.value.backgroundStyle]
    })

    return {
        settings: readonly(settings),
        animationStyle,
        backgroundStyle,
        cardDesign,
        language,
        backgroundClass,
        setAnimationStyle,
        setBackgroundStyle,
        setCardDesign,
        setLanguage,
        resetSettings
    }
}
