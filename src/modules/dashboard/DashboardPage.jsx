import { Row, Col } from 'antd'
import { Link } from 'react-router-dom'
import { homeCards } from './data'
import BottomBar from '../../layout/BottomBar'

export default function DashboardPage() {
  return (
    <>
      <Row gutter={[20, 20]} style={{ paddingBottom: 90 , paddingTop: 20 , paddingLeft: 20, paddingRight: 20 }}>
        {homeCards.map((item) => (
          <Col xs={12} sm={12} lg={8} key={item.path}>
            <Link to={item.path} className="home-card">
              <div className="home-card-inner">
                <div className="home-card-icon">{item.icon}</div>
                <div className="home-card-title">{item.title}</div>
                <div className="home-card-desc">{item.desc}</div>
              </div>
            </Link>
          </Col>
        ))}
      </Row>
      {/* <BottomBar /> */}
    </>
  )
}