<script setup lang="ts">
import type { TrainingCard, QuizCard as QuizCardType } from '~/types/training'

interface Props {
  cards: TrainingCard[]
  currentIndex: number
}

const props = defineProps<Props>()
const emit = defineEmits<{
  next: []
  answerQuiz: [optionId: string]
}>()

const { getQuizAnswer, isQuizAnswered } = useTraining()

// Track exiting card state
const exitingCard = ref<TrainingCard | null>(null)
const exitDirection = ref<'left' | 'right'>('right')
const isAnimating = ref(false)

// Show up to 3 cards for visible stack effect (front + 2 behind)
const visibleCards = computed(() => {
  return props.cards.slice(props.currentIndex, props.currentIndex + 3)
})

const handleSwipe = (direction: 'left' | 'right') => {
  if (isAnimating.value) return
  
  // Store the exiting card
  exitingCard.value = visibleCards.value[0] || null
  exitDirection.value = direction
  isAnimating.value = true
  
  // Wait for animation to complete, then update index
  setTimeout(() => {
    exitingCard.value = null
    isAnimating.value = false
    emit('next')
  }, 300) // Match animation duration
}

const handleAnswer = (optionId: string) => {
  emit('answerQuiz', optionId)
}

const getSelectedAnswer = (cardId: string) => {
  return getQuizAnswer(cardId)
}

const getShowFeedback = () => {
  return isQuizAnswered.value
}
</script>

<template>
  <div class="tinder-swipe-container">
    <div class="relative min-h-[560px] w-full max-w-xl mx-auto">
      <!-- Stack cards (shown behind) -->
      <CardsTinderCard
        v-for="(card, index) in visibleCards"
        :key="card.id"
        :card="card"
        :index="isAnimating ? index + 1 : index"
        :is-front="!isAnimating && index === 0"
        :current-index="currentIndex"
        :can-swipe="!isAnimating"
        :selected-answer="index === 0 ? getSelectedAnswer(card.id) : undefined"
        :show-feedback="index === 0 ? getShowFeedback() : false"
        @swipe="handleSwipe"
        @answer-quiz="handleAnswer"
      />
      
      <!-- Exiting card (animated out) -->
      <CardsTinderCard
        v-if="exitingCard"
        :key="exitingCard.id + '-exit'"
        :card="exitingCard"
        :index="0"
        :is-front="false"
        :is-exiting="true"
        :exit-direction="exitDirection"
        :current-index="currentIndex"
        :can-swipe="false"
      />
    </div>
  </div>
</template>

<style scoped>
.tinder-swipe-container {
  @apply relative w-full touch-none select-none;
  perspective: 1200px;
}
</style>
