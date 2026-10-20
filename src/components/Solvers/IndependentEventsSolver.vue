<template>
  <div class="space-y-6">
    <!-- Header bài toán -->
    <div class="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div class="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold bg-math-blue/10 text-math-blue border border-math-blue/20 mb-2">
            <span>Toán 11 • Xác suất biến cố độc lập</span>
          </div>
          <h2 class="text-2xl font-bold text-white tracking-tight">Xác suất các Biến Cố Độc Lập</h2>
          <p class="text-sm text-slate-400 mt-1">
            Quy tắc nhân xác suất <MathRenderer latex="P(A \cap B) = P(A) \cdot P(B)" />, biến cố đối <MathRenderer latex="P(A) = 1 - P(\bar{A})" /> cho hệ nhiều đối tượng hoạt động độc lập.
          </p>
        </div>

        <!-- Presets Buttons -->
        <div class="flex flex-wrap items-center gap-2">
          <span class="text-xs text-slate-400">Đề mẫu:</span>
          <button
            v-for="(preset, idx) in presets"
            :key="idx"
            @click="applyPreset(preset)"
            class="px-2.5 py-1 text-xs rounded-lg bg-slate-800 hover:bg-brand-600/30 text-slate-300 hover:text-brand-300 border border-slate-700 transition"
          >
            {{ preset.name }}
          </button>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full min-w-0">
      <!-- Input Panel (Sticky Sidebar) -->
      <div class="lg:col-span-5 w-full min-w-0 lg:sticky lg:top-24 space-y-4 sm:space-y-5 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto pr-1 custom-scrollbar">
        <div class="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-6 space-y-4 sm:space-y-5">
          <div class="flex items-center justify-between">
            <h3 class="text-base font-semibold text-white flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-math-blue"></span>
              1. Danh sách đối tượng độc lập
            </h3>
            <button
              v-if="actors.length < 5"
              @click="addActor"
              type="button"
              class="text-xs text-brand-400 hover:text-brand-300 font-medium inline-flex items-center gap-1"
            >
              + Thêm người/thiết bị
            </button>
          </div>

          <!-- Actor List -->
          <div class="space-y-3">
            <div
              v-for="(actor, idx) in actors"
              :key="idx"
              class="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2.5"
            >
              <div class="flex items-center justify-between gap-2">
                <div class="flex items-center gap-2 flex-grow">
                  <span class="w-5 h-5 rounded-full bg-slate-700 text-xs font-mono flex items-center justify-center text-slate-300 font-bold">
                    {{ idx + 1 }}
                  </span>
                  <input
                    v-model="actor.name"
                    type="text"
                    class="bg-transparent text-sm font-semibold text-white border-b border-transparent focus:border-brand-400 focus:outline-none flex-grow"
                    placeholder="Tên đối tượng (VD: Xạ thủ 1)"
                  />
                </div>
                <button
                  v-if="actors.length > 2"
                  @click="removeActor(idx)"
                  class="text-slate-500 hover:text-rose-400 p-1 text-sm"
                  title="Xóa đối tượng này"
                >
                  &times;
                </button>
              </div>

              <!-- Input probability -->
              <div class="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span class="text-slate-400 block mb-1">Xác suất thành công <MathRenderer :latex="`P(A_${idx+1})`" />:</span>
                  <input
                    v-model="actor.probInput"
                    @input="validateActorProb(actor)"
                    type="text"
                    class="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 focus:border-brand-400 text-white font-mono text-center text-sm"
                    placeholder="VD: 0.8 hoặc 4/5"
                  />
                </div>

                <div class="bg-slate-950/50 p-2 rounded-lg border border-slate-800 flex flex-col justify-center">
                  <span class="text-slate-400 block text-[11px]">Xác suất thất bại <MathRenderer :latex="`P(\\bar{A}_${idx+1})`" />:</span>
                  <span class="font-mono text-rose-300 font-semibold text-xs mt-0.5">
                    {{ actor.failProb ? actor.failProb.text + ` (${actor.failProb.decimalStr})` : 'Chưa hợp lệ' }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <h3 class="text-base font-semibold text-white pt-2 flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-brand-400"></span>
            2. Biến cố cần tính xác suất
          </h3>

          <!-- Event Type -->
          <div class="space-y-3">
            <div>
              <label class="text-xs text-slate-400 block mb-1">Chọn yêu cầu:</label>
              <select
                v-model="eventType"
                class="w-full px-3 py-2 text-sm rounded-xl bg-slate-950 border border-slate-700 text-slate-200 focus:border-brand-400 focus:outline-none"
              >
                <option value="at_least_1">Có ít nhất 1 người thành công (Dùng biến cố đối)</option>
                <option value="all_success">Tất cả mọi người đều thành công</option>
                <option value="none_success">Không có ai thành công (Tất cả đều thất bại)</option>
                <option value="exact_1">Có đúng 1 người thành công</option>
                <option value="exact_2" :disabled="actors.length < 2">Có đúng 2 người thành công</option>
                <option value="first_success_second_fail" :disabled="actors.length < 2">
                  Người thứ 1 thành công VÀ người thứ 2 thất bại
                </option>
              </select>
            </div>
          </div>

          <!-- Nút giải -->
          <button
            @click="calculateSolution"
            type="button"
            class="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
            </svg>
            Giải chi tiết từng bước
          </button>
        </div>
      </div>

      <!-- Solution Output Panel -->
      <div class="lg:col-span-7 w-full min-w-0 space-y-6">
        <div v-if="solution" class="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 space-y-5 sm:space-y-6 shadow-xl relative min-w-0">
          <!-- Top bar -->
          <div class="flex items-center justify-between border-b border-slate-800 pb-3 sm:pb-4 gap-2 min-w-0">
            <div class="min-w-0">
              <h3 class="text-base sm:text-lg font-bold text-white flex items-center gap-2 truncate">
                <span class="p-1 rounded bg-blue-500/20 text-blue-400 flex-shrink-0">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </span>
                Lời giải tự luận chuẩn THPT
              </h3>
              <p class="text-xs text-slate-400 mt-0.5 hidden sm:block">Xác suất biến cố độc lập & công thức nhân xác suất</p>
            </div>

            <div class="flex-shrink-0">
              <CopySolutionButton :text="plainTextSolution" />
            </div>
          </div>

          <!-- Highlight kết quả -->
          <div class="p-4 rounded-xl bg-gradient-to-br from-blue-950/60 to-slate-950 border border-blue-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span class="text-xs font-semibold text-blue-300 uppercase tracking-wider block">Xác suất cần tính P(A)</span>
              <div class="flex flex-wrap items-baseline gap-2 sm:gap-3 mt-1">
                <span class="text-xl sm:text-2xl font-extrabold text-white">
                  <MathRenderer :latex="solution.resultFraction.latex" />
                </span>
                <span class="text-slate-400 text-xs sm:text-sm font-mono">
                  ≈ {{ solution.resultFraction.decimalStr }} ({{ solution.resultFraction.percentageStr }})
                </span>
              </div>
            </div>

            <div class="text-left sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800/80">
              <span class="text-xs text-slate-400 block">Dạng bài toán</span>
              <span class="text-xs font-mono font-semibold text-blue-400 px-2 py-1 rounded bg-blue-500/10 border border-blue-500/20 inline-block mt-1">
                Biến cố độc lập (Toán 11)
              </span>
            </div>
          </div>

          <!-- Bước 1 -->
          <div class="space-y-2">
            <div class="flex items-center gap-2 text-sm font-bold text-blue-400">
              <span class="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-xs">1</span>
              <span>Bước 1: Gọi các biến cố thành phần và xác định tính độc lập</span>
            </div>
            <div class="pl-8 text-sm text-slate-300 space-y-2.5">
              <div v-for="(act, idx) in actors" :key="idx" class="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80 text-xs">
                Gọi <MathRenderer :latex="`A_${idx+1}`" /> là biến cố: <strong class="text-white">"{{ act.name }} thành công"</strong>.
                <div class="mt-1 flex items-center gap-4 text-slate-300">
                  <span><MathRenderer :latex="`P(A_${idx+1}) = ${act.parsedProb.latex}`" /> (≈ {{ act.parsedProb.decimalStr }})</span>
                  <span><MathRenderer :latex="`P(\\bar{A}_${idx+1}) = 1 - P(A_${idx+1}) = ${act.failProb.latex}`" /> (≈ {{ act.failProb.decimalStr }})</span>
                </div>
              </div>
              <p class="text-xs text-slate-400 italic">
                Vì hành động của mỗi đối tượng không ảnh hưởng đến nhau nên các biến cố <MathRenderer :latex="actorVariablesLatex" /> là các biến cố độc lập toàn phần.
              </p>
            </div>
          </div>

          <!-- Bước 2 -->
          <div class="space-y-2">
            <div class="flex items-center gap-2 text-sm font-bold text-blue-400">
              <span class="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-xs">2</span>
              <span>Bước 2: Gọi biến cố tổng quát và phân tích</span>
            </div>
            <div class="pl-8 text-sm text-slate-300 space-y-2">
              <p>
                Gọi <MathRenderer latex="A" /> là biến cố: <strong class="text-white">"{{ solution.eventDesc }}"</strong>.
              </p>
              <div v-if="solution.isOpposite" class="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-200/90 text-xs leading-relaxed">
                <span class="font-bold">Phương pháp biến cố đối:</span>
                Biến cố đối của "có ít nhất 1 người thành công" là <strong class="text-amber-100"><MathRenderer latex="\bar{A}" />: "{{ solution.oppositeDesc }}"</strong>.
                <br/>
                Theo công thức biến cố đối: <MathRenderer latex="P(A) = 1 - P(\bar{A})" />.
              </div>
            </div>
          </div>

          <!-- Bước 3 -->
          <div class="space-y-2">
            <div class="flex items-center gap-2 text-sm font-bold text-blue-400">
              <span class="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-xs">3</span>
              <span>Bước 3: Áp dụng công thức tính xác suất</span>
            </div>
            <div class="pl-8 text-sm text-slate-300 space-y-3">
              <div v-for="(expl, idx) in solution.explanations" :key="idx" class="text-xs text-slate-300 leading-relaxed">
                <div v-html="expl"></div>
              </div>

              <div class="p-3 rounded-lg bg-slate-950/80 border border-slate-800/80 overflow-x-auto">
                <MathRenderer :latex="solution.calcLatex" :display-mode="true" />
              </div>
            </div>
          </div>

          <!-- Bước 4 -->
          <div class="space-y-2">
            <div class="flex items-center gap-2 text-sm font-bold text-blue-400">
              <span class="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-xs">4</span>
              <span>Bước 4: Kết luận xác suất</span>
            </div>
            <div class="pl-8 text-sm text-slate-300 space-y-2">
              <p class="text-sm">
                Vậy xác suất để {{ solution.eventDesc.toLowerCase() }} là:
              </p>
              <div class="p-3 rounded-lg bg-slate-950/80 border border-slate-800/80">
                <MathRenderer :latex="solution.step4Latex" :display-mode="true" />
              </div>
              <p class="text-xs text-slate-400">
                Đáp số: <strong class="text-blue-300">{{ solution.resultFraction.text }}</strong> hay xấp xỉ <strong class="text-blue-300">{{ solution.resultFraction.percentageStr }}</strong>.
              </p>
            </div>
          </div>

          <!-- Câu hỏi trắc nghiệm tương tự chuẩn THPT -->
          <div class="pt-2">
            <SimilarQuizCard
              :problem-title="`Cho ${actors.length} đối tượng hoạt động độc lập: ${actors.map((a, i) => `${a.name} với P = ${a.parsedProb ? a.parsedProb.text : a.probInput}`).join(', ')}.`"
              :question-prompt="`Tính xác suất biến cố: '${solution.eventDesc}'.`"
              :correct-fraction="solution.resultFraction"
              problem-type="independent"
            />
          </div>
        </div>

        <div v-else class="h-full min-h-[380px] bg-slate-900/40 border border-slate-800/80 border-dashed rounded-2xl flex flex-col items-center justify-center p-8 text-center">
          <div class="w-16 h-16 rounded-full bg-slate-800/60 flex items-center justify-center text-slate-500 mb-4">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
          </div>
          <h4 class="text-base font-semibold text-slate-300">Chưa có kết quả</h4>
          <p class="text-xs text-slate-500 max-w-sm mt-1">
            Kiểm tra các xác suất đầu vào (hợp lệ từ 0 đến 1) và bấm "Giải chi tiết từng bước".
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import MathRenderer from '../MathRenderer.vue'
import CopySolutionButton from '../CopySolutionButton.vue'
import SimilarQuizCard from '../SimilarQuizCard.vue'
import { parseProbInput, simplifyFraction, multiplyFractions, addFractions } from '../../utils/math.js'

const actors = ref([
  { name: 'Xạ thủ 1', probInput: '0.8', parsedProb: null, failProb: null },
  { name: 'Xạ thủ 2', probInput: '0.7', parsedProb: null, failProb: null }
])

const eventType = ref('at_least_1')
const solution = ref(null)

const validateActorProb = (actor) => {
  const p = parseProbInput(actor.probInput)
  if (p) {
    actor.parsedProb = p
    // q = 1 - p
    const failNum = p.den - p.num
    actor.failProb = simplifyFraction(failNum, p.den)
  } else {
    actor.parsedProb = null
    actor.failProb = null
  }
}

const addActor = () => {
  if (actors.value.length >= 5) return
  const newIdx = actors.value.length + 1
  const newActor = {
    name: `Xạ thủ ${newIdx}`,
    probInput: '0.6',
    parsedProb: null,
    failProb: null
  }
  validateActorProb(newActor)
  actors.value.push(newActor)
}

const removeActor = (idx) => {
  actors.value.splice(idx, 1)
}

const actorVariablesLatex = computed(() => {
  return actors.value.map((_, i) => `A_${i+1}`).join(', ')
})

const presets = [
  {
    name: 'Đề 1: Hai xạ thủ (0.8 và 0.7)',
    actors: [
      { name: 'Xạ thủ 1', probInput: '0.8' },
      { name: 'Xạ thủ 2', probInput: '0.7' }
    ],
    eventType: 'at_least_1'
  },
  {
    name: 'Đề 2: Ba học sinh giải toán (0.6, 0.7, 0.8)',
    actors: [
      { name: 'Học sinh An', probInput: '0.6' },
      { name: 'Học sinh Bình', probInput: '0.7' },
      { name: 'Học sinh Cường', probInput: '0.8' }
    ],
    eventType: 'at_least_1'
  },
  {
    name: 'Đề 3: Hai động cơ máy bay (Đúng 1 động cơ hỏng)',
    actors: [
      { name: 'Động cơ 1', probInput: '0.9' },
      { name: 'Động cơ 2', probInput: '0.85' }
    ],
    eventType: 'exact_1'
  },
  {
    name: 'Đề 4: Ba xạ thủ cùng trúng',
    actors: [
      { name: 'Xạ thủ A', probInput: '3/4' },
      { name: 'Xạ thủ B', probInput: '2/3' },
      { name: 'Xạ thủ C', probInput: '4/5' }
    ],
    eventType: 'all_success'
  }
]

const applyPreset = (preset) => {
  actors.value = preset.actors.map(a => ({
    name: a.name,
    probInput: a.probInput,
    parsedProb: null,
    failProb: null
  }))
  actors.value.forEach(validateActorProb)
  eventType.value = preset.eventType
  calculateSolution()
}

const calculateSolution = () => {
  // Validate all actor probabilities
  for (const act of actors.value) {
    validateActorProb(act)
    if (!act.parsedProb) {
      alert(`Xác suất của "${act.name}" không hợp lệ. Vui lòng nhập số từ 0 đến 1 (VD: 0.8, 3/4 hoặc 80%)!`)
      return
    }
  }

  const n = actors.value.length
  let eventDesc = ''
  let isOpposite = false
  let oppositeDesc = ''
  let explanations = []
  let calcLatex = ''
  let resultFraction = null

  if (eventType.value === 'at_least_1') {
    eventDesc = 'Có ít nhất một đối tượng thành công'
    isOpposite = true
    oppositeDesc = 'Không có đối tượng nào thành công (tất cả đều thất bại)'

    // P(A_bar) = q_1 * q_2 * ... * q_n
    let qFrac = actors.value[0].failProb
    for (let i = 1; i < n; i++) {
      qFrac = multiplyFractions(qFrac, actors.value[i].failProb)
    }

    // P(A) = 1 - P(A_bar)
    const pNum = qFrac.den - qFrac.num
    resultFraction = simplifyFraction(pNum, qFrac.den)

    explanations.push(`Biến cố đối <MathRenderer latex="\\bar{A} = \\bar{A}_1 \\cap \\bar{A}_2 \\dots \\cap \\bar{A}_${n}" />.`)
    explanations.push(`Do các biến cố độc lập, xác suất để tất cả cùng thất bại là tích các xác suất thất bại:`)

    const factorSymbols = actors.value.map((_, i) => `P(\\bar{A}_${i+1})`).join(' \\cdot ')
    const factorValues = actors.value.map(a => a.failProb.latex).join(' \\cdot ')

    calcLatex = `P(\\bar{A}) = ${factorSymbols} = ${factorValues} = ${qFrac.latex}`
    
    explanations.push(`Do đó, xác suất của biến cố A là:`)
    calcLatex += ` \\implies P(A) = 1 - P(\\bar{A}) = 1 - ${qFrac.latex} = ${resultFraction.latex}`
  }
  else if (eventType.value === 'all_success') {
    eventDesc = 'Tất cả các đối tượng đều thành công'
    isOpposite = false

    let pFrac = actors.value[0].parsedProb
    for (let i = 1; i < n; i++) {
      pFrac = multiplyFractions(pFrac, actors.value[i].parsedProb)
    }
    resultFraction = pFrac

    explanations.push(`Biến cố <MathRenderer latex="A = A_1 \\cap A_2 \\dots \\cap A_${n}" />.`)
    explanations.push(`Do các biến cố độc lập, áp dụng quy tắc nhân xác suất:`)

    const factorSymbols = actors.value.map((_, i) => `P(A_${i+1})`).join(' \\cdot ')
    const factorValues = actors.value.map(a => a.parsedProb.latex).join(' \\cdot ')
    calcLatex = `P(A) = ${factorSymbols} = ${factorValues} = ${resultFraction.latex}`
  }
  else if (eventType.value === 'none_success') {
    eventDesc = 'Không có đối tượng nào thành công (tất cả đều thất bại)'
    isOpposite = false

    let qFrac = actors.value[0].failProb
    for (let i = 1; i < n; i++) {
      qFrac = multiplyFractions(qFrac, actors.value[i].failProb)
    }
    resultFraction = qFrac

    explanations.push(`Biến cố <MathRenderer latex="A = \\bar{A}_1 \\cap \\bar{A}_2 \\dots \\cap \\bar{A}_${n}" />.`)
    explanations.push(`Áp dụng quy tắc nhân xác suất cho các biến cố độc lập:`)

    const factorSymbols = actors.value.map((_, i) => `P(\\bar{A}_${i+1})`).join(' \\cdot ')
    const factorValues = actors.value.map(a => a.failProb.latex).join(' \\cdot ')
    calcLatex = `P(A) = ${factorSymbols} = ${factorValues} = ${resultFraction.latex}`
  }
  else if (eventType.value === 'exact_1') {
    eventDesc = 'Có đúng 1 đối tượng thành công'
    isOpposite = false

    // Tổng n trường hợp: người thứ i thành công, còn lại thất bại
    let sumFrac = { num: 0n, den: 1n }
    let caseTerms = []

    for (let i = 0; i < n; i++) {
      let caseFrac = actors.value[i].parsedProb
      let termParts = []
      for (let j = 0; j < n; j++) {
        if (i === j) {
          termParts.push(`P(A_${j+1})`)
        } else {
          caseFrac = multiplyFractions(caseFrac, actors.value[j].failProb)
          termParts.push(`P(\\bar{A}_${j+1})`)
        }
      }
      sumFrac = addFractions(sumFrac, caseFrac)
      caseTerms.push({
        name: actors.value[i].name,
        formula: termParts.join(' \\cdot '),
        frac: caseFrac
      })
      explanations.push(`- Chỉ ${actors.value[i].name} thành công: <MathRenderer latex="${termParts.join(' \\cdot ')} = ${caseFrac.latex}" />`)
    }

    resultFraction = sumFrac
    calcLatex = `P(A) = ${caseTerms.map(c => `(${c.frac.latex})`).join(' + ')} = ${resultFraction.latex}`
  }
  else if (eventType.value === 'exact_2') {
    eventDesc = 'Có đúng 2 đối tượng thành công'
    isOpposite = false

    let sumFrac = { num: 0n, den: 1n }
    let caseTerms = []

    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        let caseFrac = multiplyFractions(actors.value[i].parsedProb, actors.value[j].parsedProb)
        let termParts = [`P(A_${i+1})`, `P(A_${j+1})`]
        for (let k = 0; k < n; k++) {
          if (k !== i && k !== j) {
            caseFrac = multiplyFractions(caseFrac, actors.value[k].failProb)
            termParts.push(`P(\\bar{A}_${k+1})`)
          }
        }
        sumFrac = addFractions(sumFrac, caseFrac)
        caseTerms.push({
          formula: termParts.join(' \\cdot '),
          frac: caseFrac
        })
        explanations.push(`- Chỉ ${actors.value[i].name} và ${actors.value[j].name} thành công: <MathRenderer latex="${caseFrac.latex}" />`)
      }
    }

    resultFraction = sumFrac
    calcLatex = `P(A) = ${caseTerms.map(c => `(${c.frac.latex})`).join(' + ')} = ${resultFraction.latex}`
  }
  else if (eventType.value === 'first_success_second_fail') {
    eventDesc = `${actors.value[0].name} thành công VÀ ${actors.value[1].name} thất bại`
    isOpposite = false

    let frac = multiplyFractions(actors.value[0].parsedProb, actors.value[1].failProb)
    resultFraction = frac
    calcLatex = `P(A) = P(A_1) \\cdot P(\\bar{A}_2) = ${actors.value[0].parsedProb.latex} \\cdot ${actors.value[1].failProb.latex} = ${resultFraction.latex}`
  }

  const step4Latex = `P(A) = ${resultFraction.latex} \\approx ${resultFraction.decimalStr}`

  solution.value = {
    eventDesc,
    isOpposite,
    oppositeDesc,
    explanations,
    calcLatex,
    resultFraction,
    step4Latex
  }
}

