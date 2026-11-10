import { Button, Space } from 'antd'
import { useNotification } from '../../lib/notify'

export default function DemoPage() {
  const notify = useNotification()

  return (
    <Space wrap>
      <Button type="primary" onClick={() => notify.success('تم الحفظ بنجاح')}>
        نجاح
      </Button>
      <Button danger onClick={() => notify.error('فشل الحفظ', 'تحقق من البيانات')}>
        فشل
      </Button>
      <Button style={{ background: '#fa8c16', color: '#fff' }} onClick={() => notify.warning('تنبيه', 'الرصيد منخفض')}>
        تحذير
      </Button>
      <Button style={{ background: '#1677ff', color: '#fff' }} onClick={() => notify.info('معلومة', 'يوجد تحديث جديد')}>
        معلومة
      </Button>
    </Space>
  )
}