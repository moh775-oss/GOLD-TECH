import { useState } from 'react'
import { Modal, Input, InputNumber, Button, Checkbox, Space } from 'antd'
import { PrinterFilled } from '@ant-design/icons'
import Barcode from 'react-barcode'
import './ItemFormModal.css'

export default function ItemPrintModal({ open, onClose, data }) {
  const [copies, setCopies] = useState(1)
  const [labelWidth, setLabelWidth] = useState(40)
  const [labelHeight, setLabelHeight] = useState(30)
  const [showName, setShowName] = useState(true)
  const [showPrice, setShowPrice] = useState(true)
  const [showUnit, setShowUnit] = useState(true)
  const [companyName, setCompanyName] = useState('جولد تاك')

  const handlePrint = () => {
    if (!data.barcode) return
    const win = window.open('', '_blank', 'width=600,height=700')
    if (!win) return

    const html = `
      <!DOCTYPE html>
      <html dir="rtl">
      <head>
        <meta charset="utf-8" />
        <title>Print</title>
        <style>
          @page { size: ${labelWidth}mm ${labelHeight}mm; margin: 0; }
          * { box-sizing: border-box; }
          body { margin: 0; padding: 0; font-family: 'Cairo', Arial, sans-serif; }
          .page {
            width: ${labelWidth}mm; height: ${labelHeight}mm;
            display: flex; align-items: center; justify-content: center;
            page-break-after: always; overflow: hidden;
          }
          .page:last-child { page-break-after: auto; }
          .label { width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 1mm; text-align: center; }
          .company { font-size: 8pt; font-weight: 800; color: #b8860b; margin-bottom: 0.8mm; }
          .name { font-size: 9pt; font-weight: 700; margin-bottom: 1mm; }
          .barcode { max-width: 100%; height: auto; }
          .bottom { display: flex; justify-content: space-between; width: 100%; margin-top: 1mm; padding: 0 1mm; }
          .price { font-size: 10pt; font-weight: 800; }
          .unit { font-size: 9pt; font-weight: 700; }
        </style>
      </head>
      <body>
        ${Array.from({ length: copies }).map(() => `
          <div class="page">
            <div class="label">
              ${companyName ? `<div class="company">${companyName}</div>` : ''}
              ${showName && data.name ? `<div class="name">${data.name}</div>` : ''}
              <svg class="barcode" data-value="${data.barcode}"></svg>
              ${(showPrice || showUnit) ? `
                <div class="bottom">
                  <span class="price">${showPrice ? Number(data.price || 0).toFixed(2) : ''}</span>
                  <span class="unit">${showUnit ? data.unit || '' : ''}</span>
                </div>
              ` : ''}
            </div>
          </div>
        `).join('')}
        <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.6/dist/JsBarcode.all.min.js"></script>
        <script>
          window.onload = () => {
            document.querySelectorAll('.barcode').forEach(svg => {
              JsBarcode(svg, svg.getAttribute('data-value'), {
                format: 'CODE128', width: 1.5, height: 40, fontSize: 11, margin: 0, displayValue: true
              })
            })
            setTimeout(() => { window.print(); setTimeout(() => window.close(), 500) }, 400)
          }
        </script>
      </body>
      </html>
    `
    win.document.write(html)
    win.document.close()
  }

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title="طباعة ملصق الباركود"
      width={560}
      footer={[
        <Button key="close" onClick={onClose}>إغلاق</Button>,
        <Button key="print" type="primary" icon={<PrinterFilled />} onClick={handlePrint} disabled={!data.barcode}>
          طباعة ({copies})
        </Button>,
      ]}
    >
      <div className="print-form">
        <div className="print-row">
          <label>اسم الشركة:</label>
          <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
        </div>

        <div className="print-row">
          <label>عدد النسخ:</label>
          <InputNumber min={1} max={500} value={copies} onChange={setCopies} style={{ width: 80 }} />
          <label>العرض mm:</label>
          <InputNumber min={20} max={120} value={labelWidth} onChange={setLabelWidth} style={{ width: 70 }} />
          <label>الارتفاع mm:</label>
          <InputNumber min={15} max={120} value={labelHeight} onChange={setLabelHeight} style={{ width: 70 }} />
        </div>

        <div className="print-row">
          <Checkbox checked={showName} onChange={(e) => setShowName(e.target.checked)}>اسم الصنف</Checkbox>
          <Checkbox checked={showPrice} onChange={(e) => setShowPrice(e.target.checked)}>السعر</Checkbox>
          <Checkbox checked={showUnit} onChange={(e) => setShowUnit(e.target.checked)}>الوحدة</Checkbox>
        </div>

        {data.barcode && (
          <div className="print-preview">
            <div className="preview-label">
              {companyName && <div className="preview-company">{companyName}</div>}
              {showName && data.name && <div className="preview-name">{data.name}</div>}
              <Barcode value={data.barcode} height={44} width={1.4} fontSize={11} margin={4} />
              {(showPrice || showUnit) && (
                <div className="preview-bottom">
                  {showPrice && <span className="preview-price">{Number(data.price || 0).toFixed(2)}</span>}
                  {showUnit && <span className="preview-unit">{data.unit}</span>}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Modal>
  )
}