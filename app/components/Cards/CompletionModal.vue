<script setup lang="ts">
import type { TrainingCard, QuizAnswer } from '~/types/training'
import confetti from 'canvas-confetti'

const props = defineProps<{
  isOpen: boolean
  score: number
  totalQuizzes: number
  correctAnswers: number
  answers: QuizAnswer[]
  cards: TrainingCard[]
}>()

const emit = defineEmits<{
  close: []
  retry: []
  continue: []
}>()

const PASS_THRESHOLD = 70

const passed = computed(() => props.score >= PASS_THRESHOLD)
const showContent = ref(false)
const animatedScore = ref(0)

// Trigger confetti on pass
const triggerConfetti = () => {
  const duration = 3000
  const end = Date.now() + duration

  const frame = () => {
    // Left side burst
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ['#22c55e', '#3b82f6', '#f59e0b', '#8b5cf6'],
    })
    // Right side burst
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ['#22c55e', '#3b82f6', '#f59e0b', '#8b5cf6'],
    })

    if (Date.now() < end) {
      requestAnimationFrame(frame)
    }
  }

  setTimeout(frame, 300)
}

// Animate score counter and trigger confetti
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    showContent.value = false
    animatedScore.value = 0
    
    setTimeout(() => {
      showContent.value = true
    }, 200)
    
    // Trigger confetti if passed
    if (passed.value) {
      triggerConfetti()
    }
    
    const duration = 1500
    const startTime = Date.now()
    
    const animateScore = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      animatedScore.value = Math.round(props.score * eased)
      
      if (progress < 1) {
        requestAnimationFrame(animateScore)
      }
    }
    
    setTimeout(animateScore, 500)
  }
})

const quizCards = computed(() => props.cards.filter(c => c.type === 'quiz'))
</script>

<template>
  <Teleport to="body">
    <!-- Backdrop -->
    <Transition name="fade">
      <div
        v-if="isOpen"
        class="modal-backdrop"
        @click="emit('close')"
      />
    </Transition>

    <!-- Modal -->
    <Transition name="scale">
      <div
        v-if="isOpen && showContent"
        class="modal-container"
      >
        <div class="modal-content">
          <!-- Icon -->
          <div class="modal-icon" :class="passed ? 'success' : 'fail'">
            <template v-if="passed">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
                <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
                <path d="M4 22h16"/>
                <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
                <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
                <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
              </svg>
              <div class="success-check">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              </div>
            </template>
            <span v-else class="text-4xl">😢</span>
          </div>

          <!-- Title -->
          <h2 class="modal-title">
            {{ passed ? 'Congratulations!' : 'Almost There!' }}
          </h2>
          
          <p class="modal-subtitle">
            {{ passed ? 'You passed the training!' : 'You need 70% to pass. Keep learning!' }}
          </p>

          <!-- Score display -->
          <div class="score-display">
            <div class="score-value" :class="passed ? 'text-green-500' : 'text-muted-foreground'">
              {{ animatedScore }}%
            </div>
            <p class="score-info">
              {{ correctAnswers }} of {{ totalQuizzes }} questions correct
            </p>
          </div>

          <!-- Quiz review for failed attempts -->
          <div v-if="!passed" class="quiz-review">
            <p class="review-title">Quiz Review</p>
            <div class="review-list">
              <div
                v-for="(card, index) in quizCards"
                :key="card.id"
                class="review-item"
              >
                <svg
                  v-if="answers.find(a => a.cardId === card.id)?.isCorrect"
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="text-green-500"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                <svg
                  v-else
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="text-red-500"
                >
                  <circle cx="12" cy="12" r="10"/>
                  <path d="m15 9-6 6"/>
                  <path d="m9 9 6 6"/>
                </svg>
                <span class="review-text">
                  Q{{ index + 1 }}: {{ card.type === 'quiz' ? card.question?.substring(0, 40) : '' }}...
                </span>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="modal-actions">
            <template v-if="passed">
              <button class="btn-primary" @click="emit('continue')">
                <span>Access More Trainings</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M5 12h14"/>
                  <path d="m12 5 7 7-7 7"/>
                </svg>
              </button>
              <button class="btn-secondary" @click="emit('close')">
                Review Training
              </button>
            </template>
            <template v-else>
              <button class="btn-primary" @click="emit('retry')">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/>
                  <path d="M21 3v5h-5"/>
                </svg>
                <span>Retry Training</span>
              </button>
              <button class="btn-secondary" @click="emit('continue')">
                Try Another Training
              </button>
            </template>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Crying emoji rain for failed attempts -->
    <div v-if="isOpen && !passed" class="emoji-rain">
      <span
        v-for="i in 20"
        :key="i"
        class="falling-emoji"
        :style="{
          left: `${5 + (i * 4.5)}%`,
          animationDelay: `${0.3 + i * 0.15}s`,
          animationDuration: `${4 + Math.random() * 2}s`
        }"
      >
        😢
      </span>
    </div>
  </Teleport>
