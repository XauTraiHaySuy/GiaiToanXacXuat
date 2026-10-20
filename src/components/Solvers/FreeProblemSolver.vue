<template>
  <div class="space-y-6">
    <!-- Header bài toán -->
    <div class="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div class="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20 mb-2">
            <span class="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse"></span>
            <span>Mọi Dạng Toán THPT • AI Multimodal Vision & OCR</span>
          </div>
          <h2 class="text-2xl font-bold text-white tracking-tight">Giải Đề Xác Suất Tự Do</h2>
          <p class="text-sm text-slate-400 mt-1">
            Chụp ảnh đề thi, dán ảnh màn hình, tải file (.pdf, .docx, .txt) hoặc gõ đề bài. AI chuyên gia sẽ đọc đề, nhận diện công thức KaTeX và giải chi tiết 4 bước chuẩn mực.
          </p>
        </div>

        <!-- Presets Buttons -->
        <div class="flex flex-wrap items-center gap-2">
          <span class="text-xs text-slate-400">Đề mẫu hay gặp:</span>
          <button
            v-for="(preset, idx) in sampleProblems"
            :key="idx"
            @click="applySample(preset)"
            class="px-2.5 py-1 text-xs rounded-lg bg-slate-800 hover:bg-brand-600/30 text-slate-300 hover:text-brand-300 border border-slate-700 transition"
          >
            {{ preset.title }}
          </button>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full min-w-0">
      <!-- Input Panel -->
      <div class="lg:col-span-5 w-full min-w-0 space-y-4">
        <div
          class="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-6 space-y-4 transition-colors"
          :class="{ 'border-rose-500/60 bg-rose-950/20': isDragging }"
          @dragover.prevent="isDragging = true"
          @dragleave.prevent="isDragging = false"
          @drop.prevent="handleDrop"
        >
          <!-- Tiêu đề + Các nút nhập liệu đa phương thức -->
          <div class="flex flex-wrap items-center justify-between gap-2">
            <h3 class="text-base font-semibold text-white flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-rose-400"></span>
              Nội dung đề bài
            </h3>

            <div class="flex items-center gap-1.5">
              <!-- Nút Chụp ảnh đề bài (Webcam / Mobile Camera) -->
              <button
                @click="openCamera"
                type="button"
                class="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/30 transition shadow-sm"
                title="Mở Camera chụp trực tiếp đề thi / trang vở"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Chụp ảnh</span>
              </button>

              <!-- Nút Tải file Ảnh / Tài liệu -->
              <button
                @click="triggerFileUpload"
                type="button"
                class="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-brand-600 text-brand-300 hover:text-white border border-brand-500/30 transition shadow-sm"
                title="Tải ảnh (.png, .jpg, .webp) hoặc tài liệu (.pdf, .docx, .txt)"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                <span>Tải ảnh/file</span>
              </button>

              <!-- Nút xóa nhanh nếu có dữ liệu -->
              <button
                v-if="problemText || attachment"
                @click="clearAllInput"
                type="button"
                class="px-2 py-1 text-xs text-slate-500 hover:text-rose-400 transition"
                title="Xóa đề bài và file đính kèm"
              >
                Xóa hết
              </button>
            </div>
          </div>

          <!-- Hidden File Inputs -->
          <input
            ref="fileInputEl"
            type="file"
            accept="image/png,image/jpeg,image/webp,application/pdf,.docx,.txt"
            class="hidden"
            @change="handleFileInputChange"
          />

          <!-- Textarea đề bài (Hỗ trợ kéo thả & dán Ctrl+V ảnh trực tiếp) -->
          <div class="relative">
            <textarea
              v-model="problemText"
              @paste="handlePaste"
              rows="6"
              class="w-full p-3.5 text-sm rounded-xl bg-slate-950 border text-slate-100 placeholder-slate-500 focus:outline-none resize-y leading-relaxed transition-colors"
              :class="isDragging ? 'border-rose-400 ring-2 ring-rose-400/20' : 'border-slate-700 focus:border-brand-400'"
              placeholder="Dán hoặc gõ đề bài... Hoặc nhấn Ctrl+V để dán nhanh ảnh chụp màn hình từ Zalo / Snipping Tool. Kéo thả file ảnh/PDF vào đây đều được!"
            ></textarea>

            <div class="flex items-center justify-between text-[11px] text-slate-500 mt-1">
              <span class="flex items-center gap-1">
                <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Hỗ trợ Ctrl+V dán ảnh • Kéo thả (.png, .jpg, .pdf, .docx, .txt)
              </span>
              <span>{{ problemText.length }} ký tự</span>
            </div>
          </div>

          <!-- Khu vực xem trước đính kèm (Attachment Preview) -->
          <div v-if="attachment" class="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3 animate-fadeIn">
            <!-- Nếu là ẢNH -->
            <div v-if="attachment.type === 'image'" class="flex items-center gap-3 min-w-0">
              <div
                @click="isLightboxOpen = true"
                class="w-14 h-14 rounded-lg overflow-hidden border border-slate-700 bg-slate-900 flex-shrink-0 cursor-pointer group relative"
                title="Bấm để xem ảnh phóng to"
              >
                <img :src="attachment.previewUrl" :alt="attachment.name" class="w-full h-full object-cover group-hover:opacity-80 transition" />
                <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </div>
              </div>
              <div class="min-w-0">
                <div class="flex items-center gap-1.5">
                  <span class="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    ẢNH ĐỀ BÀI
                  </span>
                  <span class="text-xs font-semibold text-slate-200 truncate">{{ attachment.name }}</span>
                </div>
                <p class="text-[11px] text-slate-400 mt-0.5">{{ attachment.sizeStr }} • Sẵn sàng nhận diện OCR toán</p>
              </div>
            </div>

            <!-- Nếu là PDF -->
            <div v-else-if="attachment.type === 'pdf'" class="flex items-center gap-3 min-w-0">
              <div class="w-12 h-12 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center flex-shrink-0">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div class="min-w-0">
                <div class="flex items-center gap-1.5">
                  <span class="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    FILE PDF
                  </span>
                  <span class="text-xs font-semibold text-slate-200 truncate">{{ attachment.name }}</span>
                </div>
                <p class="text-[11px] text-slate-400 mt-0.5">{{ attachment.sizeStr }} • Gửi trực tiếp cho Gemini đọc đề</p>
              </div>
            </div>

            <!-- Các nút thao tác với đính kèm -->
            <div class="flex items-center gap-1.5 flex-shrink-0">
              <!-- Nút Lật ngang ảnh (nếu chữ bị ngược) -->
              <button
                v-if="attachment.type === 'image'"
                @click="flipAttachmentImage"
                type="button"
                class="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center justify-center transition"
                title="Lật ngang lại bức ảnh này nếu bị ngược chữ"
              >
                <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </button>

              <!-- Nút xóa đính kèm -->
              <button
                @click="removeAttachment"
                type="button"
                class="w-7 h-7 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-slate-700 flex items-center justify-center transition"
                title="Xóa tệp đính kèm này"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Thông báo trích xuất file thành công (nếu có) -->
          <div v-if="fileNotice" class="p-2.5 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-300 text-xs flex items-center justify-between">
            <span class="flex items-center gap-1.5">
              <svg class="w-4 h-4 text-brand-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              {{ fileNotice }}
            </span>
            <button @click="fileNotice = ''" class="text-slate-400 hover:text-white">✕</button>
          </div>

          <!-- Nút bấm giải (Hỗ trợ bấm khi có chữ HOẶC có ảnh/file) -->
          <button
            @click="solveProblem"
            :disabled="isLoading || (!problemText.trim() && !attachment)"
            type="button"
            class="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-rose-500 via-pink-600 to-brand-500 hover:from-rose-400 hover:to-brand-400 text-white font-bold text-sm shadow-lg shadow-rose-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg v-if="!isLoading" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
            <svg v-else class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
            <span>
              {{ isLoading ? 'AI Đang Đọc Đề & Giải Toán...' : (attachment ? 'Giải Chi Tiết Từ Ảnh / Tài Liệu' : 'Giải Chi Tiết Bằng AI') }}
            </span>
          </button>
        </div>

        <!-- Mẹo giải toán xác suất -->
        <div class="bg-slate-900/50 border border-slate-800/70 rounded-2xl p-4 text-xs text-slate-400 space-y-2">
          <div class="font-bold text-slate-300 flex items-center gap-1.5">
            <svg class="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Lưu ý khi chụp hoặc tải đề bài:
          </div>
          <ul class="list-disc list-inside space-y-1 text-slate-400 text-[11px] leading-relaxed">
            <li><strong>Chụp ảnh:</strong> Giữ khung hình thẳng, đủ ánh sáng và rõ nét các số mũ, chỉ số tổ hợp.</li>
            <li><strong>Đề trắc nghiệm:</strong> Hãy chụp kèm 4 đáp án A, B, C, D để AI tự động đối chiếu và chọn phương án đúng.</li>
            <li><strong>Đa định dạng:</strong> Chấp nhận dán ảnh trực tiếp (`Ctrl + V`), file `.pdf`, `.docx` (tự trích xuất text) và file `.txt`.</li>
          </ul>
        </div>
      </div>

      <!-- Solution Output Panel -->
      <div class="lg:col-span-7 w-full min-w-0">
        <!-- Khi đang tải -->
        <div v-if="isLoading" class="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 text-center shadow-xl">
          <div class="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto animate-bounce">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
            </svg>
          </div>

          <div class="space-y-2">
            <h4 class="text-base sm:text-lg font-bold text-white">{{ currentLoadingStep }}</h4>
            <p class="text-xs text-slate-400 max-w-md mx-auto">
              Chuyên gia AI đang phân tích đề bài, nhận diện công thức KaTeX và lập luận chặt chẽ theo Bareme chấm thi THPT...
            </p>
          </div>

          <div class="w-48 h-1.5 bg-slate-800 rounded-full mx-auto overflow-hidden">
            <div class="h-full bg-gradient-to-r from-rose-500 to-brand-400 rounded-full animate-pulse w-3/4"></div>
          </div>
        </div>

        <!-- Khi có lời giải -->
        <div v-else-if="solutionHtml" class="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 space-y-5 sm:space-y-6 shadow-xl relative min-w-0">
          <!-- Top bar: Header & Copy Button -->
          <div class="flex items-center justify-between gap-2 sm:gap-3 border-b border-slate-800 pb-3 sm:pb-4 min-w-0">
            <div class="flex items-center gap-2 sm:gap-2.5 min-w-0">
              <span class="p-1 rounded bg-rose-500/20 text-rose-400 flex-shrink-0">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </span>
              <h3 class="text-sm sm:text-base md:text-lg font-bold text-white truncate sm:whitespace-normal">
                Lời giải chi tiết từ Chuyên gia Toán
              </h3>
            </div>

            <div class="flex-shrink-0">
              <CopySolutionButton :text="rawSolutionText" />
            </div>
          </div>

          <!-- Nội dung lời giải render Markdown + KaTeX -->
          <div
            class="prose prose-invert max-w-none text-slate-200 text-sm leading-relaxed space-y-4 font-normal"
            v-html="solutionHtml"
          ></div>
        </div>

        <!-- Trạng thái lỗi -->
        <div v-else-if="errorMessage" class="bg-rose-950/40 border border-rose-500/40 rounded-2xl p-6 space-y-4">
          <div class="flex items-start gap-3">
            <div class="p-2 rounded-xl bg-rose-500/20 text-rose-400 flex-shrink-0">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
            </div>
            <div class="space-y-2 flex-grow">
              <h4 class="text-base font-bold text-rose-300">Không thể giải bài toán</h4>
              <p class="text-xs text-rose-200/90 leading-relaxed font-mono whitespace-pre-wrap">{{ errorMessage }}</p>
              <div class="pt-2">
                <button
                  @click="solveProblem"
                  type="button"
                  class="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold transition"
                >
                  Thử lại
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Trạng thái chờ / Hướng dẫn ban đầu -->
        <div v-else class="h-full min-h-[420px] bg-slate-900/40 border border-slate-800/80 border-dashed rounded-2xl flex flex-col items-center justify-center p-8 text-center">
          <div class="w-16 h-16 rounded-full bg-slate-800/60 flex items-center justify-center text-slate-500 mb-4">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
          </div>
          <h4 class="text-base font-semibold text-slate-300">Khu vực hiển thị lời giải AI</h4>
          <p class="text-xs text-slate-500 max-w-sm mt-1 leading-relaxed">
            Chụp ảnh đề bài, tải file đề thi hoặc dán nội dung vào ô bên trái, sau đó bấm <strong>"Giải Chi Tiết Bằng AI"</strong> để xem lời giải 4 bước chuẩn KaTeX.
          </p>
        </div>
      </div>
    </div>

    <!-- MODAL CAMERA: Chụp ảnh trực tiếp từ Webcam / Điện thoại -->
    <div
      v-if="isCameraModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn"
    >
      <div class="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl space-y-4 p-5">
        <div class="flex items-center justify-between border-b border-slate-800 pb-3">
          <div class="flex items-center gap-2">
            <div class="w-7 h-7 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 class="text-sm font-bold text-white">Chụp ảnh đề bài trực tiếp</h3>
          </div>
          <button @click="closeCamera" class="text-slate-400 hover:text-white p-1">✕</button>
        </div>

        <!-- Khung video Webcam -->
        <div class="relative rounded-xl overflow-hidden bg-black aspect-video flex items-center justify-center border border-slate-800">
          <video
            ref="videoEl"
            autoplay
            playsinline
            class="w-full h-full object-cover transition-transform duration-200"
            :class="{ '-scale-x-100': isMirrored }"
          ></video>

          <!-- Nút nhanh lật gương trên góc khung video -->
          <button
            @click="toggleMirror"
            type="button"
            class="absolute top-3 right-3 z-10 px-2.5 py-1 rounded-lg bg-black/60 hover:bg-black/80 text-white text-[11px] font-medium border border-white/20 backdrop-blur flex items-center gap-1.5 transition shadow"
            title="Bấm để đảo chiều lật ngang video"
          >
            <svg class="w-3.5 h-3.5 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            <span>{{ isMirrored ? 'Lật gương: BẬT' : 'Lật gương: TẮT' }}</span>
          </button>

          <!-- Khung ngắm chụp ảnh -->
          <div class="absolute inset-4 border-2 border-dashed border-rose-400/50 rounded-lg pointer-events-none flex items-center justify-center">
            <span class="text-[11px] text-white/70 bg-black/50 px-2 py-0.5 rounded">
              Đặt đề bài vào giữa khung ngắm
            </span>
          </div>

          <!-- Lỗi Camera nếu có -->
          <div v-if="cameraError" class="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center p-6 text-center space-y-3">
            <p class="text-rose-400 text-xs font-semibold">{{ cameraError }}</p>
            <button
              @click="triggerFileUpload"
              class="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700"
            >
              Chọn tải ảnh từ máy thay thế
            </button>
          </div>
        </div>

        <!-- Các nút thao tác Camera -->
        <div class="flex flex-wrap items-center justify-between gap-2.5 pt-1">
          <div class="flex items-center gap-2">
            <!-- Nút Đổi Camera -->
            <button
              @click="switchCamera"
              type="button"
              class="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
              title="Chuyển đổi giữa camera trước và camera sau"
            >
              <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Đổi Camera</span>
            </button>

            <!-- Nút Lật ngang (Flip Horizontal) -->
            <button
              @click="toggleMirror"
              type="button"
              class="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition border"
              :class="isMirrored ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 font-bold' : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'"
              title="Đảo chiều lật ngang khung hình trái/phải"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              <span>↔️ Lật ngang</span>
            </button>
          </div>

          <button
            @click="capturePhoto"
            type="button"
            class="flex-1 min-w-[130px] inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30 transition"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="9" stroke-width="2" />
              <circle cx="12" cy="12" r="3" fill="currentColor" />
            </svg>
            <span>Chụp ngay</span>
          </button>

          <button
            @click="closeCamera"
            type="button"
            class="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
          >
            Hủy
          </button>
        </div>
      </div>
    </div>

    <!-- MODAL LIGHTBOX: Xem ảnh đề bài phóng to -->
    <div
      v-if="isLightboxOpen && attachment?.previewUrl"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fadeIn"
      @click="isLightboxOpen = false"
    >
      <div class="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl" @click.stop>
        <button
          @click="isLightboxOpen = false"
          class="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-slate-950/80 hover:bg-rose-600 text-white flex items-center justify-center transition border border-slate-700"
        >
          ✕
        </button>
        <img :src="attachment.previewUrl" :alt="attachment.name" class="w-full max-h-[85vh] object-contain" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { renderMarkdownWithMath } from '../../utils/markdownMath.js'
