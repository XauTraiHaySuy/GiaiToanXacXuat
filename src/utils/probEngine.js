/**
 * Probability Engine (Lõi Tính Toán Xác Suất THPT Chuyên Sâu)
 * Tích hợp chuyên dụng fraction.js & js-combinatorics
 * Đảm bảo tính toán chính xác tuyệt đối, chuẩn hóa phân số tối giản và sinh câu hỏi trắc nghiệm chuẩn THPT
 */

import Fraction from 'fraction.js'
import * as jsComb from 'js-combinatorics'

// Xuất trực tiếp thư viện để các module khác có thể mở rộng
export { Fraction, jsComb }

// ==========================================
// 1. TỔ HỢP & HOÁN VỊ (js-combinatorics)
// ==========================================

/**
 * Giai thừa n! (dùng BigInt)
 */
export function factorial(n) {
  const num = Number(n)
  if (isNaN(num) || num < 0) return 0n
  if (num === 0 || num === 1) return 1n
  return jsComb.factorial(num)
}

/**
 * Hoán vị P_n = n!
 */
export function permutation(n) {
  return factorial(n)
}

/**
 * Chỉnh hợp chập k của n phần tử: A_n^k = n! / (n - k)!
 */
export function arrangement(n, k) {
  const nVal = Number(n)
  const kVal = Number(k)
  if (isNaN(nVal) || isNaN(kVal) || kVal < 0 || nVal < kVal) return 0n
  if (kVal === 0) return 1n
  return jsComb.permutation(nVal, kVal)
}

/**
 * Tổ hợp chập k của n phần tử: C_n^k = n! / (k! * (n - k)!)
 */
export function combination(n, k) {
  const nVal = Number(n)
  const kVal = Number(k)
  if (isNaN(nVal) || isNaN(kVal) || kVal < 0 || nVal < kVal) return 0n
  if (kVal === 0 || kVal === nVal) return 1n
  return jsComb.combination(nVal, kVal)
}

/**
 * Ước chung lớn nhất (GCD) Euclid
 */
export function gcd(a, b) {
  let x = typeof a === 'bigint' ? (a < 0n ? -a : a) : BigInt(Math.abs(Math.round(a)))
  let y = typeof b === 'bigint' ? (b < 0n ? -b : b) : BigInt(Math.abs(Math.round(b)))
  if (x === 0n) return y
  if (y === 0n) return x
  while (y !== 0n) {
    const temp = y
    y = x % y
    x = temp
  }
  return x
}

// ==========================================
// 2. PHÂN SỐ XÁC SUẤT (fraction.js)
// ==========================================

/**
 * Chuẩn hóa một giá trị thành đối tượng Phân số Xác suất tiêu chuẩn
 * Hỗ trợ nhận: (numerator, denominator), Fraction instance, chuỗi thập phân/phân số/phần trăm
 */
export function toProbFraction(numerator, denominator = 1) {
  let frac

  if (numerator instanceof Fraction) {
    frac = numerator
  } else if (numerator && numerator.fraction instanceof Fraction) {
    frac = numerator.fraction
  } else if (numerator && typeof numerator === 'object' && numerator.num !== undefined && numerator.den !== undefined) {
    frac = new Fraction(numerator.num, numerator.den)
  } else if (typeof numerator === 'string' && denominator === 1) {
    const str = numerator.trim().replace(',', '.')
    if (str.endsWith('%')) {
      const pct = parseFloat(str.slice(0, -1))
      frac = isNaN(pct) ? new Fraction(0) : new Fraction(pct, 100)
    } else {
      try {
        frac = new Fraction(str)
      } catch {
        frac = new Fraction(0)
      }
    }
  } else {
    // Xử lý chia cho 0 an toàn
    const denNum = typeof denominator === 'bigint' ? denominator : BigInt(Math.round(denominator))
    if (denNum === 0n) {
      return {
        fraction: new Fraction(0),
        num: 0n,
        den: 0n,
        latex: '\\text{Không xác định (chia cho 0)}',
        text: 'N/A',
        decimal: 0,
        decimalStr: 'N/A',
        percentageStr: 'N/A',
        isWhole: false
      }
    }

    const numNum = typeof numerator === 'bigint' ? numerator : BigInt(Math.round(numerator))
    frac = new Fraction(numNum, denNum)
  }

  const sign = frac.s < 0n ? -1n : 1n
  const num = BigInt(frac.n) * sign
  const den = BigInt(frac.d)
  const isWhole = den === 1n
  const decimalVal = frac.valueOf()

  // Định dạng LaTeX chuẩn từ hàm .toLatex() của fraction.js
  const latex = isWhole ? `${num}` : frac.toLatex()
  const text = isWhole ? `${num}` : frac.toFraction()
  const decimalStr = decimalVal.toLocaleString('vi-VN', { maximumFractionDigits: 6 })
  const percentageStr = (decimalVal * 100).toLocaleString('vi-VN', { maximumFractionDigits: 4 }) + '%'

  return {
    fraction: frac,
    num,
    den,
    latex,
    text,
    decimal: decimalVal,
    decimalStr,
    percentageStr,
    isWhole
  }
}

