import { useState, useEffect, useRef, useMemo } from 'react'
import { Modal, Input, Empty } from 'antd'
import { SearchOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { searchPages } from '../config/searchIndex'

export default function SearchModal({ open, onClose }) {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef(null)

  const results = useMemo(() => searchPages(query, 10), [query])

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100)
      setQuery('')
      setSelectedIndex(0)
    }
  }, [open])

  useEffect(() => {
    setSelectedIndex(0)
  }, [results])

  const handleSelect = (item) => {
    navigate(item.path)
    onClose()
  }

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((i) => (i + 1) % Math.max(results.length, 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((i) => (i - 1 + results.length) % Math.max(results.length, 1))
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      e.preventDefault()
      handleSelect(results[selectedIndex])
    } else if (e.key === 'Escape') {
      onClose()
    }
  }

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      closable={false}
      width={680}
      centered
      styles={{
        body: { padding: 0, borderRadius: 16, overflow: 'hidden' },
        mask: { backdropFilter: 'blur(6px)', background: 'rgba(0,0,0,0.75)' },
      }}
      className="search-modal"
    >
      <div className="search-modal-inner" onKeyDown={handleKeyDown}>
        {/* ===== حقل البحث ===== */}
        <div className="search-modal-input-wrap">
          <SearchOutlined className="search-modal-icon" />
          <Input
            ref={inputRef}
            size="large"
            placeholder="ابحث عن صفحة، قسم، أو كلمة..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            bordered={false}
            className="search-modal-input"
            allowClear
          />
          <span className="search-modal-hint">ESC</span>
        </div>

        {/* ===== النتائج ===== */}
        <div className="search-modal-results">
          {query && results.length === 0 && (
            <div className="search-modal-empty">
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={`لا توجد نتائج لـ "${query}"`}
              />
            </div>
          )}

          {results.map((item, idx) => (
            <button
              key={item.path}
              className={`search-modal-result ${idx === selectedIndex ? 'is-active' : ''}`}
              onClick={() => handleSelect(item)}
              onMouseEnter={() => setSelectedIndex(idx)}
            >
              <span className="search-modal-result-section">{item.section}</span>
              <span className="search-modal-result-label">{item.label}</span>
              <ArrowLeftOutlined className="search-modal-result-arrow" />
            </button>
          ))}
        </div>
      </div>
    </Modal>
  )
}