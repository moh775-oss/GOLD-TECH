import { useEffect, useRef } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import dayjs from 'dayjs'
import { useAuth } from '../../contexts/AuthContext.jsx'
import PrintHeader from '../../components/PrintHeader.jsx'
import { openPrintWindow, fmtMoney } from '../../lib/printHtml.jsx'

export default function GoldOpeningBalancePrint({ open, onClose, payload }) {
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

        const rows = Array.isArray(payload.rows) ? payload.rows : []
        const totalWeight = Number(payload.totalWeight || 0)
        const totalAmount = Number(payload.totalAmount || 0)

        const headerHTML = session?.company_info
            ? renderToStaticMarkup(<PrintHeader info={session.company_info} />)
            : ''

        const rowsHTML = rows.length
            ? rows
                .map((r) => {
                    const w = Number(r.weight || 0)
                    const p = Number(r.price || 0)
                    const t = r.total_amount != null ? Number(r.total_amount) : w * p
                    return `
          <tr>
            <td>${r.opening_date ? dayjs(r.opening_date).format('DD/MM/YYYY') : '&nbsp;'}</td>
            <td class="doc-bold">${r.doc_no || '&nbsp;'}</td>
            <td>${r.store_name || '&nbsp;'}</td>
            <td class="karat-cell">${r.karat_name || '&nbsp;'}</td>
            <td class="weight-cell">${w > 0 ? w.toFixed(3) : '&nbsp;'}</td>
            <td>${p > 0 ? fmtMoney(p) : '&nbsp;'}</td>
            <td class="total-cell">${t > 0 ? fmtMoney(t) : '&nbsp;'}</td>
            <td class="desc-full">${r.description || '&nbsp;'}</td>
            <td>${r.user_name || '&nbsp;'}</td>
          </tr>
        `
                })
                .join('')
            : `<tr><td colspan="9" style="padding:14px;color:#777;">لا توجد سجلات</td></tr>`

        const bodyHTML = `
      <div class="print-sheet">
        ${headerHTML}

        <div class="title-banner">كشف أرصدة الذهب الافتتاحية</div>

        <table class="gob-table">
          <thead>
            <tr>
              <th>التاريخ</th>
              <th>رقم المستند</th>
              <th>الخزينة</th>
              <th>العيار</th>
              <th>الوزن (جم)</th>
              <th>السعر</th>
              <th>الإجمالي</th>
              <th>البيان</th>
              <th>المستخدم</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHTML}
          </tbody>
        </table>

        <div class="total-bar">
          <span>إجمالي الوزن: <strong>${totalWeight.toFixed(3)} جم</strong></span>
          <span>|</span>
          <span>إجمالي المبالغ: <strong>${fmtMoney(totalAmount)}</strong></span>
          <span>|</span>
          <span>عدد القيود: <strong>${rows.length}</strong></span>
        </div>

        <div class="foot">
          <div>طُبع بواسطة: ${payload.printedBy || '—'}</div>
          <div>بتاريخ: ${payload.printedAt || dayjs().format('YYYY-MM-DD HH:mm')}</div>
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
      .title-banner {
        text-align: center;
        font-size: 16px;
        font-weight: 900;
        color: #7a5d00;
        padding: 8px 16px;
        margin: 10px 0 12px;
        border-radius: 10px;
        background: rgba(184, 134, 11, 0.14);
        border: 1.5px solid rgba(184, 134, 11, 0.45);
      }
      .gob-table {
        width: 100%;
        border-collapse: collapse;
        border: 1.5px solid rgba(184, 134, 11, 0.55);
      }
      .gob-table th {
        background: rgba(184, 134, 11, 0.16) !important;
        color: #7a5d00 !important;
        font-weight: 800;
        font-size: 11.5px;
        padding: 7px 6px;
        border: 1.2px solid rgba(184, 134, 11, 0.45);
        text-align: center;
        white-space: nowrap;
      }
      .gob-table td {
        border: 1px solid rgba(184, 134, 11, 0.35);
        padding: 6px 5px;
        font-size: 11px;
        font-weight: 700;
        text-align: center;
        vertical-align: top;
      }
      .gob-table td.desc-full {
        text-align: right;
        white-space: normal;
        word-break: break-word;
        line-height: 1.5;
        max-width: 250px;
      }
      .gob-table td.doc-bold,
      .gob-table td.karat-cell,
      .gob-table td.weight-cell,
      .gob-table td.total-cell {
        font-weight: 900;
        color: #5c4500;
      }
      .total-bar {
        margin-top: 10px;
        padding: 8px 16px;
        border-radius: 8px;
        background: rgba(184, 134, 11, 0.14);
        border: 1.5px solid rgba(184, 134, 11, 0.48);
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 14px;
        font-size: 12.5px;
        font-weight: 800;
        color: #5c4500;
      }
      .total-bar strong {
        font-weight: 900;
        color: #7a5d00;
      }
    `

        openPrintWindow({
            title: 'كشف أرصدة الذهب الافتتاحية',
            bodyHTML,
            extraStyles,
        })
    }

    return null
}