import { marked } from 'marked'
import katex from 'katex'

/**
 * Chuyển đổi Markdown chứa công thức Toán LaTeX ($...$ và $$...$$) thành HTML với KaTeX
 */
export function renderMarkdownWithMath(rawText) {
  if (!rawText) return ''

  const mathPlaceholders = []

  // 1. Bảo vệ khối toán học độc lập $$ ... $$
  let text = rawText.replace(/\$\$([\s\S]+?)\$\$/g, (match, mathContent) => {
    const id = `PROB_MATH_BLOCK_${mathPlaceholders.length}`
    let rendered = ''
    try {
      rendered = katex.renderToString(mathContent.trim(), {
        displayMode: true,
        throwOnError: false,
        strict: false
      })
    } catch (e) {
      rendered = `<div class="katex-error text-rose-400 font-mono text-sm py-1">[Lỗi công thức: ${mathContent}]</div>`
    }
    mathPlaceholders.push({
      id,
      html: `<div class="my-4 overflow-x-auto py-2 text-center bg-slate-950/70 border border-slate-800/80 rounded-xl">${rendered}</div>`
    })
    return id
  })

  // 2. Bảo vệ công thức toán nội dòng $ ... $
  text = text.replace(/(?<!\\)\$([^\$\n]+?)(?<!\\)\$/g, (match, mathContent) => {
    const id = `PROB_MATH_INLINE_${mathPlaceholders.length}`
    let rendered = ''
    try {
      rendered = katex.renderToString(mathContent.trim(), {
        displayMode: false,
        throwOnError: false,
        strict: false
      })
    } catch (e) {
      rendered = `<span class="katex-error text-rose-400 font-mono text-xs">[Lỗi công thức: ${mathContent}]</span>`
    }
    mathPlaceholders.push({
      id,
      html: `<span class="inline-math mx-0.5">${rendered}</span>`
    })
    return id
  })

  // 3. Render Markdown bằng marked
  marked.setOptions({
    gfm: true,
    breaks: true
  })
  let html = marked.parse(text)

  // 4. Phục hồi các placeholder bằng HTML toán học KaTeX
  for (const item of mathPlaceholders) {
    // Nếu marked bọc trong thẻ <p>
    const pRegex = new RegExp(`<p>\\s*${item.id}\\s*<\\/p>`, 'g')
    html = html.replace(pRegex, item.html)
    // Trường hợp inline hoặc còn lại
    html = html.replace(new RegExp(item.id, 'g'), item.html)
  }

  // 5. Khử độc XSS (Sanitize HTML) để loại bỏ hoàn toàn các thẻ và thuộc tính nguy hiểm
  return sanitizeHtml(html)
}

/**
 * Hàm lọc các thẻ nguy cơ XSS như <script>, <iframe>, thuộc tính on* (onerror, onload...)
 */
function sanitizeHtml(html) {
  if (!html) return ''
  return html
    // Xóa thẻ script
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Xóa thẻ iframe, object, embed, form
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^>]*>/gi, '')
    .replace(/<form\b[^<]*(?:(?!<\/form>)<[^<]*)*<\/form>/gi, '')
    // Vô hiệu hóa javascript: trong href hoặc src
    .replace(/(href|src)\s*=\s*["']?\s*javascript:[^"'>]+/gi, '$1="#"')
    // Xóa các inline event handler như onload=, onerror=, onclick=
    .replace(/\s+on[a-z]+\s*=\s*(?:'[^']*'|"[^"]*"|[^\s>]+)/gi, '')
}
