<template>
  <div class="space-y-6">
    <!-- Header bài toán -->
    <div class="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div class="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold bg-math-purple/10 text-math-purple border border-math-purple/20 mb-2">
            <span>Toán 12 • Chương trình GDPT mới</span>
          </div>
          <h2 class="text-2xl font-bold text-white tracking-tight">Xác Suất Có Điều Kiện, Toàn Phần & Công Thức Bayes</h2>
          <p class="text-sm text-slate-400 mt-1">
            Mô hình hóa hệ đầy đủ các biến cố <MathRenderer latex="\{A_1, A_2\}" />, công thức xác suất toàn phần <MathRenderer latex="P(B)" />, đảo ngược nguyên nhân - kết quả với công thức Bayes <MathRenderer latex="P(A_i|B)" /> kèm Sơ đồ cây trực quan.
          </p>
        </div>

        <!-- Presets Buttons -->
        <div class="flex flex-wrap items-center gap-2">
          <span class="text-xs text-slate-400">Đề mẫu SGK 12:</span>
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
      <!-- Input Panel -->
      <div class="lg:col-span-5 w-full min-w-0 space-y-4 sm:space-y-5">
        <div class="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-6 space-y-4 sm:space-y-5">
          <!-- 1. Hệ đầy đủ biến cố A1, A2 -->
          <div>
            <h3 class="text-base font-semibold text-white flex items-center gap-2 mb-3">
              <span class="w-2 h-2 rounded-full bg-math-purple"></span>
              1. Phân hoạch không gian mẫu (Hệ đầy đủ)
            </h3>

            <div class="space-y-3">
              <!-- Nhóm A1 -->
              <div class="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold text-math-purple flex items-center gap-1.5">
                    <span class="w-2 h-2 rounded-full bg-math-purple"></span>
                    Biến cố A₁:
                  </span>
                  <input
                    v-model="a1Name"
                    type="text"
                    class="bg-transparent text-xs text-right font-medium text-slate-300 border-b border-transparent focus:border-math-purple focus:outline-none w-48"
                    placeholder="Tên nhóm (VD: Máy I)"
                  />
                </div>
                <div class="flex items-center justify-between text-xs pt-1">
                  <span class="text-slate-400">Xác suất tiên nghiệm <MathRenderer latex="P(A_1)" />:</span>
                  <input
                    v-model="a1ProbInput"
                    @input="handleA1Change"
                    type="text"
                    class="w-24 px-2 py-1 text-center font-mono font-bold text-white rounded-lg bg-slate-950 border border-slate-700 focus:border-math-purple text-xs"
                    placeholder="VD: 0.6"
                  />
                </div>
              </div>

              <!-- Nhóm A2 -->
              <div class="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold text-math-blue flex items-center gap-1.5">
                    <span class="w-2 h-2 rounded-full bg-math-blue"></span>
                    Biến cố A₂:
                  </span>
                  <input
                    v-model="a2Name"
                    type="text"
                    class="bg-transparent text-xs text-right font-medium text-slate-300 border-b border-transparent focus:border-math-blue focus:outline-none w-48"
                    placeholder="Tên nhóm (VD: Máy II)"
                  />
                </div>
                <div class="flex items-center justify-between text-xs pt-1">
                  <span class="text-slate-400">Xác suất tiên nghiệm <MathRenderer latex="P(A_2)" />:</span>
                  <input
                    v-model="a2ProbInput"
                    @input="handleA2Change"
                    type="text"
                    class="w-24 px-2 py-1 text-center font-mono font-bold text-white rounded-lg bg-slate-950 border border-slate-700 focus:border-math-blue text-xs"
                    placeholder="VD: 0.4"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- 2. Biến cố quan sát B -->
          <div class="pt-2">
            <h3 class="text-base font-semibold text-white flex items-center gap-2 mb-3">
              <span class="w-2 h-2 rounded-full bg-math-amber"></span>
              2. Biến cố cần quan sát (B)
            </h3>

            <div class="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-3">
              <div>
                <label class="text-xs text-slate-400 block mb-1">Mô tả biến cố B:</label>
                <input
                  v-model="bName"
                  type="text"
                  class="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs focus:border-math-amber focus:outline-none"
                  placeholder="VD: Sản phẩm bị phế phẩm, hoặc Xét nghiệm dương tính"
                />
              </div>

              <!-- Xác suất có điều kiện -->
              <div class="space-y-2 text-xs pt-1">
                <div class="flex items-center justify-between">
                  <span class="text-slate-300">
                    Khi thuộc <strong class="text-math-purple">{{ a1Name }}</strong>, xảy ra B có XS <MathRenderer latex="P(B|A_1)" />:
                  </span>
                  <input
                    v-model="pBGivenA1Input"
                    type="text"
                    class="w-24 px-2 py-1 text-center font-mono font-bold text-white rounded-lg bg-slate-950 border border-slate-700 focus:border-math-amber"
                    placeholder="VD: 0.05"
                  />
                </div>

                <div class="flex items-center justify-between">
                  <span class="text-slate-300">
                    Khi thuộc <strong class="text-math-blue">{{ a2Name }}</strong>, xảy ra B có XS <MathRenderer latex="P(B|A_2)" />:
                  </span>
                  <input
                    v-model="pBGivenA2Input"
                    type="text"
                    class="w-24 px-2 py-1 text-center font-mono font-bold text-white rounded-lg bg-slate-950 border border-slate-700 focus:border-math-amber"
                    placeholder="VD: 0.02"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- 3. Yêu cầu tính toán -->
          <div>
            <label class="text-xs text-slate-400 block mb-1">Mục tiêu cần tính:</label>
            <select
              v-model="queryTarget"
              class="w-full px-3 py-2 text-sm rounded-xl bg-slate-950 border border-slate-700 text-slate-200 focus:border-brand-400 focus:outline-none"
            >
              <option value="bayes_a1_given_b">Công thức Bayes: Tính P(A₁|B) - Biết xảy ra B, tìm XS thuộc A₁</option>
              <option value="bayes_a2_given_b">Công thức Bayes: Tính P(A₂|B) - Biết xảy ra B, tìm XS thuộc A₂</option>
              <option value="total_prob_b">Công thức toàn phần: Tính P(B) - Xác suất tổng thể của B</option>
              <option value="bayes_a1_given_not_b">Công thức Bayes: Tính P(A₁|B̄) - Biết không xảy ra B, tìm XS thuộc A₁</option>
            </select>
          </div>

          <!-- Nút giải -->
          <button
            @click="calculateSolution"
            type="button"
            class="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-purple-500/20 transition-all flex items-center justify-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
            </svg>
            Giải toàn diện & Vẽ sơ đồ cây
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
                <span class="p-1 rounded bg-purple-500/20 text-purple-400 flex-shrink-0">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path>
                  </svg>
                </span>
                Lời giải tự luận chuẩn THPT
              </h3>
              <p class="text-xs text-slate-400 mt-0.5 hidden sm:block">Xác suất toàn phần và Công thức Bayes theo SGK Lớp 12 mới</p>
            </div>

            <div class="flex-shrink-0">
              <CopySolutionButton :text="plainTextSolution" />
            </div>
          </div>

          <!-- Highlight kết quả mục tiêu -->
          <div class="p-4 rounded-xl bg-gradient-to-br from-purple-950/60 to-slate-950 border border-purple-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span class="text-xs font-semibold text-purple-300 uppercase tracking-wider block">{{ solution.targetLabel }}</span>
              <div class="flex flex-wrap items-baseline gap-2 sm:gap-3 mt-1">
                <span class="text-xl sm:text-2xl font-extrabold text-white">
                  <MathRenderer :latex="solution.mainResultFraction.latex" />
                </span>
                <span class="text-slate-400 text-xs sm:text-sm font-mono">
                  ≈ {{ solution.mainResultFraction.decimalStr }} ({{ solution.mainResultFraction.percentageStr }})
                </span>
              </div>
            </div>

            <div class="text-left sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800/80">
              <span class="text-xs text-slate-400 block">Xác suất toàn phần P(B)</span>
              <span class="text-sm font-mono font-bold text-amber-300 block mt-0.5">
                {{ solution.totalProbBFrac.text }} ({{ solution.totalProbBFrac.percentageStr }})
              </span>
            </div>
          </div>

          <!-- Sơ đồ hình cây trực quan (SVG Tree Diagram) -->
          <div class="bg-slate-950 p-3 sm:p-4 rounded-xl border border-slate-800 space-y-2 w-full min-w-0">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
              <span class="font-bold text-slate-300 flex items-center gap-1.5">
                <svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                </svg>
                Sơ đồ hình cây (Tree Diagram)
              </span>
              <span class="text-slate-400 text-[10px] sm:text-[11px]">Đường nét sáng biểu thị đường đi tạo ra biến cố B</span>
            </div>
            <div class="text-[10px] text-brand-400 sm:hidden flex items-center gap-1 py-0.5">
              <span>👉 Vuốt sang ngang để xem toàn bộ sơ đồ cây</span>
            </div>

            <!-- SVG Tree -->
            <div class="overflow-x-auto py-2 w-full max-w-full no-scrollbar">
              <svg viewBox="0 0 720 320" class="w-full min-w-[540px] h-auto select-none font-sans text-xs">
                <defs>
                  <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#64748b" />
                  </marker>
                  <marker id="arrow-active" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#10b981" />
                  </marker>
                </defs>

                <!-- Gốc không gian mẫu Omega -->
                <circle cx="50" cy="160" r="24" fill="#1e293b" stroke="#3b82f6" stroke-width="2" />
                <text x="50" y="165" text-anchor="middle" fill="#93c5fd" font-weight="bold" font-size="14">Ω</text>

                <!-- Đường đi từ Gốc đến A1 -->
                <path d="M 74 150 Q 140 100 210 90" fill="none" stroke="#a855f7" stroke-width="2.5" />
                <!-- Label trên nhánh A1 -->
                <rect x="110" y="98" width="70" height="20" rx="4" fill="#0f172a" stroke="#a855f7" stroke-width="1" />
                <text x="145" y="112" text-anchor="middle" fill="#d8b4fe" font-size="11" font-weight="bold">
                  {{ solution.a1Frac.text }}
                </text>

                <!-- Đường đi từ Gốc đến A2 -->
                <path d="M 74 170 Q 140 220 210 230" fill="none" stroke="#38bdf8" stroke-width="2.5" />
                <!-- Label trên nhánh A2 -->
                <rect x="110" y="202" width="70" height="20" rx="4" fill="#0f172a" stroke="#38bdf8" stroke-width="1" />
                <text x="145" y="216" text-anchor="middle" fill="#7dd3fc" font-size="11" font-weight="bold">
                  {{ solution.a2Frac.text }}
                </text>

                <!-- Nút A1 -->
                <circle cx="230" cy="90" r="22" fill="#2e1065" stroke="#c084fc" stroke-width="2" />
                <text x="230" y="94" text-anchor="middle" fill="#f3e8ff" font-weight="bold" font-size="12">A₁</text>
                <text x="230" y="60" text-anchor="middle" fill="#c084fc" font-size="11" font-weight="bold">{{ a1Name }}</text>

                <!-- Nút A2 -->
                <circle cx="230" cy="230" r="22" fill="#0c4a6e" stroke="#38bdf8" stroke-width="2" />
                <text x="230" y="234" text-anchor="middle" fill="#e0f2fe" font-weight="bold" font-size="12">A₂</text>
                <text x="230" y="268" text-anchor="middle" fill="#38bdf8" font-size="11" font-weight="bold">{{ a2Name }}</text>

                <!-- Nhánh từ A1 đến B (Tích cực) -->
                <path d="M 252 80 Q 340 40 430 40" fill="none" stroke="#10b981" stroke-width="3" stroke-dasharray="0" />
                <rect x="305" y="32" width="78" height="20" rx="4" fill="#064e3b" stroke="#34d399" stroke-width="1" />
                <text x="344" y="46" text-anchor="middle" fill="#a7f3d0" font-size="11" font-weight="bold">
                  P(B|A₁)={{ solution.pBGivenA1Frac.text }}
                </text>

                <!-- Nhánh từ A1 đến B_ngang -->
                <path d="M 252 95 Q 340 120 430 130" fill="none" stroke="#64748b" stroke-width="1.5" stroke-dasharray="4" />
                <rect x="310" y="105" width="80" height="20" rx="4" fill="#1e293b" stroke="#64748b" stroke-width="1" />
                <text x="350" y="119" text-anchor="middle" fill="#94a3b8" font-size="10">
                  P(B̄|A₁)={{ solution.pNotBGivenA1Frac.text }}
                </text>

                <!-- Nhánh từ A2 đến B (Tích cực) -->
                <path d="M 252 220 Q 340 180 430 180" fill="none" stroke="#10b981" stroke-width="3" />
                <rect x="305" y="172" width="78" height="20" rx="4" fill="#064e3b" stroke="#34d399" stroke-width="1" />
                <text x="344" y="186" text-anchor="middle" fill="#a7f3d0" font-size="11" font-weight="bold">
                  P(B|A₂)={{ solution.pBGivenA2Frac.text }}
                </text>

                <!-- Nhánh từ A2 đến B_ngang -->
                <path d="M 252 240 Q 340 270 430 270" fill="none" stroke="#64748b" stroke-width="1.5" stroke-dasharray="4" />
                <rect x="310" y="250" width="80" height="20" rx="4" fill="#1e293b" stroke="#64748b" stroke-width="1" />
                <text x="350" y="264" text-anchor="middle" fill="#94a3b8" font-size="10">
                  P(B̄|A₂)={{ solution.pNotBGivenA2Frac.text }}
                </text>

                <!-- Nút lá B (nhánh trên A1) -->
                <circle cx="450" cy="40" r="18" fill="#064e3b" stroke="#10b981" stroke-width="2" />
                <text x="450" y="45" text-anchor="middle" fill="#ecfdf5" font-weight="bold" font-size="12">B</text>
                <!-- Kết quả A1 ∩ B -->
                <rect x="480" y="26" width="220" height="28" rx="6" fill="#0f172a" stroke="#10b981" stroke-width="1.5" />
                <text x="490" y="44" fill="#34d399" font-size="11" font-weight="bold">
                  A₁ ∩ B: P = {{ solution.pA1AndBFrac.text }} ({{ solution.pA1AndBFrac.percentageStr }})
                </text>

                <!-- Nút lá B_bar (nhánh A1) -->
                <circle cx="450" cy="130" r="16" fill="#1e293b" stroke="#64748b" stroke-width="1.5" />
                <text x="450" y="135" text-anchor="middle" fill="#cbd5e1" font-size="11">B̄</text>
                <text x="480" y="135" fill="#64748b" font-size="11">
                  A₁ ∩ B̄: P = {{ solution.pA1AndNotBFrac.text }}
                </text>

                <!-- Nút lá B (nhánh dưới A2) -->
                <circle cx="450" cy="180" r="18" fill="#064e3b" stroke="#10b981" stroke-width="2" />
                <text x="450" y="185" text-anchor="middle" fill="#ecfdf5" font-weight="bold" font-size="12">B</text>
                <!-- Kết quả A2 ∩ B -->
                <rect x="480" y="166" width="220" height="28" rx="6" fill="#0f172a" stroke="#10b981" stroke-width="1.5" />
                <text x="490" y="184" fill="#34d399" font-size="11" font-weight="bold">
                  A₂ ∩ B: P = {{ solution.pA2AndBFrac.text }} ({{ solution.pA2AndBFrac.percentageStr }})
                </text>

                <!-- Nút lá B_bar (nhánh A2) -->
                <circle cx="450" cy="270" r="16" fill="#1e293b" stroke="#64748b" stroke-width="1.5" />
                <text x="450" y="275" text-anchor="middle" fill="#cbd5e1" font-size="11">B̄</text>
                <text x="480" y="275" fill="#64748b" font-size="11">
                  A₂ ∩ B̄: P = {{ solution.pA2AndNotBFrac.text }}
                </text>
              </svg>
            </div>
          </div>

          <!-- Bước 1 -->
          <div class="space-y-2">
            <div class="flex items-center gap-2 text-sm font-bold text-purple-400">
              <span class="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-xs">1</span>
              <span>Bước 1: Xác định hệ đầy đủ các biến cố và các xác suất ban đầu</span>
            </div>
            <div class="pl-8 text-sm text-slate-300 space-y-2">
              <p>
                Gọi <MathRenderer latex="A_1" /> là biến cố đối tượng thuộc nhóm: <strong class="text-white">"{{ a1Name }}"</strong>.
                <br/>
                Gọi <MathRenderer latex="A_2" /> là biến cố đối tượng thuộc nhóm: <strong class="text-white">"{{ a2Name }}"</strong>.
              </p>
              <div class="p-3 rounded-lg bg-slate-950/80 border border-slate-800/80 text-xs space-y-1">
                <p>Do <MathRenderer latex="A_1 \cap A_2 = \emptyset" /> và <MathRenderer latex="A_1 \cup A_2 = \Omega" /> nên <MathRenderer latex="\{A_1, A_2\}" /> lập thành một <strong>hệ đầy đủ các biến cố</strong>.</p>
                <div class="flex items-center gap-6 pt-1 text-slate-300">
                  <span><MathRenderer :latex="`P(A_1) = ${solution.a1Frac.latex}`" /></span>
                  <span><MathRenderer :latex="`P(A_2) = ${solution.a2Frac.latex}`" /></span>
                </div>
              </div>
              <p class="pt-1">
                Gọi <MathRenderer latex="B" /> là biến cố quan sát: <strong class="text-white">"{{ bName }}"</strong>.
                <br/>
                Theo đề bài, các xác suất có điều kiện là:
              </p>
              <div class="p-3 rounded-lg bg-slate-950/80 border border-slate-800/80 text-xs flex flex-wrap gap-6 text-slate-300">
                <span><MathRenderer :latex="`P(B|A_1) = ${solution.pBGivenA1Frac.latex}`" /></span>
                <span><MathRenderer :latex="`P(B|A_2) = ${solution.pBGivenA2Frac.latex}`" /></span>
              </div>
            </div>
          </div>

          <!-- Bước 2 -->
          <div class="space-y-2">
            <div class="flex items-center gap-2 text-sm font-bold text-purple-400">
              <span class="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-xs">2</span>
              <span>Bước 2: Áp dụng công thức xác suất toàn phần để tính P(B)</span>
            </div>
            <div class="pl-8 text-sm text-slate-300 space-y-2">
              <p class="text-sm">
                Theo công thức xác suất toàn phần đối với hệ đầy đủ <MathRenderer latex="\{A_1, A_2\}" />:
              </p>
              <div class="p-3 rounded-lg bg-slate-950/80 border border-slate-800/80">
                <MathRenderer :latex="solution.step2Latex" :display-mode="true" />
              </div>
              <p class="text-xs text-slate-400">
                Ý nghĩa: Xác suất ngẫu nhiên để xảy ra biến cố B trong toàn bộ quần thể là <strong class="text-amber-300">{{ solution.totalProbBFrac.text }}</strong> (tương đương <strong class="text-amber-300">{{ solution.totalProbBFrac.percentageStr }}</strong>).
              </p>
            </div>
          </div>

          <!-- Bước 3 -->
          <div class="space-y-2">
            <div class="flex items-center gap-2 text-sm font-bold text-purple-400">
              <span class="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-xs">3</span>
              <span>Bước 3: Áp dụng công thức Bayes để tính xác suất hậu nghiệm</span>
            </div>
            <div class="pl-8 text-sm text-slate-300 space-y-2">
              <p class="text-sm">
                Biết rằng biến cố <MathRenderer latex="B" /> đã xảy ra, xác suất để nguyên nhân xuất phát từ <strong class="text-white">{{ solution.targetGroupDesc }}</strong> được tính theo công thức Bayes:
              </p>
              <div class="p-3 rounded-lg bg-slate-950/80 border border-slate-800/80">
                <MathRenderer :latex="solution.step3Latex" :display-mode="true" />
              </div>
            </div>
          </div>

          <!-- Bước 4 -->
          <div class="space-y-2">
            <div class="flex items-center gap-2 text-sm font-bold text-purple-400">
              <span class="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-xs">4</span>
              <span>Bước 4: Kết luận & Biện luận thực tiễn</span>
            </div>
            <div class="pl-8 text-sm text-slate-300 space-y-2">
              <div class="p-3 rounded-lg bg-slate-950/80 border border-slate-800/80">
                <MathRenderer :latex="solution.step4Latex" :display-mode="true" />
              </div>
              <div v-if="solution.insightComment" class="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-200/90 text-xs leading-relaxed">
                <span class="font-bold text-emerald-300">Biện luận kết quả:</span>
                <span v-html="solution.insightComment"></span>
              </div>
            </div>
          </div>

          <!-- Câu hỏi trắc nghiệm tương tự chuẩn THPT -->
          <div class="pt-2">
            <SimilarQuizCard
              :problem-title="`Hệ đầy đủ gồm {A₁: '${a1Name}', A₂: '${a2Name}'} với P(A₁) = ${solution.a1Frac.text}, P(A₂) = ${solution.a2Frac.text}. Biến cố B: '${bName}'.`"
              :question-prompt="`Tính ${solution.targetLabel.toLowerCase()}.`"
              :correct-fraction="solution.probFraction"
              problem-type="bayes"
            />
          </div>
        </div>

        <div v-else class="h-full min-h-[380px] bg-slate-900/40 border border-slate-800/80 border-dashed rounded-2xl flex flex-col items-center justify-center p-8 text-center">
          <div class="w-16 h-16 rounded-full bg-slate-800/60 flex items-center justify-center text-slate-500 mb-4">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
          </div>
          <h4 class="text-base font-semibold text-slate-300">Chưa có kết quả</h4>
          <p class="text-xs text-slate-500 max-w-sm mt-1">
            Vui lòng nhập các xác suất phân hoạch và xác suất điều kiện ở cột bên trái rồi bấm "Giải toàn diện & Vẽ sơ đồ cây".
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import MathRenderer from '../MathRenderer.vue'
import CopySolutionButton from '../CopySolutionButton.vue'
import SimilarQuizCard from '../SimilarQuizCard.vue'
import { parseProbInput, simplifyFraction, multiplyFractions, addFractions } from '../../utils/math.js'