import CopySolutionButton from '../CopySolutionButton.vue'
import mammoth from 'mammoth'

const problemText = ref('')
const isLoading = ref(false)
const solutionHtml = ref('')
const rawSolutionText = ref('')
const errorMessage = ref('')
const currentLoadingStep = ref('Đang phân tích cấu trúc bài toán...')

// Đa phương thức: Camera, Tải file, Drag & Drop, Paste
const attachment = ref(null) // { type: 'image'|'pdf', mimeType, base64Data, previewUrl, name, sizeStr }
const isDragging = ref(false)
const fileNotice = ref('')
const fileInputEl = ref(null)

// Camera State
const isCameraModalOpen = ref(false)
const isLightboxOpen = ref(false)
const videoEl = ref(null)
const mediaStream = ref(null)
const cameraError = ref('')
const facingMode = ref('environment') // sau (environment) hoặc trước (user)
const isMirrored = ref(true) // Đảo chiều lật ngang camera mặc định theo mong muốn người dùng

const toggleMirror = () => {
  isMirrored.value = !isMirrored.value
}

let stepInterval = null

onMounted(() => {
  // Nạp sẵn đề mẫu đầu tiên
  applySample(sampleProblems[0])
})

onUnmounted(() => {
  stopCameraStream()
})

// Danh sách đề bài mẫu kinh điển từ cơ bản đến vận dụng cao (VDC)
const sampleProblems = [
  {
    title: 'Bàn tròn (VDC)',
    text: 'Có 6 học sinh nam và 4 học sinh nữ được xếp ngẫu nhiên ngồi vào một bàn tròn có 10 ghế. Tính xác suất để không có hai bạn nữ nào ngồi cạnh nhau.'
  },
  {
    title: 'Số tự nhiên (Vận dụng)',
    text: 'Từ các chữ số 0, 1, 2, 3, 4, 5, 6, 7 lập một số tự nhiên có 4 chữ số khác nhau đôi một. Chọn ngẫu nhiên một số được lập. Tính xác suất để số được chọn là số chẵn và luôn có mặt chữ số 0.'
  },
  {
    title: '3 Xúc xắc tổng 11 (Cơ bản)',
    text: 'Gieo đồng thời 3 con xúc xắc cân đối và đồng chất. Tính xác suất để tổng số chấm xuất hiện trên mặt của 3 con xúc xắc bằng 11.'
  },
  {
    title: 'Chia kẹo Euler (VDC)',
    text: 'Có 10 viên kẹo giống nhau chia ngẫu nhiên cho 3 bạn An, Bình và Cường. Tính xác suất để bạn An nhận được ít nhất 3 viên kẹo và mỗi bạn đều nhận được ít nhất 1 viên kẹo.'
  },
  {
    title: 'Bayes & Y tế (Lớp 12)',
    text: 'Một căn bệnh hiểm nghèo có tỉ lệ mắc trong cộng đồng là 0.2%. Một xét nghiệm đặc hiệu có độ chính xác 98% đối với người mang bệnh (dương tính thật) và tỉ lệ dương tính giả là 1% đối với người khỏe mạnh. Một người đi kiểm tra sức khỏe và nhận kết quả xét nghiệm dương tính. Hãy tính xác suất người đó thực sự mắc bệnh.'
  }
]

