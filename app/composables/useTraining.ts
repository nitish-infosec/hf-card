import type { TrainingModule, TrainingProgress, TrainingCard, QuizCard } from '~/types/training'

export const useTraining = () => {
    const currentModule = useState<TrainingModule | null>('currentModule', () => null)

    const progress = useState<TrainingProgress>('trainingProgress', () => ({
        currentIndex: 0,
        answeredQuizzes: {},
        correctAnswers: 0,
        totalQuizzes: 0,
        isComplete: false
    }))

    // Computed values
    const currentCard = computed<TrainingCard | null>(() => {
        if (!currentModule.value) return null
        return currentModule.value.cards[progress.value.currentIndex] ?? null
    })

    const totalCards = computed(() => currentModule.value?.cards.length ?? 0)

    const currentIndex = computed(() => progress.value.currentIndex)

    const isFirstCard = computed(() => progress.value.currentIndex === 0)

    const isLastCard = computed(() => {
        if (!currentModule.value) return true
        return progress.value.currentIndex === currentModule.value.cards.length - 1
    })

    const isQuizCard = computed(() => currentCard.value?.type === 'quiz')

    const isQuizAnswered = computed(() => {
        if (!currentCard.value || currentCard.value.type !== 'quiz') return true
        return !!progress.value.answeredQuizzes[currentCard.value.id]
    })

    const canNavigateNext = computed(() => {
        // For quiz cards, require an answer before allowing navigation
        if (isQuizCard.value && !isQuizAnswered.value) return false
        return true
    })

    const progressPercentage = computed(() => {
        if (!totalCards.value) return 0
        return Math.round(((progress.value.currentIndex + 1) / totalCards.value) * 100)
    })

    // Actions
    const loadModule = (module: TrainingModule) => {
        currentModule.value = module
        progress.value = {
            currentIndex: 0,
            answeredQuizzes: {},
            correctAnswers: 0,
            totalQuizzes: module.cards.filter(c => c.type === 'quiz').length,
            isComplete: false
        }
    }

    const goToCard = (index: number) => {
        if (!currentModule.value) return
        if (index < 0 || index >= currentModule.value.cards.length) return
        progress.value.currentIndex = index
    }

    const nextCard = () => {
        if (isLastCard.value || !canNavigateNext.value) return
        progress.value.currentIndex++
    }

    const previousCard = () => {
        if (isFirstCard.value) return
        progress.value.currentIndex--
    }

    const answerQuiz = (optionId: string) => {
        if (!currentCard.value || currentCard.value.type !== 'quiz') return

        const quizCard = currentCard.value as QuizCard
        const selectedOption = quizCard.options.find(o => o.id === optionId)

        // Only count if not already answered
        if (!progress.value.answeredQuizzes[quizCard.id]) {
            progress.value.answeredQuizzes[quizCard.id] = optionId
            if (selectedOption?.isCorrect) {
                progress.value.correctAnswers++
            }
        }
    }

    const getQuizAnswer = (quizId: string) => {
        return progress.value.answeredQuizzes[quizId]
    }

    const isAnswerCorrect = (quizId: string) => {
        const card = currentModule.value?.cards.find(c => c.id === quizId)
        if (!card || card.type !== 'quiz') return false

        const answerId = progress.value.answeredQuizzes[quizId]
        if (!answerId) return false

        return (card as QuizCard).options.find(o => o.id === answerId)?.isCorrect ?? false
    }

    const completeTraining = () => {
        progress.value.isComplete = true
    }

    const resetProgress = () => {
        progress.value = {
            currentIndex: 0,
            answeredQuizzes: {},
            correctAnswers: 0,
            totalQuizzes: progress.value.totalQuizzes,
            isComplete: false
        }
    }

    return {
        currentModule: readonly(currentModule),
        progress: readonly(progress),
        currentCard,
        totalCards,
        currentIndex,
        isFirstCard,
        isLastCard,
        isQuizCard,
        isQuizAnswered,
        canNavigateNext,
        progressPercentage,
        loadModule,
        goToCard,
        nextCard,
        previousCard,
        answerQuiz,
        getQuizAnswer,
        isAnswerCorrect,
        completeTraining,
        resetProgress
    }
}
