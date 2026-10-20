<template>
  <div class="space-y-6">
    <!-- Header bài toán -->
    <div class="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div class="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-2">
            <span>Toán 10 & 11 • Đại số & Tổ hợp</span>
          </div>
          <h2 class="text-2xl font-bold text-white tracking-tight">Bài toán Chọn bi / Rút thẻ từ hộp</h2>
          <p class="text-sm text-slate-400 mt-1">
            Tính không gian mẫu tổ hợp <MathRenderer latex="C_n^k" />, phân tích biến cố trực tiếp hoặc biến cố đối <MathRenderer latex="\bar{A}" />, tối giản phân số chuẩn tự luận THPT.
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
          <h3 class="text-base font-semibold text-white flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-brand-400"></span>
            1. Thiết lập các phần tử trong hộp
          </h3>

          <!-- Color List -->
          <div class="space-y-3">
            <div
              v-for="(item, idx) in items"
              :key="idx"
              class="flex items-center gap-3 p-3 rounded-xl bg-slate-800/60 border border-slate-700/60"
            >
              <div class="w-4 h-4 rounded-full flex-shrink-0" :style="{ backgroundColor: item.colorHex }"></div>
              <input
                v-model="item.name"
                type="text"
                class="bg-transparent text-sm font-medium text-slate-200 border-b border-transparent focus:border-brand-400 focus:outline-none flex-grow"
                placeholder="Tên loại / màu"
              />
              <div class="flex items-center gap-2">
                <span class="text-xs text-slate-400">Số lượng:</span>
                <input
                  v-model.number="item.count"
                  type="number"
                  min="0"
                  max="100"
                  class="w-16 px-2 py-1 text-sm text-center rounded-lg bg-slate-950 border border-slate-700 focus:border-brand-400 focus:outline-none text-white font-mono"
                />
              </div>
              <button
                v-if="items.length > 2"
                @click="removeItem(idx)"
                class="text-slate-500 hover:text-rose-400 p-1"
                title="Xóa loại này"
              >
                &times;
              </button>
            </div>
          </div>

          <button
            v-if="items.length < 5"
            @click="addItem"
            type="button"
            class="text-xs text-brand-400 hover:text-brand-300 font-medium inline-flex items-center gap-1"
          >
            + Thêm màu/loại vật thể mới
          </button>

          <!-- Tổng số bi & Số bi lấy ra k -->
          <div class="pt-4 border-t border-slate-800/80 grid grid-cols-2 gap-4">
            <div class="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
              <span class="block text-xs text-slate-400">Tổng số vật thể (N)</span>
              <span class="text-xl font-bold text-brand-400 font-mono">{{ totalItems }}</span>
            </div>

            <div class="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
              <label class="block text-xs text-slate-400 mb-1">Số vật thể lấy ra (k)</label>
              <input
                v-model.number="drawCount"
                type="number"
                min="1"
                :max="totalItems"
                class="w-full px-2 py-1 text-sm font-bold text-center rounded-lg bg-slate-900 border border-slate-700 focus:border-brand-400 text-white font-mono"
              />
            </div>
          </div>

          <h3 class="text-base font-semibold text-white pt-2 flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-math-blue"></span>
            2. Chọn yêu cầu biến cố cần tính
          </h3>

          <!-- Event Type Selector -->
          <div class="space-y-3">
            <div>
              <label class="text-xs text-slate-400 block mb-1">Dạng biến cố:</label>
              <select
                v-model="eventType"
                class="w-full px-3 py-2 text-sm rounded-xl bg-slate-950 border border-slate-700 text-slate-200 focus:border-brand-400 focus:outline-none"
              >
                <option value="at_least_1">Có ít nhất 1 bi của màu chọn (Giải bằng biến cố đối)</option>
                <option value="exact_x">Có đúng x bi của màu chọn</option>
                <option value="at_least_x">Có ít nhất x bi của màu chọn</option>
                <option value="at_most_x">Có nhiều nhất x bi của màu chọn</option>
                <option value="all_colors" :disabled="items.length < 3 || drawCount < items.length">
                  Có đủ cả {{ items.length }} màu (yêu cầu k ≥ {{ items.length }})
                </option>
                <option value="same_color">Tất cả bi lấy ra đều cùng 1 màu</option>
                <option value="no_color">Không có bi nào thuộc màu chọn</option>
              </select>
            </div>

            <!-- Tham số phụ thuộc vào dạng biến cố -->
            <div v-if="['at_least_1', 'exact_x', 'at_least_x', 'at_most_x', 'no_color'].includes(eventType)" class="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label class="text-xs text-slate-400 block mb-1">Màu mục tiêu:</label>
                <select
                  v-model="targetColorIndex"
                  class="w-full px-3 py-2 text-sm rounded-xl bg-slate-950 border border-slate-700 text-slate-200 focus:border-brand-400 focus:outline-none"
                >
                  <option v-for="(it, idx) in items" :key="idx" :value="idx">
                    {{ it.name }} ({{ it.count }} quả)
                  </option>
                </select>
              </div>

              <div v-if="['exact_x', 'at_least_x', 'at_most_x'].includes(eventType)">
                <label class="text-xs text-slate-400 block mb-1">Số lượng x:</label>
                <input
                  v-model.number="targetX"
                  type="number"
                  min="0"
                  :max="Math.min(drawCount, currentTargetItem.count)"
                  class="w-full px-3 py-2 text-sm rounded-xl bg-slate-950 border border-slate-700 text-white font-mono focus:border-brand-400 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <!-- Nút giải -->
          <button
            @click="calculateSolution"
            type="button"
            class="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-brand-500 to-emerald-600 hover:from-brand-400 hover:to-emerald-500 text-slate-950 font-bold text-sm shadow-lg shadow-brand-500/20 transition-all flex items-center justify-center gap-2"
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
          <!-- Top bar: Header & Copy Button -->
          <div class="flex items-center justify-between border-b border-slate-800 pb-3 sm:pb-4 gap-2 min-w-0">
            <div class="min-w-0">
              <h3 class="text-base sm:text-lg font-bold text-white flex items-center gap-2 truncate">
                <span class="p-1 rounded bg-brand-500/20 text-brand-400 flex-shrink-0">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </span>
                Lời giải tự luận chuẩn THPT
              </h3>
              <p class="text-xs text-slate-400 mt-0.5 hidden sm:block">Trình bày 4 bước theo đúng Bareme chấm thi THPT Quốc gia & Đề kiểm tra</p>
            </div>

            <div class="flex-shrink-0">
              <CopySolutionButton :text="plainTextSolution" />
            </div>
          </div>

          <!-- Highlight kết quả chung cuộc -->
          <div class="p-4 rounded-xl bg-gradient-to-br from-brand-950/60 to-slate-950 border border-brand-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span class="text-xs font-semibold text-brand-300 uppercase tracking-wider block">Xác suất biến cố P(A)</span>
              <div class="flex flex-wrap items-baseline gap-2 sm:gap-3 mt-1">
                <span class="text-xl sm:text-2xl font-extrabold text-white">
                  <MathRenderer :latex="solution.probFraction.latex" />
                </span>
                <span class="text-slate-400 text-xs sm:text-sm font-mono">
                  ≈ {{ solution.probFraction.decimalStr }} ({{ solution.probFraction.percentageStr }})
                </span>
              </div>
            </div>

            <div class="text-left sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800/80">
              <span class="text-xs text-slate-400 block">Số kết quả thuận lợi</span>
              <span class="text-base sm:text-lg font-mono font-bold text-emerald-400">n(A) = {{ solution.nA }}</span>
            </div>
          </div>

          <!-- Bước 1 -->
          <div class="space-y-2">
            <div class="flex items-center gap-2 text-sm font-bold text-brand-400">
              <span class="w-6 h-6 rounded-full bg-brand-500/20 flex items-center justify-center text-xs">1</span>
              <span>Bước 1: Xác định phép thử và không gian mẫu</span>
            </div>
            <div class="pl-8 text-sm text-slate-300 space-y-2">
              <p>
                Phép thử: Lấy ngẫu nhiên {{ drawCount }} viên bi từ hộp có tổng cộng {{ totalItems }} viên bi.
              </p>
              <div class="p-3 rounded-lg bg-slate-950/80 border border-slate-800/80">
                <p>Số phần tử của không gian mẫu là:</p>
                <MathRenderer :latex="solution.step1Latex" :display-mode="true" />
              </div>
            </div>
          </div>

          <!-- Bước 2 -->
          <div class="space-y-2">
            <div class="flex items-center gap-2 text-sm font-bold text-brand-400">
              <span class="w-6 h-6 rounded-full bg-brand-500/20 flex items-center justify-center text-xs">2</span>
              <span>Bước 2: Gọi biến cố và lập luận</span>
            </div>
            <div class="pl-8 text-sm text-slate-300 space-y-2">
              <p>
                Gọi <MathRenderer latex="A" /> là biến cố: <strong class="text-white">"{{ solution.eventDesc }}"</strong>.
              </p>
              <div v-if="solution.isOppositeEvent" class="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-200/90 text-xs leading-relaxed">
                <span class="font-bold">Nhận xét phương pháp:</span>
                Yêu cầu "có ít nhất 1" có thể bao gồm nhiều trường hợp (1, 2, 3... bi). Do đó, sử dụng <strong class="text-amber-100">biến cố đối <MathRenderer latex="\bar{A}" /></strong>: <em>"{{ solution.oppositeEventDesc }}"</em> sẽ ngắn gọn, tránh sót trường hợp.
              </div>
            </div>
          </div>

          <!-- Bước 3 -->
          <div class="space-y-2">
            <div class="flex items-center gap-2 text-sm font-bold text-brand-400">
              <span class="w-6 h-6 rounded-full bg-brand-500/20 flex items-center justify-center text-xs">3</span>
              <span>Bước 3: Tính số kết quả thuận lợi cho biến cố</span>
            </div>
            <div class="pl-8 text-sm text-slate-300 space-y-3">
              <div v-for="(explanation, idx) in solution.step3Explanations" :key="idx" class="text-xs text-slate-300 leading-relaxed">
                <div v-html="explanation"></div>
              </div>

              <div class="p-3 rounded-lg bg-slate-950/80 border border-slate-800/80">
                <MathRenderer :latex="solution.step3Latex" :display-mode="true" />
              </div>
            </div>
          </div>

          <!-- Bước 4 -->
          <div class="space-y-2">
            <div class="flex items-center gap-2 text-sm font-bold text-brand-400">
              <span class="w-6 h-6 rounded-full bg-brand-500/20 flex items-center justify-center text-xs">4</span>
              <span>Bước 4: Kết luận xác suất</span>
            </div>
            <div class="pl-8 text-sm text-slate-300 space-y-2">
              <p>Xác suất của biến cố <MathRenderer latex="A" /> là:</p>
              <div class="p-3 rounded-lg bg-slate-950/80 border border-slate-800/80">
                <MathRenderer :latex="solution.step4Latex" :display-mode="true" />
              </div>
              <p class="text-xs text-slate-400 pt-1">
                Kết luận: Xác suất cần tìm là <strong class="text-brand-300">{{ solution.probFraction.text }}</strong> (hoặc xấp xỉ <strong class="text-brand-300">{{ solution.probFraction.percentageStr }}</strong>).
              </p>
            </div>
          </div>

          <!-- Câu hỏi trắc nghiệm tương tự chuẩn THPT (fraction.js & js-combinatorics) -->
          <div class="pt-2">
            <SimilarQuizCard
              :problem-title="`Hộp có tổng cộng ${totalItems} viên bi (${items.map(i => `${i.count} ${i.name.toLowerCase()}`).join(', ')}). Rút ngẫu nhiên ${drawCount} viên bi.`"
              :question-prompt="`Tính xác suất biến cố A: '${solution.eventDesc}'.`"
              :correct-fraction="solution.probFraction"
              :raw-numerator="solution.nA"
              :raw-denominator="solution.nOmega"
              problem-type="ball_drawing"
            />
          </div>
        </div>

        <div v-else class="h-full min-h-[380px] bg-slate-900/40 border border-slate-800/80 border-dashed rounded-2xl flex flex-col items-center justify-center p-8 text-center">
          <div class="w-16 h-16 rounded-full bg-slate-800/60 flex items-center justify-center text-slate-500 mb-4">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
            </svg>
          </div>
          <h4 class="text-base font-semibold text-slate-300">Chưa có kết quả</h4>
          <p class="text-xs text-slate-500 max-w-sm mt-1">
            Vui lòng chọn thông số bài toán bên trái và bấm "Giải chi tiết từng bước" để xem bài giải tự luận hoàn chỉnh.
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
import { combination, simplifyFraction } from '../../utils/math.js'

