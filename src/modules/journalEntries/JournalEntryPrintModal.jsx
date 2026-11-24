import { useEffect, useRef } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import dayjs from 'dayjs'
import { useAuth } from '../../contexts/AuthContext.jsx'
import PrintHeader from '../../components/PrintHeader.jsx'
import { openPrintWindow, fmtMoney } from '../../lib/printHtml.jsx'

import { Tafgeet } from 'tafgeet-arabic'

function amountToArabicWords(amount) {
  try {
    return new Tafgeet(String(amount || 0), 'SAR').parse()
  } catch (error) {
    console.error(error)
    return ''
  }
}

export default function JournalEntryPrintModal({ open, onClose, payload }) {
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

    const j = payload.journal || {}
    const details = j.details || []

    const hasGold = details.some(
      d => Number(d.gold_debit || 0) > 0 || Number(d.gold_credit || 0) > 0
    )
    const isGold =
      j.transaction_type === 'gold' ||
      (j.transaction_type !== 'cash' && hasGold)

    const totalCashDebit  = details.reduce((s, d) => s + Number(d.debit_amount  || 0), 0)
    const totalCashCredit = details.reduce((s, d) => s + Number(d.credit_amount || 0), 0)
    const totalGoldDebit  = details.reduce((s, d) => s + Number(d.gold_debit    || 0), 0)
    const totalGoldCredit = details.reduce((s, d) => s + Number(d.gold_credit   || 0), 0)

    const balanced = isGold
      ? Math.abs(totalGoldDebit - totalGoldCredit) < 0.001
      : Math.abs(totalCashDebit - totalCashCredit) < 0.01

    const cashEntryValue = totalCashDebit
    const goldEntryValue = totalGoldDebit

    // ✅ كتابة الإجمالي بالكلمات (للريال فقط عبر مكتبة riyal)
    const cashWords = !isGold ? amountToArabicWords(cashEntryValue) : ''

    const headerHTML = session?.company_info
      ? renderToStaticMarkup(<PrintHeader info={session.company_info} />)
      : ''

    // ============ رأس الجدول ============
    const headerRow = isGold
      ? `
          <tr>
            <th style="width:40px;">#</th>
            <th>الحساب</th>
            <th style="width:130px;">مدين (جم)</th>
            <th style="width:130px;">دائن (جم)</th>
            <th style="width:80px;">العيار</th>
            <th>البيان</th>
          </tr>
        `
      : `
          <tr>
            <th style="width:40px;">#</th>
            <th>الحساب</th>
            <th style="width:130px;">مدين</th>
            <th style="width:130px;">دائن</th>
            <th>البيان</th>
          </tr>
        `

    // ============ سطور الجدول ============
    const bodyRows = details.map((d, i) => {
      if (isGold) {
        const gd = Number(d.gold_debit  || 0)
        const gc = Number(d.gold_credit || 0)
        return `
          <tr>
            <td>${i + 1}</td>
            <td style="text-align:right;">${d.account?.acc_no || ''} - ${d.account?.name || ''}</td>
            <td style="color:#b8860b;font-weight:700;">${gd > 0 ? gd.toFixed(3) : '—'}</td>
            <td style="color:#b8860b;font-weight:700;">${gc > 0 ? gc.toFixed(3) : '—'}</td>
            <td>${d.karat?.name || '—'}</td>
            <td style="text-align:right;">${d.description || '—'}</td>
          </tr>
        `
      }
      const db = Number(d.debit_amount  || 0)
      const cr = Number(d.credit_amount || 0)
      return `
        <tr>
          <td>${i + 1}</td>
          <td style="text-align:right;">${d.account?.acc_no || ''} - ${d.account?.name || ''}</td>
          <td style="color:#389e0d;font-weight:700;">${db > 0 ? fmtMoney(db) : '—'}</td>
          <td style="color:#cf1322;font-weight:700;">${cr > 0 ? fmtMoney(cr) : '—'}</td>
          <td style="text-align:right;">${d.description || '—'}</td>
        </tr>
      `
    }).join('')

    // ============ سطر الإجمالي ============
    const totalsRow = isGold
      ? `
          <tr class="total-row">
            <td colspan="2" style="text-align:right;font-weight:800;">الإجمالي</td>
            <td style="color:#389e0d;font-weight:800;">${totalGoldDebit.toFixed(3)}</td>
            <td style="color:#cf1322;font-weight:800;">${totalGoldCredit.toFixed(3)}</td>
            <td colspan="2" style="background:#fff9e8;color:${balanced ? '#7a5d00' : '#cf1322'};font-weight:800;">
              قيمة القيد: ${goldEntryValue.toFixed(3)} جم
            </td>
          </tr>
        `
      : `
          <tr class="total-row">
            <td colspan="2" style="text-align:right;font-weight:800;">الإجمالي</td>
            <td style="color:#389e0d;font-weight:800;">${fmtMoney(totalCashDebit)}</td>
            <td style="color:#cf1322;font-weight:800;">${fmtMoney(totalCashCredit)}</td>
            <td style="background:#fff9e8;color:${balanced ? '#7a5d00' : '#cf1322'};font-weight:800;">
              قيمة القيد: ${fmtMoney(cashEntryValue)} ريال
            </td>
          </tr>
        `

    // ============ بطاقات الإجماليات ============
    const totalsCards = isGold
      ? `
          <div class="totals-wrap">
            <div class="total-box">
              <span class="total-label">إجمالي الوزن المعاير مدين</span>
              <span class="total-value green">${totalGoldDebit.toFixed(3)} جم</span>
            </div>
            <div class="total-box">
              <span class="total-label">إجمالي الوزن المعاير دائن</span>
              <span class="total-value red">${totalGoldCredit.toFixed(3)} جم</span>
            </div>
            <div class="total-box total-box-gold">
              <span class="total-label">قيمة القيد</span>
              <span class="total-value gold">${goldEntryValue.toFixed(3)} جم</span>
            </div>
          </div>
        `
      : `
          <div class="totals-wrap">
            <div class="total-box">
              <span class="total-label">إجمالي المدين</span>
              <span class="total-value green">${fmtMoney(totalCashDebit)} ريال</span>
            </div>
            <div class="total-box">
              <span class="total-label">إجمالي الدائن</span>
              <span class="total-value red">${fmtMoney(totalCashCredit)} ريال</span>
            </div>
            <div class="total-box total-box-gold">
              <span class="total-label">قيمة القيد</span>
              <span class="total-value gold">${fmtMoney(cashEntryValue)} ريال</span>
            </div>
          </div>
        `

    // ✅ صندوق كتابة الإجمالي (للريال فقط)
    const wordsBox = cashWords
      ? `
          <div class="total-words">
            <strong>الإجمالي كتابةً:</strong> ${cashWords}
          </div>
        `
      : ''

    const bodyHTML = `
      ${headerHTML}

      <div class="doc-title">قيد يومية — رقم ${j.doc_no || '—'}</div>

      <div class="doc-meta">
        <div><strong>التاريخ:</strong> ${j.journal_date ? dayjs(j.journal_date).format('YYYY-MM-DD') : '—'}</div>
        
        <div><strong>النوع:</strong> ${isGold ? 'ذهب' : 'نقدي'}</div>
      </div>

      ${j.description ? `<div class="doc-desc"><strong>البيان:</strong> ${j.description}</div>` : ''}

      <table class="je-table">
        <thead>${headerRow}</thead>
        <tbody>
          ${bodyRows}
          ${totalsRow}
        </tbody>
      </table>

      ${totalsCards}
      ${wordsBox}

      <div class="foot">
        <div>طُبع بواسطة: ${payload.printed_by || '—'}</div>
        <div>بتاريخ: ${dayjs(payload.print_at).format('YYYY-MM-DD HH:mm')}</div>
      </div>
    `

    const extraStyles = `
      .je-table th {
        background: #b8860b !important;
        color: #ffffff !important;
        font-weight: 700 !important;
        text-align: center !important;
        border-color: #9b7208 !important;
        padding: 10px 8px !important;
      }
      .je-table td { padding: 8px 10px !important; font-size: 12px; }
      .je-table .total-row td {
        background: #fff9e8 !important;
        border-top: 2px solid #b8860b !important;
        padding: 10px 8px !important;
        font-size: 12px;
      }

      .doc-desc {
        background: #fef9e7;
        border: 1px solid #f2d98d;
        border-radius: 6px;
        padding: 8px 12px;
        margin: 8px 0;
        font-size: 12px;
        color: #7a5d00;
      }

      .totals-wrap {
        display: flex;
        gap: 10px;
        margin-top: 14px;
        flex-wrap: wrap;
        justify-content: center;
      }
      .total-box {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        min-width: 145px;
        padding: 8px 14px;
        border-radius: 8px;
        background: #ffffff;
        border: 1px solid #ead9a5;
      }
      .total-box-gold {
        background: #fff9e8;
        border-color: #d4a017;
      }
      .total-label {
        color: #666;
        font-size: 11px;
        font-weight: 600;
        white-space: nowrap;
      }
      .total-value {
        font-size: 14px;
        font-weight: 800;
        font-variant-numeric: tabular-nums;
      }
      .total-value.green { color: #389e0d; }
      .total-value.red   { color: #cf1322; }
      .total-value.gold  { color: #b8860b; }

      /* ✅ صندوق كتابة الإجمالي */
      .total-words {
        margin-top: 14px;
        padding: 12px 18px;
        background: linear-gradient(135deg, #fef9e7, #fdf2d0);
        border: 1px solid #d4a017;
        border-radius: 8px;
        font-size: 13px;
        color: #7a5d00;
        text-align: center;
        line-height: 1.9;
      }
      .total-words strong {
        color: #b8860b;
        font-weight: 800;
        margin-left: 6px;
      }
    `

    openPrintWindow({
      title: `قيد يومية ${j.doc_no || ''}`,
      bodyHTML,
      extraStyles,
    })
  }

  return null
}