const a1Name = ref('Sản phẩm do Máy I sản xuất')
const a2Name = ref('Sản phẩm do Máy II sản xuất')
const a1ProbInput = ref('0.6')
const a2ProbInput = ref('0.4')

const bName = ref('Sản phẩm là phế phẩm')
const pBGivenA1Input = ref('0.02')
const pBGivenA2Input = ref('0.03')

const queryTarget = ref('bayes_a1_given_b')
const solution = ref(null)

const handleA1Change = () => {
  const p1 = parseFloat(a1ProbInput.value)
  if (!isNaN(p1) && p1 >= 0 && p1 <= 1) {
    const p2 = Math.round((1 - p1) * 10000) / 10000
    a2ProbInput.value = p2.toString()
  }
}

const handleA2Change = () => {
  const p2 = parseFloat(a2ProbInput.value)
  if (!isNaN(p2) && p2 >= 0 && p2 <= 1) {
    const p1 = Math.round((1 - p2) * 10000) / 10000
    a1ProbInput.value = p1.toString()
  }
}

const presets = [
  {
    name: 'Đề 1: Xét nghiệm bệnh lạ (Độ nhạy & độ đặc hiệu)',
    a1Name: 'Người thực sự mắc bệnh',
    a2Name: 'Người bình thường (không bệnh)',
    a1ProbInput: '0.01',
    a2ProbInput: '0.99',
    bName: 'Kết quả xét nghiệm Dương tính',
    pBGivenA1Input: '0.95',
    pBGivenA2Input: '0.02',
    queryTarget: 'bayes_a1_given_b'
  },
  {
    name: 'Đề 2: Lô hàng từ 2 Máy (60% và 40%)',
    a1Name: 'Sản phẩm Máy I',
    a2Name: 'Sản phẩm Máy II',
    a1ProbInput: '0.6',
    a2ProbInput: '0.4',
    bName: 'Sản phẩm bị lỗi / phế phẩm',
    pBGivenA1Input: '0.02',
    pBGivenA2Input: '0.03',
    queryTarget: 'bayes_a1_given_b'
  },
  {
    name: 'Đề 3: Hai phân xưởng may (70% và 30%)',
    a1Name: 'Áo do Xưởng 1 may',
    a2Name: 'Áo do Xưởng 2 may',
    a1ProbInput: '0.7',
    a2ProbInput: '0.3',
    bName: 'Áo đạt tiêu chuẩn xuất khẩu',
    pBGivenA1Input: '0.9',
    pBGivenA2Input: '0.8',
    queryTarget: 'total_prob_b'
  }
]

