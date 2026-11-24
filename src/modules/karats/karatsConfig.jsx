import { Tag, Dropdown, Button } from 'antd'
import { EditOutlined, DeleteOutlined, MoreOutlined } from '@ant-design/icons'
import { confirmDelete } from '../../lib/confirmDelete.jsx'

const METAL_LABEL = {
  gold:   { label: 'ذهب', color: 'gold' },
  silver: { label: 'فضة', color: 'default' },
}

export function buildKaratColumns({ onEdit, onDelete }) {
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
          { key: 'edit', icon: <EditOutlined style={{ color: '#197fdd' }} />, label: <span style={{ color: '#197fdd', fontWeight: 600 }}>تعديل</span>, onClick: () => onEdit(row) },
          { type: 'divider' },
          { key: 'delete', icon: <DeleteOutlined style={{ color: '#ff4d4f' }} />, label: <span style={{ color: '#ff4d4f', fontWeight: 600 }}>حذف</span>, danger: true, onClick: handleDelete },
        ]

        return (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Dropdown menu={{ items: menuItems }} trigger={['click']} placement="bottom">
              <Button type="text" icon={<MoreOutlined style={{ fontSize: 18, color: '#6b7280' }} />} style={{ width: 34, height: 34, borderRadius: 10, background: '#fafafa', border: '1px solid #f0f0f0' }} />
            </Dropdown>
          </div>
        )
      },
    },
    { key: 'name',      label: 'الاسم',    width: 120, sortable: true, align: 'center' },
    {
      key: 'metal_type',
      label: 'نوع المعدن',
      width: 120,
      align: 'center',
      render: (v) => {
        const m = METAL_LABEL[v] || { label: v, color: 'default' }
        return <Tag color={m.color}>{m.label}</Tag>
      },
    },
    {
      key: 'the_value',
      label: 'نسبة النقاء',
      width: 140,
      align: 'center',
      render: (v) => v != null ? Number(v).toFixed(6) : '—',
    },
    {
      key: 'is_active',
      label: 'الحالة',
      width: 100,
      align: 'center',
      render: (v) => v ? <Tag color="green">نشط</Tag> : <Tag color="red">موقوف</Tag>,
    },
    {
      key: 'created_at',
      label: 'تاريخ الإنشاء',
      width: 160,
      align: 'center',
      render: (v) => v ? new Date(v).toLocaleString('en-US') : '—',
    },
  ]
}