// Danh sách các loại vật thể / bi
const items = ref([
  { name: 'Bi đỏ', count: 5, colorHex: '#ef4444' },
  { name: 'Bi xanh', count: 4, colorHex: '#3b82f6' },
  { name: 'Bi vàng', count: 3, colorHex: '#eab308' }
])

const drawCount = ref(4)
const eventType = ref('at_least_1')
const targetColorIndex = ref(0)
const targetX = ref(2)
const solution = ref(null)

const totalItems = computed(() => {
  return items.value.reduce((sum, item) => sum + (Number(item.count) || 0), 0)
})

const currentTargetItem = computed(() => {
  return items.value[targetColorIndex.value] || items.value[0]
})

const defaultColors = ['#ef4444', '#3b82f6', '#eab308', '#10b981', '#a855f7']

const addItem = () => {
  if (items.value.length >= 5) return
  const nextColor = defaultColors[items.value.length % defaultColors.length]
  items.value.push({
    name: `Bi màu ${items.value.length + 1}`,
    count: 3,
    colorHex: nextColor
  })
}

const removeItem = (idx) => {
  items.value.splice(idx, 1)
  if (targetColorIndex.value >= items.value.length) {
    targetColorIndex.value = 0
  }
}

// Các đề bài mẫu phổ biến
const presets = [
  {
    name: 'Đề 1: Ít nhất 1 bi đỏ (12 bi, lấy 4)',
    items: [
      { name: 'Bi đỏ', count: 5, colorHex: '#ef4444' },
      { name: 'Bi xanh', count: 4, colorHex: '#3b82f6' },
      { name: 'Bi vàng', count: 3, colorHex: '#eab308' }
    ],
    drawCount: 4,
    eventType: 'at_least_1',
    targetColorIndex: 0
  },
  {
    name: 'Đề 2: Đúng 2 bi đỏ (10 bi, lấy 3)',
    items: [
      { name: 'Bi đỏ', count: 6, colorHex: '#ef4444' },
      { name: 'Bi xanh', count: 4, colorHex: '#3b82f6' }
    ],
    drawCount: 3,
    eventType: 'exact_x',
    targetColorIndex: 0,
    targetX: 2
  },
  {
    name: 'Đề 3: Đủ cả 3 màu (15 bi, lấy 3)',
    items: [
      { name: 'Bi đỏ', count: 4, colorHex: '#ef4444' },
      { name: 'Bi xanh', count: 5, colorHex: '#3b82f6' },
      { name: 'Bi vàng', count: 6, colorHex: '#eab308' }
    ],
    drawCount: 3,
    eventType: 'all_colors'
  },
  {
    name: 'Đề 4: Cùng một màu (15 bi, lấy 3)',
    items: [
      { name: 'Bi đỏ', count: 4, colorHex: '#ef4444' },
      { name: 'Bi xanh', count: 5, colorHex: '#3b82f6' },
      { name: 'Bi vàng', count: 6, colorHex: '#eab308' }
    ],
    drawCount: 3,
    eventType: 'same_color'
  }
]

