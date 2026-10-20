import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

const SYSTEM_PROMPT = `Bạn là một Giáo viên Chuyên Toán THPT Quốc gia Việt Nam với hơn 15 năm kinh nghiệm.
Nhiệm vụ của bạn là giải chi tiết, chặt chẽ và chuẩn mực các bài toán Xác suất và Đại số tổ hợp (Lớp 10, 11, 12 theo Chương trình GDPT mới: Kết nối tri thức, Chân trời sáng tạo, Cánh diều).

QUY TẮC BẮT BUỘC VỀ TRÌNH BÀY:
1. NẾU CÓ ẢNH HOẶC TÀI LIỆU ĐÍNH KÈM:
   - KIỂM TRA NỘI DUNG ẢNH:
     + Nếu bức ảnh/tài liệu KHÔNG CHỨA BÀI TOÁN XÁC SUẤT HOẶC ĐẠI SỐ TỔ HỢP (ví dụ: ảnh sinh hoạt đời thường, chân dung, đồ vật không có chữ đề bài toán), bạn PHẢI THÔNG BÁO RÕ RÀNG:
       > ⚠️ **Hình ảnh bạn tải lên không chứa đề bài toán Xác suất hay Tổ hợp.**
       > Vui lòng chụp hoặc tải ảnh rõ nét chụp từ sách giáo khoa, đề thi hoặc vở bài tập để được hướng dẫn giải chi tiết nhé!
       TUYỆT ĐỐI KHÔNG TỰ Ý BỊA RA ĐỀ BÀI KHI ẢNH KHÔNG CÓ CÂU HỎI TOÁN HỌC.
   - NẾU ẢNH CÓ CHỨA ĐỀ TOÁN:
     MỤC ĐẦU TIÊN BẮT BUỘC LÀ:
     ### 📌 Đề bài nhận diện được:
     Trích xuất chính xác, nguyên văn toàn bộ đề bài toán từ ảnh/tài liệu, bao gồm cả các phương án trắc nghiệm A, B, C, D (nếu có). Mọi công thức toán học trong đề bài phải được bọc chuẩn KaTeX ($...$).
     Sau đó mới bắt đầu phần Lời giải chi tiết.

2. BÀI GIẢI TỰ LUẬN 4 BƯỚC CHUẨN THPT:
   - **Bước 1: Xác định phép thử và tính số phần tử của không gian mẫu $n(\\Omega)$**
   - **Bước 2: Gọi biến cố $A$ và phân tích phương pháp giải**
   - **Bước 3: Tính số kết quả thuận lợi cho biến cố $n(A)$ (hoặc xác suất thành phần)** (chia các TH1, TH2)
   - **Bước 4: Kết luận xác suất $P(A) = \\frac{n(A)}{n(\\Omega)}$ & Chọn đáp án trắc nghiệm (nếu có)** (rút gọn phân số tối giản và kèm số thập phân).
     Ở dòng "Kết luận" cuối cùng, PHẢI LUÔN ghi rõ giá trị phân số xác suất đặt trong dấu $ (ví dụ: "với xác suất tương ứng là $\\frac{100}{241}$"), tuyệt đối không viết tắt tên biến cố hay viết dính chữ như A1 (bắt buộc viết rõ trong ký hiệu KaTeX là $A_1$, $P(A_1)$ hoặc ghi rõ tên đầy đủ của biến cố).

3. QUY TẮC ĐỊNH DẠNG TOÁN HỌC (KATEX):
   - MỌI biểu thức, ký hiệu toán học PHẢI ĐƯỢC BỌC TRONG ký hiệu $...$ (nội dòng) hoặc $$...$$ (khối).
   - Ví dụ đúng: $n(\\Omega) = C_{12}^4 = 495$, $P(A) = \\frac{3}{14} \\approx 0.2143$.`;

