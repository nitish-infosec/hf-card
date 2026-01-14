<script setup lang="ts">
interface Props {
  direction: 'left' | 'right'
  disabled?: boolean
}

defineProps<Props>()
const emit = defineEmits<{
  click: []
}>()
</script>

<template>
  <button
    class="arrow-button"
    :class="[
      direction === 'left' ? '-left-16 md:-left-20' : '-right-16 md:-right-20',
      { 'opacity-30 cursor-not-allowed': disabled }
    ]"
    :disabled="disabled"
    :aria-label="direction === 'left' ? 'Previous card' : 'Next card'"
    @click="emit('click')"
  >
    <Icon 
      :name="direction === 'left' ? 'heroicons:chevron-left' : 'heroicons:chevron-right'" 
      class="w-6 h-6"
    />
  </button>
</template>

<style scoped>
.arrow-button {
  @apply absolute top-1/2 -translate-y-1/2 z-20;
  @apply w-10 h-10 rounded-xl;
  @apply bg-white/90 dark:bg-dark-200/90 backdrop-blur-sm;
  @apply shadow-lg hover:shadow-xl;
  @apply border border-gray-200 dark:border-gray-700;
  @apply text-gray-700 dark:text-gray-300;
  @apply transition-all duration-200 ease-out;
  @apply hover:scale-110 active:scale-95;
  @apply flex items-center justify-center;
}

.arrow-button:not(:disabled):hover {
  @apply bg-white dark:bg-dark-100;
  @apply text-primary-600 dark:text-primary-400;
}
</style>
