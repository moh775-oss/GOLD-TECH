import { useEffect, useRef } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import dayjs from 'dayjs'
import { Tafgeet } from 'tafgeet-arabic'
import { useAuth } from '../../contexts/AuthContext.jsx'
import PrintHeader from '../../components/PrintHeader.jsx'
import { openPrintWindow, fmtMoney } from '../../lib/printHtml.jsx'

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

function buildPartyRowsHTML(contact) {
  const taxNo = String(contact.tax_no || contact.vat_no || contact.tax_number || '').trim()
  const address = String(contact.address || contact.city || '').trim()
  const mobile = String(contact.mobile || contact.phone || '').trim()
  const accNo = String(contact.acc_no || '').trim()

  const infoCells = []
  if (accNo) infoCells.push({ label: 'رقم الحساب', value: accNo })
  if (mobile) infoCells.push({ label: 'الجوال', value: mobile })
  if (taxNo) infoCells.push({ label: 'الرقم الضريبي', value: taxNo })
  if (address) infoCells.push({ label: 'العنوان', value: address, fullRow: true })

  const extraRows = []
  let i = 0
  while (i < infoCells.length) {
    const curr = infoCells[i]
    if (curr.fullRow) {
      extraRows.push(`
        <tr>
          <td class="k">${curr.label}</td>
          <td class="v" colspan="3">${curr.value}</td>
        </tr>
      `)
      i += 1
    } else {
      const next = infoCells[i + 1]
      if (next && !next.fullRow) {
        extraRows.push(`
          <tr>
            <td class="k">${curr.label}</td>
            <td class="v">${curr.value}</td>
            <td class="k">${next.label}</td>
            <td class="v">${next.value}</td>
          </tr>
        `)
        i += 2
      } else {
        extraRows.push(`
          <tr>
            <td class="k">${curr.label}</td>
            <td class="v" colspan="3">${curr.value}</td>
          </tr>
        `)
        i += 1
      }
    }
  }

  return extraRows.join('')
}

