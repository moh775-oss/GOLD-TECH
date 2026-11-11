import { Tag, Dropdown, Button } from 'antd'
import { EditOutlined, EyeOutlined, DeleteOutlined, MoreOutlined } from '@ant-design/icons'
import { confirmDelete } from '../../lib/confirmDelete'

export function buildCostCenterColumns({ onEdit, onDelete, onView }) {
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
    { key: 'name', label: 'الاسم', width: 200, sortable: true, align: 'center' },
    { key: 'name_en', label: 'الاسم بالإنجليزية', width: 180, align: 'center' },
    { key: 'code', label: 'الكود', width: 120, align: 'center' },
    { key: 'center_type', label: 'النوع', width: 120, align: 'center' },
    { key: 'budget_amount', label: 'الميزانية', width: 140, align: 'center', render: (v) => v != null ? Number(v).toLocaleString('ar-SA') : '—' },
    { key: 'opening_balance', label: 'رصيد افتتاحي', width: 140, align: 'center', render: (v) => v != null ? Number(v).toLocaleString('ar-SA') : '—' },
    {
      key: 'is_active',
      label: 'الحالة',
      width: 100,
      align: 'center',
      render: (v) => <Tag color={v ? 'green' : 'red'}>{v ? 'نشط' : 'موقوف'}</Tag>,
    },
  ]
}