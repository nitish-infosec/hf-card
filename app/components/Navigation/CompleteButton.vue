<script setup lang="ts">
const emit = defineEmits<{
  complete: []
}>()
</script>

<template>
  <button
    class="complete-button"
    @click="emit('complete')"
  >
    <Icon name="heroicons:check" class="w-5 h-5" />
    <span>Complete Training</span>
  </button>
</template>

<style scoped>
.complete-button {
  @apply inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl;
  @apply bg-gradient-to-r from-green-500 to-emerald-600;
  @apply text-white font-semibold text-base;
  @apply shadow-lg shadow-green-500/30;
  @apply transition-all duration-200 ease-out;
  @apply hover:shadow-xl hover:shadow-green-500/40 hover:scale-105;
  @apply active:scale-95;
}
</style>
