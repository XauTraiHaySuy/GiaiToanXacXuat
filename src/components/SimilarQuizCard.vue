<template>
  <div v-if="currentQuiz" class="rounded-2xl border border-brand-500/30 bg-slate-900/90 shadow-xl shadow-brand-950/20 overflow-hidden transition-all duration-300">
    <!-- Header Card -->
    <div class="px-5 py-4 bg-gradient-to-r from-brand-950/80 via-slate-900 to-indigo-950/70 border-b border-brand-500/20 flex flex-wrap items-center justify-between gap-3">
      <div class="flex items-center gap-2.5">
        <div class="w-8 h-8 rounded-xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-brand-400">
          <!-- Icon Practice/Exam SVG -->
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        </div>
        <div>
          <div class="flex items-center gap-2">
            <h3 class="text-sm font-bold text-white tracking-tight">Câu Hỏi Trắc Nghiệm Tương Tự</h3>
            <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-brand-500/10 text-brand-300 border border-brand-500/20 uppercase tracking-wide">
              Chuẩn THPT Quốc Gia
            </span>
          </div>
          <p class="text-xs text-slate-400">Tự động sinh 4 đáp án phân số tối giản (kèm bẫy biến cố đối & sai lệch phép đếm)</p>
        </div>
      </div>

      <!-- Action buttons & stats -->
      <div class="flex items-center gap-2">
        <span v-if="stats.total > 0" class="text-xs font-mono px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
          Đúng <span class="text-emerald-400 font-bold">{{ stats.correct }}</span>/{{ stats.total }}
        </span>

        <button
          @click="refreshQuiz"
          type="button"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700/80 hover:border-brand-500/40 transition shadow-sm"
          title="Xáo trộn lại vị trí đáp án hoặc sinh phương án nhiễu mới"
        >
          <svg class="w-3.5 h-3.5 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Đổi đề / Xáo đáp án</span>
        </button>
      </div>
    </div>

    <!-- Question Content -->
    <div class="p-5 space-y-4">
      <!-- Question Prompt Box -->
      <div class="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 text-sm text-slate-200 leading-relaxed space-y-1.5">
        <div class="flex items-center gap-2 text-xs font-bold text-brand-400">
          <span class="w-2 h-2 rounded-full bg-brand-400"></span>
          <span>ĐỀ BÀI TRẮC NGHIỆM:</span>
        </div>
        <p class="font-medium text-slate-100">
          {{ currentQuiz.problemTitle }}
        </p>
        <p class="text-slate-300 text-xs">
          <strong>Yêu cầu:</strong> {{ currentQuiz.questionPrompt }}
        </p>
      </div>

      <!-- 4 Options (A, B, C, D) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          v-for="opt in currentQuiz.options"
          :key="opt.key"
          @click="selectOption(opt)"
          type="button"
          :disabled="isAnswered"
          class="relative p-3.5 rounded-xl border text-left transition-all duration-200 flex items-center justify-between gap-3 group"
          :class="getOptionClasses(opt)"
        >
          <!-- Left: Letter & Latex Formula -->
          <div class="flex items-center gap-3">
            <span
              class="w-7 h-7 rounded-lg font-bold text-xs flex items-center justify-center flex-shrink-0 transition-colors"
              :class="getBadgeClasses(opt)"
            >
              {{ opt.key }}
            </span>

            <div class="flex items-center gap-2">
              <span class="text-xs text-slate-400 font-mono">P =</span>
              <span class="text-base font-bold text-white">
                <MathRenderer :latex="opt.latex" />
              </span>
            </div>
          </div>

          <!-- Right: Value preview / Indicator -->
          <div class="flex items-center gap-2 flex-shrink-0">
            <span class="text-[11px] text-slate-500 font-mono hidden md:inline">
              ≈ {{ opt.decimalStr }}
            </span>

            <!-- Status Icon -->
            <span v-if="isAnswered && opt.isCorrect" class="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
              </svg>
            </span>
            <span v-else-if="isAnswered && selectedKey === opt.key && !opt.isCorrect" class="w-6 h-6 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </span>
          </div>
        </button>
      </div>

      <!-- Result Banner & Pedagogical Explanation -->
      <div v-if="isAnswered" class="p-4 rounded-xl border transition-all duration-300 space-y-3" :class="isCorrectSelection ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-200' : 'bg-rose-950/40 border-rose-500/30 text-rose-200'">
        <div class="flex items-center justify-between gap-3">
          <div class="flex items-center gap-2">
            <span class="w-6 h-6 rounded-full flex items-center justify-center" :class="isCorrectSelection ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'">
              <svg v-if="isCorrectSelection" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
              </svg>
              <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </span>
            <span class="font-bold text-sm">
              {{ isCorrectSelection ? 'CHÍNH XÁC! Bạn đã làm chủ dạng toán này.' : 'CHƯA CHÍNH XÁC! Hãy chú ý các bẫy đề thi bên dưới.' }}
            </span>
          </div>

          <span class="text-xs font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
            Đáp án đúng: <strong class="text-emerald-400 font-bold">{{ currentQuiz.correctKey }}</strong>
          </span>
        </div>

        <!-- Detailed Trap Explanation Breakdown -->
        <div class="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80 text-xs space-y-2 text-slate-300">
          <div class="font-semibold text-slate-200">
            Phân tích chi tiết các phương án:
          </div>
          <div class="space-y-1.5 pl-2">
            <div v-for="opt in currentQuiz.options" :key="'exp-' + opt.key" class="flex items-start gap-2" :class="{ 'text-emerald-300 font-medium': opt.isCorrect, 'text-rose-300': selectedKey === opt.key && !opt.isCorrect }">
              <span class="font-bold font-mono">[{{ opt.key }}]</span>
              <span>
                <strong v-if="opt.tag" class="underline mr-1">{{ opt.tag }}:</strong>
                {{ opt.explanation }}
              </span>
            </div>
          </div>
        </div>

        <!-- Next Question Action -->
        <div class="flex justify-end pt-1">
          <button
            @click="refreshQuiz"
            type="button"
            class="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-500 text-white transition shadow-sm inline-flex items-center gap-1.5"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
            <span>Làm câu hỏi tiếp theo</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import MathRenderer from './MathRenderer.vue'
