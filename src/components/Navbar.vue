<template>
  <header class="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
    <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4 min-w-0">
      <!-- Logo & Brand -->
      <div class="flex items-center gap-2 sm:gap-3 min-w-0">
        <img
          src="/logoGTXX.png"
          alt="Logo Giải Toán Xác Suất"
          class="w-8 h-8 sm:w-10 sm:h-10 rounded-xl object-contain shadow-lg shadow-brand-500/10 bg-slate-900 border border-slate-800 p-0.5 flex-shrink-0"
        />
        <div class="min-w-0">
          <div class="flex items-center gap-1.5 sm:gap-2">
            <h1 class="text-sm sm:text-base md:text-lg font-black text-white tracking-tight truncate">Giải Toán <span class="text-brand-400">Xác Suất</span></h1>
            <span class="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-brand-500/10 text-brand-400 border border-brand-500/20 flex-shrink-0">
              GDPT 2018
            </span>
          </div>
          <p class="text-[11px] text-slate-400 hidden sm:block truncate">Chuyên Giải & Trình Bày Tự Luận Toán Xác Suất Cấp 3</p>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-2 sm:gap-2.5">
        <!-- Nút mở Sổ tay công thức -->
        <button
          @click="$emit('open-theory')"
          type="button"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-slate-600 transition shadow-sm"
        >
          <svg class="w-4 h-4 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
          </svg>
          <span class="hidden md:inline">Sổ tay công thức</span>
          <span class="md:hidden">Lý thuyết</span>
        </button>

        <!-- Nút chuyển đổi Dark / Light Mode -->
        <button
          @click="toggleTheme"
          type="button"
          class="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-slate-600 transition shadow-sm cursor-pointer"
          :title="isDark ? 'Chuyển sang giao diện Sáng' : 'Chuyển sang giao diện Tối'"
        >
          <!-- Mặt trời khi đang ở Dark Mode (bấm để chuyển Sáng) -->
          <svg v-if="isDark" class="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <!-- Mặt trăng khi đang ở Light Mode (bấm để chuyển Tối) -->
          <svg v-else class="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
          <span class="hidden sm:inline font-medium">{{ isDark ? 'Sáng' : 'Tối' }}</span>
        </button>

        <!-- Cloudflare Pages Badge -->
        <div class="hidden lg:flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium rounded-xl bg-slate-900 border border-slate-800 text-slate-400">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Cloudflare Pages</span>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useTheme } from '../composables/useTheme'

defineEmits(['open-theory'])

const { isDark, toggleTheme } = useTheme()
</script>
