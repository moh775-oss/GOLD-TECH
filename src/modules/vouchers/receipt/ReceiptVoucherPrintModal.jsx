import { useEffect, useRef } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import dayjs from 'dayjs'
import { Tafgeet } from 'tafgeet-arabic'
import { useAuth } from '../../../contexts/AuthContext.jsx'
import PrintHeader from '../../../components/PrintHeader.jsx'
import { openPrintWindow, fmtMoney } from '../../../lib/printHtml.jsx'

const METHOD_MAP = {
  cash: 'نقدي',
  bank: 'تحويل بنكي',
  cheque: 'شيك',
  card: 'بطاقة',
}

function amountToArabicWords(amount) {
  try {
    const num = Number(amount || 0)
    if (num <= 0) return ''
    let text = String(new Tafgeet(String(num), 'SAR').parse() || '').trim()
    if (!text) return ''

    text = text
      .replace(/^فقط\s+/u, '')
      .replace(/\s*(فقط\s*)?لا\s*غير\.?$/u, '')
      .trim()

    return `فقط ${text} لا غير.`
  } catch (error) {
    console.error(error)
    return ''
  }
}

function formatHijriDate(dateInput) {
  try {
    const d = dateInput ? new Date(dateInput) : new Date()
    if (Number.isNaN(d.getTime())) return '—'
    return new Intl.DateTimeFormat('ar-SA-u-ca-islamic', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(d)
  } catch {
    return '—'
  }
}

export default function ReceiptVoucherPrintModal({ open, onClose, payload }) {
  const { session } = useAuth()
  const printedRef = useRef(false)

  useEffect(() => {
    if (!open || !payload) {
      printedRef.current = false
      return
    }
    if (printedRef.current) return
    printedRef.current = true

    const timer = setTimeout(() => {
      triggerPrint()
      onClose?.()
    }, 80)

    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, payload])

  const triggerPrint = () => {
    if (!payload) return

    const v = payload.voucher || {}
    const txType =
      v.transaction_type ||
      (Number(v.gold_weight || 0) > 0 && Number(v.cash_amount || 0) > 0
        ? 'cash_gold'
        : Number(v.gold_weight || 0) > 0
          ? 'gold'
          : 'cash')

    const hasCash = txType === 'cash' || txType === 'cash_gold'
    const hasGold = txType === 'gold' || txType === 'cash_gold'

    const cashAmount = hasCash ? Number(v.cash_amount || 0) : 0
    const goldAmount = hasGold ? Number(v.gold_amount || 0) : 0
    const goldWeight = hasGold ? Number(v.gold_weight || 0) : 0
    const goldNetWeight = hasGold ? Number(v.gold_net_weight || 0) : 0

    const computedTotal =
      v.total_amount !== undefined && v.total_amount !== null
        ? Number(v.total_amount)
        : cashAmount + goldAmount

    const amountBadgeText =
      hasGold && !hasCash
        ? `${goldNetWeight.toFixed(3)} جم`
        : `${fmtMoney(computedTotal)} ر.س`

    const wordsText =
      hasCash && cashAmount > 0
        ? amountToArabicWords(cashAmount)
        : hasGold
          ? `وزن معاير ${goldNetWeight.toFixed(3)} جرام — عيار ${v.karat?.name || '—'}`
          : '—'

    const titleAr =
      txType === 'gold'
        ? 'سند قبض ذهب'
        : txType === 'cash_gold'
          ? 'سند قبض ذهب وريال'
          : 'سند قبض ريال'

    const badgeLabel =
      txType === 'gold'
        ? 'معاملة ذهب'
        : txType === 'cash_gold'
          ? 'معاملة ذهب وريال'
          : 'معاملة نقدية'

    const headerHTML = session?.company_info
      ? renderToStaticMarkup(<PrintHeader info={session.company_info} />)
      : ''

    const accountSourceLabel =
      v.payment_method === 'bank' ? 'البنك' : 'الصندوق'
    const accountSourceValue =
      v.payment_method === 'bank'
        ? v.bank?.name || '—'
        : v.safe?.name || v.bank?.name || '—'

    const goldLineHTML = hasGold
      ? `
        <div class="v-row">
          <div class="v-label">بيانات الذهب</div>
          <div class="v-colon">:</div>
          <div class="v-val gold-val">
            وزن قائم <strong>${goldWeight.toFixed(3)} جم</strong> — وزن معاير <strong>${goldNetWeight.toFixed(3)} جم</strong> — عيار <strong>${v.karat?.name || '—'}</strong>${hasCash ? ` — قيمة الذهب: <strong>${fmtMoney(goldAmount)} ر.س</strong>` : ''}
          </div>
          <div class="v-extra">${v.store?.name ? `<span class="meta-chip">الخزينة: ${v.store.name}</span>` : ''}</div>
        </div>
      `
      : ''

    const bodyHTML = `
      ${headerHTML}

      <div class="voucher-card-box">
        <div class="v-top-bar">
          <div class="v-box v-box-champagne">
            <div class="v-box-line">
              <span class="v-box-k">تاريخ السند</span>
              <span class="v-box-v">${v.doc_date ? dayjs(v.doc_date).format('YYYY-MM-DD') : '—'}</span>
            </div>
            <div class="v-box-divider"></div>
            <div class="v-box-line">
              <span class="v-box-k">الموافق</span>
              <span class="v-box-v">${formatHijriDate(v.doc_date)} هـ</span>
            </div>
          </div>

          <div class="v-box v-box-royal">
            <div class="v-title-ar">${titleAr}</div>
            <div class="v-box-divider royal-divider"></div>
            <div class="v-title-sub">
              <span>Receipt Voucher</span>
              <span class="v-pill">${badgeLabel}</span>
            </div>
          </div>

          <div class="v-box v-box-champagne">
            <div class="v-box-line">
              <span class="v-box-k">رقم السند</span>
              <span class="v-box-v num-highlight">#${v.doc_no || '—'}</span>
            </div>
            <div class="v-box-divider"></div>
            <div class="v-box-line">
              <span class="v-box-k">مبلغ وقدره</span>
              <span class="v-box-v amount-highlight">${amountBadgeText}</span>
            </div>
          </div>
        </div>

        <div class="v-body-rows">
          <div class="v-row">
            <div class="v-label">استلمت من السيد</div>
            <div class="v-colon">:</div>
            <div class="v-val bold-val">${v.contact?.name || '—'}</div>
            <div class="v-extra">${v.reference_no ? `<span class="meta-chip">المرجع: ${v.reference_no}</span>` : '<span class="v-muted">رقم المرجع: —</span>'}</div>
          </div>

          <div class="v-row words-row">
            <div class="v-label">القيمة بالحروف</div>
            <div class="v-colon">:</div>
            <div class="v-val words-val">${wordsText}</div>
            <div class="v-extra"></div>
          </div>

          <div class="v-row">
            <div class="v-label">طريقة تسديد</div>
            <div class="v-colon">:</div>
            <div class="v-val">${hasCash ? (METHOD_MAP[v.payment_method] || v.payment_method || '—') : 'ذهب'}</div>
            <div class="v-extra">${v.cost_center?.name ? `<span class="meta-chip">مركز التكلفة: ${v.cost_center.name}</span>` : ''}</div>
          </div>

          <div class="v-row">
            <div class="v-label">${accountSourceLabel}</div>
            <div class="v-colon">:</div>
            <div class="v-val emerald-val">${hasCash ? accountSourceValue : (v.store?.name || '—')}</div>
            <div class="v-extra">${v.agent_name ? `<span class="meta-chip">المندوب: ${v.agent_name}</span>` : ''}</div>
          </div>

          ${goldLineHTML}

          <div class="v-row">
            <div class="v-label">البيان</div>
            <div class="v-colon">:</div>
            <div class="v-val">${v.description || '—'}</div>
            <div class="v-extra"><span class="v-muted">الوقت: ${dayjs().format('HH:mm')}</span></div>
          </div>
        </div>

        <div class="v-signatures">
          <div class="sig-col">
            <div class="sig-title">محرر السند</div>
            <div class="sig-line">${payload.printed_by || session?.user?.name || '.....................'}</div>
          </div>
          <div class="sig-col">
            <div class="sig-title">المسلّم</div>
            <div class="sig-line">.....................</div>
          </div>
          <div class="sig-col">
            <div class="sig-title">المحاسب</div>
            <div class="sig-line">.....................</div>
          </div>
          <div class="sig-col">
            <div class="sig-title">المراجع</div>
            <div class="sig-line">.....................</div>
          </div>
          <div class="sig-col">
            <div class="sig-title">المدير المالي</div>
            <div class="sig-line">.....................</div>
          </div>
          <div class="sig-col">
            <div class="sig-title">المدير العام</div>
            <div class="sig-line">.....................</div>
          </div>
        </div>
      </div>
    `

    const extraStyles = `
      .voucher-card-box,
      .voucher-card-box * {
        box-sizing: border-box;
      }

      .voucher-card-box {
        border: 1.5px solid #c89d28;
        border-radius: 16px;
        padding: 14px 16px 14px;
        margin-top: 10px;
        background: linear-gradient(180deg, #fffdf8 0%, #ffffff 35%);
        box-shadow: 0 4px 14px rgba(184, 134, 11, 0.06);
      }

      .v-top-bar {
        display: flex;
        justify-content: space-between;
        align-items: stretch;
        gap: 10px;
        margin-bottom: 14px;
        width: 100%;
      }

      .v-box {
        flex: 1 1 0;
        min-width: 0;
        border-radius: 10px;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }

      .v-box-champagne {
        background: #fdf6e3;
        border: 1.2px solid #dfc06b;
      }

      .v-box-royal {
        background: linear-gradient(135deg, #fff6dc 0%, #faecc4 100%);
        border: 1.5px solid #b8860b;
        text-align: center;
      }

      .v-box-line {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 6px 10px;
        font-size: 11.5px;
        font-weight: 700;
        color: #2b2416;
        gap: 6px;
      }

      .v-box-k {
        color: #6e581b;
        white-space: nowrap;
        flex-shrink: 0;
      }

      .v-box-v {
        color: #1a1a1a;
        white-space: nowrap;
        font-variant-numeric: tabular-nums;
      }

      .num-highlight {
        color: #8f6200;
        font-weight: 800;
      }

      .amount-highlight {
        color: #1b6b3a;
        font-weight: 800;
      }

      .v-box-divider {
        height: 1px;
        background: #e7cf8b;
        width: 100%;
      }

      .royal-divider {
        background: #d4aa38;
      }

      .v-title-ar {
        padding: 5px 10px;
        font-size: 15px;
        font-weight: 800;
        color: #7c1d18;
        white-space: nowrap;
      }

      .v-title-sub {
        padding: 5px 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        flex-wrap: nowrap;
        font-size: 11.5px;
        font-weight: 800;
        color: #8f6200;
        font-family: Arial, sans-serif;
      }

      .v-pill {
        background: #b8860b;
        color: #fff;
        font-family: Tajawal, Cairo, sans-serif;
        font-size: 10px;
        font-weight: 700;
        padding: 1px 7px;
        border-radius: 999px;
        white-space: nowrap;
      }

      .v-body-rows {
        padding: 2px 4px 10px;
      }

      .v-row {
        display: flex;
        align-items: baseline;
        padding: 7px 6px;
        font-size: 12.5px;
        line-height: 1.55;
        color: #1f1f1f;
        border-bottom: 1px dashed #efe4c4;
        gap: 6px;
      }

      .v-row:last-child {
        border-bottom: none;
      }

      .words-row {
        background: #fcf8ec;
        border-radius: 8px;
        border-bottom: none;
        margin: 3px 0;
        padding: 7px 10px;
      }

      .v-label {
        width: 112px;
        flex-shrink: 0;
        font-weight: 800;
        color: #5c4712;
      }

      .v-colon {
        width: 12px;
        flex-shrink: 0;
        font-weight: 800;
        text-align: center;
        color: #9b7208;
      }

      .v-val {
        flex: 1 1 auto;
        min-width: 0;
        font-weight: 600;
        color: #1f1f1f;
      }

      .v-val.bold-val {
        font-weight: 800;
        font-size: 13px;
        color: #111;
      }

      .v-val.words-val {
        color: #6d4c00;
        font-weight: 700;
      }

      .v-val.emerald-val {
        color: #166534;
        font-weight: 800;
      }

      .v-val.gold-val {
        color: #8f6200;
        font-weight: 700;
      }

      .v-extra {
        flex-shrink: 0;
        text-align: left;
        font-size: 11.5px;
      }

      .meta-chip {
        display: inline-block;
        background: #f7f2e2;
        border: 1px solid #e5d29c;
        color: #5c4712;
        padding: 1px 8px;
        border-radius: 6px;
        font-weight: 700;
        white-space: nowrap;
      }

      .v-muted {
        color: #777;
        font-size: 11px;
        white-space: nowrap;
      }

      .v-signatures {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        gap: 8px;
        margin-top: 20px;
        padding-top: 10px;
        border-top: 1.5px solid #e8d49a;
        text-align: center;
      }

      .sig-col {
        flex: 1 1 0;
        min-width: 0;
      }

      .sig-title {
        font-size: 11.5px;
        font-weight: 800;
        color: #5c4712;
        margin-bottom: 10px;
        white-space: nowrap;
      }

      .sig-line {
        font-size: 11px;
        font-weight: 700;
        color: #222;
        white-space: nowrap;
      }
    `

    openPrintWindow({
      title: `${titleAr} ${v.doc_no || ''}`,
      bodyHTML,
      extraStyles,
    })
  }

  return null
}