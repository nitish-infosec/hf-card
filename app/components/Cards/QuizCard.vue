<script setup lang="ts">
import type { QuizCard as QuizCardType } from '~/types/training'

interface Props {
  card: QuizCardType
  selectedAnswer?: string
  showFeedback?: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  selectAnswer: [optionId: string]
}>()

const correctOption = computed(() => 
  props.card.options.find(o => o.isCorrect)
)

const isCorrect = computed(() => {
  if (!props.selectedAnswer) return false
  return props.selectedAnswer === correctOption.value?.id
})

const getOptionClass = (optionId: string) => {
  if (!props.showFeedback) {
    return props.selectedAnswer === optionId ? 'selected' : ''
  }
  
  if (optionId === correctOption.value?.id) {
    return 'correct'
  }
  
  if (props.selectedAnswer === optionId && !isCorrect.value) {
    return 'incorrect'
  }
  
  return ''
}

const handleSelect = (optionId: string) => {
  if (props.showFeedback) return // Already answered
  emit('selectAnswer', optionId)
}
</script>

<template>
  <div class="card relative h-full flex flex-col">
    <!-- Quiz Badge - Top Right -->
    <div class="absolute top-4 right-4 z-10">
      <span class="quiz-badge">
        <Icon name="heroicons:academic-cap" class="w-3 h-3" />
        Quiz
      </span>
    </div>

    <!-- Header with Title -->
    <div class="p-6 pb-3 flex-shrink-0">
      <h2 class="text-xl font-bold text-gray-900 dark:text-white pr-16 leading-tight">
        {{ card.question || card.title }}
      </h2>
    </div>

    <!-- Image Section -->
    <div v-if="card.imageUrl || card.image" class="px-6 flex-1 min-h-0">
      <div class="relative rounded-2xl overflow-hidden h-full bg-gray-100 dark:bg-gray-800">
        <img
          :src="card.imageUrl || card.image"
          :alt="card.question || card.title"
          class="w-full h-full object-cover pointer-events-none select-none"
          @error="(e: Event) => (e.target as HTMLImageElement).style.display = 'none'"
        />
      </div>
    </div>

    <!-- Options -->
    <div class="p-6 pt-3 flex-shrink-0 flex flex-col gap-2">
      <button
        v-for="(option, index) in card.options"
        :key="option.id"
        class="quiz-option"
        :class="getOptionClass(option.id)"
        :disabled="showFeedback"
        @click="handleSelect(option.id)"
      >
        <span class="option-letter">{{ option.label || String.fromCharCode(65 + index) }}</span>
        <span class="flex-1 text-sm text-gray-900 dark:text-white text-left">{{ option.text }}</span>
        <Icon 
          v-if="showFeedback && option.id === correctOption?.id" 
          name="heroicons:check-circle-solid" 
          class="w-5 h-5 text-green-500 flex-shrink-0"
        />
        <Icon 
          v-else-if="showFeedback && selectedAnswer === option.id && !isCorrect" 
          name="heroicons:x-circle-solid" 
          class="w-5 h-5 text-red-500 flex-shrink-0"
        />
      </button>

      <!-- Feedback Message -->
      <Transition name="slide-up">
        <div v-if="showFeedback" class="feedback-message" :class="isCorrect ? 'feedback-correct' : 'feedback-incorrect'">
          <Icon 
            :name="isCorrect ? 'heroicons:check-circle-solid' : 'heroicons:x-circle-solid'" 
            class="w-4 h-4"
          />
          <span class="font-medium text-sm">{{ isCorrect ? 'Correct!' : 'Not quite right' }}</span>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.quiz-badge {
  @apply inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium;
  @apply bg-orange-500/20 text-orange-600 dark:text-orange-400;
}

.quiz-option {
  @apply w-full p-3 rounded-xl border-2 text-left transition-all duration-200;
  @apply flex items-center gap-3;
  @apply border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-dark-300/50;
  @apply hover:border-primary-400 hover:bg-primary-50/50 dark:hover:bg-primary-900/20;
  @apply cursor-pointer;
}

.quiz-option:disabled {
  @apply cursor-default;
}

.quiz-option.selected {
  @apply border-primary-500 bg-primary-50 dark:bg-primary-900/30;
}

.quiz-option.correct {
  @apply border-green-500 bg-green-50 dark:bg-green-900/30;
}

.quiz-option.incorrect {
  @apply border-red-500 bg-red-50 dark:bg-red-900/30;
}

.option-letter {
  @apply w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0;
  @apply bg-gray-100 dark:bg-dark-300 text-gray-600 dark:text-gray-400;
}

.quiz-option.selected .option-letter {
  @apply bg-primary-500 text-white;
}

.quiz-option.correct .option-letter {
  @apply bg-green-500 text-white;
}

.quiz-option.incorrect .option-letter {
  @apply bg-red-500 text-white;
}

.feedback-message {
  @apply mt-2 p-3 rounded-xl text-xs flex items-center gap-2;
}

.feedback-correct {
  @apply bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300;
}

.feedback-incorrect {
  @apply bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease-out;
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
