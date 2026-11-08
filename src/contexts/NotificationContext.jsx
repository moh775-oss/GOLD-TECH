import { createContext, useContext, useMemo } from 'react'
import { notification } from 'antd'
import {
  CheckCircleFilled,
  CloseCircleFilled,
  WarningFilled,
  InfoCircleFilled,
} from '@ant-design/icons'
import { sounds } from '../lib/sounds'

const NotificationContext = createContext(null)

const THEME = {
  success: { bg: '#52c41a', icon: <CheckCircleFilled /> },
  error:   { bg: '#ff4d4f', icon: <CloseCircleFilled /> },
  warning: { bg: '#faad14', icon: <WarningFilled /> },
  info:    { bg: '#1677ff', icon: <InfoCircleFilled /> },
}

export function NotificationProvider({ children }) {
  const [api, contextHolder] = notification.useNotification({
    placement: 'topRight',
    duration: 1.6,
    top: 24,
    closable: false,
    rtl: true,
  })

  const show = (type, message) => {
    const t = THEME[type] || THEME.info
    api.open({
      message: (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#fff', fontWeight: 600, fontSize: 15, whiteSpace: 'nowrap' }}>
          <span style={{ fontSize: 18, display: 'inline-flex' }}>{t.icon}</span>
          <span>{message || ''}</span>
        </span>
      ),
      icon: null,
      closable: false,
      duration: 1.6,
      style: {
        background: t.bg,
        borderRadius: 10,
        boxShadow: '0 6px 20px rgba(0,0,0,0.18)',
        padding: '10px 16px',
        minWidth:'180px',
        width: 'fit-content',
        maxWidth: '90vw',
        marginInlineStart: 'auto',
      },
    })
    sounds[type]?.()
  }

  const value = useMemo(() => ({
    success: (msg) => show('success', msg),
    error:   (msg) => show('error', msg),
    warning: (msg) => show('warning', msg),
    info:    (msg) => show('info', msg),
    raw: api,
  }), [api])

  return (
    <NotificationContext.Provider value={value}>
      {contextHolder}
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotification = () => {
  const ctx = useContext(NotificationContext)
  if (!ctx) throw new Error('useNotification must be used inside NotificationProvider')
  return ctx
}