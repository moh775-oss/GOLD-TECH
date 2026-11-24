import { Tag, Dropdown, Button } from 'antd'
import { EditOutlined, EyeOutlined, DeleteOutlined, MoreOutlined } from '@ant-design/icons'
import { confirmDelete } from '../../lib/confirmDelete.jsx'

const ITEM_TYPE_MAP = {
  scrap: 'كسر مصاغ', pure: 'ذهب صافي', worked: 'مصاغ',
  silver: 'فضة', diamond: 'الماس', for_sale: 'للبيع', raw: 'خام',
}
const GOLD_TYPE_MAP = { scrap: 'كسر', worked: 'مصاغ', pure: 'صافي' }

export function buildItemColumns({ onEdit, onDelete, onView }) {
  return [
    {
      key: 'actions',
      label: 'إجراءات',
      width: 80,
      sortable: false,
      fixed: 'start',
      align: 'center',
      render: (_, row) => {
        const handleDelete = () => confirmDelete({ name: row.name, onOk: () => onDelete(row) })

        const menuItems = [
          { key: 'edit', icon: <EditOutlined style={{ color: '#197fdd', fontSize: 15 }} />, label: <span style={{ color: '#197fdd', fontWeight: 600 }}>تعديل</span>, onClick: () => onEdit(row) },
          { key: 'view', icon: <EyeOutlined style={{ color: '#d4a017', fontSize: 15 }} />, label: <span style={{ color: '#b8860b', fontWeight: 600 }}>عرض</span>, onClick: () => onView(row) },
          { type: 'divider' },
          { key: 'delete', icon: <DeleteOutlined style={{ color: '#ff4d4f', fontSize: 15 }} />, label: <span style={{ color: '#ff4d4f', fontWeight: 600 }}>حذف</span>, danger: true, onClick: handleDelete },
        ]

        return (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
            <Dropdown menu={{ items: menuItems }} trigger={['click']} placement="bottom">
              <Button type="text" icon={<MoreOutlined style={{ fontSize: 18, color: '#6b7280' }} />} style={{ width: 34, height: 34, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafafa', border: '1px solid #f0f0f0', padding: 0 }} />
            </Dropdown>
          </div>
        )
      },
    },
    {
      key: 'barcode',
      label: 'الباركود',
      width: 110,
      align: 'center',
      render: (v) => <code style={{ color: '#b8860b', fontWeight: 700, fontSize: 12 }}>{v || '—'}</code>,
    },
    // { key: 'code', label: 'الكود', width: 100, align: 'center' },
    { key: 'name', label: 'الاسم', width: 180, sortable: true, align: 'center' },
    { key: 'name_en', label: 'الاسم بالإنجليزية', width: 160, align: 'center' },
    {
      key: 'category',
      label: 'المجموعة',
      width: 140,
      align: 'center',
      render: (_, row) => {
        const name = row.category?.name
        return name ? <Tag color="gold">{name}</Tag> : '—'
      },
    },
    {
      key: 'karat',
      label: 'العيار',
      width: 100,
      align: 'center',
      render: (_, row) => {
        const name = row.karat?.name
        return name ? <Tag color="orange">{name}</Tag> : '—'
      },
    },
    { key: 'unit', label: 'الوحدة', width: 90, align: 'center' },
    {
      key: 'item_type',
      label: 'النوع',
      width: 110,
      align: 'center',
      render: (v) => <Tag color="blue">{ITEM_TYPE_MAP[v] || v || '—'}</Tag>,
    },
    {
      key: 'gold_type',
      label: 'نوع الذهب',
      width: 110,
      align: 'center',
      render: (v) => <Tag color="gold">{GOLD_TYPE_MAP[v] || v || '—'}</Tag>,
    },
    // {
    //   key: 'weight',
    //   label: 'الوزن',
    //   width: 90,
    //   align: 'center',
    //   render: (v) => v != null ? Number(v).toFixed(3) : '—',
    // },
    {
      key: 'sale_price_with_tax',
      label: 'سعر البيع ',
      width: 130,
      align: 'center',
      render: (v) => v != null ? <span style={{ color: '#389e0d', fontWeight: 700 }}>{Number(v).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span> : '—',
    },
    {
      key: 'purchase_price_with_tax',
      label: 'سعر الشراء',
      width: 130,
      align: 'center',
      render: (v) => v != null ? <span style={{ color: '#1890ff', fontWeight: 700 }}>{Number(v).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span> : '—',
    },
    {
      key: 'is_active',
      label: 'الحالة',
      width: 90,
      align: 'center',
      render: (v) => <Tag color={v ? 'green' : 'red'}>{v ? 'نشط' : 'موقوف'}</Tag>,
    },
  ]
}