const applySample = (preset) => {
  problemText.value = preset.text
  attachment.value = null
  solutionHtml.value = ''
  rawSolutionText.value = ''
  errorMessage.value = ''
  fileNotice.value = ''
}

const clearAllInput = () => {
  problemText.value = ''
  attachment.value = null
  fileNotice.value = ''
}

const removeAttachment = () => {
  attachment.value = null
}

const formatBytes = (bytes) => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

// ==========================================
// 1. NÉN ẢNH CLIENT BẰNG CANVAS (Max 1200px)
// ==========================================
const compressImage = (fileOrBlob, maxWidth = 1200, quality = 0.85) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        let width = img.width
        let height = img.height

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width)
          width = maxWidth
        }

        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, width, height)
        ctx.drawImage(img, 0, 0, width, height)

        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality)
        const base64Data = compressedDataUrl.split(',')[1]
        resolve({
          dataUrl: compressedDataUrl,
          base64Data,
          width,
          height
        })
      }
      img.onerror = reject
      img.src = e.target.result
    }
    reader.onerror = reject
    reader.readAsDataURL(fileOrBlob)
  })
}

// ==========================================
// 2. XỬ LÝ TẢI FILE (.PNG, .JPG, .PDF, .DOCX, .TXT)
// ==========================================
const triggerFileUpload = () => {
  if (fileInputEl.value) {
    fileInputEl.value.click()
  }
}