const plainTextSolution = computed(() => {
  if (!solution.value) return ''
  const s = solution.value
  return `=== LỜI GIẢI TOÁN XÁC SUẤT ĐỘC LẬP (GIẢI TOÁN XÁC SUẤT) ===
Yêu cầu: Tính xác suất biến cố A: "${s.eventDesc}".

BƯỚC 1: GỌI CÁC BIẾN CỐ THÀNH PHẦN
${actors.value.map((a, i) => `- Gọi A${i+1} là biến cố: "${a.name} thành công" => P(A${i+1}) = ${a.parsedProb.decimalStr}, P(A${i+1}-ngang) = ${a.failProb.decimalStr}`).join('\n')}
Vì các đối tượng hoạt động độc lập nên các biến cố trên độc lập toàn phần.

BƯỚC 2: GỌI BIẾN CỐ CẦN TÍNH
- Gọi A là biến cố: "${s.eventDesc}".
${s.isOpposite ? `- Xét biến cố đối A-ngang: "${s.oppositeDesc}".` : ''}

BƯỚC 3: ÁP DỤNG CÔNG THỨC NHÂN VÀ CỘNG XÁC SUẤT
${s.explanations.map(e => e.replace(/<[^>]*>?/gm, '')).join('\n')}

BƯỚC 4: KẾT LUẬN XÁC SUẤT
P(A) = ${s.resultFraction.text} ≈ ${s.resultFraction.decimalStr} (${s.resultFraction.percentageStr}).`
})

onMounted(() => {
  actors.value.forEach(validateActorProb)
  calculateSolution()
})
</script>
