<template>
  <footer class="border-t border-slate-800/80 bg-slate-950/90 backdrop-blur-md mt-12 sm:mt-16 text-slate-400 text-xs">
    <!-- Main Footer Grid -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div class="grid grid-cols-2 md:grid-cols-12 gap-6 sm:gap-8">
        <!-- Cột 1: Thông tin thương hiệu -->
        <div class="col-span-2 md:col-span-6 space-y-3.5">
          <div class="flex items-center gap-3">
            <img
              src="/logoGTXX.png"
              alt="Logo Giải Toán Xác Xuất"
              class="w-10 h-10 rounded-xl object-contain shadow-lg shadow-brand-500/10 bg-slate-900 border border-slate-800 p-0.5 flex-shrink-0"
            />
            <div>
              <div class="flex items-center gap-2">
                <span class="text-base font-black text-white tracking-tight">Giải Toán <span class="text-brand-400">Xác Xuất</span></span>
                <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-brand-500/10 text-brand-400 border border-brand-500/20">
                  GDPT 2018
                </span>
              </div>
              <p class="text-[11px] text-slate-400">Giải Toán Xác Suất THPT Chuyên Sâu</p>
            </div>
          </div>

          <p class="text-slate-400 leading-relaxed text-xs max-w-lg">
            Nền tảng hỗ trợ học sinh và giáo viên giải chi tiết, chuẩn mực từng bước các bài toán Xác suất và Đại số tổ hợp từ cơ bản đến Vận dụng cao (VDC).
          </p>

          <div class="flex flex-wrap gap-1.5 sm:gap-2 pt-1">
            <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-[11px]">
              <svg class="w-3.5 h-3.5 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
              </svg>
              Kết nối tri thức
            </span>
            <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-[11px]">
              <svg class="w-3.5 h-3.5 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
              </svg>
              Cánh diều
            </span>
            <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-[11px]">
              <svg class="w-3.5 h-3.5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
              </svg>
              Chân trời sáng tạo
            </span>
          </div>
        </div>

        <!-- Cột 2: Các công cụ giải toán -->
        <div class="col-span-1 md:col-span-3 space-y-3">
          <h4 class="text-xs sm:text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5 sm:gap-2">
            <span class="w-1.5 h-1.5 rounded-full bg-brand-400"></span>
            Công Cụ Giải Toán
          </h4>
          <ul class="space-y-2 text-xs">
            <li>
              <button
                @click="$emit('select-tab', 'balls')"
                class="hover:text-brand-300 transition-colors flex items-center gap-1.5 sm:gap-2 text-left w-full"
              >
                <!-- SVG Dice Icon -->
                <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect x="3" y="3" width="18" height="18" rx="3" stroke-width="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/>
                  <circle cx="15.5" cy="15.5" r="1.5" fill="currentColor"/>
                  <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
                </svg>
                <span class="truncate">Chọn bi & Rút thẻ</span>
              </button>
            </li>
            <li>
              <button
                @click="$emit('select-tab', 'independent')"
                class="hover:text-brand-300 transition-colors flex items-center gap-1.5 sm:gap-2 text-left w-full"
              >
                <!-- SVG Target Icon -->
                <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="9" stroke-width="2"/>
                  <circle cx="12" cy="12" r="5" stroke-width="2"/>
                  <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
                </svg>
                <span class="truncate">Biến cố độc lập</span>
              </button>
            </li>
            <li>
              <button
                @click="$emit('select-tab', 'bayes')"
                class="hover:text-brand-300 transition-colors flex items-center gap-1.5 sm:gap-2 text-left w-full"
              >
                <!-- SVG Tree Icon -->
                <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 3v12a3 3 0 003 3h9M6 9h4a3 3 0 013 3v6m6-6a3 3 0 11-6 0 3 3 0 016 0zM9 3a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                <span class="truncate">Bayes & Sơ đồ cây</span>
              </button>
            </li>
            <li>
              <button
                @click="$emit('select-tab', 'free')"
                class="hover:text-rose-300 transition-colors flex items-center gap-1.5 sm:gap-2 text-left w-full font-medium text-rose-400"
              >
                <!-- SVG Sparkle Icon -->
                <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/>
                </svg>
                <span class="truncate">Giải Đề Tự Do (AI)</span>
              </button>
            </li>
          </ul>
        </div>

        <!-- Cột 3: Trọng tâm lý thuyết -->
        <div class="col-span-1 md:col-span-3 space-y-3">
          <h4 class="text-xs sm:text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5 sm:gap-2">
            <span class="w-1.5 h-1.5 rounded-full bg-math-blue"></span>
            Lý Thuyết Trọng Tâm
          </h4>
          <ul class="space-y-2 text-xs">
            <li>
              <button
                @click="$emit('open-theory')"
                class="hover:text-slate-200 transition-colors text-left block w-full truncate"
              >
                Hoán vị, Tổ hợp
              </button>
            </li>
            <li>
              <button
                @click="$emit('open-theory')"
                class="hover:text-slate-200 transition-colors text-left block w-full truncate"
              >
                Quy tắc cộng & nhân
              </button>
            </li>
            <li>
              <button
                @click="$emit('open-theory')"
                class="hover:text-slate-200 transition-colors text-left block w-full truncate"
              >
                Biến cố đối & độc lập
              </button>
            </li>
            <li>
              <button
                @click="$emit('open-theory')"
                class="hover:text-slate-200 transition-colors text-left block w-full truncate"
              >
                Xác suất toàn phần & Bayes
              </button>
            </li>
            <li class="pt-1">
              <button
                @click="$emit('open-theory')"
                class="text-brand-400 hover:text-brand-300 font-semibold inline-flex items-center gap-1"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                </svg>
                <span>Mở sổ tay</span>
                <span class="text-xs">&rarr;</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Bottom Copyright Bar -->
    <div class="border-t border-slate-800/80 bg-slate-950 py-3.5 sm:py-4">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-2.5 sm:gap-3 text-slate-400 text-center md:text-left">
        <div class="text-[10.5px] sm:text-[11px]">
          <span>© 2026 <strong>Giải Toán Xác Xuất</strong>. Phần mềm giáo dục phi lợi nhuận hỗ trợ kỳ thi THPT & Đánh giá năng lực.</span>
        </div>
        <!-- Toàn bộ 3 mục hiển thị gọn trên đúng 1 HÀNG DUY NHẤT -->
        <div class="flex flex-nowrap items-center justify-center gap-1.5 min-[390px]:gap-2 sm:gap-3 text-[9px] min-[390px]:text-[10px] sm:text-[11px] text-slate-400 max-w-full overflow-x-auto no-scrollbar whitespace-nowrap py-0.5">
          <span class="flex-shrink-0 font-medium">Chuẩn Bareme Bộ GD&ĐT</span>
          <span class="text-slate-600 flex-shrink-0">•</span>
          <span class="flex-shrink-0 font-medium">Công thức KaTeX</span>
          <span class="text-slate-600 flex-shrink-0">•</span>
          <span class="flex-shrink-0 font-medium">Cloudflare Pages & Functions</span>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
defineEmits(['select-tab', 'open-theory'])
</script>