</template>

<style scoped>
.modal-backdrop {
  @apply fixed inset-0 bg-black/50 backdrop-blur-sm z-50;
}

.modal-container {
  @apply fixed inset-0 flex items-center justify-center z-50 p-4;
  pointer-events: none;
}

.modal-content {
  @apply rounded-3xl p-8 max-w-xl w-full shadow-2xl text-center;
  background: white;
  border: 1px solid rgba(148, 163, 184, 0.3);
  pointer-events: auto;
}

:root.dark .modal-content {
  background: #1e293b;
  border-color: rgba(148, 163, 184, 0.2);
}

.modal-icon {
  @apply w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center relative;
}

.modal-icon.success {
  @apply bg-green-500/20 text-green-500;
}

.modal-icon.fail {
  @apply bg-gray-100 dark:bg-gray-800;
}

.success-check {
  @apply absolute -top-1 -right-1 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white;
}

.modal-title {
  @apply text-2xl font-bold mb-2;
}

.modal-subtitle {
  @apply text-gray-500 dark:text-gray-400 mb-6;
}

.score-display {
  @apply py-6 text-center;
}

.score-value {
  @apply text-6xl font-bold mb-2;
}

.score-info {
  @apply text-sm text-gray-500 dark:text-gray-400;
}

.quiz-review {
  @apply pt-4 mb-4 max-h-40 overflow-y-auto;
  border-top: 1px solid rgba(148, 163, 184, 0.3);
}

:root.dark .quiz-review {
  border-color: rgba(148, 163, 184, 0.2);
}

.review-title {
  @apply text-xs font-medium text-gray-500 dark:text-gray-400 mb-3;
}

.review-list {
  @apply space-y-2;
}

.review-item {
  @apply flex items-center gap-2 text-sm;
}

.review-text {
  @apply text-gray-500 dark:text-gray-400 truncate;
}

.modal-actions {
  @apply flex flex-col gap-3;
}

.btn-primary {
  @apply w-full rounded-xl h-12 bg-green-500 hover:bg-green-600 text-white flex items-center justify-center gap-2 font-medium transition-colors;
}

.btn-secondary {
  @apply w-full rounded-xl h-12 font-medium transition-colors;
  background: white;
  border: 1px solid rgba(148, 163, 184, 0.3);
  color: #1f2937;
}

:root.dark .btn-secondary {
  background: #1e293b;
  border-color: rgba(148, 163, 184, 0.2);
  color: white;
}

.btn-secondary:hover {
  background: #f3f4f6;
}

:root.dark .btn-secondary:hover {
  background: #374151;
}

.emoji-rain {
  @apply fixed inset-0 pointer-events-none overflow-hidden z-[99999];
}

.falling-emoji {
  @apply absolute text-3xl md:text-4xl;
  top: -50px;
  animation: fall linear forwards;
}

@keyframes fall {
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 0.8;
  }
  100% {
    transform: translateY(110vh) rotate(540deg);
    opacity: 0;
  }
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.scale-enter-active,
.scale-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.scale-enter-from,
.scale-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>
