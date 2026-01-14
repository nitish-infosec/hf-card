<script setup lang="ts">
import type { TrainingCard, QuizCard as QuizCardType } from '~/types/training'

interface Props {
  cards: TrainingCard[]
  currentIndex: number
}

const props = defineProps<Props>()
const emit = defineEmits<{
  next: []
  previous: []
  answerQuiz: [optionId: string]
  'update:currentIndex': [index: number]
}>()

const { animationStyle } = useSettings()
const { getQuizAnswer, isQuizAnswered } = useTraining()

// Animation state
const direction = ref<'next' | 'prev'>('next')
const isAnimating = ref(false)

const currentCard = computed(() => props.cards[props.currentIndex])
const previousCard = computed(() => props.cards[props.currentIndex - 1])
const nextCard = computed(() => props.cards[props.currentIndex + 1])

// Get quiz answer for current card if it's a quiz
const selectedAnswer = computed(() => {
  if (currentCard.value?.type !== 'quiz') return undefined
  return getQuizAnswer(currentCard.value.id)
})

const showQuizFeedback = computed(() => {
  if (currentCard.value?.type !== 'quiz') return false
  return isQuizAnswered.value
})

const handleAnswer = (optionId: string) => {
  emit('answerQuiz', optionId)
}

// Card transition classes based on animation style
const getCardStyle = (index: number) => {
  const offset = index - props.currentIndex
  
  if (animationStyle.value === 'swipe') {
    return getSwipeStyle(offset)
  } else if (animationStyle.value === 'flip') {
    return getFlipStyle(offset)
  } else if (animationStyle.value === 'coverflow') {
    return getCoverflowStyle(offset)
  } else if (animationStyle.value === 'stack') {
    return getStackStyle(offset)
  }
  
  return getSwipeStyle(offset)
}

const getSwipeStyle = (offset: number) => {
  if (offset === 0) {
    return {
      transform: 'translateX(0) scale(1)',
      opacity: 1,
      zIndex: 10
    }
  }
  
  const xOffset = offset * 100
  const scale = 1 - Math.abs(offset) * 0.1
  const opacity = Math.max(0, 1 - Math.abs(offset) * 0.5)
  
  return {
    transform: `translateX(${xOffset}%) scale(${scale})`,
    opacity,
    zIndex: 10 - Math.abs(offset)
  }
}

const getFlipStyle = (offset: number) => {
  if (offset === 0) {
    return {
      transform: 'rotateY(0deg)',
      opacity: 1,
      zIndex: 10
    }
  }
  
  const rotation = offset * -90
  return {
    transform: `rotateY(${rotation}deg)`,
    opacity: offset !== 0 ? 0 : 1,
    zIndex: 10 - Math.abs(offset)
  }
}

const getCoverflowStyle = (offset: number) => {
  if (offset === 0) {
    return {
      transform: 'translateX(0) translateZ(0) rotateY(0)',
      opacity: 1,
      zIndex: 10
    }
  }
  
  const xOffset = offset * 50
  const zOffset = -Math.abs(offset) * 100
  const rotation = offset * -15
  const opacity = Math.max(0.3, 1 - Math.abs(offset) * 0.3)
  
  return {
    transform: `translateX(${xOffset}%) translateZ(${zOffset}px) rotateY(${rotation}deg)`,
    opacity,
    zIndex: 10 - Math.abs(offset)
  }
}

const getStackStyle = (offset: number) => {
  if (offset === 0) {
    return {
      transform: 'translateY(0) scale(1)',
      opacity: 1,
      zIndex: 10
    }
  }
  
  if (offset > 0) {
    const yOffset = offset * 30
    const scale = 1 - offset * 0.05
    return {
      transform: `translateY(${yOffset}px) scale(${scale})`,
      opacity: Math.max(0.5, 1 - offset * 0.3),
      zIndex: 10 - offset
    }
  }
  
  return {
    transform: 'translateY(-100%) scale(0.95)',
    opacity: 0,
    zIndex: 0
  }
}
</script>

<template>
  <div class="relative w-full max-w-xl mx-auto perspective-1000">
    <!-- Tinder Swipe Mode -->
    <CardsTinderSwipe
      v-if="animationStyle === 'swipe'"
      :cards="cards"
      :current-index="currentIndex"
      @next="emit('next')"
      @answer-quiz="handleAnswer"
    />

    <!-- Coverflow Mode -->
    <CardsCoverflowStack
      v-else-if="animationStyle === 'coverflow'"
      :cards="cards"
      :current-index="currentIndex"
      @swipe-left="emit('next')"
      @swipe-right="emit('previous')"
      @card-click="(index) => $emit('update:currentIndex', index)"
    />

    <!-- Vertical Stack Mode -->
    <CardsVerticalStack
      v-else-if="animationStyle === 'stack'"
      :cards="cards"
      :current-index="currentIndex"
      @navigate-up="emit('previous')"
      @navigate-down="emit('next')"
    />

    <!-- 3D Flip Mode (default) -->
    <div v-else class="relative min-h-[560px]">
      <TransitionGroup 
        :name="'flip'"
        tag="div"
      >
        <div
          v-for="(card, index) in cards"
          :key="card.id"
          v-show="Math.abs(index - currentIndex) <= 2"
          class="absolute inset-0 transition-all duration-500 ease-out preserve-3d"
          :style="getCardStyle(index)"
        >
          <!-- Info/Learning Card -->
          <CardsInfoCard
            v-if="card.type === 'info' || card.type === 'learning'"
            :card="card"
          />
          
          <!-- Quiz Card -->
          <CardsQuizCard
            v-else-if="card.type === 'quiz'"
            :card="card as QuizCardType"
            :selected-answer="index === currentIndex ? selectedAnswer : undefined"
            :show-feedback="index === currentIndex ? showQuizFeedback : false"
            @select-answer="handleAnswer"
          />
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<style scoped>
/* Swipe transitions */
.swipe-enter-active,
.swipe-leave-active {
  transition: all 0.5s ease-out;
}

.swipe-enter-from {
  transform: translateX(100%) scale(0.9);
  opacity: 0;
}

.swipe-leave-to {
  transform: translateX(-100%) scale(0.9);
  opacity: 0;
}

/* Flip transitions */
.flip-enter-active,
.flip-leave-active {
  transition: all 0.5s ease-out;
}

.flip-enter-from {
  transform: rotateY(-90deg);
  opacity: 0;
}

.flip-leave-to {
  transform: rotateY(90deg);
  opacity: 0;
}

/* Stack transitions */
.stack-enter-active,
.stack-leave-active {
  transition: all 0.5s ease-out;
}

.stack-enter-from {
  transform: translateY(100px) scale(0.9);
  opacity: 0;
}

.stack-leave-to {
  transform: translateY(-100px) scale(0.9);
  opacity: 0;
}
</style>
