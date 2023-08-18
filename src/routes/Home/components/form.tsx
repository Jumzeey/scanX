import React, { useState } from 'react'
import { Button, Input, Space, Form as FormAntd } from 'antd'

const Form: React.FC<{
  onSubmit: (val: any) => void
  formMessage: string
  customMessage: string
  logo: string | any
}> = ({ onSubmit, formMessage, customMessage, logo }) => {
  const [loading, setLoading] = useState<boolean>(false)

  const onFinish = async (values: any) => {
    if (values?.name?.length > 1) {
      if (typeof onSubmit === 'function') {
        setLoading(true)
        await onSubmit({ name: values?.name, phone: values?.phone })
        setLoading(false)
      }
    }
  }

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
  }

  return (
    <div className="center-page flex-1">
      <FormAntd
        className="card"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        layout="vertical"
      >
        <Space direction="vertical" size={20}>
          {logo && <img src={logo} alt="prize" style={{ height: '35px' }} />}
          <h1 className="font-2x color-primary">
            {formMessage?.length > 0 ? formMessage : 'Win a prize'}
          </h1>

          <Space direction="vertical" size={8} style={{ width: '100%' }}>
            <FormAntd.Item
              label="Name"
              name="name"
              rules={[
                {
                  required: true,
                  message: 'Please input your name!',
                },
              ]}
            >
              <Input size="large" placeholder="Name" className="primary" />
            </FormAntd.Item>
            <FormAntd.Item
              label="Phone"
              name="phone"
              rules={[
                {
                  required: true,
                  message: 'Please input your phone!',
                },
              ]}
            >
              <Input size="large" placeholder="Phone" className="primary" />
            </FormAntd.Item>
          </Space>
          <FormAntd.Item>
            <Button
              type="primary"
              size="large"
              block
              className="primary"
              htmlType="submit"
              loading={loading}
            >
              Submit
            </Button>
          </FormAntd.Item>
          {customMessage && (
            <div style={{ background: '#cd2929', padding: '5px 10px' }}>
              <p className="font-1x" style={{ color: '#fff' }}>
                {customMessage}
              </p>
            </div>
          )}
        </Space>
      </FormAntd>
    </div>
  )
}

export default Form
