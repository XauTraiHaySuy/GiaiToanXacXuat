# Giải Toán Xác Suất - THPT Chuyên Sâu

> Ứng dụng web chuyên giải và hướng dẫn giải chi tiết từng bước các bài toán Xác suất cấp 3 (Lớp 10, 11, 12 theo Chương trình Giáo dục Phổ thông mới - GDPT 2018: Kết nối tri thức, Chân trời sáng tạo, Cánh diều), kết hợp công cụ tính toán chính xác và Trí tuệ nhân tạo (AI Gemini), sẵn sàng triển khai trên Cloudflare Pages & Functions.

---

## 🌟 4 Chế Độ Giải Toán Xác Suất Toàn Diện

### 1. 🎲 Công cụ 1 (Lớp 10 & 11) - Bài toán Chọn bi / Rút thẻ từ hộp
- Tùy biến số lượng các màu bi/thẻ (Đỏ, Xanh, Vàng, có thể thêm/bớt).
- Hỗ trợ các dạng: **Có ít nhất 1 bi màu X** (tự động phân tích bằng **biến cố đối $\bar{A}$**), **Có đúng $x$ bi**, **Có đủ cả 3 màu**, **Cùng một màu**.
- Xuất lời giải 4 bước theo Bareme tự luận chấm thi THPT.

### 2. 🎯 Công cụ 2 (Lớp 11) - Xác suất các Biến Cố Độc Lập
- $n$ đối tượng hoạt động độc lập (xạ thủ bắn bia, động cơ máy bay, học sinh giải toán...).
- Nhập xác suất linh hoạt: số thập phân (`0.8`), phân số (`4/5`) hoặc phần trăm (`80%`).
- Tính toán: **Ít nhất 1 người trúng**, **Tất cả cùng trúng**, **Không ai trúng**, **Có đúng 1 người trúng**.

### 3. 🌲 Công cụ 3 (Lớp 12) - Xác Suất Có Điều Kiện, Toàn Phần & Công Thức Bayes
- Hệ đầy đủ 2 nhóm phân hoạch $\{A_1, A_2\}$ (2 máy sản xuất, người mắc bệnh / khỏe mạnh).
- **Vẽ Sơ đồ hình cây trực quan (SVG Tree Diagram)** thể hiện xác suất trên từng nhánh và nút lá.
- Tính **Công thức xác suất toàn phần**: $P(B) = P(A_1)P(B|A_1) + P(A_2)P(B|A_2)$.
- Tính **Công thức Bayes**: $P(A_1|B) = \frac{P(A_1 \cap B)}{P(B)}$ kèm cảnh báo *Nghịch lý độ chính xác cơ sở (Base Rate Fallacy)*.

### 4. ✨ MỚI: Công cụ 4 - Giải Đề Xác Suất Tự Do (AI + Math Engine)
- Ô nhập đề bài tự do cho mọi bài toán từ cơ bản đến Vận dụng cao (VDC):
  - Bài toán xếp người vào bàn tròn.
  - Bài toán số tự nhiên (chẵn/lẻ, chia hết, chia dư).
  - Bài toán chia kẹo Euler (tổ hợp lặp).
  - Xác suất hình học & Biến cố phụ thuộc.
- Nút nạp nhanh 5 đề thi mẫu kinh điển.
- Hiệu ứng trạng thái phân tích từng bước sống động.
- Render lời giải dạng Markdown kết hợp KaTeX chuẩn xác từng công thức.
- Tự động gọi Backend Serverless `/api/solve` trên Cloudflare Pages hoặc gọi trực tiếp qua API Key Localhost.

---

## 🛠️ Công Nghệ Sử Dụng

- **Frontend**: Vue 3 (Composition API `<script setup>`) + Tailwind CSS (Dark Mode mặc định)
- **Math Rendering**: `KaTeX` với component `<MathRenderer />` và module `markdownMath.js`
- **Math Engine**: Thuật toán Euclid GCD + BigInt combinatorics tính toán phân số tối giản
- **Backend Serverless**: Cloudflare Pages Functions (`/functions/api/solve.js`)
- **Mô hình AI**: Google Gemini API (`gemini-2.5-flash` / `gemini-1.5-flash`)

---

## 🚀 Hướng Dẫn Chạy & Test Localhost

```bash
# 1. Cài đặt các gói phụ thuộc
npm install

# 2. Khởi chạy server phát triển
npm run dev
# Mở trình duyệt tại: http://localhost:5173/

# 3. Để test tính năng "Giải Đề Tự Do" trên Localhost:
# Bấm nút "API Key" ở góc trên bên phải thanh Navbar và dán Gemini API Key của bạn vào.
# (Key được lưu an toàn trong localStorage trên máy bạn, không bị đẩy lên Git).
```

---

## ☁️ Hướng Dẫn Deploy Lên Cloudflare Pages Hoàn Chỉnh

### Bước 1: Đẩy mã nguồn lên GitHub

Mở PowerShell tại thư mục dự án `d:\BaiToanXacXuat` và chạy các lệnh:

```bash
# 1. Kiểm tra trạng thái Git
git status

# 2. Thêm toàn bộ file mới và commit
git add .
git commit -m "feat: complete ProbSolver VN with 4 solvers and Cloudflare Functions"

# 3. Đổi tên nhánh chính thành master (hoặc main)
git branch -M master

# 4. Thêm remote repository GitHub của bạn (thay URL bằng repo của bạn)
git remote add origin https://github.com/TÊN_GITHUB_CỦA_BẠN/probsolver-vn.git

# 5. Đẩy code lên GitHub
git push -u origin master
```

---

### Bước 2: Thao tác trên Trang Quản Trị Cloudflare Dashboard

1. Đăng nhập vào [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. Chọn menu **Workers & Pages** ở cột bên trái $\to$ Bấm nút **Create application** $\to$ Chuyển sang tab **Pages** $\to$ Chọn **Connect to Git**.
3. Chọn tài khoản GitHub của bạn và chọn kho lưu trữ `probsolver-vn` vừa tạo $\to$ Bấm **Begin setup**.
4. Cấu hình các thông số build:
   - **Project name**: `probsolver-vn` (hoặc tên bạn muốn)
   - **Production branch**: `master` (hoặc `main`)
   - **Framework preset**: Chọn `Vite` (hoặc `Vue`)
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
5. **CẤU HÌNH BIẾN MÔI TRƯỜNG CHO AI (QUAN TRỌNG NHẤT)**:
   - Mở rộng mục **Environment variables (advanced)**.
   - Bấm **Add variable**:
     - **Variable name**: `GEMINI_API_KEY`
     - **Value**: Dán mã Gemini API Key của bạn (lấy miễn phí tại [Google AI Studio](https://aistudio.google.com/app/apikey)).
6. Bấm **Save and Deploy**.
7. Đợi khoảng 1 - 2 phút, Cloudflare sẽ tự động:
   - Build ứng dụng Vue 3 vào thư mục `dist/`.
   - Biên dịch thư mục `/functions/api/solve.js` thành Cloudflare Serverless Function.
   - Gắn biến môi trường `env.GEMINI_API_KEY` vào Function.
   - Cấp một đường dẫn miễn phí có HTTPS dạng: `https://probsolver-vn.pages.dev`.

🎉 **Hoàn tất!** Giờ đây ứng dụng web Giải Toán Xác Suất đã chạy trực tiếp trên toàn cầu với tốc độ cao của mạng lưới Cloudflare, giải mượt mà cả 4 dạng toán xác suất cho học sinh và thầy cô.
