<script setup lang="ts">
import type { TrainingCard, QuizAnswer } from '~/types/training'

const props = defineProps<{
  cards: TrainingCard[]
  currentIndex: number
  answers?: QuizAnswer[]
  onQuizAnswer?: (cardId: string, optionId: string, isCorrect: boolean) => void
}>()

const emit = defineEmits<{
  'update:currentIndex': [index: number]
  'swipe-left': []
  'swipe-right': []
  'card-click': [index: number]
}>()

// Drag state
const dragX = ref(0)
const isDragging = ref(false)
const startX = ref(0)

// Get visible cards (current + 2 on each side)
const visibleCards = computed((): Array<{ card: TrainingCard; position: number; index: number }> => {
  const visible: Array<{ card: TrainingCard; position: number; index: number }> = []
  for (let offset = -2; offset <= 2; offset++) {
    const cardIndex = props.currentIndex + offset
    if (cardIndex >= 0 && cardIndex < props.cards.length) {
      visible.push({
        card: props.cards[cardIndex]!,
        position: offset,
        index: cardIndex
      })
    }
  }
  // Sort so center card renders last (on top)
  return visible.sort((a, b) => Math.abs(b.position) - Math.abs(a.position))
})

// Get card transform based on position - matching React exactly
const getCardTransform = (position: number) => {
  const absPosition = Math.abs(position)
  const isLeft = position < 0

  if (position === 0) {
    return {
      x: 0,
      rotateY: 0,
      scale: 1,
      zIndex: 100,
      opacity: 1
    }
  }

  return {
    x: position * 180,
    rotateY: isLeft ? 45 : -45,
    scale: 0.75 - absPosition * 0.05,
    zIndex: 50 - absPosition * 10,
    opacity: 1 - absPosition * 0.15
  }
}

// Get transform origin based on position
const getTransformOrigin = (position: number) => {
  if (position < 0) return 'right center'
  if (position > 0) return 'left center'
  return 'center center'
}

// Drag handlers
const onPointerDown = (e: PointerEvent) => {
  isDragging.value = true
  startX.value = e.clientX
  dragX.value = 0
  ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
}

const onPointerMove = (e: PointerEvent) => {
  if (!isDragging.value) return
  dragX.value = e.clientX - startX.value
}

const onPointerUp = () => {
  if (!isDragging.value) return
  isDragging.value = false

  const threshold = 50

  // Swipe left (negative offset) = go to next card
  if (dragX.value < -threshold) {
    emit('swipe-left')
  }
  // Swipe right (positive offset) = go to previous card
  else if (dragX.value > threshold) {
    emit('swipe-right')
  }

  dragX.value = 0
}

const handleCardClick = (index: number, position: number) => {
  if (position !== 0) {
    emit('card-click', index)
  }
}

const onQuizAnswer = (cardId: string, optionId: string, isCorrect: boolean) => {
  props.onQuizAnswer?.(cardId, optionId, isCorrect)
}
</script>

<template>
  <div
    class="coverflow-container"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="onPointerUp"
    @pointercancel="onPointerUp"
  >
    <!-- Perspective wrapper - matching React structure -->
    <div class="coverflow-perspective">
      <div
        v-for="{ card, position, index } in visibleCards"
        :key="card.id"
        class="coverflow-card"
        :class="{ 'is-active': position === 0, 'is-inactive': position !== 0 }"
        :style="{
          transform: `translateX(${getCardTransform(position).x}px) rotateY(${getCardTransform(position).rotateY}deg) scale(${getCardTransform(position).scale})`,
          zIndex: getCardTransform(position).zIndex,
          opacity: getCardTransform(position).opacity,
          transformOrigin: getTransformOrigin(position)
        }"
        @click="handleCardClick(index, position)"
      >
        <!-- Active card content -->
        <template v-if="position === 0">
          <CardsInfoCard
            v-if="card.type === 'info' || card.type === 'learning'"
            :card="card"
          />
          <CardsQuizCard
            v-else-if="card.type === 'quiz'"
            :card="card"
            :has-answered="!!answers?.find(a => a.cardId === card.id)"
            :selected-answer="answers?.find(a => a.cardId === card.id)?.selectedOptionId"
            @answer="(optionId: string, isCorrect: boolean) => onQuizAnswer(card.id, optionId, isCorrect)"
          />
        </template>

        <!-- Non-active cards: show actual content with blur overlay -->
        <template v-else>
          <div class="blur-content-wrapper">
            <!-- Show actual content but blurred -->
            <div class="blur-content">
              <CardsInfoCard
                v-if="card.type === 'info' || card.type === 'learning'"
                :card="card"
              />
              <CardsQuizCard
                v-else-if="card.type === 'quiz'"
                :card="card"
                :has-answered="false"
              />
            </div>
            <!-- Subtle frosted glass overlay -->
            <div class="frosted-overlay" />
          </div>
          <!-- Darkening overlay for non-active cards -->
          <div class="dark-overlay" />
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.coverflow-container {
  position: relative;
  width: 100%;
  max-width: 42rem; /* max-w-2xl */
  margin: 2rem auto;
  height: 480px;
  overflow: visible;
  touch-action: none;
  cursor: grab;
  user-select: none;
}

@media (min-width: 640px) {
  .coverflow-container {
    height: 540px;
  }
}

.coverflow-container:active {
  cursor: grabbing;
}

.coverflow-perspective {
  height: 100%;
  perspective: 1200px;
}

.coverflow-card {
  position: absolute;
  left: 50%;
  top: 0;
  margin-left: -45%;
  width: 90%;
  height: 100%;
  border-radius: 1.5rem; /* rounded-3xl */
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); /* shadow-2xl */
  border: 1px solid rgba(148, 163, 184, 0.3);
  background: white;
  transform-style: preserve-3d;
  transition: transform 0.4s cubic-bezier(0.25, 0.1, 0.25, 1), 
              opacity 0.4s ease;
}

:root.dark .coverflow-card {
  background: #1e293b;
  border-color: rgba(148, 163, 184, 0.2);
}

.coverflow-card.is-inactive {
  cursor: pointer;
}

/* Blur wrapper structure matching React */
.blur-content-wrapper {
  height: 100%;
  width: 100%;
  position: relative;
  overflow: hidden;
}

.blur-content {
  height: 100%;
  width: 100%;
  filter: blur(6px);
  transform: scale(1.02);
  pointer-events: none;
  user-select: none;
}

.frosted-overlay {
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.2);
  pointer-events: none;
}

:root.dark .frosted-overlay {
  background: rgba(0, 0, 0, 0.2);
}

.dark-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.1);
  pointer-events: none;
}
</style>
