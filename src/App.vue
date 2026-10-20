<template>
  <div class="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-brand-500/30 selection:text-brand-300">
    <!-- Navbar -->
    <Navbar @open-theory="isTheoryOpen = true" />

    <!-- Main Container -->
    <main class="flex-grow max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-5 sm:space-y-8 min-w-0">
      <!-- Tab điều hướng -->
      <div class="space-y-2 w-full min-w-0">
        <!-- Tab Bar: Hiển thị ĐẦY ĐỦ 4 CÔNG CỤ (Lưới 2x2 trên Mobile, 1 hàng ngang trên Desktop) -->
        <div class="w-full p-1.5 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-inner">
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-1.5 sm:gap-2">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="currentTab = tab.id"
              type="button"
              class="flex items-center gap-2 sm:gap-2.5 p-2 sm:px-4 sm:py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all duration-200 text-left min-w-0"
              :class="currentTab === tab.id 
                ? (tab.id === 'free' 
                    ? 'bg-gradient-to-r from-rose-500 via-pink-600 to-brand-500 text-white shadow-md shadow-rose-500/25 font-bold' 
                    : 'bg-gradient-to-r from-brand-600 to-teal-600 text-white shadow-md shadow-brand-600/25 font-bold') 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 bg-slate-950/40 sm:bg-transparent'"
            >
              <!-- SVG Icon Component theo từng tab -->
              <span class="w-4 h-4 flex-shrink-0" v-html="tab.iconSvg"></span>
              <div class="min-w-0 flex-grow">
                <span class="block leading-tight font-semibold text-xs sm:text-sm truncate">{{ tab.name }}</span>
                <span class="text-[10px] opacity-80 block truncate">{{ tab.grade }}</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      <!-- Active Solver Component -->
      <div class="transition-all duration-300 w-full min-w-0">
        <KeepAlive>
          <component :is="activeComponent" />
        </KeepAlive>
      </div>
    </main>

    <!-- Rich Footer -->
    <Footer
      @select-tab="currentTab = $event"
      @open-theory="isTheoryOpen = true"
    />

    <!-- Modal Sổ tay công thức -->
    <TheoryModal :is-open="isTheoryOpen" @close="isTheoryOpen = false" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import Navbar from './components/Navbar.vue'
import BallDrawingSolver from './components/Solvers/BallDrawingSolver.vue'
import IndependentEventsSolver from './components/Solvers/IndependentEventsSolver.vue'
import BayesTreeSolver from './components/Solvers/BayesTreeSolver.vue'
import FreeProblemSolver from './components/Solvers/FreeProblemSolver.vue'
import TheoryModal from './components/TheoryModal.vue'
import Footer from './components/Footer.vue'

const currentTab = ref('balls')
const isTheoryOpen = ref(false)

const tabs = [
  {
    id: 'balls',
    name: 'Chọn bi & Rút thẻ',
    grade: 'Lớp 10 & 11 (Tổ hợp C_n^k)',
    iconSvg: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="3" stroke-width="2"/><circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/><circle cx="15.5" cy="15.5" r="1.5" fill="currentColor"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/></svg>`
  },
  {
    id: 'independent',
    name: 'Biến cố độc lập',
    grade: 'Lớp 11 (Quy tắc nhân xác suất)',
    iconSvg: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" stroke-width="2"/><circle cx="12" cy="12" r="5" stroke-width="2"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/></svg>`
  },
  {
    id: 'bayes',
    name: 'Bayes & Sơ đồ hình cây',
    grade: 'Lớp 12 (Xác suất toàn phần)',
    iconSvg: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 3v12a3 3 0 003 3h9M6 9h4a3 3 0 013 3v6m6-6a3 3 0 11-6 0 3 3 0 016 0zM9 3a3 3 0 11-6 0 3 3 0 016 0z"/></svg>`
  },
  {
    id: 'free',
    name: 'Giải Đề Tự Do',
    grade: 'AI + Math Engine (Mọi dạng toán)',
    iconSvg: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/></svg>`
  }
]

const activeComponent = computed(() => {
  switch (currentTab.value) {
    case 'balls':
      return BallDrawingSolver
    case 'independent':
      return IndependentEventsSolver
    case 'bayes':
      return BayesTreeSolver
    case 'free':
      return FreeProblemSolver
    default:
      return BallDrawingSolver
  }
})
</script>
