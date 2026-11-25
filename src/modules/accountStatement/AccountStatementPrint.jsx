import { useEffect, useRef } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import dayjs from 'dayjs'
import { RiyalIcon } from 'riyal/react'
import { Tafgeet } from 'tafgeet-arabic'
import { useAuth } from '../../contexts/AuthContext.jsx'
import PrintHeader from '../../components/PrintHeader.jsx'
import { openPrintWindow, fmtMoney } from '../../lib/printHtml.jsx'

function amountToArabicWords(amount) {
  try {
    const num = Math.abs(Number(amount || 0))
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

function balanceSideLabel(val, isCreditNature) {
  const num = Number(val || 0)
  if (Math.abs(num) < 0.0001) return '&nbsp;'
  if (isCreditNature) {
    return num > 0 ? 'له' : 'عليه'
  }
  return num > 0 ? 'عليه' : 'له'
}

// ✅ نلف الـ label بين قوسين (له)/(عليه) ونتعامل مع الفراغ
function sideWithParens(val, isCreditNature) {
  const label = balanceSideLabel(val, isCreditNature)
  return label === '&nbsp;' ? '&nbsp;' : `(${label})`
}

function fmtGoldIfActive(val) {
  const num = Math.abs(Number(val || 0))
  if (num < 0.0001) return '&nbsp;'
  return num.toFixed(2)
}

function fmtCashIfActive(val) {
  const num = Math.abs(Number(val || 0))
  if (num < 0.0001) return '&nbsp;'
  return fmtMoney(num)
}

export default function AccountStatementPrint({ open, onClose, payload }) {
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
    if (!payload?.account) return

    const acc = payload.account || {}
    const flt = payload.filters || {}
    const sum = payload.summary || {}
    const rows = payload.rows || []

    const isCreditNature = String(acc.account_nature || 'debit').toLowerCase() === 'credit'
    const openingCash = Number(sum.opening_balance?.cash || 0)
    const openingGold = Number(sum.opening_balance?.gold || 0)
    const closingCash = Number(sum.closing_balance?.cash || 0)
    const closingGold = Number(sum.closing_balance?.gold || 0)
    const periodDebit = Number(sum.period_totals?.debit_amount || 0)
    const periodCredit = Number(sum.period_totals?.credit_amount || 0)
    const periodGDebit = Number(sum.period_totals?.gold_debit || 0)
    const periodGCredit = Number(sum.period_totals?.gold_credit || 0)

    const reportTitle = `كشف حساب${acc.name ? ` - ${acc.name}` : ''}`

    const headerHTML = session?.company_info
      ? renderToStaticMarkup(<PrintHeader info={session.company_info} />)
      : ''

    const openingRowHTML = `
      <tr class="opening-row">
        <td>${flt.from ? dayjs(flt.from).format('DD/MM/YYYY') : '&nbsp;'}</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td class="num-bold">${fmtGoldIfActive(openingGold)}</td>
        <td class="side-bold">${sideWithParens(openingGold, isCreditNature)}</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td class="num-bold">${fmtCashIfActive(openingCash)}</td>
        <td class="side-bold">${sideWithParens(openingCash, isCreditNature)}</td>
        <td class="desc-full">${flt.with_opening ? 'رصيد قبل الفترة' : 'رصيد افتتاحي (بدون رصيد سابق)'}</td>
      </tr>
    `

    const dataRowsHTML = rows.length
      ? rows
          .map((r) => {
            const gDr = Number(r.gold_debit || 0)
            const gCr = Number(r.gold_credit || 0)
            const gBal = Number(r.running_gold_balance || 0)
            const cDr = Number(r.debit_amount || 0)
            const cCr = Number(r.credit_amount || 0)
            const cBal = Number(r.running_cash_balance || 0)
            const hasGold = Math.abs(gDr) > 0 || Math.abs(gCr) > 0 || Math.abs(gBal) > 0
            const hasCash = Math.abs(cDr) > 0 || Math.abs(cCr) > 0 || Math.abs(cBal) > 0

            return `
          <tr>
            <td>${r.journal_date ? dayjs(r.journal_date).format('DD/MM/YYYY') : '&nbsp;'}</td>
            <td class="karat-bold">${hasGold && r.karat_name ? r.karat_name : '&nbsp;'}</td>
            <td>${fmtGoldIfActive(gDr)}</td>
            <td>${fmtGoldIfActive(gCr)}</td>
            <td class="num-bold">${hasGold ? Math.abs(gBal).toFixed(2) : '&nbsp;'}</td>
            <td class="side-bold">${hasGold ? sideWithParens(gBal, isCreditNature) : '&nbsp;'}</td>
            <td>${hasCash ? 'ر.س' : '&nbsp;'}</td>
            <td>${fmtCashIfActive(cDr)}</td>
            <td>${fmtCashIfActive(cCr)}</td>
            <td class="num-bold">${hasCash ? fmtMoney(Math.abs(cBal)) : '&nbsp;'}</td>
            <td class="side-bold">${hasCash ? sideWithParens(cBal, isCreditNature) : '&nbsp;'}</td>
            <td class="desc-full">${r.description || r.doc_type_name || '&nbsp;'}</td>
          </tr>
        `
          })
          .join('')
      : `<tr><td colspan="12" style="color:#777;padding:14px;">لا توجد حركات ضمن الفترة المحددة</td></tr>`

    const cashWords = Math.abs(closingCash) > 0 ? amountToArabicWords(closingCash) : ''
    const riyalIconHTML =
      Math.abs(closingCash) >= 0.0001
        ? ` <span style="display:inline-flex;vertical-align:middle;margin-right:4px;">${renderToStaticMarkup(<RiyalIcon width={14} height={14} />)}</span>`
        : ''
    const bodyHTML = `
      <div class="print-sheet">
        ${headerHTML}

        <div class="statement-banner">${reportTitle}</div>

        <div class="account-pill">
          <span><strong>الرقم الحساب</strong> &nbsp;&nbsp; ${acc.acc_no || '&nbsp;'}</span>
          <span><strong>اسم الحساب</strong> &nbsp;&nbsp; ${acc.name || '&nbsp;'}</span>
          <span class="period-meta">(${flt.from || 'من تاريخ'} — ${flt.to || 'الى تاريخ'})</span>
        </div>

        <table class="stmt-table">
          <thead>
            <tr>
              <th rowspan="2" class="th-main th-date">التاريخ</th>
              <th colspan="5" class="th-main th-group-gold">الذهب</th>
              <th colspan="5" class="th-main th-group-cash">المبالغ</th>
              <th rowspan="2" class="th-main th-desc">التفاصيل</th>
            </tr>
            <tr>
              <th class="th-sub">العيار</th>
              <th class="th-sub">مدين</th>
              <th class="th-sub">دائن</th>
              <th class="th-sub">الرصيد</th>
              <th class="th-sub">حالة الرصيد</th>
              <th class="th-sub">العملة</th>
              <th class="th-sub">مدين</th>
              <th class="th-sub">دائن</th>
              <th class="th-sub">الرصيد</th>
              <th class="th-sub">حالة الرصيد</th>
            </tr>
          </thead>
          <tbody>
            ${openingRowHTML}
            ${dataRowsHTML}
          </tbody>
        </table>

        <div class="totals-grid">
          <table class="totals-box">
            <tbody>
              <tr class="tot-top">
                <td class="tot-val">${fmtGoldIfActive(periodGCredit)}</td>
                <td class="tot-val">${fmtGoldIfActive(periodGDebit)}</td>
                <td class="tot-lbl" colspan="2">الإجمالي بالعيار الأساسي</td>
              </tr>
              <tr class="tot-bottom">
                <td class="tot-unit">${Math.abs(closingGold) > 0 ? 'جرام' : '&nbsp;'}</td>
                <td class="tot-side">${sideWithParens(closingGold, isCreditNature)}</td>
                <td class="tot-val-strong">${fmtGoldIfActive(closingGold)}</td>
                <td class="tot-lbl">الرصيد</td>
              </tr>
            </tbody>
          </table>

          <table class="totals-box">
            <tbody>
              <tr class="tot-top">
                <td class="tot-val">${fmtCashIfActive(periodCredit)}</td>
                <td class="tot-val">${fmtCashIfActive(periodDebit)}</td>
                <td class="tot-lbl" colspan="2">الإجمالي بالعملة المحلي ر.س</td>
              </tr>
              <tr class="tot-bottom">
                <td class="tot-unit">${Math.abs(closingCash) > 0 ? 'ر.س' : '&nbsp;'}</td>
                <td class="tot-side">${sideWithParens(closingCash, isCreditNature)}</td>
                <td class="tot-val-strong">${fmtCashIfActive(closingCash)}${riyalIconHTML}</td>
                <td class="tot-lbl">الرصيد</td>
              </tr>
            </tbody>
          </table>
        </div>

        ${
          cashWords
            ? `<div class="total-words"><strong>الرصيد النقدي الختامي كتابةً:</strong> ${cashWords}</div>`
            : ''
        }

        <div class="foot">
          <div>طُبع بواسطة: ${payload.printed_by || '—'}</div>
          <div>بتاريخ: ${payload.printed_at || dayjs().format('YYYY-MM-DD HH:mm')}</div>
        </div>
      </div>
    `

    const extraStyles = `
      .print-sheet {
        max-width: 1060px;
        margin: 0 auto;
        font-weight: 700;
        color: #111827;
      }
      .statement-banner {
        text-align: center;
        font-size: 16px;
        font-weight: 900;
        color: #7a5d00;
        padding: 7px 16px;
        margin: 8px 0 10px;
        border-radius: 10px;
  
        border: 0.5px solid rgba(255, 236, 188, 0.97);
      }
      .account-pill {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 36px;
        padding: 7px 22px;
        margin: 8px 0 12px;
        background: rgba(184, 134, 11, 0.14);
        border: 1.5px solid rgba(184, 134, 11, 0.48);
        border-radius: 10px;
        font-size: 13px;
        font-weight: 800;
        color: #5c4500;
      }
      .period-meta {
        font-size: 11.5px;
        font-weight: 700;
        color: #7a5d00;
      }
      .stmt-table {
        width: 100%;
        border-collapse: collapse;
        border: 1.5px solid rgba(184, 134, 11, 0.55);
      }
      .stmt-table th.th-main {
        background: rgba(184, 134, 11, 0.16) !important;
        color: #7a5d00 !important;
        font-weight: 800;
        font-size: 12px;
        padding: 7px 6px;
        border: 1.2px solid rgba(184, 134, 11, 0.5);
        text-align: center;
      }
      .stmt-table th.th-sub {
        background: rgba(184, 134, 11, 0.09) !important;
        color: #5c4500 !important;
        font-weight: 800;
        font-size: 11px;
        padding: 6px 5px;
        border: 1.2px solid rgba(184, 134, 11, 0.45);
        text-align: center;
        white-space: nowrap;
      }
      .stmt-table td {
        border: 1.2px solid rgba(184, 134, 11, 0.35);
        padding: 6px 5px;
        font-size: 11px;
        font-weight: 700;
        text-align: center;
        vertical-align: top;
      }
      .stmt-table td.desc-full {
        text-align: right;
        white-space: normal;
        word-break: break-word;
        line-height: 1.55;
        max-width: 310px;
      }
      .stmt-table td.num-bold,
      .stmt-table td.side-bold,
      .stmt-table td.karat-bold {
        font-weight: 800;
        color: #5c4500;
      }
      .opening-row td {
        background: rgba(184, 134, 11, 0.05);
      }
      .totals-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
        margin-top: 8px;
      }
      .totals-box {
        width: 100%;
        border-collapse: collapse;
        border: 1.5px solid rgba(184, 134, 11, 0.5);
        background: rgba(184, 134, 11, 0.11);
      }
      .totals-box td {
        border: 1px solid rgba(184, 134, 11, 0.4);
        padding: 6px 8px;
        font-size: 11.5px;
        font-weight: 800;
        color: #5c4500;
        text-align: center;
      }
      .totals-box td.tot-lbl {
        text-align: right;
        background: rgba(184, 134, 11, 0.16);
        color: #7a5d00;
      }
      .totals-box td.tot-val-strong {
        font-weight: 900;
        color: #7a5d00;
      }
      .total-words {
        margin-top: 10px;
        padding: 8px 14px;
        background: rgba(184, 134, 11, 0.08);
        border: 1px solid rgba(184, 134, 11, 0.4);
        border-radius: 6px;
        font-size: 12px;
        font-weight: 800;
        color: #5c4500;
        text-align: center;
      }
    `

    openPrintWindow({
      title: reportTitle,
      bodyHTML,
      extraStyles,
    })
  }

  return null
}