// Plugin dev server xử lý trực tiếp /api/solve ở môi trường localhost
function localDevApiPlugin() {
  return {
    name: 'local-dev-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url === '/api/solve' && req.method === 'POST') {
          let bodyStr = ''
          req.on('data', chunk => { bodyStr += chunk })
          req.on('end', async () => {
            try {
              const body = JSON.parse(bodyStr || '{}')
              const problem = (body.problem || '').trim()
              const attachment = body.attachment || body.image || null

              if (!problem && (!attachment || !attachment.base64Data)) {
                res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' })
                res.end(JSON.stringify({ success: false, error: 'Chưa có nội dung đề bài hoặc ảnh/tài liệu đính kèm.' }))
                return
              }

              const env = loadEnv('development', process.cwd(), '')
              const googleApiKey = env.GEMINI_API_KEY || req.headers['x-gemini-key'] || ''
              const kiraApiKey = env.KIRA_API_KEY || req.headers['x-kira-key'] || ''

              let solution = null
              let engineUsed = ''
              const errors = []

              let promptText = ''
              if (problem && attachment) {
                promptText = `Hãy đọc kỹ tài liệu/ảnh đính kèm kết hợp nội dung bổ sung sau đây để giải chi tiết theo chuẩn 4 bước THPT và KaTeX:\n\n${problem}`
              } else if (problem) {
                promptText = `Hãy giải chi tiết bài toán sau theo đúng 4 bước chuẩn tự luận THPT và KaTeX:\n\n${problem}`
              } else {
                promptText = 'Hãy trích xuất chính xác đề bài từ ảnh/tài liệu đính kèm và giải chi tiết theo đúng 4 bước chuẩn tự luận THPT và KaTeX:'
              }

              // Động cơ 1: Google Official Gemini 3.5-flash-lite Multimodal
              if (googleApiKey) {
                try {
                  const parts = [{ text: promptText }]
                  if (attachment && attachment.base64Data) {
                    parts.push({
                      inline_data: {
                        mime_type: attachment.mimeType || 'image/jpeg',
                        data: attachment.base64Data
                      }
                    })
                  }

                  const gRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${encodeURIComponent(googleApiKey)}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      contents: [{ role: 'user', parts }],
                      system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
                      generationConfig: { temperature: 0.15, maxOutputTokens: 4096 }
                    })
                  })
                  const gData = await gRes.json()
                  if (gRes.ok && gData?.candidates?.[0]?.content?.parts?.[0]?.text) {
                    solution = gData.candidates[0].content.parts[0].text
                    engineUsed = 'Google Gemini Official (3.5-Flash-Lite)'
                  } else {
                    errors.push(`Google API (${gRes.status}): ${gData?.error?.message || 'Lỗi gọi API'}`)
                  }
                } catch (e) {
                  errors.push(`Google Error: ${e.message}`)
                }
              }

              // Động cơ 2: Kira AI (Gemini 4 Argon) Failover
              if (!solution && kiraApiKey) {
                try {
                  let userContent = promptText
                  if (attachment && attachment.base64Data && (attachment.mimeType || '').startsWith('image/')) {
                    userContent = [
                      { type: 'text', text: promptText },
                      {
                        type: 'image_url',
                        image_url: {
                          url: `data:${attachment.mimeType || 'image/jpeg'};base64,${attachment.base64Data}`
                        }
                      }
                    ]
                  }

                  const kRes = await fetch('https://kiraai.vn/api/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${kiraApiKey}`
                    },
                    body: JSON.stringify({
                      model: 'gemini-4-argon',
                      messages: [
                        { role: 'system', content: SYSTEM_PROMPT },
                        { role: 'user', content: userContent }
                      ],
                      temperature: 0.15,
                      max_tokens: 4096
                    })
                  })
                  const kData = await kRes.json()
                  if (kRes.ok && kData?.choices?.[0]?.message?.content) {
                    solution = kData.choices[0].message.content
                    engineUsed = 'Kira AI Gateway (Gemini 4 Argon)'
                  } else {
                    errors.push(`Kira API (${kRes.status}): ${kData?.error?.message || 'Lỗi gọi API'}`)
                  }
                } catch (e) {
                  errors.push(`Kira Error: ${e.message}`)
                }
              }

              if (!solution) {
                res.writeHead(502, { 'Content-Type': 'application/json; charset=utf-8' })
                res.end(JSON.stringify({ success: false, error: errors.join(' | ') }))
                return
              }

              res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' })
              res.end(JSON.stringify({ success: true, solution, engine: engineUsed }))
            } catch (err) {
              res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' })
              res.end(JSON.stringify({ success: false, error: err.message }))
            }
          })
          return
        }
        next()
      })
    }
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), localDevApiPlugin()],
  build: {
    target: 'esnext'
  }
})
