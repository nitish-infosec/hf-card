<script setup lang="ts">
const { backgroundClass } = useSettings()
</script>

<template>
  <div 
    class="min-h-screen transition-colors duration-500"
    :class="backgroundClass"
  >
    <slot />
  </div>
</template>
