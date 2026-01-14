<script setup lang="ts">
import type { AnimationStyle, BackgroundStyle, CardDesignStyle } from '~/types/training'

type PanelType = 'cardDesign' | 'background' | 'animation' | 'stats' | 'share'

interface Props {
  type: PanelType
  isOpen: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
}>()

const { 
  animationStyle, 
  backgroundStyle, 
  cardDesign,
  setAnimationStyle, 
  setBackgroundStyle, 
  setCardDesign 
} = useSettings()

// Panel titles
const panelTitle = computed(() => {
  const titles: Record<PanelType, string> = {
    cardDesign: 'Card Design',
    background: 'Background Style',
    animation: 'Card Animation',
    stats: 'Training Stats',
    share: 'Share Training'
  }
  return titles[props.type]
})

// Animation options
const animationOptions: { id: AnimationStyle; name: string; description: string; icon: string }[] = [
  { id: 'flip', name: '3D Flip', description: 'Card rotates in 3D space like turning a page', icon: 'heroicons:arrow-path' },
  { id: 'swipe', name: 'Tinder Swipe', description: 'Drag to swipe cards like Tinder with rotation', icon: 'heroicons:hand-raised' },
  { id: 'coverflow', name: 'Coverflow', description: '3D carousel with perspective like album covers', icon: 'heroicons:squares-2x2' },
  { id: 'stack', name: 'Vertical Stack', description: 'Vertical cards with side controls and progress', icon: 'heroicons:bars-3-bottom-left' }
]

// Background options
const backgroundOptions: { id: BackgroundStyle; name: string; description: string; gradient: string }[] = [
  { id: 'deep-ocean', name: 'Deep Ocean', description: 'Deep blue gradients', gradient: 'bg-style-deep-ocean' },
  { id: 'admn', name: 'ADMN Gradient', description: 'Abu Dhabi Media Network theme', gradient: 'bg-style-admn' },
  { id: 'mesh', name: 'Mesh Gradient', description: 'Vibrant purple/violet mesh', gradient: 'bg-style-mesh' },
  { id: 'hybrid', name: 'Hybrid', description: 'Mix of mesh and ADMN styles', gradient: 'bg-style-hybrid' }
]

// Card design options
const designOptions: { id: CardDesignStyle; name: string; description: string }[] = [
  { id: 'corporate', name: 'Corporate', description: 'Clean with elegant shadows' },
  { id: 'minimal', name: 'Minimal', description: 'Simple and distraction-free' },
  { id: 'playful', name: 'Playful', description: 'Fun with rounded corners' }
]
</script>

<template>
  <Transition name="slide-in">
    <div 
      v-if="isOpen" 
      class="settings-panel custom-scrollbar"
    >
      <!-- Header -->
      <div class="panel-header">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
          {{ panelTitle }}
        </h2>
        <button 
          class="btn-icon" 
          aria-label="Close panel"
          @click="emit('close')"
        >
          <Icon name="heroicons:x-mark" class="w-5 h-5" />
        </button>
      </div>

      <!-- Animation Options -->
      <div v-if="type === 'animation'" class="panel-content">
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Choose how cards transition
        </p>
        <div class="space-y-4">
          <button
            v-for="option in animationOptions"
            :key="option.id"
            class="anim-option-card"
            :class="{ 'anim-option-card-active': animationStyle === option.id }"
            @click="setAnimationStyle(option.id)"
          >
            <!-- Header with icon and text -->
            <div class="flex items-start gap-3">
              <div class="anim-icon" :class="{ 'anim-icon-active': animationStyle === option.id }">
                <Icon :name="option.icon" class="w-5 h-5" />
              </div>
              <div class="flex-1 text-left">
                <div class="font-medium text-gray-900 dark:text-white">{{ option.name }}</div>
                <div class="text-sm text-gray-500 dark:text-gray-400">{{ option.description }}</div>
              </div>
              <Icon 
                v-if="animationStyle === option.id" 
                name="heroicons:check-circle-solid" 
                class="w-5 h-5 text-primary-500 flex-shrink-0"
              />
            </div>
            <!-- Animation Preview -->
            <div class="anim-preview">
              <div 
                class="anim-preview-card"
                :class="{
                  'anim-flip': option.id === 'flip',
                  'anim-swipe': option.id === 'swipe',
                  'anim-coverflow': option.id === 'coverflow',
                  'anim-stack': option.id === 'stack'
                }"
              />
            </div>
          </button>
        </div>
      </div>

      <!-- Background Options -->
      <div v-if="type === 'background'" class="panel-content">
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Choose a backdrop for your training
        </p>
        <div class="grid grid-cols-2 gap-3">
          <button
            v-for="option in backgroundOptions"
            :key="option.id"
            class="bg-option-card"
            :class="{ 'bg-option-card-active': backgroundStyle === option.id }"
            @click="setBackgroundStyle(option.id)"
          >
            <div class="bg-preview" :class="option.gradient">
              <div class="bg-preview-inner" />
            </div>
            <div class="text-left mt-2">
              <div class="font-medium text-sm text-gray-900 dark:text-white">{{ option.name }}</div>
              <div class="text-xs text-gray-500 dark:text-gray-400 truncate">{{ option.description }}</div>
            </div>
            <Icon 
              v-if="backgroundStyle === option.id" 
              name="heroicons:check-circle-solid" 
              class="absolute top-2 right-2 w-5 h-5 text-primary-500"
            />
          </button>
        </div>
      </div>

      <!-- Card Design Options -->
      <div v-if="type === 'cardDesign'" class="panel-content">
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Choose the visual style
        </p>
        <div class="space-y-3">
          <button
            v-for="option in designOptions"
            :key="option.id"
            class="option-card"
            :class="{ 'option-card-active': cardDesign === option.id }"
            @click="setCardDesign(option.id)"
          >
            <div class="option-icon">
              <Icon name="heroicons:paint-brush" class="w-5 h-5" />
            </div>
            <div class="flex-1">
              <div class="font-medium text-gray-900 dark:text-white">{{ option.name }}</div>
              <div class="text-sm text-gray-500 dark:text-gray-400">{{ option.description }}</div>
            </div>
            <Icon 
              v-if="cardDesign === option.id" 
              name="heroicons:check-circle-solid" 
              class="w-5 h-5 text-primary-500"
            />
          </button>
        </div>
      </div>

      <!-- Stats Panel -->
      <div v-if="type === 'stats'" class="panel-content">
        <div class="text-center py-8">
          <Icon name="heroicons:chart-bar" class="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <p class="text-gray-500 dark:text-gray-400">
            Training statistics will appear here after completing the module.
          </p>
        </div>
      </div>

      <!-- Share Panel -->
      <div v-if="type === 'share'" class="panel-content">
        <div class="text-center py-8">
          <Icon name="heroicons:share" class="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <p class="text-gray-500 dark:text-gray-400">
            Share this training module with others.
          </p>
          <button class="btn btn-primary mt-4">
            <Icon name="heroicons:link" class="w-4 h-4" />
            Copy Link
          </button>
        </div>
      </div>
    </div>
  </Transition>

  <!-- Backdrop -->
  <Transition name="fade">
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-black/30 z-40"
      @click="emit('close')"
    />
  </Transition>
