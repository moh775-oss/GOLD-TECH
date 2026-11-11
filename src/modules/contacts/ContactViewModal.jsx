import { Modal, Descriptions, Tag, Divider } from 'antd'
import { CONTACT_TYPE_LABELS } from './contactsConfig.jsx'

export default function ContactViewModal({ open, onClose, contact }) {
  if (!contact) return null

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title={`تفاصيل: ${contact.name}`}
      footer={null}
      width={720}
      className="modal-md"
    >
      <Descriptions bordered column={2} size="small">
        <Descriptions.Item label="الرقم">{contact.id}</Descriptions.Item>
        <Descriptions.Item label="الاسم">{contact.name}</Descriptions.Item>
        <Descriptions.Item label="الاسم بالإنجليزية">{contact.name_en || '—'}</Descriptions.Item>
        <Descriptions.Item label="النوع">
          <Tag color="gold">{CONTACT_TYPE_LABELS[contact.contact_type] || contact.contact_type}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="الجوال">{contact.mobile || '—'}</Descriptions.Item>
        <Descriptions.Item label="الهاتف">{contact.phone || '—'}</Descriptions.Item>
        <Descriptions.Item label="واتساب">{contact.whatsapp || '—'}</Descriptions.Item>
        <Descriptions.Item label="البريد">{contact.email || '—'}</Descriptions.Item>
        <Descriptions.Item label="الموقع">{contact.website || '—'}</Descriptions.Item>
        <Descriptions.Item label="الرقم الضريبي">{contact.tax_number || '—'}</Descriptions.Item>
        <Descriptions.Item label="السجل التجاري">{contact.commercial_register || '—'}</Descriptions.Item>
        <Descriptions.Item label="الهوية الوطنية">{contact.national_id || '—'}</Descriptions.Item>
        <Descriptions.Item label="المدينة">{contact.city || '—'}</Descriptions.Item>
        <Descriptions.Item label="الحي">{contact.district || '—'}</Descriptions.Item>
        <Descriptions.Item label="الشارع">{contact.street || '—'}</Descriptions.Item>
        <Descriptions.Item label="رقم المبنى">{contact.building_no || '—'}</Descriptions.Item>
        <Descriptions.Item label="الرمز البريدي">{contact.postal_code || '—'}</Descriptions.Item>
        <Descriptions.Item label="الدولة">{contact.country || '—'}</Descriptions.Item>
        <Descriptions.Item label="حد الائتمان">{contact.credit_limit || '—'}</Descriptions.Item>
        <Descriptions.Item label="الرصيد الافتتاحي">{contact.opening_balance || '—'}</Descriptions.Item>
        <Descriptions.Item label="الحالة">
          <Tag color={contact.is_active ? 'green' : 'red'}>
            {contact.is_active ? 'نشط' : 'موقوف'}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="ملاحظات" span={2}>
          {contact.notes || '—'}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  )
}