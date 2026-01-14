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
    <div class="p-4 sm:p-6 md:p-8 pb-3 sm:pb-4 flex-shrink-0">
      <h2 class="text-xl sm:text-2xl font-bold leading-tight text-gray-900">
        {{ card.title }}
      </h2>
    </div>

    <!-- Card Image - fills remaining space between title and content -->
    <div v-if="card.imageUrl || card.image" class="px-4 sm:px-6 md:px-8 flex-1 min-h-[100px] sm:min-h-[120px]">
      <div class="relative rounded-xl sm:rounded-2xl overflow-hidden bg-gray-100 h-full">
        <img
          :src="card.imageUrl || card.image"
          :alt="card.title"
          class="w-full h-full object-contain pointer-events-none select-none"
          @error="(e: Event) => (e.target as HTMLImageElement).style.display = 'none'"
        />
      </div>
    </div>

    <!-- Card Content - shows ALL text without truncation -->
    <div class="p-4 sm:p-6 md:p-8 pt-4 sm:pt-5 flex-shrink-0">
      <!-- String with key terms -->
      <div 
        v-if="isStringContent" 
        class="text-gray-700 leading-relaxed text-base sm:text-lg md:text-xl"
        v-html="highlightedContent"
      ></div>
      
      <!-- Array format (legacy) -->
      <div v-else class="text-gray-700 leading-relaxed text-base sm:text-lg md:text-xl">
        <template v-for="(part, index) in contentArray" :key="index">
          <span v-if="part.isKeyword" class="highlight-term">{{ part.text }}</span>
          <span v-else>{{ part.text }}</span>
        </template>
      </div>

      <!-- Quick Tip -->
      <div v-if="card.tip" class="mt-4 sm:mt-6 p-3 sm:p-4 rounded-xl bg-orange-50 border border-orange-100">
        <div class="flex items-start gap-2 sm:gap-3">
          <Icon name="heroicons:light-bulb" class="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 flex-shrink-0 mt-0.5" />
          <p class="text-xs sm:text-sm text-gray-800">
            <span class="font-bold">Quick Tip:</span> {{ card.tip }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