import { generateSimilarQuiz } from '../utils/probEngine.js'

const props = defineProps({
  problemTitle: {
    type: String,
    default: 'Bài toán xác suất'
  },
  questionPrompt: {
    type: String,
    default: 'Tính xác suất của biến cố đã cho.'
  },
  correctFraction: {
    type: [Object, String, Number],
    required: true
  },
  rawNumerator: {
    type: [Number, String, BigInt],
    default: null
  },
  rawDenominator: {
    type: [Number, String, BigInt],
    default: null
  },
  problemType: {
    type: String,
    default: 'general'
  },
  customDistractors: {
    type: Array,
    default: () => []
  }
})

const currentQuiz = ref(null)
const selectedKey = ref(null)
const isAnswered = ref(false)
const stats = ref({ correct: 0, total: 0 })

const isCorrectSelection = computed(() => {
  if (!currentQuiz.value || !selectedKey.value) return false
  return selectedKey.value === currentQuiz.value.correctKey
})

const buildQuiz = () => {
  if (!props.correctFraction) return
  try {
    currentQuiz.value = generateSimilarQuiz({
      problemTitle: props.problemTitle,
      questionPrompt: props.questionPrompt,
      correctFraction: props.correctFraction,
      rawNumerator: props.rawNumerator,
      rawDenominator: props.rawDenominator,
      problemType: props.problemType,
      customDistractors: props.customDistractors
    })
    selectedKey.value = null
    isAnswered.value = false
  } catch (err) {
    console.error('Failed to generate similar quiz:', err)
  }
}

watch(
  () => [props.correctFraction, props.problemTitle, props.questionPrompt],
  () => {
    buildQuiz()
  },
  { immediate: true, deep: true }
)

const refreshQuiz = () => {
  buildQuiz()
}

const selectOption = (opt) => {
  if (isAnswered.value) return
  selectedKey.value = opt.key
  isAnswered.value = true

  stats.value.total++
  if (opt.isCorrect) {
    stats.value.correct++
  }
}

const getOptionClasses = (opt) => {
  if (!isAnswered.value) {
    return 'bg-slate-950/70 border-slate-800 hover:border-brand-500/60 hover:bg-slate-850 hover:shadow-md cursor-pointer'
  }

  if (opt.isCorrect) {
    return 'bg-emerald-950/50 border-emerald-500/80 shadow-md shadow-emerald-950/50 text-white font-bold'
  }

  if (selectedKey.value === opt.key && !opt.isCorrect) {
    return 'bg-rose-950/50 border-rose-500/80 shadow-md shadow-rose-950/50 text-rose-200'
  }

  return 'bg-slate-950/40 border-slate-800/60 opacity-60'
}

const getBadgeClasses = (opt) => {
  if (!isAnswered.value) {
    return 'bg-slate-800 border border-slate-700 text-slate-300 group-hover:bg-brand-600 group-hover:text-white'
  }

  if (opt.isCorrect) {
    return 'bg-emerald-500 text-slate-950 font-black'
  }

  if (selectedKey.value === opt.key && !opt.isCorrect) {
    return 'bg-rose-500 text-white font-black'
  }

  return 'bg-slate-800 text-slate-400'
}
</script>
