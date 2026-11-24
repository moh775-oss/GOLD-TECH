import { Tag, Dropdown, Button, Modal, Tooltip } from 'antd'
import { EditOutlined, DeleteOutlined, MoreOutlined, CheckCircleOutlined, StopOutlined, CrownOutlined, LockOutlined } from '@ant-design/icons'
import { confirmDelete } from '../../lib/confirmDelete.jsx'
import { Link } from 'react-router-dom'

const ROLE_LABEL = {
  admin: { label: 'مدير', color: 'gold' },
  accountant: { label: 'محاسب', color: 'purple' },
  cashier: { label: 'كاشير', color: 'green' },
}

export function buildUserColumns({ onEdit, onDelete, onToggle }) {
  return [
    {
      key: 'actions',
      label: 'إجراءات',
      width: 90,
      sortable: false,
      fixed: 'start',
      align: 'center',
      render: (_, row) => {
        const isProtected = row.id === 1

        const handleDelete = () => confirmDelete({ name: row.name, onOk: () => onDelete(row) })
        const handleToggle = () => Modal.confirm({
          title: row.is_active ? 'تأكيد تعطيل المستخدم' : 'تأكيد تفعيل المستخدم',
          content: row.is_active
            ? `هل أنت متأكد من تعطيل المستخدم "${row.name}"؟`
            : `هل أنت متأكد من تفعيل المستخدم "${row.name}"؟`,
          okText: row.is_active ? 'نعم، تعطيل' : 'نعم، تفعيل',
          cancelText: 'إلغاء',
          okButtonProps: { danger: !!row.is_active },
          onOk: () => onToggle(row),
        })

        // ✅ المستخدم 1 — لا قائمة
        if (isProtected) {
          return (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Tooltip title="مدير النظام الرئيسي — محمي">
                <Button
                  type="text"
                  icon={<CrownOutlined style={{ fontSize: 18, color: '#d4a017' }} />}
                  style={{ width: 34, height: 34, borderRadius: 10, background: '#fdf3d6', border: '1px solid #e6dcc4' }}
                  disabled
                />
              </Tooltip>
            </div>
          )
        }

        const menuItems = [
          {
            key: 'edit',
            icon: <EditOutlined style={{ color: '#197fdd' }} />,
            label: <span style={{ color: '#197fdd', fontWeight: 600 }}>تعديل</span>,
            onClick: () => onEdit(row),
          },
          {
            key: 'toggle',
            icon: row.is_active ? <StopOutlined style={{ color: '#fa8c16' }} /> : <CheckCircleOutlined style={{ color: '#52c41a' }} />,
            label: <span style={{ color: row.is_active ? '#fa8c16' : '#52c41a', fontWeight: 600 }}>{row.is_active ? 'تعطيل' : 'تفعيل'}</span>,
            onClick: handleToggle,
          },
          { type: 'divider' },
          {
            key: 'delete',
            icon: <DeleteOutlined style={{ color: '#ff4d4f' }} />,
            label: <span style={{ color: '#ff4d4f', fontWeight: 600 }}>حذف</span>,
            danger: true,
            onClick: handleDelete,
          },
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
    { key: 'name', label: 'الاسم', width: 180, sortable: true, align: 'center' },
    { key: 'mobile', label: 'الجوال', width: 140, align: 'center' },
    { key: 'email', label: 'البريد', width: 200, align: 'center', render: (v) => v || '—' },
    {
      key: 'branch',
      label: 'الفرع',
      width: 140,
      align: 'center',
      render: (_, row) => row.branch?.name ? <Tag color="cyan">{row.branch.name}</Tag> : '—',
    },
    {
      key: 'role',
      label: 'الدور',
      width: 120,
      align: 'center',
      render: (v) => {
        const r = ROLE_LABEL[v] || { label: v, color: 'default' }
        return <Tag color={r.color}>{r.label}</Tag>
      },
    },
    {
      key: 'is_active',
      label: 'الحالة',
      width: 100,
      align: 'center',
      render: (v) => v ? <Tag color="green">نشط</Tag> : <Tag color="red">موقوف</Tag>,
    },
    {
      key: 'last_login_at',
      label: 'آخر دخول',
      width: 160,
      align: 'center',
      render: (v) => v ? new Date(v).toLocaleString('en-US') : '—',
    },
  ]
}