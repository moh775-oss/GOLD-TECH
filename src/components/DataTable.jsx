import { useMemo, useState } from 'react'
import { Input, Table } from 'antd'
import { SearchOutlined } from '@ant-design/icons'

export default function DataTable({
  columns = [],
  dataSource = [],
  rowKey = 'id',
  loading = false,

  // بحث (اختياري)
  searchable = false,
  searchPlaceholder = 'بحث...',
  searchKeys = [],           // أسماء الحقول التي يُبحث فيها
  onSearch,                  // إن أردت البحث من السيرفر (بدل الفلترة المحلية)
  searchValue,

  // الصفحات (اختياري)
  paginated = true,
  pageSize: initialPageSize = 20,
  pageSizeOptions = [10, 20, 50, 100],
  showPageSizeChanger = true,

  // سكرول
  scrollX = 'max-content',
  scrollY = null,            // مثال: 500

  // إضافات
  title,
  extra,                     // أزرار على يمين العنوان
  size = 'middle',
  bordered = false,
  ...rest
}) {
  const [localSearch, setLocalSearch] = useState(searchValue ?? '')

  // الفلترة المحلية (إن لم يُمرَّر onSearch)
  const filteredData = useMemo(() => {
    if (onSearch) return dataSource
    const s = (searchValue ?? localSearch).trim().toLowerCase()
    if (!s || !searchable || searchKeys.length === 0) return dataSource
    return dataSource.filter((row) =>
      searchKeys.some((key) => String(row[key] ?? '').toLowerCase().includes(s))
    )
  }, [dataSource, localSearch, searchValue, searchable, searchKeys, onSearch])

  const handleSearchChange = (e) => {
    const v = e.target.value
    setLocalSearch(v)
    onSearch?.(v)
  }

  // ترتيب افتراضي لكل عمود قابل للترتيب
  const normalizedColumns = useMemo(
    () =>
      columns.map((col, idx) => ({
        key: col.key ?? col.dataIndex ?? `col-${idx}`,
        sorter:
          col.sorter !== undefined
            ? col.sorter
            : col.dataIndex
            ? (a, b) => {
                const x = a[col.dataIndex]
                const y = b[col.dataIndex]
                if (x == null) return -1
                if (y == null) return 1
                if (typeof x === 'number' && typeof y === 'number') return x - y
                return String(x).localeCompare(String(y), 'ar')
              }
            : false,
        width: col.width,
        ...col,
      })),
    [columns]
  )

  const pagination = paginated
    ? {
        pageSize: initialPageSize,
        showSizeChanger: showPageSizeChanger,
        pageSizeOptions,
        showTotal: (total, range) => `${range[0]}-${range[1]} من ${total}`,
        ...(rest.pagination || {}),
      }
    : false

  return (
    <div>
      {(title || extra || searchable) && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 12,
            gap: 12,
            flexWrap: 'wrap',
          }}
        >
          <div style={{ fontWeight: 700, fontSize: 15 }}>{title}</div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {searchable && (
              <Input
                allowClear
                prefix={<SearchOutlined />}
                placeholder={searchPlaceholder}
                value={searchValue ?? localSearch}
                onChange={handleSearchChange}
                style={{ width: 260 }}
              />
            )}
            {extra}
          </div>
        </div>
      )}

      <Table
        rowKey={rowKey}
        columns={normalizedColumns}
        dataSource={filteredData}
        loading={loading}
        size={size}
        bordered={bordered}
        pagination={pagination}
        scroll={{ x: scrollX, y: scrollY }}
        {...rest}
      />
    </div>
  )
}