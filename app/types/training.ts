// Training Card Types

export type CardType = 'info' | 'quiz' | 'learning'

export type AnimationStyle = 'flip' | 'swipe' | 'coverflow' | 'stack'

export type BackgroundStyle = 'deep-ocean' | 'admn' | 'mesh' | 'hybrid'

export type CardDesignStyle = 'corporate' | 'minimal' | 'playful'

export interface HighlightedText {
    text: string
    isKeyword?: boolean
}

export interface QuizOption {
    id: string
    label?: string // A, B, C, D (optional)
    text: string
    isCorrect: boolean
}

export interface BaseCard {
    id: string
    type: CardType
    title: string
    imageUrl?: string // Direct image URL
}

export interface InfoCard extends BaseCard {
    type: 'info' | 'learning'
    content: string | HighlightedText[] // Support both formats
    keyTerms?: string[] // Terms to highlight
    tip?: string
    image?: string
    imageAlt?: string
}

export interface QuizCard extends BaseCard {
    type: 'quiz'
    question?: string
    content?: string // Quiz description
    image?: string
    imageAlt?: string
    options: QuizOption[]
    explanation?: string
}

export type TrainingCard = InfoCard | QuizCard

export interface TrainingModule {
    id: string
    slug: string
    title: string
    description: string
    cards: TrainingCard[]
    estimatedTime?: string // e.g., "5 min"
    duration?: string // Alternative name
    category?: string
    difficulty?: 'beginner' | 'intermediate' | 'advanced'
    tags?: string[]
}

export interface TrainingProgress {
    currentIndex: number
    answeredQuizzes: Record<string, string> // quizId -> selectedOptionId
    correctAnswers: number
    totalQuizzes: number
    isComplete: boolean
}

export interface QuizAnswer {
    cardId: string
    selectedOptionId: string
    isCorrect: boolean
}

export interface AppSettings {
    animationStyle: AnimationStyle
    backgroundStyle: BackgroundStyle
    cardDesign: CardDesignStyle
    language: string
}
