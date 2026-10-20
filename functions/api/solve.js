/**
 * Cloudflare Pages Function: /api/solve
 * Hỗ trợ Cơ chế Dual-Engine (Google Official Gemini + Kira AI)
 * Hỗ trợ Đa phương thức (Multimodal): Chụp ảnh, Tải/Dán ảnh (.png, .jpg, .webp) và Đọc tài liệu (.pdf)
 */

const SYSTEM_PROMPT = `Bạn là một Giáo viên Chuyên Toán THPT Quốc gia Việt Nam với hơn 15 năm kinh nghiệm luyện thi học sinh giỏi và thi tốt nghiệp.
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
   - **Bước 1: Xác định phép thử và tính số phần tử của không gian mẫu $n(\\Omega)$**:
     Nêu rõ phép thử là gì, công thức tính số phần tử $n(\\Omega)$ (dùng quy tắc đếm, hoán vị $P_n$, chỉnh hợp $A_n^k$, tổ hợp $C_n^k$).
   - **Bước 2: Gọi biến cố $A$ và phân tích phương pháp giải**:
     Định nghĩa rõ biến cố $A$: "...". Nêu rõ giải bằng phương pháp trực tiếp (chia trường hợp), quy tắc nhân/cộng, hay dùng biến cố đối $\\bar{A}$. Giải thích lý do chọn phương pháp (đặc biệt khi bài toán có từ khóa "có ít nhất", "có nhiều nhất").
   - **Bước 3: Tính số kết quả thuận lợi cho biến cố $n(A)$ (hoặc xác suất thành phần)**:
     Nếu chia trường hợp, hãy đánh số rõ: Trường hợp 1 (TH1), Trường hợp 2 (TH2)... Viết rõ công thức tổ hợp của từng trường hợp (ví dụ: $C_5^2 \\times C_4^1$) và tính toán số cách của từng trường hợp trước khi cộng lại.
   - **Bước 4: Kết luận xác suất $P(A)$ & Chọn đáp án trắc nghiệm (nếu có)**:
     Áp dụng công thức $P(A) = \\frac{n(A)}{n(\\Omega)}$. Viết đầy đủ phân số ban đầu, rút gọn phân số tối giản (bằng cách chia cho ƯCLN - GCD), và viết thêm xấp xỉ số thập phân / phần trăm.
     Ở dòng "Kết luận" cuối cùng, PHẢI LUÔN ghi rõ giá trị phân số xác suất đặt trong dấu $ (ví dụ: "với xác suất tương ứng là $\\frac{100}{241}$"), tuyệt đối không viết tắt tên biến cố hay viết dính chữ như A1 (bắt buộc viết rõ trong ký hiệu KaTeX là $A_1$, $P(A_1)$ hoặc ghi rõ tên đầy đủ của biến cố).
     Nếu đề bài là trắc nghiệm có các lựa chọn A, B, C, D, hãy kết luận rõ ràng: **=> Chọn đáp án [A/B/C/D]**.

3. QUY TẮC ĐỊNH DẠNG TOÁN HỌC (KATEX):
   - MỌI biểu thức, ký hiệu toán học, biến số, phân số, số tổ hợp PHẢI ĐƯỢC BỌC TRONG ký hiệu $...$ (toán nội dòng) hoặc $$...$$ (toán khối độc lập).
   - Ví dụ đúng: $n(\\Omega) = C_{12}^4 = 495$, $P(A) = \\frac{3}{14} \\approx 0.2143$.
   - Ký hiệu tổ hợp, chỉnh hợp: dùng $C_n^k$ hoặc $C_{n}^{k}$, $A_n^k$, $P_n$.
   - Không được để công thức toán trần trụi ngoài dấu $.

4. QUY TẮC CHÍNH XÁC VỀ TÍNH TOÁN:
   - Hãy tính toán cẩn thận từng bước, kiểm tra lại phép nhân và phép cộng.
   - Phân số kết quả phải được rút gọn tối giản nhất có thể.
   - Nếu bài toán là dạng Vận dụng cao (VDC) như: Xếp người vào bàn tròn, Bài toán chia kẹo Euler, Biến cố phụ thuộc, Xác suất hình học, Công thức Bayes nâng cao, hãy giải thích cặn kẽ bản chất toán học giúp học sinh hiểu sâu.`;