const applyPreset = (preset) => {
  a1Name.value = preset.a1Name
  a2Name.value = preset.a2Name
  a1ProbInput.value = preset.a1ProbInput
  a2ProbInput.value = preset.a2ProbInput
  bName.value = preset.bName
  pBGivenA1Input.value = preset.pBGivenA1Input
  pBGivenA2Input.value = preset.pBGivenA2Input
  queryTarget.value = preset.queryTarget
  calculateSolution()
}

const calculateSolution = () => {
  const a1Frac = parseProbInput(a1ProbInput.value)
  const a2Frac = parseProbInput(a2ProbInput.value)
  const pBGivenA1Frac = parseProbInput(pBGivenA1Input.value)
  const pBGivenA2Frac = parseProbInput(pBGivenA2Input.value)

  if (!a1Frac || !a2Frac || !pBGivenA1Frac || !pBGivenA2Frac) {
    alert('Vui lòng kiểm tra các giá trị xác suất. Phải là số hợp lệ từ 0 đến 1!')
    return
  }

  // P(B_bar | A1) = 1 - P(B | A1)
  const pNotBGivenA1Frac = simplifyFraction(pBGivenA1Frac.den - pBGivenA1Frac.num, pBGivenA1Frac.den)
  const pNotBGivenA2Frac = simplifyFraction(pBGivenA2Frac.den - pBGivenA2Frac.num, pBGivenA2Frac.den)

  // Nhánh 1: P(A1 ∩ B) = P(A1) * P(B | A1)
  const pA1AndBFrac = multiplyFractions(a1Frac, pBGivenA1Frac)
  // Nhánh 2: P(A1 ∩ B_bar) = P(A1) * P(B_bar | A1)
  const pA1AndNotBFrac = multiplyFractions(a1Frac, pNotBGivenA1Frac)

  // Nhánh 3: P(A2 ∩ B) = P(A2) * P(B | A2)
  const pA2AndBFrac = multiplyFractions(a2Frac, pBGivenA2Frac)
  // Nhánh 4: P(A2 ∩ B_bar) = P(A2) * P(B_bar | A2)
  const pA2AndNotBFrac = multiplyFractions(a2Frac, pNotBGivenA2Frac)

  // Công thức xác suất toàn phần: P(B) = P(A1 ∩ B) + P(A2 ∩ B)
  const totalProbBFrac = addFractions(pA1AndBFrac, pA2AndBFrac)
  const totalProbNotBFrac = simplifyFraction(totalProbBFrac.den - totalProbBFrac.num, totalProbBFrac.den)

  // Bước 2 LaTeX
  const step2Latex = `P(B) = P(A_1) \\cdot P(B|A_1) + P(A_2) \\cdot P(B|A_2) = (${a1Frac.latex} \\times ${pBGivenA1Frac.latex}) + (${a2Frac.latex} \\times ${pBGivenA2Frac.latex}) = ${pA1AndBFrac.latex} + ${pA2AndBFrac.latex} = ${totalProbBFrac.latex} \\approx ${totalProbBFrac.decimalStr}`

  let targetLabel = ''
  let targetGroupDesc = ''
  let mainResultFraction = null
  let step3Latex = ''
  let step4Latex = ''
  let insightComment = ''

  if (queryTarget.value === 'bayes_a1_given_b') {
    targetLabel = 'Xác suất Bayes: P(A₁ | B)'
    targetGroupDesc = `Nhóm A₁ (${a1Name.value})`
    // P(A1 | B) = P(A1 ∩ B) / P(B)
    // (num1/den1) / (numB/denB) = (num1 * denB) / (den1 * numB)
    const top = pA1AndBFrac.num * totalProbBFrac.den
    const bottom = pA1AndBFrac.den * totalProbBFrac.num
    mainResultFraction = simplifyFraction(top, bottom)

    step3Latex = `P(A_1|B) = \\frac{P(A_1) \\cdot P(B|A_1)}{P(B)} = \\frac{${pA1AndBFrac.latex}}{${totalProbBFrac.latex}} = ${mainResultFraction.latex} \\approx ${mainResultFraction.decimalStr}`
    step4Latex = `P(A_1|B) = ${mainResultFraction.latex} \\approx ${mainResultFraction.decimalStr} \\text{ (${mainResultFraction.percentageStr})}`

    if (a1Frac.value <= 0.05) {
      insightComment = `Mặc dù độ chính xác của kiểm tra rất cao (${pBGivenA1Frac.percentageStr}), nhưng vì tỉ lệ nhóm A₁ trong thực tế rất nhỏ (${a1Frac.percentageStr}) nên xác suất thật sự thuộc A₁ khi nhận được tín hiệu B chỉ là <strong>${mainResultFraction.percentageStr}</strong>. Đây là hiện tượng <em>Nghịch lý độ chính xác cơ sở (Base Rate Fallacy)</em> rất phổ biến trong y học và sàng lọc dữ liệu!`
    }
  }
  else if (queryTarget.value === 'bayes_a2_given_b') {
    targetLabel = 'Xác suất Bayes: P(A₂ | B)'
    targetGroupDesc = `Nhóm A₂ (${a2Name.value})`
    const top = pA2AndBFrac.num * totalProbBFrac.den
    const bottom = pA2AndBFrac.den * totalProbBFrac.num
    mainResultFraction = simplifyFraction(top, bottom)

    step3Latex = `P(A_2|B) = \\frac{P(A_2) \\cdot P(B|A_2)}{P(B)} = \\frac{${pA2AndBFrac.latex}}{${totalProbBFrac.latex}} = ${mainResultFraction.latex} \\approx ${mainResultFraction.decimalStr}`
    step4Latex = `P(A_2|B) = ${mainResultFraction.latex} \\approx ${mainResultFraction.decimalStr} \\text{ (${mainResultFraction.percentageStr})}`
  }
  else if (queryTarget.value === 'total_prob_b') {
    targetLabel = 'Xác suất toàn phần: P(B)'
    targetGroupDesc = `Biến cố B (${bName.value})`
    mainResultFraction = totalProbBFrac
    step3Latex = `P(B) = ${totalProbBFrac.latex} \\approx ${totalProbBFrac.decimalStr}`
    step4Latex = `P(B) = ${totalProbBFrac.latex} \\approx ${totalProbBFrac.decimalStr} \\text{ (${totalProbBFrac.percentageStr})}`
  }
  else if (queryTarget.value === 'bayes_a1_given_not_b') {
    targetLabel = 'Xác suất Bayes: P(A₁ | B̄)'
    targetGroupDesc = `Nhóm A₁ (${a1Name.value}) khi B KHÔNG xảy ra`
    const top = pA1AndNotBFrac.num * totalProbNotBFrac.den
    const bottom = pA1AndNotBFrac.den * totalProbNotBFrac.num
    mainResultFraction = simplifyFraction(top, bottom)

    step3Latex = `P(A_1|\\bar{B}) = \\frac{P(A_1) \\cdot P(\\bar{B}|A_1)}{P(\\bar{B})} = \\frac{${pA1AndNotBFrac.latex}}{${totalProbNotBFrac.latex}} = ${mainResultFraction.latex} \\approx ${mainResultFraction.decimalStr}`
    step4Latex = `P(A_1|\\bar{B}) = ${mainResultFraction.latex} \\approx ${mainResultFraction.decimalStr} \\text{ (${mainResultFraction.percentageStr})}`
  }

  solution.value = {
    a1Frac,
    a2Frac,
    pBGivenA1Frac,
    pBGivenA2Frac,
    pNotBGivenA1Frac,
    pNotBGivenA2Frac,
    pA1AndBFrac,
    pA1AndNotBFrac,
    pA2AndBFrac,
    pA2AndNotBFrac,
    totalProbBFrac,
    totalProbNotBFrac,
    step2Latex,
    targetLabel,
    targetGroupDesc,
    mainResultFraction,
    step3Latex,
    step4Latex,
    insightComment
  }
}

