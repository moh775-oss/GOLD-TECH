import { Modal } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'

export function confirmDelete({ name, onOk }) {
  Modal.confirm({
    title: 'تأكيد الحذف',
    icon: <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />,
    content: `هل أنت متأكد من حذف "${name}"؟`,
    okText: 'نعم، احذف',
    okType: 'danger',
    cancelText: 'إلغاء',
    centered: true,
    onOk,
  })
}