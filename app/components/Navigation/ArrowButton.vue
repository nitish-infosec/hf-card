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
      direction === 'left' ? 'left-2 sm:-left-6 md:-left-14' : 'right-2 sm:-right-6 md:-right-14',
      { 'opacity-30 cursor-not-allowed': disabled }
    ]"
    :disabled="disabled"
    :aria-label="direction === 'left' ? 'Previous card' : 'Next card'"
    @click="emit('click')"
  >
    <Icon 
      :name="direction === 'left' ? 'heroicons:chevron-left' : 'heroicons:chevron-right'" 
      class="w-5 h-5 sm:w-6 sm:h-6"
    />
  </button>
</template>

<style scoped>
.arrow-button {
  @apply absolute top-1/2 -translate-y-1/2 z-20;
  @apply w-8 h-8 sm:w-10 sm:h-10 rounded-xl;
  @apply bg-white/90 backdrop-blur-sm;
  @apply shadow-lg hover:shadow-xl;
  @apply border border-gray-200;
  @apply text-gray-700;
  @apply transition-all duration-200 ease-out;
  @apply hover:scale-110 active:scale-95;
  @apply flex items-center justify-center;
}

.arrow-button:not(:disabled):hover {
  @apply bg-white;
  @apply text-primary-600;
}
</style>