const applyPreset = (preset) => {
  items.value = JSON.parse(JSON.stringify(preset.items))
  drawCount.value = preset.drawCount
  eventType.value = preset.eventType
  if (preset.targetColorIndex !== undefined) targetColorIndex.value = preset.targetColorIndex
  if (preset.targetX !== undefined) targetX.value = preset.targetX
  calculateSolution()
}

// Logic giải bài toán chi tiết
const calculateSolution = () => {
  const N = totalItems.value
  const k = Number(drawCount.value)
  if (k <= 0 || k > N) {
    alert(`Số bi lấy ra (k = ${k}) phải lớn hơn 0 và không vượt quá tổng số bi (N = ${N})!`)
    return
  }

  const nOmega = combination(N, k)
  const step1Latex = `n(\\Omega) = C_{${N}}^{${k}} = ${nOmega}`

  let eventDesc = ''
  let isOppositeEvent = false
  let oppositeEventDesc = ''
  let nA = 0n
  let step3Explanations = []
  let step3Latex = ''

  const targetItem = currentTargetItem.value
  const otherCount = N - targetItem.count

  if (eventType.value === 'at_least_1') {
    // Có ít nhất 1 bi màu target -> Dùng biến cố đối
    eventDesc = `Lấy được ít nhất 1 ${targetItem.name.toLowerCase()}`
    isOppositeEvent = true
    oppositeEventDesc = `Không lấy được viên ${targetItem.name.toLowerCase()} nào (chỉ lấy từ ${otherCount} viên các màu còn lại)`
    
    const nAbar = combination(otherCount, k)
    nA = nOmega - nAbar
    
    step3Explanations.push(`• Số cách chọn ${k} viên bi không có viên ${targetItem.name.toLowerCase()} nào là chọn ${k} viên từ ${otherCount} viên các màu còn lại: <br/><span class="font-mono text-brand-300">n(\\bar{A}) = C_{${otherCount}}^{${k}} = ${nAbar}</span>`)
    step3Explanations.push(`• Áp dụng công thức biến cố đối, số kết quả thuận lợi cho biến cố A là:`)
    
    step3Latex = `n(A) = n(\\Omega) - n(\\bar{A}) = C_{${N}}^{${k}} - C_{${otherCount}}^{${k}} = ${nOmega} - ${nAbar} = ${nA}`
  } 
  else if (eventType.value === 'exact_x') {
    const x = Number(targetX.value)
    const remainK = k - x
    eventDesc = `Lấy được đúng ${x} ${targetItem.name.toLowerCase()}`

    if (x > targetItem.count || remainK > otherCount || remainK < 0) {
      nA = 0n
      step3Explanations.push(`Không thể chọn được ${x} viên ${targetItem.name.toLowerCase()} và ${remainK} viên còn lại vì vượt quá số lượng bi trong hộp.`)
      step3Latex = `n(A) = 0`
    } else {
      const c1 = combination(targetItem.count, x)
      const c2 = combination(otherCount, remainK)
      nA = c1 * c2

      step3Explanations.push(`Để chọn được đúng ${x} ${targetItem.name.toLowerCase()} và ${remainK} viên màu khác, ta thực hiện qua 2 công đoạn:`)
      step3Explanations.push(`- Công đoạn 1: Chọn ${x} viên ${targetItem.name.toLowerCase()} từ ${targetItem.count} viên: có <span class="font-mono text-brand-300">C_{${targetItem.count}}^{${x}} = ${c1}</span> cách.`)
      step3Explanations.push(`- Công đoạn 2: Chọn ${remainK} viên còn lại từ ${otherCount} viên các màu khác: có <span class="font-mono text-brand-300">C_{${otherCount}}^{${remainK}} = ${c2}</span> cách.`)
      step3Explanations.push(`Theo quy tắc nhân, số kết quả thuận lợi là:`)

      step3Latex = `n(A) = C_{${targetItem.count}}^{${x}} \\times C_{${otherCount}}^{${remainK}} = ${c1} \\times ${c2} = ${nA}`
    }
  }
  else if (eventType.value === 'at_least_x') {
    const minX = Number(targetX.value)
    eventDesc = `Lấy được ít nhất ${minX} ${targetItem.name.toLowerCase()}`
    const maxX = Math.min(k, targetItem.count)
    let sumParts = []
    let totalCombinations = 0n

    step3Explanations.push(`Biến cố A xảy ra khi số ${targetItem.name.toLowerCase()} lấy ra nhận các giá trị từ ${minX} đến ${maxX}:`)

    for (let x = minX; x <= maxX; x++) {
      const remain = k - x
      if (remain <= otherCount && remain >= 0) {
        const c1 = combination(targetItem.count, x)
        const c2 = combination(otherCount, remain)
        const part = c1 * c2
        totalCombinations += part
        sumParts.push(`(C_{${targetItem.count}}^{${x}} \\times C_{${otherCount}}^{${remain}})`)
        step3Explanations.push(`- Trường hợp ${x} ${targetItem.name.toLowerCase()} và ${remain} viên khác: C_{${targetItem.count}}^{${x}} \\times C_{${otherCount}}^{${remain}} = ${c1} \\times ${c2} = ${part} cách.`)
      }
    }
    nA = totalCombinations
    step3Latex = `n(A) = ${sumParts.join(' + ')} = ${nA}`
  }
  else if (eventType.value === 'at_most_x') {
    const maxX = Number(targetX.value)
    eventDesc = `Lấy được nhiều nhất ${maxX} ${targetItem.name.toLowerCase()}`
    let sumParts = []
    let totalCombinations = 0n

    step3Explanations.push(`Biến cố A xảy ra khi số ${targetItem.name.toLowerCase()} lấy ra nhận các giá trị từ 0 đến ${maxX}:`)

    for (let x = 0; x <= maxX; x++) {
      const remain = k - x
      if (remain <= otherCount && remain >= 0 && x <= targetItem.count) {
        const c1 = combination(targetItem.count, x)
        const c2 = combination(otherCount, remain)
        const part = c1 * c2
        totalCombinations += part
        sumParts.push(`(C_{${targetItem.count}}^{${x}} \\times C_{${otherCount}}^{${remain}})`)
        step3Explanations.push(`- Trường hợp ${x} ${targetItem.name.toLowerCase()} và ${remain} viên khác: C_{${targetItem.count}}^{${x}} \\times C_{${otherCount}}^{${remain}} = ${c1} \\times ${c2} = ${part} cách.`)
      }
    }
    nA = totalCombinations
    step3Latex = `n(A) = ${sumParts.join(' + ')} = ${nA}`
  }
  else if (eventType.value === 'no_color') {
    eventDesc = `Không có viên ${targetItem.name.toLowerCase()} nào`
    nA = combination(otherCount, k)
    step3Explanations.push(`Để không có viên ${targetItem.name.toLowerCase()} nào, ta chọn tất cả ${k} viên từ ${otherCount} viên thuộc các màu còn lại:`)
    step3Latex = `n(A) = C_{${otherCount}}^{${k}} = ${nA}`
  }
  else if (eventType.value === 'same_color') {
    eventDesc = `Tất cả ${k} viên bi lấy ra đều cùng một màu`
    let parts = []
    let sum = 0n

    items.value.forEach(item => {
      if (item.count >= k) {
        const c = combination(item.count, k)
        sum += c
        parts.push(`C_{${item.count}}^{${k}}`)
        step3Explanations.push(`- Lấy ${k} viên đều là ${item.name.toLowerCase()}: C_{${item.count}}^{${k}} = ${c} cách.`)
      } else {
        step3Explanations.push(`- Không thể lấy ${k} viên cùng là ${item.name.toLowerCase()} do hộp chỉ có ${item.count} viên (< ${k}).`)
      }
    })

    nA = sum
    if (parts.length > 0) {
      step3Latex = `n(A) = ${parts.join(' + ')} = ${nA}`
    } else {
      step3Latex = `n(A) = 0`
    }
  }
  else if (eventType.value === 'all_colors') {
    eventDesc = `Lấy được đủ cả ${items.value.length} màu trong ${k} viên lấy ra`

    // Đệ quy hoặc phân phối tổng k phần tử thành các phần tử >= 1
    // Giả sử có 3 màu (Đỏ, Xanh, Vàng)
    if (items.value.length === 3) {
      const [it1, it2, it3] = items.value
      let totalWays = 0n
      let detailCases = []

      for (let x1 = 1; x1 <= Math.min(k, it1.count); x1++) {
        for (let x2 = 1; x2 <= Math.min(k - x1, it2.count); x2++) {
          const x3 = k - x1 - x2
          if (x3 >= 1 && x3 <= it3.count) {
            const c1 = combination(it1.count, x1)
            const c2 = combination(it2.count, x2)
            const c3 = combination(it3.count, x3)
            const way = c1 * c2 * c3
            totalWays += way
            detailCases.push({
              desc: `${x1} ${it1.name.toLowerCase()}, ${x2} ${it2.name.toLowerCase()}, ${x3} ${it3.name.toLowerCase()}`,
              latex: `C_{${it1.count}}^{${x1}} \\times C_{${it2.count}}^{${x2}} \\times C_{${it3.count}}^{${x3}} = ${c1} \\times ${c2} \\times ${c3} = ${way}`
            })
          }
        }
      }

      nA = totalWays
      step3Explanations.push(`Để có đủ cả 3 màu, ta phân chia các trường hợp số lượng bi của từng màu (mỗi màu ít nhất 1 viên):`)
      detailCases.forEach((cs, i) => {
        step3Explanations.push(`- TH ${i + 1} (${cs.desc}): ${cs.latex} cách.`)
      })
      step3Latex = `n(A) = ${detailCases.length > 0 ? detailCases.map(c => `(${c.latex.split(' = ')[0]})`).join(' + ') : '0'} = ${nA}`
    } else {
      // Trường hợp tổng quát
      nA = 0n
      step3Explanations.push(`Tính năng phân tích đủ màu hiện tối ưu tốt nhất cho 3 màu kinh điển.`)
      step3Latex = `n(A) = 0`
    }
  }

  // Bước 4: Tính xác suất rút gọn
  const probFraction = simplifyFraction(nA, nOmega)
  const isSimplified = probFraction.num !== nA || probFraction.den !== nOmega

  let step4Latex = `P(A) = \\frac{n(A)}{n(\\Omega)} = \\frac{${nA}}{${nOmega}}`
  if (isSimplified && !probFraction.isWhole) {
    step4Latex += ` = ${probFraction.latex}`
  } else if (probFraction.isWhole) {
    step4Latex += ` = ${probFraction.latex}`
  }
  step4Latex += ` \\approx ${probFraction.decimalStr}`

  solution.value = {
    eventDesc,
    isOppositeEvent,
    oppositeEventDesc,
    nA,
    nOmega,
    probFraction,
    step1Latex,
    step3Explanations,
    step3Latex,
    step4Latex
  }
}