const plainTextSolution = computed(() => {
  if (!solution.value) return ''
  const s = solution.value
  return `=== LỜI GIẢI TOÁN XÁC SUẤT TOÀN PHẦN & BAYES (GIẢI TOÁN XÁC SUẤT) ===
Bài toán: Phân hoạch không gian mẫu gồm {A1: "${a1Name.value}", A2: "${a2Name.value}"}.
Biến cố quan sát B: "${bName.value}".

BƯỚC 1: XÁC ĐỊNH HỆ ĐẦY ĐỦ CÁC BIẾN CỐ
- P(A1) = ${s.a1Frac.text} (${s.a1Frac.decimalStr})
- P(A2) = ${s.a2Frac.text} (${s.a2Frac.decimalStr})
- P(B|A1) = ${s.pBGivenA1Frac.text} (${s.pBGivenA1Frac.decimalStr})
- P(B|A2) = ${s.pBGivenA2Frac.text} (${s.pBGivenA2Frac.decimalStr})

BƯỚC 2: TÍNH XÁC SUẤT TOÀN PHẦN P(B)
P(B) = P(A1).P(B|A1) + P(A2).P(B|A2) = ${s.totalProbBFrac.text} ≈ ${s.totalProbBFrac.decimalStr} (${s.totalProbBFrac.percentageStr}).

BƯỚC 3 & 4: ÁP DỤNG CÔNG THỨC BAYES
${s.targetLabel}:
Kết quả = ${s.mainResultFraction.text} ≈ ${s.mainResultFraction.decimalStr} (${s.mainResultFraction.percentageStr}).`
})

onMounted(() => {
  calculateSolution()
})
</script>
