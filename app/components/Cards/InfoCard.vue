<script setup lang="ts">
import type { InfoCard as InfoCardType, HighlightedText } from '~/types/training'

interface Props {
  card: InfoCardType
}

const props = defineProps<Props>()

// Check if content is string or array
const isStringContent = computed(() => typeof props.card.content === 'string')

// Highlight key terms in string content
const highlightedContent = computed(() => {
  if (!isStringContent.value || !props.card.keyTerms?.length) {
    return props.card.content as string
  }
  
  let content = props.card.content as string
  props.card.keyTerms.forEach(term => {
    const regex = new RegExp(`(${term})`, 'gi')
    content = content.replace(regex, '<span class="highlight-term">$1</span>')
  })
  return content
})

// Get content as array for legacy format
const contentArray = computed(() => {
  if (isStringContent.value) return []
  return props.card.content as HighlightedText[]
})
</script>

<template>
  <div class="card h-full flex flex-col relative select-none">
    <!-- Card Header - fixed height -->
    <div class="p-8 pb-4 flex-shrink-0">
      <h2 class="text-2xl font-bold leading-tight text-gray-900 dark:text-white">
        {{ card.title }}
      </h2>
    </div>

    <!-- Card Image - fills remaining space between title and content -->
    <div v-if="card.imageUrl || card.image" class="px-8 flex-1 min-h-[120px]">
      <div class="relative rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 h-full">
        <img
          :src="card.imageUrl || card.image"
          :alt="card.title"
          class="w-full h-full object-contain pointer-events-none select-none"
          @error="(e: Event) => (e.target as HTMLImageElement).style.display = 'none'"
        />
      </div>
    </div>

    <!-- Card Content - shows ALL text without truncation -->
    <div class="p-8 pt-5 flex-shrink-0">
      <!-- String with key terms -->
      <div 
        v-if="isStringContent" 
        class="text-gray-700 dark:text-gray-300 leading-relaxed" 
        style="font-size: 20px;"
        v-html="highlightedContent"
      ></div>
      
      <!-- Array format (legacy) -->
      <div v-else class="text-gray-700 dark:text-gray-300 leading-relaxed" style="font-size: 20px;">
        <template v-for="(part, index) in contentArray" :key="index">
          <span v-if="part.isKeyword" class="highlight-term">{{ part.text }}</span>
          <span v-else>{{ part.text }}</span>
        </template>
      </div>

      <!-- Quick Tip -->
      <div v-if="card.tip" class="mt-6 p-4 rounded-xl bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-800/30">
        <div class="flex items-start gap-3">
          <Icon name="heroicons:light-bulb" class="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
          <p class="text-sm text-gray-800 dark:text-gray-200">
            <span class="font-bold">Quick Tip:</span> {{ card.tip }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
