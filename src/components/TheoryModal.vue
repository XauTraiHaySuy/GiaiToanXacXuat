<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
    <div class="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
      <!-- Modal Header -->
      <div class="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
        <div class="flex items-center gap-2">
          <span class="p-1.5 rounded-lg bg-brand-500/20 text-brand-400">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
            </svg>
          </span>
          <h3 class="text-lg font-bold text-white">Sổ Tay Công Thức Xác Suất THPT (GDPT 2018)</h3>
        </div>
        <button
          @click="$emit('close')"
          class="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
        >
          &times;
        </button>
      </div>

      <!-- Modal Body -->
      <div class="p-6 overflow-y-auto space-y-6 text-slate-300 text-sm">
        <!-- Phần 1: Đại số tổ hợp (Lớp 10) -->
        <div class="space-y-3">
          <div class="flex items-center gap-2 text-brand-400 font-bold border-b border-slate-800 pb-1.5">
            <span class="text-xs px-2 py-0.5 rounded bg-brand-500/10 text-brand-300">LỚP 10</span>
            <span>1. Các Công Thức Đại Số Tổ Hợp Cơ Bản</span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div class="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
              <span class="text-xs text-slate-400 block font-semibold">Hoán vị (P_n):</span>
              <div class="py-1">
                <MathRenderer latex="P_n = n! = 1 \cdot 2 \cdot \dots \cdot n" />
              </div>
              <p class="text-[11px] text-slate-400">Sắp xếp thứ tự của n phần tử khác nhau.</p>
            </div>

            <div class="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
              <span class="text-xs text-slate-400 block font-semibold">Chỉnh hợp (A_n^k):</span>
              <div class="py-1">
                <MathRenderer latex="A_n^k = \frac{n!}{(n-k)!}" />
              </div>
              <p class="text-[11px] text-slate-400">Chọn k phần tử từ n phần tử VÀ CÓ sắp thứ tự.</p>
            </div>

            <div class="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
              <span class="text-xs text-slate-400 block font-semibold">Tổ hợp (C_n^k):</span>
              <div class="py-1">
                <MathRenderer latex="C_n^k = \frac{n!}{k!(n-k)!}" />
              </div>
              <p class="text-[11px] text-slate-400">Chọn k phần tử từ n phần tử KHÔNG phân biệt thứ tự.</p>
            </div>
          </div>
        </div>

        <!-- Phần 2: Xác suất cổ điển & Biến cố độc lập (Lớp 11) -->
        <div class="space-y-3">
          <div class="flex items-center gap-2 text-math-blue font-bold border-b border-slate-800 pb-1.5">
            <span class="text-xs px-2 py-0.5 rounded bg-blue-500/10 text-blue-300">LỚP 11</span>
            <span>2. Định Nghĩa Cổ Điển & Biến Cố Độc Lập</span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div class="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
              <span class="text-xs text-slate-400 block font-semibold">Định nghĩa cổ điển:</span>
              <div class="py-1">
                <MathRenderer latex="P(A) = \frac{n(A)}{n(\Omega)}" />
              </div>
              <p class="text-[11px] text-slate-400">Số kết quả thuận lợi chia cho số phần tử không gian mẫu.</p>
            </div>

            <div class="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
              <span class="text-xs text-slate-400 block font-semibold">Biến cố đối:</span>
              <div class="py-1">
                <MathRenderer latex="P(A) = 1 - P(\bar{A})" />
              </div>
              <p class="text-[11px] text-slate-400">Rất hữu ích khi đề bài yêu cầu "có ít nhất một".</p>
            </div>

            <div class="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
              <span class="text-xs text-slate-400 block font-semibold">Quy tắc cộng (Biến cố xung khắc):</span>
              <div class="py-1">
                <MathRenderer latex="P(A \cup B) = P(A) + P(B)" />
              </div>
              <p class="text-[11px] text-slate-400">Nếu A và B không bao giờ cùng xảy ra (<MathRenderer latex="A \cap B = \emptyset" />).</p>
            </div>

            <div class="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
              <span class="text-xs text-slate-400 block font-semibold">Quy tắc nhân (Biến cố độc lập):</span>
              <div class="py-1">
                <MathRenderer latex="P(A \cap B) = P(A) \cdot P(B)" />
              </div>
              <p class="text-[11px] text-slate-400">Việc xảy ra của A không làm thay đổi xác suất của B.</p>
            </div>
          </div>
        </div>

        <!-- Phần 3: Xác suất có điều kiện, Toàn phần & Bayes (Lớp 12) -->
        <div class="space-y-3">
          <div class="flex items-center gap-2 text-math-purple font-bold border-b border-slate-800 pb-1.5">
            <span class="text-xs px-2 py-0.5 rounded bg-purple-500/10 text-purple-300">LỚP 12</span>
            <span>3. Xác Suất Có Điều Kiện, Toàn Phần & Công Thức Bayes</span>
          </div>

          <div class="space-y-3">
            <div class="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
              <span class="text-xs text-slate-400 block font-semibold">Xác suất có điều kiện:</span>
              <div class="py-1">
                <MathRenderer latex="P(A|B) = \frac{P(A \cap B)}{P(B)} \quad (P(B) > 0)" />
              </div>
              <p class="text-[11px] text-slate-400">Xác suất để biến cố A xảy ra khi biết biến cố B đã xảy ra.</p>
            </div>

            <div class="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
              <span class="text-xs text-slate-400 block font-semibold">Công thức xác suất toàn phần:</span>
              <div class="py-1">
                <MathRenderer latex="P(B) = P(A_1)P(B|A_1) + P(A_2)P(B|A_2) + \dots + P(A_n)P(B|A_n)" />
              </div>
              <p class="text-[11px] text-slate-400">Với <MathRenderer latex="\{A_1, A_2, \dots, A_n\}" /> là một hệ đầy đủ các biến cố (rời nhau từng đôi và hợp lại bằng toàn bộ không gian mẫu).</p>
            </div>

            <div class="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
              <span class="text-xs text-slate-400 block font-semibold">Công thức Bayes (Đảo ngược xác suất nguyên nhân):</span>
              <div class="py-1">
                <MathRenderer latex="P(A_k|B) = \frac{P(A_k) \cdot P(B|A_k)}{P(B)} = \frac{P(A_k) \cdot P(B|A_k)}{\sum_{i=1}^n P(A_i) \cdot P(B|A_i)}" />
              </div>
              <p class="text-[11px] text-slate-400">Đánh giá lại xác suất của một giả thuyết / nguyên nhân khi đã quan sát thấy kết quả kiểm tra hay biến cố thực nghiệm.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="px-6 py-3 border-t border-slate-800 bg-slate-950 flex justify-end">
        <button
          @click="$emit('close')"
          class="px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold text-xs transition"
        >
          Đã hiểu, đóng sổ tay
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import MathRenderer from './MathRenderer.vue'

defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

defineEmits(['close'])
</script>