</template>

<style scoped>
.panel-header {
  @apply flex items-center justify-between p-4;
  @apply border-b border-gray-200 dark:border-gray-800;
}

.panel-content {
  @apply p-4;
}

.option-card {
  @apply flex items-center gap-3 w-full p-3 rounded-xl;
  @apply border border-gray-200 dark:border-gray-700;
  @apply transition-all duration-200;
  @apply hover:border-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20;
  @apply text-left;
}

.option-card-active {
  @apply border-primary-500 bg-primary-50 dark:bg-primary-900/30;
}

.option-icon {
  @apply w-10 h-10 rounded-lg flex items-center justify-center;
  @apply bg-gray-100 dark:bg-dark-300 text-gray-600 dark:text-gray-400;
}

/* Background option card styles */
.bg-option-card {
  @apply relative flex flex-col p-3 rounded-xl;
  @apply border border-gray-200 dark:border-gray-700;
  @apply transition-all duration-200;
  @apply hover:border-primary-400 hover:bg-primary-50/50 dark:hover:bg-primary-900/20;
}

.bg-option-card-active {
  @apply border-primary-500 bg-primary-50 dark:bg-primary-900/30;
}

.bg-preview {
  @apply w-full aspect-[4/3] rounded-lg overflow-hidden;
  @apply flex items-center justify-center;
}

.bg-preview-inner {
  @apply w-8 h-10 bg-white/80 rounded shadow-sm;
}

/* Animation option card styles */
.anim-option-card {
  @apply w-full p-4 rounded-xl;
  @apply border border-gray-200 dark:border-gray-700;
  @apply transition-all duration-200;
  @apply hover:border-primary-400 hover:bg-primary-50/50 dark:hover:bg-primary-900/20;
}

.anim-option-card-active {
  @apply border-primary-500 bg-primary-50 dark:bg-primary-900/30;
}

.anim-icon {
  @apply w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0;
  @apply bg-gray-100 dark:bg-dark-300 text-gray-600 dark:text-gray-400;
}

.anim-icon-active {
  @apply bg-primary-500 text-white;
}

.anim-preview {
  @apply mt-4 h-20 rounded-lg overflow-hidden;
  @apply bg-gradient-to-br from-gray-800 to-gray-900;
  @apply flex items-center justify-center;
}

.anim-preview-card {
  @apply w-12 h-14 bg-white/90 rounded shadow-lg;
}

/* Animation specific styles */
.anim-flip {
  animation: flipPreview 2s ease-in-out infinite;
}

.anim-swipe {
  animation: swipePreview 2s ease-in-out infinite;
}

.anim-coverflow {
  animation: coverflowPreview 2s ease-in-out infinite;
}

.anim-stack {
  animation: stackPreview 2s ease-in-out infinite;
}

@keyframes flipPreview {
  0%, 100% { transform: rotateY(0deg); }
  50% { transform: rotateY(180deg); }
}

@keyframes swipePreview {
  0%, 100% { transform: translateX(0) rotate(0deg); }
  50% { transform: translateX(20px) rotate(5deg); }
}

@keyframes coverflowPreview {
  0%, 100% { transform: perspective(200px) rotateY(0deg); }
  50% { transform: perspective(200px) rotateY(-15deg) translateX(10px); }
}

@keyframes stackPreview {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

/* Slide in animation */
.slide-in-enter-active,
.slide-in-leave-active {
  transition: transform 0.3s ease-out;
}

.slide-in-enter-from,
.slide-in-leave-to {
  transform: translateX(100%);
}

/* Fade animation */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
