import { Dropdown, Button } from 'antd'
import {
    EditOutlined,
    EyeOutlined,
    DeleteOutlined,
    MoreOutlined,
} from '@ant-design/icons'
import { confirmDelete } from '../../lib/confirmDelete.jsx'

const fmtWeight = (v) => (v != null ? Number(v).toFixed(3) : '0.000')
const fmtMoney = (v) =>
    v != null
        ? Number(v).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        : '0.00'

export function buildGoldOpeningBalanceColumns({ onEdit, onDelete, onView }) {
    return [
        {
            key: 'actions',
            label: 'إجراءات',
            width: 80,
            sortable: false,
            fixed: 'start',
            align: 'center',
            render: (_, row) => {
                const handleDelete = () => {
                    confirmDelete({
                        name: row.doc_no ? `مستند ${row.doc_no}` : row.store_name || 'رصيد افتتاحي',
                        onOk: () => onDelete(row),
                    })
                }

                const menuItems = [
                    {
                        key: 'edit',
                        icon: <EditOutlined style={{ color: '#197fdd', fontSize: 15 }} />,
                        label: <span style={{ color: '#197fdd', fontWeight: 600 }}>تعديل</span>,
                        onClick: () => onEdit(row),
                    },
                    {
                        key: 'view',
                        icon: <EyeOutlined style={{ color: '#d4a017', fontSize: 15 }} />,
                        label: <span style={{ color: '#b8860b', fontWeight: 600 }}>عرض</span>,
                        onClick: () => onView(row),
                    },
                    { type: 'divider' },
                    {
                        key: 'delete',
                        icon: <DeleteOutlined style={{ color: '#ff4d4f', fontSize: 15 }} />,
                        label: <span style={{ color: '#ff4d4f', fontWeight: 600 }}>حذف</span>,
                        danger: true,
                        onClick: handleDelete,
                    },
                ]

                return (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                        <Dropdown menu={{ items: menuItems }} trigger={['click']} placement="bottom">
                            <Button
                                type="text"
                                icon={<MoreOutlined style={{ fontSize: 18, color: '#6b7280' }} />}
                                style={{
                                    width: 34,
                                    height: 34,
                                    borderRadius: 10,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    background: '#fafafa',
                                    border: '1px solid #f0f0f0',
                                    transition: 'all 0.2s ease',
                                    padding: 0,
                                }}
                            />
                        </Dropdown>
                    </div>
                )
            },
        },
        { key: 'doc_no', label: 'رقم المستند', width: 120, sortable: true, align: 'center' },
        { key: 'opening_date', label: 'التاريخ', width: 120, sortable: true, align: 'center' },
        { key: 'store_name', label: 'الخزينة', width: 140, sortable: true, align: 'center' },
        { key: 'karat_name', label: 'العيار', width: 110, align: 'center' },
        {
            key: 'weight',
            label: 'الوزن',
            width: 120,
            align: 'center',
            render: (v) => fmtWeight(v),
        },
        {
            key: 'price',
            label: 'السعر',
            width: 130,
            align: 'center',
            render: (v) => fmtMoney(v),
        },
        {
            key: 'total_amount',
            label: 'الإجمالي',
            width: 140,
            align: 'center',
            render: (v, row) => {
                const val = v != null ? Number(v) : Number(row.weight || 0) * Number(row.price || 0)
                return fmtMoney(val)
            },
        },
        { key: 'description', label: 'البيان', width: 220, align: 'right' },
        {
            key: 'created_at',
            label: 'تاريخ الإنشاء',
            width: 160,
            align: 'center',
            render: (v) => (v ? new Date(v).toLocaleString('en-US') : '—'),
        },
    ]
}