export async function onRequestPost({ request, env }) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, x-gemini-key, x-kira-key',
    'Content-Type': 'application/json; charset=utf-8',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'SAMEORIGIN',
    'Referrer-Policy': 'strict-origin-when-cross-origin'
  };

  try {
    // 1. Kiểm tra giới hạn dung lượng request (Tối đa 15MB để tránh tấn công làm tràn bộ nhớ DoS)
    const contentLength = parseInt(request.headers.get('content-length') || '0', 10);
    if (contentLength > 15 * 1024 * 1024) {
      return new Response(
        JSON.stringify({ success: false, error: 'Dung lượng yêu cầu vượt quá giới hạn cho phép (tối đa 15MB).' }),
        { status: 413, headers: corsHeaders }
      );
    }

    const body = await request.json().catch(() => ({}));
    const problem = (body.problem || '').trim();
    const attachment = body.attachment || body.image || null;

    // 2. Giới hạn độ dài đề bài nhập tay (tối đa 20.000 ký tự)
    if (problem.length > 20000) {
      return new Response(
        JSON.stringify({ success: false, error: 'Đề bài quá dài. Vui lòng rút gọn dưới 20.000 ký tự.' }),
        { status: 400, headers: corsHeaders }
      );
    }

    if (!problem && (!attachment || !attachment.base64Data)) {
      return new Response(
        JSON.stringify({ success: false, error: 'Vui lòng nhập nội dung đề bài hoặc đính kèm ảnh / tài liệu đề thi.' }),
        { status: 400, headers: corsHeaders }
      );
    }

    // 3. Kiểm định định dạng tệp đính kèm (Whitelist MIME Types)
    if (attachment && attachment.base64Data) {
      const allowedMimes = [
        'image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif',
        'application/pdf', 'text/plain',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      if (attachment.mimeType && !allowedMimes.includes(attachment.mimeType.toLowerCase())) {
        return new Response(
          JSON.stringify({ success: false, error: 'Định dạng tệp không được hỗ trợ vì lý do an toàn.' }),
          { status: 400, headers: corsHeaders }
        );
      }
      // Giới hạn chuỗi base64 tối đa khoảng 16MB ký tự
      if (typeof attachment.base64Data !== 'string' || attachment.base64Data.length > 16 * 1024 * 1024) {
        return new Response(
          JSON.stringify({ success: false, error: 'Dữ liệu tệp đính kèm vượt quá kích thước cho phép.' }),
          { status: 413, headers: corsHeaders }
        );
      }
    }

    // Lấy API keys từ biến môi trường Cloudflare hoặc headers/body
    const googleApiKey = env.GEMINI_API_KEY || request.headers.get('x-gemini-key') || body.geminiApiKey || '';
    const kiraApiKey = env.KIRA_API_KEY || request.headers.get('x-kira-key') || body.kiraApiKey || '';

    // Hàm ẩn/che giấu secret trong thông báo lỗi để tránh rò rỉ
    const maskSecrets = (msg) => {
      if (!msg) return '';
      let safe = String(msg);
      if (googleApiKey && googleApiKey.length > 6) {
        safe = safe.replaceAll(googleApiKey, '***GOOGLE_KEY***');
      }
      if (kiraApiKey && kiraApiKey.length > 6) {
        safe = safe.replaceAll(kiraApiKey, '***KIRA_KEY***');
      }
      return safe;
    };

    let solution = null;
    let engineUsed = '';
    const errors = [];

    // Chuẩn bị nội dung prompt
    let promptText = '';
    if (problem && attachment) {
      promptText = `Hãy đọc kỹ tài liệu/ảnh đính kèm kết hợp nội dung bổ sung sau đây để giải chi tiết theo chuẩn 4 bước THPT và KaTeX:\n\n${problem}`;
    } else if (problem) {
      promptText = `Hãy giải chi tiết bài toán sau theo đúng 4 bước chuẩn tự luận THPT và KaTeX:\n\n${problem}`;
    } else {
      promptText = 'Hãy trích xuất chính xác đề bài từ ảnh/tài liệu đính kèm và giải chi tiết theo đúng 4 bước chuẩn tự luận THPT và KaTeX:';
    }

    // --- ĐỘNG CƠ 1: Google Gemini Official (Mô hình gemini-3.5-flash-lite Multimodal) ---
    // Sử dụng x-goog-api-key trong HTTP Header thay vì đưa key lên URL query params (Bảo mật tối đa)
    if (googleApiKey) {
      try {
        const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent';
        
        const parts = [{ text: promptText }];
        if (attachment && attachment.base64Data) {
          parts.push({
            inline_data: {
              mime_type: attachment.mimeType || 'image/jpeg',
              data: attachment.base64Data
            }
          });
        }

        const res = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': googleApiKey
          },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts
              }
            ],
            system_instruction: {
              parts: [{ text: SYSTEM_PROMPT }]
            },
            generationConfig: {
              temperature: 0.15,
              topP: 0.95,
              maxOutputTokens: 4096
            }
          })
        });

        const data = await res.json();
        if (res.ok && data?.candidates?.[0]?.content?.parts?.[0]?.text) {
          solution = data.candidates[0].content.parts[0].text;
          engineUsed = 'Google Gemini Official (3.5-Flash-Lite)';
        } else {
          errors.push(`Google API (${res.status}): ${maskSecrets(data?.error?.message || 'Không có kết quả')}`);
        }
      } catch (err) {
        errors.push(`Google API Network Error: ${maskSecrets(err.message)}`);
      }
    }

    // --- ĐỘNG CƠ 2: Kira AI Gateway (Gemini 4 Argon) - Chuyển đổi dự phòng (Failover) ---
    if (!solution && kiraApiKey) {
      try {
        let userContent = promptText;
        if (attachment && attachment.base64Data && (attachment.mimeType || '').startsWith('image/')) {
          userContent = [
            { type: 'text', text: promptText },
            {
              type: 'image_url',
              image_url: {
                url: `data:${attachment.mimeType || 'image/jpeg'};base64,${attachment.base64Data}`
              }
            }
          ];
        }

        const res = await fetch('https://kiraai.vn/api/v1/chat/completions', {
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
        });

        const data = await res.json();
        if (res.ok && data?.choices?.[0]?.message?.content) {
          solution = data.choices[0].message.content;
          engineUsed = 'Kira AI Gateway (Gemini 4 Argon)';
        } else {
          errors.push(`Kira API (${res.status}): ${maskSecrets(data?.error?.message || 'Không có kết quả')}`);
        }
      } catch (err) {
        errors.push(`Kira API Network Error: ${maskSecrets(err.message)}`);
      }
    }

    // Nếu cả 2 động cơ đều không thành công
    if (!solution) {
      return new Response(
        JSON.stringify({
          success: false,
          error: `Không thể kết nối đến AI engine. Chi tiết: ${errors.join(' | ')}`
        }),
        { status: 502, headers: corsHeaders }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        solution,
        engine: engineUsed
      }),
      { status: 200, headers: corsHeaders }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: 'Đã có lỗi xử lý nội bộ phía máy chủ.' }),
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, x-gemini-key, x-kira-key',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'SAMEORIGIN'
    }
  });
}
