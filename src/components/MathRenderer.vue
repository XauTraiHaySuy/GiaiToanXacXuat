<template>
  <component
    :is="displayMode ? 'div' : 'span'"
    class="math-renderer"
    :class="{ 'my-3 text-center block overflow-x-auto py-1': displayMode, 'inline-block mx-0.5': !displayMode }"
    v-html="renderedHtml"
  />
</template>

<script setup>
import { computed } from 'vue'
import katex from 'katex'

const props = defineProps({
  latex: {
    type: [String, Number],
    default: ''
  },
  displayMode: {
    type: Boolean,
    default: false
  }
})

const renderedHtml = computed(() => {
  const content = props.latex !== null && props.latex !== undefined ? String(props.latex) : ''
  if (!content.trim()) return ''

  try {
    return katex.renderToString(content, {
      displayMode: props.displayMode,
      throwOnError: false,
      strict: false,
      trust: true
    })
  } catch (err) {
    console.error('KaTeX rendering error for latex:', content, err)
    return `<span class="text-rose-400 font-mono text-sm">[Công thức: ${content}]</span>`
  }
})
</script>

<style>
/* Đảm bảo KaTeX hiển thị mượt mà trên nền tối */
.math-renderer .katex {
  font-size: 1.05em;
  text-rendering: optimizeLegibility;
}
.dark .math-renderer .katex {
  color: #f1f5f9;
}
.math-renderer .katex-display {
  margin: 0.5em 0;
}
</style>
