import React from 'react'
import { Space } from 'antd'

const Blocked: React.FC = () => {
  return (
    <div className="center-page flex-1">
      <div className="card">
        <Space direction="vertical" size={20}>
          <h1 className="font-2x color-primary">
            You have exceeded your number of tries.
          </h1>
        </Space>
      </div>
    </div>
  )
}

export default Blocked