/**
 * Tương thích ngược với hàm simplifyFraction trước đây
 */
export function simplifyFraction(numerator, denominator) {
  return toProbFraction(numerator, denominator)
}

/**
 * Chuyển đổi chuỗi nhập liệu (thập phân "0.75", phần trăm "75%", phân số "3/4") thành ProbFraction
 */
export function parseProbInput(input) {
  if (input === null || input === undefined) return null
  const str = String(input).trim().replace(',', '.')
  if (!str) return null

  try {
    let frac
    if (str.endsWith('%')) {
      const pct = parseFloat(str.slice(0, -1))
      if (isNaN(pct) || pct < 0 || pct > 100) return null
      frac = new Fraction(pct, 100)
    } else if (str.includes('/')) {
      const parts = str.split('/')
      if (parts.length !== 2) return null
      const top = parseInt(parts[0].trim(), 10)
      const bottom = parseInt(parts[1].trim(), 10)
      if (isNaN(top) || isNaN(bottom) || bottom <= 0 || top < 0 || top > bottom) return null
      frac = new Fraction(top, bottom)
    } else {
      const val = parseFloat(str)
      if (isNaN(val) || val < 0 || val > 1) return null
      frac = new Fraction(str)
    }

    const prob = toProbFraction(frac)
    return {
      value: prob.decimal,
      num: prob.num,
      den: prob.den,
      latex: prob.latex,
      text: prob.text,
      decimalStr: prob.decimal.toString(),
      percentageStr: prob.percentageStr,
      fraction: frac
    }
  } catch {
    return null
  }
}

// ==========================================
// 3. CÁC PHÉP TOÁN XÁC SUẤT BẰNG FRACTION
// ==========================================

function getFraction(p) {
  if (p instanceof Fraction) return p
  if (p && p.fraction instanceof Fraction) return p.fraction
  if (p && p.num !== undefined && p.den !== undefined) return new Fraction(p.num, p.den)
  return new Fraction(p)
}

/**
 * Cộng 2 xác suất P1 + P2 bằng Fraction
 */
export function addProbs(p1, p2) {
  const f1 = getFraction(p1)
  const f2 = getFraction(p2)
  return toProbFraction(f1.add(f2))
}

export function addFractions(f1, f2) {
  return addProbs(f1, f2)
}

/**
 * Trừ 2 xác suất P1 - P2 bằng Fraction
 */
export function subtractProbs(p1, p2) {
  const f1 = getFraction(p1)
  const f2 = getFraction(p2)
  return toProbFraction(f1.sub(f2))
}

/**
 * Nhân 2 xác suất P1 * P2 bằng Fraction
 */
export function multiplyProbs(p1, p2) {
  const f1 = getFraction(p1)
  const f2 = getFraction(p2)
  return toProbFraction(f1.mul(f2))
}

export function multiplyFractions(f1, f2) {
  return multiplyProbs(f1, f2)
}

/**
 * Chia 2 xác suất P1 / P2 bằng Fraction
 */
export function divideProbs(p1, p2) {
  const f1 = getFraction(p1)
  const f2 = getFraction(p2)
  return toProbFraction(f1.div(f2))
}

/**
 * Xác suất biến cố đối: P(A ngang) = 1 - P(A)
 */
export function complementProb(p) {
  const f = getFraction(p)
  return toProbFraction(new Fraction(1).sub(f))
}

/**
 * Công thức Bayes: P(A | B) = P(A) * P(B | A) / P(B)
 */
export function bayesProb(priorA, likelihoodBGivenA, totalEvidenceB) {
  const fA = getFraction(priorA)
  const fBA = getFraction(likelihoodBGivenA)
  const fB = getFraction(totalEvidenceB)
  const numerator = fA.mul(fBA)
  return toProbFraction(numerator.div(fB))
}