export default function SalesClosingPrint({ open, onClose, payload }) {
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

    const c = payload.closing || {}
    const contact = c.contact || {}
    const hasGold = c.transaction_type === 'gold' || c.transaction_type === 'both'
    const hasCash = c.transaction_type === 'cash' || c.transaction_type === 'both'

    const weight = Number(c.net_weight || c.jewelry_weight || 0)
    const gramPrice = Number(c.gram_price || 0)
    const netAmount = Number(c.net_amount || 0)
    const jewelryAmount = Number(c.jewelry_amount || 0)
    const goldTotal = Number((netAmount + jewelryAmount).toFixed(2))
    const cashPaid = Number(c.total_amount || 0)

    const typeLabel =
      c.transaction_type === 'both'
        ? 'ذهب وريال'
        : c.transaction_type === 'gold'
        ? 'ذهب'
        : 'نقدي'

    const cashWords = cashPaid > 0 ? amountToArabicWords(cashPaid) : ''
    const headerHTML = session?.company_info
      ? renderToStaticMarkup(<PrintHeader info={session.company_info} />)
      : ''

    const extraPartyRowsHTML = buildPartyRowsHTML(contact)

    const goldSectionHTML = hasGold
      ? `
      <div class="block-label gold-label">بيانات الذهب</div>
      <table class="je-table gold-table">
        <thead>
          <tr>
            <th>الوزن (جم)</th>
            <th>العيار</th>
            <th>سعر الجرام</th>
            
            
            <th>إجمالي الذهب</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="color:#8f6200;font-weight:800;">${weight.toFixed(3)}</td>
            <td style="font-weight:800;">${c.karat?.name || '—'}</td>
            <td style="font-weight:700;">${fmtMoney(gramPrice)}</td>
            
            
            <td style="color:#8f6200;font-weight:800;">${fmtMoney(goldTotal)}</td>
          </tr>
        </tbody>
      </table>
    `
      : ''

    const cashSectionHTML = hasCash
      ? `
      <div class="block-label cash-label">بيانات المبالغ النقدية</div>
      <table class="je-table cash-table">
        <thead>
          <tr>
            <th>البيان</th>
            <th>المبلغ المدفوع / المسلم (ر.س)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="font-weight:800;">المبلغ النقدي المسلم من العميل</td>
            <td style="color:#1d4ed8;font-weight:800;font-size:13px;">${fmtMoney(cashPaid)}</td>
          </tr>
        </tbody>
      </table>
      ${cashWords ? `<div class="total-words"><strong>المبلغ كتابةً:</strong> ${cashWords}</div>` : ''}
    `
      : ''

    const bodyHTML = `
      <div class="print-sheet">
        ${headerHTML}

        <div class="doc-title">تسكير مبيعات</div>

        <div class="doc-strip">
          <div class="strip-right"><strong>رقم المستند / الفاتورة:</strong> ${c.doc_no || '—'}</div>
          
          <div class="strip-left"><strong>التاريخ:</strong> ${c.doc_date ? dayjs(c.doc_date).format('YYYY-MM-DD') : '—'}</div>
        </div>

        <table class="party-table">
          <thead>
            <tr>
              <th colspan="4">بيانات العميل</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="k">اسم العميل</td>
              <td class="v" colspan="3">${contact.name || '—'}</td>
            </tr>
            ${extraPartyRowsHTML}
          </tbody>
        </table>

        ${goldSectionHTML}
        ${cashSectionHTML}

        ${c.notes ? `<div class="doc-desc"><strong>البيان / ملاحظات:</strong> ${c.notes}</div>` : ''}

        <div class="foot">
          <div>طُبع بواسطة: ${payload.printed_by || '—'}</div>
          <div>بتاريخ: ${dayjs(payload.print_at || new Date()).format('YYYY-MM-DD HH:mm')}</div>
        </div>
      </div>
    `

    const extraStyles = `
      .print-sheet {
        max-width: 980px;
        margin: 0 auto;
        font-weight: 700;
      }
      .doc-strip {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        padding: 9px 14px;
        margin: 10px 0 12px;
        background: rgba(184, 134, 11, 0.12);
        border: 1px solid rgba(184, 134, 11, 0.45);
        border-radius: 8px;
        font-size: 13px;
        font-weight: 800;
        color: #1f2937;
      }
      .strip-right { flex: 1; text-align: right; }
      .strip-center { flex: 1; text-align: center; }
      .strip-left { flex: 1; text-align: left; }
      .party-table {
        width: 100%;
        border-collapse: collapse;
        margin: 10px 0 14px;
        font-size: 12.5px;
      }
      .party-table th {
        background: rgba(184, 134, 11, 0.16) !important;
        color: #7a5d00 !important;
        font-weight: 800 !important;
        text-align: right;
        padding: 8px 12px;
        border: 1px solid rgba(184, 134, 11, 0.45);
      }
      .party-table td {
        padding: 8px 12px;
        border: 1px solid #d1d5db;
        text-align: right;
        font-weight: 700;
      }
      .party-table td.k {
        background: rgba(184, 134, 11, 0.08);
        color: #5c4500;
        font-weight: 800;
        width: 17%;
      }
      .party-table td.v {
        color: #111827;
        font-weight: 800;
        width: 33%;
      }
      .block-label {
        margin-top: 14px;
        margin-bottom: 6px;
        font-size: 13px;
        font-weight: 800;
        padding-right: 8px;
      }
      .gold-label {
        color: #7a5d00;
        border-right: 4px solid #b8860b;
      }
      .cash-label {
        color: #1e3a8a;
        border-right: 4px solid #2563eb;
      }
      .je-table {
        width: 100%;
        border-collapse: collapse;
      }
      .gold-table th {
        background: rgba(184, 134, 11, 0.16) !important;
        color: #7a5d00 !important;
        font-weight: 800 !important;
        text-align: center !important;
        border: 1px solid rgba(184, 134, 11, 0.45) !important;
        padding: 9px 10px !important;
        font-size: 12.5px;
      }
      .cash-table th {
        background: rgba(29, 78, 216, 0.14) !important;
        color: #1e3a8a !important;
        font-weight: 800 !important;
        text-align: center !important;
        border: 1px solid rgba(29, 78, 216, 0.45) !important;
        padding: 9px 10px !important;
        font-size: 12.5px;
      }
      .je-table td {
        padding: 9px 10px !important;
        font-size: 12.5px;
        font-weight: 700;
        text-align: center;
        border: 1px solid #d1d5db;
      }
      .total-words {
        margin-top: 12px;
        padding: 11px 18px;
        background: rgba(29, 78, 216, 0.10);
        border: 1px solid rgba(29, 78, 216, 0.45);
        border-radius: 8px;
        font-size: 13px;
        font-weight: 800;
        color: #1e3a8a;
        text-align: center;
        line-height: 1.9;
      }
      .total-words strong {
        color: #1d4ed8;
        font-weight: 800;
        margin-left: 6px;
      }
      .doc-desc {
        background: rgba(184, 134, 11, 0.08);
        border: 1px solid rgba(184, 134, 11, 0.4);
        border-radius: 8px;
        padding: 10px 14px;
        margin-top: 14px;
        font-size: 12.5px;
        font-weight: 800;
        color: #1f2937;
      }
      .foot {
        font-weight: 700;
      }
    `

    openPrintWindow({
      title: `تسكير مبيعات ${c.doc_no || ''}`,
      bodyHTML,
      extraStyles,
    })
  }

  return null
}