const handleFileInputChange = (e) => {
  const file = e.target.files?.[0]
  if (file) {
    processFile(file)
  }
  // Reset input để có thể chọn lại cùng file
  e.target.value = ''
}

const handleDrop = (e) => {
  isDragging.value = false
  const file = e.dataTransfer?.files?.[0]
  if (file) {
    processFile(file)
  }
}

// Xử lý sự kiện paste (Ctrl + V)
const handlePaste = (e) => {
  const items = e.clipboardData?.items
  if (!items) return

  for (const item of items) {
    if (item.type.startsWith('image/')) {
      const file = item.getAsFile()
      if (file) {
        processImageFile(file, 'anh_dan_clipboard.jpg')
        fileNotice.value = 'Đã nhận diện ảnh chụp màn hình từ bộ nhớ tạm (Ctrl+V)!'
        e.preventDefault()
        return
      }
    }
  }
}

const processImageFile = async (fileOrBlob, filename = 'anh_de_bai.jpg') => {
  try {
    const res = await compressImage(fileOrBlob)
    attachment.value = {
      type: 'image',
      mimeType: 'image/jpeg',
      base64Data: res.base64Data,
      previewUrl: res.dataUrl,
      name: filename,
      sizeStr: `${res.width}x${res.height}px`
    }
  } catch (err) {
    errorMessage.value = `Lỗi đọc ảnh: ${err.message}`
  }
}

