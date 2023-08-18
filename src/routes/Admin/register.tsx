import React, { useState } from 'react'
import {
  UserOutlined,
  LockOutlined,
  KeyOutlined,
  MailOutlined,
} from '@ant-design/icons'
import { Button, Input, Space, Form } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import { registerUser } from '../../utils/api'
import { useQueryUser } from '../../lib/hooks'

const Register: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const navigate = useNavigate()
  const [user, setUser] = useQueryUser()

  const onFinish = async (values: any) => {
    const params = { ...values, role: 'admin' }

    setLoading(true)
    const response = await registerUser(params)
    setLoading(false)

    if (!response.error) {
      localStorage.setItem('@Auth:token', response.data.token)
      setUser(response.data.user)
      setTimeout(() => {
        // location.
        navigate('/admin/')
      }, 700)
    }
  }

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
  }

  return (
    <>
      <div className="center-page flex-1">
        <Form
          autoComplete="off"
          className="card"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          layout="vertical"
        >
          <Space direction="vertical" size={20}>
            <h1 className="font-2x color-primary">Register</h1>
            <Space direction="vertical" size={0}>
              <Form.Item
                label="Full name"
                name="fullname"
                rules={[
                  {
                    required: true,
                    message: 'Please input your full name!',
                  },
                ]}
              >
                <Input
                  autoComplete="false"
                  size="large"
                  placeholder="Full name"
                  className="primary"
                  prefix={<UserOutlined />}
                />
              </Form.Item>
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
                  autoComplete="false"
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
                  autoComplete="false"
                  size="large"
                  placeholder="Password"
                  type="password"
                  className="primary"
                  prefix={<LockOutlined />}
                />
              </Form.Item>
              <Form.Item
                label="Confirm Password"
                name="password_confirmation"
                rules={[
                  {
                    required: true,
                    message: 'Please input your Confirm Password!',
                  },
                ]}
              >
                <Input
                  autoComplete="false"
                  size="large"
                  placeholder="Confirm Password"
                  type="password"
                  className="primary"
                  prefix={<LockOutlined />}
                />
              </Form.Item>
              <Form.Item
                label="Site Key"
                name="site_key"
                rules={[
                  {
                    required: true,
                    message: 'Please input key!',
                  },
                ]}
              >
                <Input
                  autoComplete="false"
                  name="key"
                  size="large"
                  placeholder="Site Key"
                  className="primary"
                  prefix={<KeyOutlined />}
                />
              </Form.Item>
            </Space>
            <Form.Item>
              <Button
                type="primary"
                size="large"
                block
                className="primary"
                htmlType="submit"
                loading={loading}
              >
                Register
              </Button>
            </Form.Item>
            <p>
              Already have an account?{' '}
              <Link to="/admin/login" className="highlight">
                Login
              </Link>
            </p>
          </Space>
        </Form>
      </div>
    </>
  )
}

export default Register
