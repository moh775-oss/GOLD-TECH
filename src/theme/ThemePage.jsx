import { Card, Row, Col, Typography, Tag } from 'antd'
import { colors } from './colors'

const { Title, Text } = Typography

function Swatch({ name, value }) {
  return (
    <Card size="small" style={{ background: value, borderColor: '#2e2e2e' }}>
      <div style={{ color: isLight(value) ? '#0a0a0a' : '#f5f5f5' }}>
        <Text strong style={{ color: 'inherit' }}>{name}</Text>
        <div style={{ fontSize: 12, opacity: 0.8 }}>{value}</div>
      </div>
    </Card>
  )
}

// نحسب هل اللون فاتح لنضع نصاً داكناً فوقه
function isLight(hex) {
  const c = hex.replace('#', '')
  const r = parseInt(c.substring(0, 2), 16)
  const g = parseInt(c.substring(2, 4), 16)
  const b = parseInt(c.substring(4, 6), 16)
  return (r * 299 + g * 587 + b * 114) / 1000 > 150
}

function Group({ title, group }) {
  return (
    <>
      <Title level={4} style={{ marginTop: 24 }}>{title}</Title>
      <Row gutter={[12, 12]}>
        {Object.entries(group).map(([key, value]) => (
          <Col xs={12} sm={8} md={6} lg={4} key={key}>
            <Swatch name={key} value={value} />
          </Col>
        ))}
      </Row>
    </>
  )
}

export default function ThemePage() {
  return (
    <div>
      <Title level={3}>تعريف الألوان</Title>
      <Text type="secondary">
        استخدم هذه الأسماء في كل مكان بدل كتابة الأكواد مباشرة.
      </Text>
      <Group title="الأسود" group={colors.black} />
      <Group title="الذهبي" group={colors.gold} />
      <Group title="النصوص" group={colors.text} />
      <Group title="الحالات" group={colors.state} />
      <Group title="الأسطح" group={colors.surface} />
      <div style={{ marginTop: 24 }}>
        <Tag color={colors.gold[600]}>primary</Tag>
        <Tag color={colors.state.success}>success</Tag>
        <Tag color={colors.state.warning}>warning</Tag>
        <Tag color={colors.state.error}>error</Tag>
      </div>
    </div>
  )
}