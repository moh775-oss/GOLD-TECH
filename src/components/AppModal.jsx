import { Modal } from 'antd'

export default function AppModal({ size = 'md', children, bodyStyle, ...props }) {
  const sizeConfig = {
    sm: { width: 420, maxBodyHeight: 'calc(100vh - 200px)' },
    md: { width: 640, maxBodyHeight: 'calc(100vh - 200px)' },
    lg: { width: '95vw', maxBodyHeight: 'calc(100vh - 180px)' },
  }

  const cfg = sizeConfig[size] || sizeConfig.md

  return (
    <Modal
      width={cfg.width}
      style={{ top: 20 }}
      styles={{
        body: {
          maxHeight: cfg.maxBodyHeight,
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: '16px 20px',
          ...bodyStyle,
        },
        header: {
          padding: '16px 20px',
          borderBottom: '1px solid #f0f0f0',
        },
        footer: {
          padding: '12px 20px',
          borderTop: '1px solid #f0f0f0',
        },
      }}
      {...props}
    >
      {children}
    </Modal>
  )
}