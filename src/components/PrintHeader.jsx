export default function PrintHeader({ info, logoHeight = 80, borderColor = '#EEC662' }) {
  if (!info) return null

  const placeholder = '—'
  const v = (x) => x || placeholder

  const logoUrl = info.logo_url

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 16,
        border: `1.5px solid ${borderColor}`,
        borderRadius: 10,
        padding: '10px 16px',
        marginBottom: 16,
        background: '#FFFFFF',
      }}
    >
      {/* ===== يمين: عربي ===== */}
      <div style={{ flex: 1, textAlign: 'right', fontSize: 12, lineHeight: 1.6 }}>
        <div style={{ fontWeight: 800, fontSize: 15, color: '#7a5d00', marginBottom: 2 }}>
          {v(info.name)}
        </div>
        <div>الرقم الضريبي: {v(info.tax_number)}</div>
        <div>السجل التجاري: {v(info.commercial_register)}</div>
        <div>العنوان: {v(info.address)}</div>
        <div>البريد: {v(info.email)}</div>
      </div>

      {/* ===== وسط: الشعار ===== */}
      <div
        style={{
          flex: '0 0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: 120,
        }}
      >
        {logoUrl ? (
          <img
            src={logoUrl}
            alt="logo"
            style={{ maxHeight: logoHeight, maxWidth: 160, objectFit: 'contain' }}
          />
        ) : (
          <div
            style={{
              width: 100,
              height: logoHeight,
              border: '1px dashed #ccc',
              borderRadius: 6,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#aaa',
              fontSize: 11,
            }}
          >
            الشعار
          </div>
        )}
      </div>

      {/* ===== يسار: إنجليزي ===== */}
      <div
        dir="ltr"
        style={{ flex: 1, textAlign: 'left', fontSize: 11, lineHeight: 1.6, color: '#555' }}
      >
        <div style={{ fontWeight: 800, fontSize: 14, color: '#7a5d00', marginBottom: 2 }}>
          {v(info.name_en)}
        </div>
        <div>VAT: {v(info.tax_number)}</div>
        <div>CR: {v(info.commercial_register)}</div>
        <div>Address: {v(info.address)}</div>
        <div>Email: {v(info.email)}</div>
      </div>
    </div>
  )
}