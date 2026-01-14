<script setup lang="ts">
import type { TrainingCard, QuizCard as QuizCardType } from '~/types/training'

interface Props {
  card: TrainingCard
  index: number
  isFront: boolean
  canSwipe: boolean
  currentIndex: number
  selectedAnswer?: string
  showFeedback?: boolean
  isExiting?: boolean
  exitDirection?: 'left' | 'right'
}

const props = withDefaults(defineProps<Props>(), {
  isExiting: false,
  exitDirection: 'right'
})

const emit = defineEmits<{
  swipe: [direction: 'left' | 'right']
  answerQuiz: [optionId: string]
}>()

// Drag state
const dragX = ref(0)
const isDragging = ref(false)
const startX = ref(0)

// Animation constants (matching React)
const SWIPE_THRESHOLD = 100
const ROTATION_RANGE = 18
const EXIT_DISTANCE = 400

const handleAnswer = (optionId: string) => {
  emit('answerQuiz', optionId)
}

// Drag logic
const onPointerDown = (e: PointerEvent) => {
  if (!props.isFront || !props.canSwipe) return
  isDragging.value = true
  startX.value = e.clientX
  dragX.value = 0
}

const onPointerMove = (e: PointerEvent) => {
  if (!isDragging.value) return
  dragX.value = e.clientX - startX.value
}

const onPointerUp = () => {
  if (!isDragging.value) return
  isDragging.value = false

  // Check if swipe threshold met
  if (Math.abs(dragX.value) > SWIPE_THRESHOLD) {
    const direction = dragX.value > 0 ? 'right' : 'left'
    emit('swipe', direction)
  }
  
  // Reset drag position
  dragX.value = 0
}

const cardStyle = computed(() => {
  // Handle exiting card
  if (props.isExiting) {
    const exitX = props.exitDirection === 'left' ? -EXIT_DISTANCE : EXIT_DISTANCE
    const exitRotation = props.exitDirection === 'left' ? -15 : 15
    return {
      transform: `translateX(${exitX}px) rotate(${exitRotation}deg) scale(1)`,
      zIndex: 50,
      opacity: 0,
      transition: 'all 0.3s ease-out'
    }
  }
  
  // Front card - can be dragged
  if (props.isFront) {
    const rotation = (dragX.value / 150) * ROTATION_RANGE
    
    return {
      transform: `translateX(${dragX.value}px) rotate(${rotation}deg) scale(1)`,
      zIndex: 20,
      opacity: 1,
      transition: isDragging.value 
        ? 'none' 
        : 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
    }
  }

  // Stack positioning (matching React exactly)
  const stackScale = 1 - props.index * 0.04
  const stackY = props.index * 8
  const stackX = props.index * -6
  const stackRotate = props.index * -3
  const stackOpacity = 1 - props.index * 0.12

  return {
    transform: `translate(${stackX}px, ${stackY}px) rotate(${stackRotate}deg) scale(${stackScale})`,
    zIndex: 10 - props.index,
    opacity: stackOpacity,
    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
  }
})
</script>

<template>
  <div
    class="absolute inset-0 card-wrapper cursor-grab active:cursor-grabbing preserve-3d"
    :class="{ 
      'dragging': isDragging, 
      'pointer-events-none': !isFront || isExiting
    }"
    :style="cardStyle"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="onPointerUp"
    @pointerleave="onPointerUp"
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
      :selected-answer="selectedAnswer"
      :show-feedback="showFeedback"
      @select-answer="handleAnswer"
    />
  </div>
</template>

<style scoped>
.card-wrapper {
  @apply w-full h-full;
  user-select: none;
  touch-action: none;
}

.dragging {
  @apply cursor-grabbing;
}
</style>
