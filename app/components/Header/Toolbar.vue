<script setup lang="ts">
const emit = defineEmits<{
  openCardDesign: [],
  openBackground: [],
  openAnimation: [],
  openStats: [],
  openShare: [],
  goBack: []
}>()

const colorMode = useColorMode()

const toggleTheme = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

const isDark = computed(() => colorMode.value === 'dark')
</script>

<template>
  <header class="toolbar">
    <div class="toolbar-left">
      <!-- Back Button -->
      <!-- <button 
        class="btn-icon" 
        aria-label="Go back"
        @click="emit('goBack')"
      >
        <Icon name="heroicons:arrow-left" class="w-5 h-5" />
      </button> -->
      
      <!-- Logo -->
      <div class="logo">
        <img src="/ad-media-logo.svg" alt="Abu Dhabi Media Network" class="h-7 sm:h-8 w-auto brightness-0 invert" />
      </div>
    </div>

    <!--
    <div class="toolbar-right">
      <button 
        class="btn-icon" 
        aria-label="Card design"
        title="Card Design"
        @click="emit('openCardDesign')"
      >
        <Icon name="heroicons:swatch" class="w-5 h-5" />
      </button>

      <button 
        class="btn-icon" 
        aria-label="Background style"
        title="Background Style"
        @click="emit('openBackground')"
      >
        <Icon name="heroicons:photo" class="w-5 h-5" />
      </button>

      <button 
        class="btn-icon" 
        aria-label="Card animation"
        title="Card Animation"
        @click="emit('openAnimation')"
      >
        <Icon name="heroicons:play" class="w-5 h-5" />
      </button>

      <button 
        class="btn-icon" 
        aria-label="Language"
        title="Language"
      >
        <span class="text-sm">🇺🇸</span>
      </button>

      <button 
        class="btn-icon" 
        :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
        title="Toggle theme"
        @click="toggleTheme"
      >
        <Icon 
          :name="isDark ? 'heroicons:sun' : 'heroicons:moon'" 
          class="w-5 h-5" 
        />
      </button>

      <button 
        class="btn-icon" 
        aria-label="Stats"
        title="Training Stats"
        @click="emit('openStats')"
      >
        <Icon name="heroicons:chart-bar" class="w-5 h-5" />
      </button>

      <button 
        class="btn-icon" 
        aria-label="Share"
        title="Share"
        @click="emit('openShare')"
      >
        <Icon name="heroicons:share" class="w-5 h-5" />
      </button>
    </div>
    -->
  </header>
</template>

<style scoped>
.toolbar {
  @apply fixed top-0 left-0 right-0 z-50;
  @apply flex items-center justify-between;
  @apply px-4 py-3;
}

.toolbar-left {
  @apply flex items-center gap-4;
}

.toolbar-right {
  @apply flex items-center gap-1;
}

.logo {
  @apply text-lg font-semibold hidden sm:block;
}
</style>
