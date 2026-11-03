import { Card, Empty } from 'antd'

export default function PagePlaceholder({ title, description }) {
  return (
    <Card title={title}>
      <Empty description={description} />
    </Card>
  )
}