/**
 * Định dạng số nguyên có dấu cách phân cách hàng nghìn
 */
export function formatNum(n) {
  if (n === null || n === undefined) return '0'
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

// ==========================================
// 4. SINH CÂU HỎI TRẮC NGHIỆM TƯƠNG TỰ (THPT)
// ==========================================

/**
 * Tự động sinh câu hỏi trắc nghiệm 4 đáp án A, B, C, D chuẩn đề thi THPT Quốc gia
 * Bao gồm 1 đáp án đúng và 3 đáp án bẫy hợp lý (biến cố đối, sai mẫu số, sai công thức)
 */
export function generateSimilarQuiz({
  problemTitle = 'Bài toán xác suất',
  questionPrompt = 'Tính xác suất của biến cố đã cho.',
  correctFraction,
  rawNumerator = null,
  rawDenominator = null,
  problemType = 'general',
  customDistractors = []
}) {
  const correctProb = toProbFraction(correctFraction)
  const correctVal = correctProb.fraction.valueOf()
  const correctLatex = correctProb.latex

  const optionsMap = new Map()

  // 1. Đáp án ĐÚNG (A, B, C hoặc D sau khi xáo trộn)
  optionsMap.set(correctProb.fraction.toFraction(), {
    fraction: correctProb.fraction,
    latex: correctLatex,
    text: correctProb.text,
    decimalStr: correctProb.decimalStr,
    percentageStr: correctProb.percentageStr,
    isCorrect: true,
    tag: 'Chính xác',
    explanation: 'Đáp án chính xác! Áp dụng đúng công thức và rút gọn phân số tối giản.'
  })

  // 2. BẪY 1: Biến cố đối P(A ngang) = 1 - P(A) (Lỗi phổ biến nhất khi học sinh quên lấy 1 trừ biến cố đối)
  const comp = new Fraction(1).sub(correctProb.fraction)
  if (comp.valueOf() > 0 && comp.valueOf() < 1 && !optionsMap.has(comp.toFraction())) {
    const compProb = toProbFraction(comp)
    optionsMap.set(comp.toFraction(), {
      fraction: comp,
      latex: compProb.latex,
      text: compProb.text,
      decimalStr: compProb.decimalStr,
      percentageStr: compProb.percentageStr,
      isCorrect: false,
      tag: 'Bẫy biến cố đối',
      explanation: 'Bẫy biến cố đối! Đây là giá trị P(Ā) = 1 - P(A), thí sinh hay quên lấy phần bù 1 - P(Ā).'
    })
  }

  // 3. BẪY 2: Sai lệch không gian mẫu hoặc đếm thiếu/thừa số kết quả thuận lợi
  if (rawNumerator && rawDenominator) {
    const rn = BigInt(rawNumerator)
    const rd = BigInt(rawDenominator)
    const rawCandidates = [
      {
        frac: new Fraction(rn > 1n ? rn - 1n : 1n, rd),
        tag: 'Bẫy đếm thiếu kết quả',
        exp: 'Bẫy đếm thiếu! Đếm thiếu 1 trường hợp thuận lợi trong phép đếm tổ hợp.'
      },
      {
        frac: new Fraction(rn + 1n < rd ? rn + 1n : rn, rd),
        tag: 'Bẫy đếm dư kết quả',
        exp: 'Bẫy đếm dư! Trùng lặp hoặc tính dư 1 trường hợp trong không gian thuận lợi.'
      },
      {
        frac: new Fraction(rn, rd + 1n),
        tag: 'Bẫy không gian mẫu n(Ω)',
        exp: 'Bẫy không gian mẫu! Sai sót trong việc xác định tổng số phần tử n(Ω).'
      },
      {
        frac: new Fraction(rn, rd > 2n ? rd - 1n : rd + 2n),
        tag: 'Bẫy không gian mẫu n(Ω)',
        exp: 'Bẫy không gian mẫu! Chia nhầm mẫu số phép thử lân cận.'
      }
    ]

    for (const item of rawCandidates) {
      if (optionsMap.size >= 4) break
      const key = item.frac.toFraction()
      if (item.frac.valueOf() > 0 && item.frac.valueOf() < 1 && !optionsMap.has(key)) {
        const itemProb = toProbFraction(item.frac)
        optionsMap.set(key, {
          fraction: item.frac,
          latex: itemProb.latex,
          text: itemProb.text,
          decimalStr: itemProb.decimalStr,
          percentageStr: itemProb.percentageStr,
          isCorrect: false,
          tag: item.tag,
          explanation: item.exp
        })
      }
    }
  }

  // 4. BẪY 3: Custom distractors nếu có
  if (Array.isArray(customDistractors)) {
    for (const d of customDistractors) {
      if (optionsMap.size >= 4) break
      const dFrac = getFraction(d.fraction || d)
      const key = dFrac.toFraction()
      if (dFrac.valueOf() > 0 && dFrac.valueOf() < 1 && !optionsMap.has(key)) {
        const dProb = toProbFraction(dFrac)
        optionsMap.set(key, {
          fraction: dFrac,
          latex: dProb.latex,
          text: dProb.text,
          decimalStr: dProb.decimalStr,
          percentageStr: dProb.percentageStr,
          isCorrect: false,
          tag: d.tag || 'Bẫy công thức',
          explanation: d.reason || 'Bẫy công thức! Nhầm lẫn giữa các quy tắc nhân và cộng xác suất.'
        })
      }
    }
  }

  // 5. Dự phòng sinh đáp án nhiễu hợp lý nếu chưa đủ 4 lựa chọn
  const n = correctProb.fraction.n
  const d = correctProb.fraction.d
  const fallbackFractions = [
    { f: new Fraction(n, d + 1n), tag: 'Bẫy mẫu số', exp: 'Sai lệch mẫu số không gian mẫu.' },
    { f: new Fraction(n > 1n ? n - 1n : 1n, d), tag: 'Bẫy tử số', exp: 'Đếm thiếu số kết quả thuận lợi n(A).' },
    { f: new Fraction(n + 1n < d ? n + 1n : n, d + 1n), tag: 'Bẫy tính toán', exp: 'Sai lệch trong các phép tính tổ hợp thành phần.' },
    { f: new Fraction(1n, 2n), tag: 'Bẫy xác suất cân bằng', exp: 'Nhầm lẫn với xác suất 50-50 thông thường.' },
    { f: new Fraction(1n, 3n), tag: 'Bẫy phân phối đều', exp: 'Nhầm lẫn giả thiết biến cố đồng khả năng.' },
    { f: new Fraction(2n, 3n), tag: 'Bẫy quy tắc cộng', exp: 'Cộng xác suất nhưng quên trừ phần giao P(A ∩ B).' },
    { f: new Fraction(1n, 4n), tag: 'Bẫy phép thử độc lập', exp: 'Sai sót khi tính tích xác suất 2 biến cố.' },
    { f: new Fraction(3n, 4n), tag: 'Bẫy quy tắc bù', exp: 'Nhầm lẫn trong tính toán biến cố hội.' },
    { f: new Fraction(1n, 5n), tag: 'Bẫy tỷ lệ', exp: 'Sai sót tỷ số giữa các nhóm đối tượng.' }
  ]

  for (const fb of fallbackFractions) {
    if (optionsMap.size >= 4) break
    const key = fb.f.toFraction()
    if (fb.f.valueOf() > 0 && fb.f.valueOf() < 1 && !optionsMap.has(key)) {
      const fbProb = toProbFraction(fb.f)
      optionsMap.set(key, {
        fraction: fb.f,
        latex: fbProb.latex,
        text: fbProb.text,
        decimalStr: fbProb.decimalStr,
        percentageStr: fbProb.percentageStr,
        isCorrect: false,
        tag: fb.tag,
        explanation: fb.exp
      })
    }
  }

  // Lấy chính xác 4 lựa chọn và xáo trộn ngẫu nhiên (Fisher-Yates Shuffle)
  const items = Array.from(optionsMap.values()).slice(0, 4)
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[items[i], items[j]] = [items[j], items[i]]
  }

  const optionLetters = ['A', 'B', 'C', 'D']
  let correctKey = 'A'

  const options = items.map((item, idx) => {
    const key = optionLetters[idx]
    if (item.isCorrect) {
      correctKey = key
    }
    return {
      key,
      fraction: item.fraction,
      latex: item.latex,
      text: item.text,
      decimalStr: item.decimalStr,
      percentageStr: item.percentageStr,
      isCorrect: item.isCorrect,
      tag: item.tag,
      explanation: item.explanation
    }
  })

  return {
    problemTitle,
    questionPrompt,
    problemType,
    correctKey,
    correctProb,
    options
  }
}