const processFile = async (file) => {
  fileNotice.value = ''

  // 1. Nếu là ảnh
  if (file.type.startsWith('image/')) {
    await processImageFile(file, file.name)
    return
  }

  // 2. Nếu là PDF
  if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
    if (file.size > 5 * 1024 * 1024) {
      alert('Vui lòng chọn file PDF dưới 5MB để đảm bảo tốc độ phân tích.')
      return
    }
    const reader = new FileReader()
    reader.onload = (e) => {
      const dataUrl = e.target.result
      attachment.value = {
        type: 'pdf',
        mimeType: 'application/pdf',
        base64Data: dataUrl.split(',')[1],
        name: file.name,
        sizeStr: formatBytes(file.size)
      }
      fileNotice.value = `Đã đính kèm tài liệu PDF: "${file.name}". Gemini sẽ đọc trực tiếp toàn bộ tài liệu!`
    }
    reader.readAsDataURL(file)
    return
  }

  // 3. Nếu là Word (.docx)
  if (file.name.endsWith('.docx')) {
    try {
      const arrayBuffer = await file.arrayBuffer()
      const result = await mammoth.extractRawText({ arrayBuffer })
      const text = result.value.trim()
      if (text) {
        problemText.value = (problemText.value ? problemText.value + '\n\n' : '') + text
        fileNotice.value = `Đã trích xuất thành công ${text.length} ký tự từ file Word "${file.name}" vào đề bài!`
      } else {
        fileNotice.value = `File Word "${file.name}" không chứa văn bản thô.`
      }
    } catch (err) {
      errorMessage.value = `Lỗi đọc file Word: ${err.message}`
    }
    return
  }

  // 4. Nếu là Text (.txt)
  if (file.name.endsWith('.txt') || file.type === 'text/plain') {
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = (e.target.result || '').trim()
      if (text) {
        problemText.value = (problemText.value ? problemText.value + '\n\n' : '') + text
        fileNotice.value = `Đã nhập nội dung từ file text "${file.name}" vào đề bài!`
      }
    }
    reader.readAsText(file)
    return
  }

  alert('Định dạng không được hỗ trợ. Vui lòng chọn ảnh (.png, .jpg, .webp), tài liệu (.pdf, .docx, .txt).')
}

