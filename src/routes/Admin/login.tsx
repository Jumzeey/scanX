import React, { useState } from 'react'
import { LockOutlined, MailOutlined } from '@ant-design/icons'
import { Button, Input, Space, Form } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import { adminLogin } from '../../utils/api'
import { useQueryUser } from '../../lib/hooks'

const Login: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [, setQueryUser] = useQueryUser()
  const navigate = useNavigate()

  const onFinish = async (values: any) => {
    const ac = new AbortController()
    setLoading(true)
    const response = await adminLogin(values)
    if (!response.error) {
      localStorage.setItem('@Auth:token', response.data.access_token)
      setQueryUser(response.data.user)
      setTimeout(() => {
        // location.
        navigate('/admin/')
      }, 700)
    }
    setLoading(false)
    return () => ac.abort()
  }

  const onFinishFailed = (errorInfo: any) => {
    // console.log('Failed:', errorInfo)
  }

  return (
    <>
      <div className="center-page flex-1">
        <Form
          className="card"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          layout="vertical"
        >
          <Space direction="vertical" size={20}>
            <h1 className="font-2x color-primary">Login</h1>

            <div>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  {
                    required: true,
                    message: 'Please input your email!',
                  },
                ]}
              >
                <Input
                  size="large"
                  placeholder="Email"
                  className="primary"
                  prefix={<MailOutlined />}
                />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[
                  {
                    required: true,
                    message: 'Please input your password!',
                  },
                ]}
              >
                <Input
                  size="large"
                  placeholder="Password"
                  type="password"
                  className="primary"
                  prefix={<LockOutlined />}
                />
              </Form.Item>
            </div>
            <Form.Item>
              <Button
                type="primary"
                size="large"
                block
                className="primary"
                htmlType="submit"
                loading={loading}
              >
                Login
              </Button>
            </Form.Item>
            <p>
              Don&lsquo;t have an account?{' '}
              <Link to="/admin/register" className="highlight">
                Register
              </Link>
            </p>
          </Space>
        </Form>
      </div>
    </>
  )
}

export default Login
