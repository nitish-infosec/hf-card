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
  'navigate-up': []
  'navigate-down': []
}>()

// Drag state
const dragY = ref(0)
const isDragging = ref(false)
const startY = ref(0)

// Get visible cards (current + adjacent)
const visibleCards = computed((): Array<{ card: TrainingCard; position: number; index: number }> => {
  const visible: Array<{ card: TrainingCard; position: number; index: number }> = []
  for (let offset = -1; offset <= 1; offset++) {
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

const isFirst = computed(() => props.currentIndex === 0)
const isLast = computed(() => props.currentIndex === props.cards.length - 1)

// Get card transform based on position - matching React exactly
const getCardTransform = (position: number) => {
  if (position === 0) {
    return {
      y: 0,
      scale: 1,
      zIndex: 50,
      opacity: 1
    }
  }

  // React uses: y: position * 60, scale: 0.92 - Math.abs(position) * 0.05
  return {
    y: position * 60,
    scale: 0.92 - Math.abs(position) * 0.05,
    zIndex: 10,
    opacity: 0.5
  }
}

// Drag handlers
const onPointerDown = (e: PointerEvent) => {
  isDragging.value = true
  startY.value = e.clientY
  dragY.value = 0
  ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
}

const onPointerMove = (e: PointerEvent) => {
  if (!isDragging.value) return
  dragY.value = e.clientY - startY.value
}

const onPointerUp = () => {
  if (!isDragging.value) return
  isDragging.value = false

  const threshold = 50

  // Swipe up (negative offset) = go to next card
  if (dragY.value < -threshold) {
    emit('navigate-down')
  }
  // Swipe down (positive offset) = go to previous card
  else if (dragY.value > threshold) {
    emit('navigate-up')
  }

  dragY.value = 0
}

const handleNavUp = () => {
  emit('navigate-up')
}

const handleNavDown = () => {
  emit('navigate-down')
}

const onQuizAnswer = (cardId: string, optionId: string, isCorrect: boolean) => {
  props.onQuizAnswer?.(cardId, optionId, isCorrect)
}
</script>

<template>
  <div class="vertical-stack-layout">
    <!-- Left: Progress Dots -->
    <div class="progress-dots">
      <div
        v-for="(_, i) in cards"
        :key="i"
        class="progress-dot"
        :class="{
          'is-completed': i < currentIndex,
          'is-current': i === currentIndex
        }"
      />
    </div>

    <!-- Center: Card Stack -->
    <div
      class="vertical-stack-container"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
      @pointercancel="onPointerUp"
    >
      <div
        v-for="{ card, position, index } in visibleCards"
        :key="card.id"
        class="vertical-card"
        :class="{ 'is-active': position === 0 }"
        :style="{
          transform: `translateY(${getCardTransform(position).y}px) scale(${getCardTransform(position).scale})`,
          zIndex: getCardTransform(position).zIndex,
          opacity: getCardTransform(position).opacity
        }"
      >
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
      </div>
    </div>

    <!-- Right: Navigation Controls (Up/Down Only) -->
    <div class="nav-controls">
      <button
        class="nav-btn"
        :class="{ 'is-disabled': isFirst }"
        :disabled="isFirst"
        @click="handleNavUp"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="m18 15-6-6-6 6"/>
        </svg>
      </button>

      <button class="nav-btn pause-btn">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="14" y="4" width="4" height="16" rx="1"/>
          <rect x="6" y="4" width="4" height="16" rx="1"/>
        </svg>
      </button>

      <button
        class="nav-btn"
        :class="{ 'is-disabled': isLast }"
        :disabled="isLast"
        @click="handleNavDown"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="m6 9 6 6 6-6"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
.vertical-stack-layout {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 3rem;
  width: 100%;
  max-width: 64rem;
  margin: 0 auto;
  padding-left: 2rem;
  padding-right: 2rem;
}

.progress-dots {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.progress-dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 9999px;
  background-color: rgba(100, 116, 139, 0.3);
  transition: all 0.3s ease;
}

:root.dark .progress-dot {
  background-color: rgba(100, 116, 139, 0.5);
}

.progress-dot.is-completed {
  background-color: #3b82f6;
}

.progress-dot.is-current {
  width: 0.75rem;
  height: 1.5rem;
  background-color: #3b82f6;
}

.vertical-stack-container {
  position: relative;
  flex: 1;
  width: 100%;
  height: 480px;
  touch-action: none;
  cursor: grab;
  user-select: none;
}

@media (min-width: 640px) {
  .vertical-stack-container {
    height: 540px;
  }
}

.vertical-stack-container:active {
  cursor: grabbing;
}

.vertical-card {
  position: absolute;
  inset: 0;
  border-radius: 1.5rem;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(148, 163, 184, 0.3);
  background: white;
  transition: transform 0.4s cubic-bezier(0.25, 0.1, 0.25, 1), opacity 0.4s ease;
}

:root.dark .vertical-card {
  background: #1e293b;
  border-color: rgba(148, 163, 184, 0.2);
}

.nav-controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.nav-btn {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(8px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(148, 163, 184, 0.3);
  color: #475569;
  cursor: pointer;
}

:root.dark .nav-btn {
  background: rgba(30, 41, 59, 0.8);
  border-color: rgba(148, 163, 184, 0.2);
  color: #94a3b8;
}

.nav-btn:hover:not(.is-disabled) {
  background: white;
  color: #1e293b;
}

:root.dark .nav-btn:hover:not(.is-disabled) {
  background: #334155;
  color: #f1f5f9;
}

.nav-btn.is-disabled {
  opacity: 0.3;
  cursor: not-allowed;
}
</style>
