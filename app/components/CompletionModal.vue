<script setup lang="ts">
import type { TrainingProgress, TrainingCard, QuizCard } from '~/types/training'

interface Props {
  isOpen: boolean
  progress: TrainingProgress
  cards: TrainingCard[]
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
  retry: []
  continue: []
}>()

// Calculate score
const totalQuizzes = computed(() => props.progress.totalQuizzes)
const correctAnswers = computed(() => props.progress.correctAnswers)
const score = computed(() => {
  if (totalQuizzes.value === 0) return 100
  return Math.round((correctAnswers.value / totalQuizzes.value) * 100)
})

const isPassing = computed(() => score.value >= 60)

// Get quiz results
const quizResults = computed(() => {
  const quizCards = props.cards.filter(c => c.type === 'quiz') as QuizCard[]
  return quizCards.map(quiz => {
    const answerId = props.progress.answeredQuizzes[quiz.id]
    const selectedOption = quiz.options.find(o => o.id === answerId)
    const correctOption = quiz.options.find(o => o.isCorrect)
    return {
      question: quiz.question || quiz.title,
      selectedAnswer: selectedOption?.text || 'Not answered',
      correctAnswer: correctOption?.text || '',
      isCorrect: selectedOption?.isCorrect || false
    }
  })
})

const handleRetry = () => {
  emit('retry')
}

const handleContinue = () => {
  emit('continue')
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen" class="modal-overlay" @click.self="$emit('close')">
        <div class="modal-container">
          <!-- Success Icon -->
          <div class="flex justify-center mb-6">
            <div 
              class="w-20 h-20 rounded-full flex items-center justify-center"
              :class="isPassing ? 'bg-green-100 dark:bg-green-900/30' : 'bg-amber-100 dark:bg-amber-900/30'"
            >
              <Icon 
                :name="isPassing ? 'heroicons:check-circle-solid' : 'heroicons:exclamation-circle-solid'" 
                class="w-12 h-12"
                :class="isPassing ? 'text-green-500' : 'text-amber-500'"
              />
            </div>
          </div>

          <!-- Title -->
          <h2 class="text-2xl font-bold text-center text-gray-900 dark:text-white mb-2">
            {{ isPassing ? 'Training Complete!' : 'Keep Practicing' }}
          </h2>
          
          <p class="text-center text-gray-600 dark:text-gray-400 mb-6">
            {{ isPassing 
              ? "Great job! You've successfully completed this micro-training." 
              : "You didn't pass this time, but don't worry - try again!" 
            }}
          </p>

          <!-- Score Display -->
          <div class="bg-gray-100 dark:bg-gray-800 rounded-2xl p-6 mb-6">
            <div class="text-center">
              <div 
                class="text-5xl font-bold mb-2"
                :class="isPassing ? 'text-green-500' : 'text-amber-500'"
              >
                {{ score }}%
              </div>
              <div class="text-gray-600 dark:text-gray-400">
                {{ correctAnswers }} out of {{ totalQuizzes }} correct
              </div>
            </div>
          </div>

          <!-- Quiz Results -->
          <div class="space-y-3 max-h-48 overflow-y-auto mb-6">
            <div 
              v-for="(result, index) in quizResults" 
              :key="index"
              class="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50"
            >
              <Icon 
                :name="result.isCorrect ? 'heroicons:check-circle-solid' : 'heroicons:x-circle-solid'" 
                class="w-5 h-5 flex-shrink-0 mt-0.5"
                :class="result.isCorrect ? 'text-green-500' : 'text-red-500'"
              />
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {{ result.question }}
                </p>
                <p 
                  class="text-xs"
                  :class="result.isCorrect ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'"
                >
                  {{ result.isCorrect ? 'Correct' : `Correct: ${result.correctAnswer}` }}
                </p>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-3">
            <button
              class="flex-1 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              @click="handleRetry"
            >
              Retry Training
            </button>
            <button
              class="flex-1 px-4 py-3 rounded-xl font-medium transition-colors"
              :class="isPassing 
                ? 'bg-green-500 hover:bg-green-600 text-white' 
                : 'bg-primary-500 hover:bg-primary-600 text-white'"
              @click="handleContinue"
            >
              {{ isPassing ? 'Continue' : 'Back to Home' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  @apply fixed inset-0 z-50 flex items-center justify-center p-4;
  @apply bg-black/60 backdrop-blur-sm;
}

.modal-container {
  @apply w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-2xl;
  @apply border border-gray-200 dark:border-gray-700;
}

.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease-out;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(0.95);
}
</style>
