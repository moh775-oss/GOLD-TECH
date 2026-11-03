import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import arEG from 'antd/locale/ar_EG'
import 'antd/dist/reset.css'
import './index.css'
import App from './App.jsx'
import { antdTheme } from './theme'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ConfigProvider direction="rtl" locale={arEG} theme={antdTheme}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ConfigProvider>
  </StrictMode>,
)