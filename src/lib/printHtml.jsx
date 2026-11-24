import dayjs from 'dayjs'

export function openPrintWindow({ title, bodyHTML, extraStyles = '' }) {
  const w = window.open('', '_blank', 'width=900,height=1000')
  if (!w) {
    alert('الرجاء السماح بالنوافذ المنبثقة للطباعة')
    return
  }

  w.document.write(`
    <!DOCTYPE html>
    <html dir="rtl">
    <head>
      <title>${title || 'طباعة'}</title>
      <meta charset="utf-8" />
      <style>
        @page { size: A4; margin: 12mm; }
        * { box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Arial, sans-serif; color: #111; margin: 0; padding: 0; }
        .print-wrap { padding: 4px; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { border: 1px solid #c9c9c9; padding: 6px 8px; font-size: 12px; text-align: center; }
        th { background: #fdf2d0; color: #7a5d00; font-weight: 700; }
        .foot { margin-top: 24px; display: flex; justify-content: space-between; font-size: 11px; color: #666; border-top: 1px dashed #ccc; padding-top: 8px; }
        .doc-title { text-align: center; color: #7a5d00; font-size: 15px; font-weight: 800; margin: 10px 0; }
        .doc-meta { display: flex; justify-content: space-between; font-size: 11px; color: #555; margin: 6px 0 10px; padding: 0 4px; }
        ${extraStyles}
      </style>
    </head>
    <body>
      <div class="print-wrap">${bodyHTML}</div>
      <script>
        // ✅ إغلاق تلقائي متعدد المتصفحات
        (function() {
          var closeWin = function() {
            try { window.close() } catch (e) {}
          };

          // تعيين onafterprint قبل print
          window.onafterprint = closeWin;

          // fallback لو onafterprint غير مدعوم
          if (window.matchMedia) {
            try {
              window.matchMedia('print').addListener(function(mql) {
                if (!mql.matches) setTimeout(closeWin, 200);
              });
            } catch (e) {}
          }

          window.addEventListener('load', function() {
            setTimeout(function() {
              try {
                window.print();
              } catch (e) {
                closeWin();
              }
            }, 200);
          });
        })();
      </script>
    </body>
    </html>
  `)
  w.document.close()
}

export const fmtMoney = (v) =>
  Number(v || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export const fmtDate = (v) => (v ? dayjs(v).format('YYYY-MM-DD') : '—')