// ==========================================
// 3. CAMERA: WEBCAM & MOBILE CAMERA
// ==========================================
const openCamera = async () => {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    alert('Trình duyệt của bạn không hỗ trợ Camera trực tiếp. Vui lòng dùng nút "Tải ảnh" thay thế.')
    return
  }
  isCameraModalOpen.value = true
  cameraError.value = ''
  await startCameraStream()
}

const startCameraStream = async () => {
  stopCameraStream()
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: facingMode.value,
        width: { ideal: 1920 },
        height: { ideal: 1080 }
      },
      audio: false
    })
    mediaStream.value = stream
    if (videoEl.value) {
      videoEl.value.srcObject = stream
    }
  } catch (err) {
    console.error('Camera stream error:', err)
    cameraError.value = 'Không thể truy cập camera. Vui lòng cấp quyền truy cập Camera trên trình duyệt hoặc dùng tính năng Tải ảnh.'
  }
}

const stopCameraStream = () => {
  if (mediaStream.value) {
    mediaStream.value.getTracks().forEach(track => track.stop())
    mediaStream.value = null
  }
  if (videoEl.value) {
    videoEl.value.srcObject = null
  }
}

const switchCamera = async () => {
  facingMode.value = facingMode.value === 'environment' ? 'user' : 'environment'
  await startCameraStream()
}