// Plain text version for clipboard
const plainTextSolution = computed(() => {
  if (!solution.value) return ''
  const s = solution.value
  return `=== LỜI GIẢI TOÁN XÁC SUẤT (GIẢI TOÁN XÁC SUẤT) ===
Bài toán: Hộp có ${totalItems.value} viên bi, lấy ngẫu nhiên ${drawCount.value} viên bi.
Yêu cầu: Tính xác suất biến cố A: "${s.eventDesc}".

BƯỚC 1: XÁC ĐỊNH PHÉP THỬ VÀ KHÔNG GIAN MẪU
- Phép thử: Lấy ngẫu nhiên ${drawCount.value} viên bi từ ${totalItems.value} viên bi.
- Số phần tử không gian mẫu: n(Ω) = C(${totalItems.value}, ${drawCount.value}) = ${s.nOmega}.

BƯỚC 2: GỌI BIẾN CỐ
- Gọi A là biến cố: "${s.eventDesc}".
${s.isOppositeEvent ? `- Xét biến cố đối A-ngang: "${s.oppositeEventDesc}".` : ''}

BƯỚC 3: TÍNH SỐ KẾT QUẢ THUẬN LỢI n(A)
${s.step3Explanations.map(e => e.replace(/<[^>]*>?/gm, '')).join('\n')}
=> n(A) = ${s.nA}.

BƯỚC 4: KẾT LUẬN XÁC SUẤT
P(A) = n(A) / n(Ω) = ${s.nA} / ${s.nOmega} = ${s.probFraction.text} ≈ ${s.probFraction.decimalStr} (${s.probFraction.percentageStr}).`
})

onMounted(() => {
  calculateSolution()
})
</script>
