<script setup lang="ts">
import aiThreatsData from '~/data/ai-threats.json'
import type { TrainingModule } from '~/types/training'

definePageMeta({
  layout: 'default'
})

const route = useRoute()
const router = useRouter()

// Load training module based on slug
const trainingModule = computed<TrainingModule>(() => {
  // For demo, we only have ai-threats
  return aiThreatsData as TrainingModule
})

// Training state
const {
  currentModule,
  currentCard,
  currentIndex,
  totalCards,
  isFirstCard,
  isLastCard,
  canNavigateNext,
  loadModule,
  nextCard,
  previousCard,
  answerQuiz,
  completeTraining,
  progress,
  resetProgress
} = useTraining()

// Get animation style to conditionally render navigation
const { animationStyle } = useSettings()

// Settings panel state
type PanelType = 'cardDesign' | 'background' | 'animation' | 'stats' | 'share'
const activePanel = ref<PanelType | null>(null)

// Completion modal state
const showCompletionModal = ref(false)

const openPanel = (type: PanelType) => {
  activePanel.value = type
}

const closePanel = () => {
  activePanel.value = null
}

const handleComplete = () => {
  completeTraining()
  showCompletionModal.value = true
}

const handleRetry = () => {
  showCompletionModal.value = false
  resetProgress()
}

const handleContinue = () => {
  showCompletionModal.value = false
  router.push('/')
}

const goBack = () => {
  router.push('/')
}

// Load module on mount
onMounted(() => {
  loadModule(trainingModule.value)
})

// Watch for module changes
watch(trainingModule, (module) => {
  loadModule(module)
})

// Page title
useHead({
  title: `${trainingModule.value.title} | HF-Cards`
})
</script>

<template>
  <div class="preview-page">
    <!-- Header Toolbar -->
    <HeaderToolbar
      @open-card-design="openPanel('cardDesign')"
      @open-background="openPanel('background')"
      @open-animation="openPanel('animation')"
      @open-stats="openPanel('stats')"
      @open-share="openPanel('share')"
      @go-back="goBack"
    />

    <!-- Settings Panel -->
    <HeaderSettingsPanel
      v-if="activePanel"
      :type="activePanel"
      :is-open="!!activePanel"
      @close="closePanel"
    />

    <!-- Main Content -->
    <main class="main-content">
      <!-- Title -->
      <h1 class="page-title">
        {{ trainingModule.title }}
      </h1>

      <!-- Card Stack -->
      <div class="card-container">
        <CardsCardStack
          v-if="currentModule"
          :cards="currentModule.cards"
          :current-index="currentIndex"
          @answer-quiz="answerQuiz"
          @next="nextCard"
          @previous="previousCard"
        />

        <!-- Navigation Arrows (hidden for vertical stack which has its own nav) -->
        <template v-if="animationStyle !== 'stack'">
          <NavigationArrowButton
            direction="left"
            :disabled="isFirstCard"
            @click="previousCard"
          />
          <NavigationArrowButton
            direction="right"
            :disabled="!canNavigateNext"
            @click="nextCard"
          />
        </template>
      </div>

      <!-- Progress & Complete Button -->
      <div class="footer-area">
        <NavigationProgressIndicator
          :current="currentIndex + 1"
          :total="totalCards"
        />

        <Transition name="fade">
          <NavigationCompleteButton
            v-if="isLastCard && canNavigateNext"
            @complete="handleComplete"
          />
        </Transition>
      </div>
    </main>

    <!-- Completion Modal -->
    <CompletionModal
      v-if="currentModule"
      :is-open="showCompletionModal"
      :progress="progress"
      :cards="currentModule.cards"
      @close="showCompletionModal = false"
      @retry="handleRetry"
      @continue="handleContinue"
    />
  </div>
</template>

<style scoped>
.preview-page {
  @apply min-h-screen;
}

.main-content {
  @apply pt-20 pb-32 px-4;
  @apply flex flex-col items-center;
}

.page-title {
  @apply text-3xl md:text-4xl font-bold text-white text-center mb-8;
  @apply drop-shadow-lg;
}

.card-container {
  @apply relative w-full max-w-xl mx-auto;
}

.footer-area {
  @apply fixed bottom-0 left-0 right-0;
  @apply flex flex-col items-center gap-4 py-6;
  @apply bg-gradient-to-t from-black/50 to-transparent;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