const capturePhoto = () => {
  if (!videoEl.value) return
  const video = videoEl.value
  const canvas = document.createElement('canvas')
  const width = video.videoWidth || 1280
  const height = video.videoHeight || 720

  let targetWidth = width
  let targetHeight = height
  if (targetWidth > 1200) {
    targetHeight = Math.round((targetHeight * 1200) / targetWidth)
    targetWidth = 1200
  }

  canvas.width = targetWidth
  canvas.height = targetHeight
  const ctx = canvas.getContext('2d')

  // Đảm bảo bức ảnh chụp ra xuất hiện đúng chiều 100% như người dùng đang nhìn thấy
  if (isMirrored.value) {
    ctx.translate(targetWidth, 0)
    ctx.scale(-1, 1)
  }

  ctx.drawImage(video, 0, 0, targetWidth, targetHeight)

  const dataUrl = canvas.toDataURL('image/jpeg', 0.85)
  attachment.value = {
    type: 'image',
    mimeType: 'image/jpeg',
    base64Data: dataUrl.split(',')[1],
    previewUrl: dataUrl,
    name: 'anh_chup_de_bai.jpg',
    sizeStr: `${targetWidth}x${targetHeight}px`
  }

  fileNotice.value = 'Đã chụp thành công ảnh đề bài! Chữ viết và công thức hiển thị đúng chiều.'
  closeCamera()
}

