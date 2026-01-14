<script setup lang="ts">
interface Props {
  current: number
  total: number
}

defineProps<Props>()
</script>

<template>
  <div class="progress-indicator">
    <!-- Dot indicators -->
    <div class="dots-container">
      <button
        v-for="index in total"
        :key="index"
        class="dot"
        :class="{ 'dot-active': index === current, 'dot-completed': index < current }"
        :aria-label="`Go to card ${index}`"
      />
    </div>
    <!-- Text counter -->
    <span class="progress-text">
      {{ current }} / {{ total }}
    </span>
  </div>
</template>

<style scoped>
.progress-indicator {
  @apply flex flex-col items-center gap-3;
}

.dots-container {
  @apply flex items-center justify-center gap-1.5 flex-wrap max-w-xs;
}

.dot {
  @apply w-2 h-2 rounded-full;
  @apply bg-white/40;
  @apply transition-all duration-300 ease-out;
}

.dot-active {
  @apply w-3 h-3 bg-white;
}

.dot-completed {
  @apply bg-white/60;
}

.progress-text {
  @apply text-sm font-medium text-white/80;
  font-variant-numeric: tabular-nums;
}
</style>