// Cho phép lật ngang bức ảnh đã đính kèm bất cứ lúc nào nếu cần
const flipAttachmentImage = () => {
  if (!attachment.value || attachment.value.type !== 'image' || !attachment.value.previewUrl) return
  const img = new Image()
  img.onload = () => {
    const canvas = document.createElement('canvas')
    canvas.width = img.width
    canvas.height = img.height
    const ctx = canvas.getContext('2d')
    ctx.translate(img.width, 0)
    ctx.scale(-1, 1)
    ctx.drawImage(img, 0, 0)
    const newUrl = canvas.toDataURL('image/jpeg', 0.85)
    attachment.value.previewUrl = newUrl
    attachment.value.base64Data = newUrl.split(',')[1]
    fileNotice.value = 'Đã đảo chiều lật ngang ảnh đính kèm thành công!'
  }
  img.src = attachment.value.previewUrl
}

const closeCamera = () => {
  stopCameraStream()
  isCameraModalOpen.value = false
  cameraError.value = ''
}

// ==========================================
// 4. GỬI YÊU CẦU GIẢI TOÁN
// ==========================================
const startLoadingSteps = () => {
  const steps = [
    'Đang phân tích đề bài từ văn bản & ảnh OCR...',
    'Nhận diện các công thức KaTeX và đối chiếu câu hỏi...',
    'Xác định phép thử và tính không gian mẫu n(Ω)...',
    'Phân tích biến cố thuận lợi và tính xác suất từng trường hợp...',
    'Rút gọn phân số tối giản và hoàn thiện lời giải chuẩn mực...'
  ]
  let idx = 0
  currentLoadingStep.value = steps[0]
  stepInterval = setInterval(() => {
    idx = (idx + 1) % steps.length
    currentLoadingStep.value = steps[idx]
  }, 2200)
}

const stopLoadingSteps = () => {
  if (stepInterval) {
    clearInterval(stepInterval)
    stepInterval = null
  }
}

const solveProblem = async () => {
  const problem = problemText.value.trim()
  if (!problem && !attachment.value) return

  isLoading.value = true
  errorMessage.value = ''
  solutionHtml.value = ''
  rawSolutionText.value = ''
  startLoadingSteps()

  const localKey = (localStorage.getItem('gemini_api_key') || '').trim()

  try {
    const payload = {
      problem,
      geminiApiKey: localKey || undefined
    }

    if (attachment.value && attachment.value.base64Data) {
      payload.attachment = {
        type: attachment.value.type,
        mimeType: attachment.value.mimeType,
        base64Data: attachment.value.base64Data,
        fileName: attachment.value.name
      }
    }

    // Gửi đến /api/solve (xử lý trên Cloudflare Pages Function hoặc dev proxy)
    const res = await fetch('/api/solve', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(localKey ? { 'x-gemini-key': localKey } : {})
      },
      body: JSON.stringify(payload)
    })

    const data = await res.json()
    if (!res.ok || !data.success) {
      throw new Error(data.error || `Lỗi máy chủ (${res.status})`)
    }

    const resultText = data.solution
    rawSolutionText.value = resultText
    solutionHtml.value = renderMarkdownWithMath(resultText)
  } catch (err) {
    errorMessage.value = err.message
  } finally {
    isLoading.value = false
    stopLoadingSteps()
  }
}
</script>

<style>
/* Style cho nội dung render Markdown KaTeX */
.prose h1, .prose h2, .prose h3, .prose h4 {
  color: #f1f5f9;
  font-weight: 700;
  margin-top: 1.25em;
  margin-bottom: 0.5em;
}
.prose h3 {
  font-size: 1.15rem;
  color: #38bdf8;
}
.prose h4 {
  font-size: 1rem;
  color: #fb7185;
}
.prose p {
  margin-top: 0.6em;
  margin-bottom: 0.6em;
}
.prose ul, .prose ol {
  padding-left: 1.5em;
  margin-top: 0.5em;
  margin-bottom: 0.5em;
}
.prose li {
  margin-top: 0.25em;
  margin-bottom: 0.25em;
}
.prose strong {
  color: #5eead4;
}
.prose blockquote {
  border-left: 3px solid #0d9488;
  padding-left: 1em;
  color: #94a3b8;
  font-style: italic;
}
</style>
