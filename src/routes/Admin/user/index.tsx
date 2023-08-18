import { useCallback, useEffect, useState } from 'react'
import { Menu, MenuProps, message } from 'antd'
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  DownOutlined,
} from '@ant-design/icons'

import { useNavigate } from 'react-router-dom'

import {
  Dropdown,
  Button,
  Input,
  Row,
  Col,
  Card,
  Table,
  Upload,
  Space,
  Form,
  notification,
  Modal,
} from 'antd'
import { CSVLink } from 'react-csv'
import {
  registerUser,
  getAllVendors,
  importUsers,
  editVendorsFunc,
  allocatePrize,
  getAllAdmin,
} from '../../../utils/api'
import { useQueryUser } from '../../../lib/hooks'
const handleMenuClick: MenuProps['onClick'] = (e) => {
  message.info('Click on menu item.');
  console.log('click', e);
};

type EditVendor = {
  adminId: string
  vendorId: string
  prizeAllocated: string
  prizeId: string
  name: string
}

const User = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [loadingCSVUpload, setLoadingCSVUpload] = useState<boolean>(false)
  const [vendors, setVendors] = useState([])
  const [prizes, setPrizes] = useState<any[]>([])
  const [modal1Open, setModal1Open] = useState(false)
  const [formValues, setFormValues] = useState({ name: '', quantity: 0 })
  const [editVendors, setEditVendors] = useState<EditVendor>({
    adminId: '',
    vendorId: '',
    prizeAllocated: '',
    prizeId: '',
    name: '',
  })
  const [allocatingPrize, setAllocatingPrize] = useState([]);

  useEffect(() => {
    allocatePrize().then((response) => {
      setAllocatingPrize(response); // Set the state with the response data
      console.log(response);
    });
  }, []);
  
  
  // useEffect(() => {
  //   allocatePrize().then((response) => {
  //     setAllocatingPrize(response.data); // Set the state with the response data
  //     const newMenuItems = response.data.map((item) => ({
  //       label: item.title,
  //       key: item.id.toString(), // Assuming item.id is unique
  //     }));
  //     setMenuItems(newMenuItems);
  //     console.log(response);
  //   });
  // }, []);
  
  const navigate = useNavigate()
  const [queryUser] = useQueryUser()
  const onFinish = async (values: any) => {
    const params = { ...values, role: 'user', admin_id: queryUser?.id }

    setLoading(true)
    const response = await registerUser(params)
    setLoading(false)
    if (!response.error) {
      notification.success({
        message: 'Successfully Created User',
      })
    }
  }

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
  }

  const getVendors = async () => {
    if (queryUser.role === 'admin') {
      const response = await getAllVendors()
      if (!response.error) {
        setVendors(response.data?.vendor)
      }
    }
  }

  useEffect(() => {
    getVendors()
  }, [queryUser])

  useEffect(() => {
    if (queryUser.role === 'user') {
      navigate('/admin/')
    }
  }, [queryUser])

  // const editGetVendors = async () => {
  //   if (queryUser.role === 'admin') {
  //     const response = await editVendorsFunc()
  //     if (!response.error) {
  //       setEditVendors(response.data?.editVendors)
  //     }
  //   }
  // }

  // useEffect(() => {
  //   editGetVendors()
  // }, [queryUser])

  useEffect(() => {
    if (queryUser.role === 'user') {
      navigate('/admin/')
    }
  }, [queryUser])

  const handleUploadUsersCSV = async (file: any) => {
    setLoadingCSVUpload(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('admin_id', `${queryUser?.id}`)

    if (formData) {
      try {
        const response = await importUsers(formData)
        if (!response.error) {
          notification.success({
            message: 'Successfully Uploaded Users',
          })
        }
        setLoadingCSVUpload(false)
      } catch (e) {
        console.log(e)
      }
    }
  }

  const handleBeforeUploadUsersCSV = (file: any) => {
    handleUploadUsersCSV(file)
    // const reader = new FileReader()

    // reader.onload = (e: any) => {
    //   console.log(e.target.result)
    // }
    // reader.readAsText(file)

    // Prevent upload
    return false
  }
  
  const vendorColumns = [
    {
      title: 'Full Name',
      dataIndex: 'fullname',
      key: 'fullname',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Redeem count',
      dataIndex: 'redeem_count',
      key: 'redeem_count',
    },
    {
      title: 'Allocated Prize',
      dataIndex: 'allocate_prize',
      key: 'allocate_prize',
    },
    {
      title: 'Created at',
      dataIndex: 'created_at',
      key: 'created_at',
    },
    {
      title: 'action',
      dataIndex: 'edited_redeem_count',
      key: 'redeem_count',
      render: (text: any, record: any, index: number) => {
        const items: MenuProps['items'] = [
          {
            label: 'Asun',
            key: '1',
          },
          {
            label: 'Cap',
            key: '2',
          },
          {
            label: 'Towel',
            key: '3',
          },
          
        ];
        const menuProps = {
          items,
          onClick: handleMenuClick,
        };
        
  
        return (
          <Space>
            <Button
                  size="large"
                  type="primary"
              className="primary"
              onClick={() => {
                    
                setEditVendors({
                  ...editVendors,
                  adminId: record?.admin_id,
                  name: record?.fullname,
                  prizeAllocated: record?.allocate_prize,
                  vendorId: record?.id,
                  prizeId: record?.prize_id,
                })
                console.log('flase');
                setModal1Open(true);
              }}
            >
              Allocate Prize
           </Button>
            <Modal
              title="Edit Vendor's Redeemable Count"
              style={{ top: 20 }}
              open={modal1Open}
              onOk={() => {
                setModal1Open(false)
                const filtered = Object.fromEntries(
                  Object.entries(editVendors).filter(([k, _]) => k !== 'name')
                )
                editVendorsFunc(filtered, getAllVendors)
              }}
        onCancel={() => setModal1Open(false)}
      >
         <Input
            size="large"
            placeholder="Name"
            value={editVendors.name}
            disabled
            className="primary"
          />
           <br />
          <br />
          <Dropdown menu={menuProps} >
              <a onClick={(e) => e.preventDefault()}>
              <Button>
        <Space>
          Button
          <DownOutlined />
        </Space>
      </Button>
              </a>
            </Dropdown>
          <br />
          <br />
  



          <Input
            size="large"
            placeholder="Edit Quantity"
            type="number"
            value={editVendors.prizeAllocated}
            className="primary"
            onChange={(e) => {
              setEditVendors({ ...editVendors, prizeAllocated: e.target.value })
            }}
          />
        
      </Modal>          
          </Space>
        )
      }, 
    }
  ]
 
  return (
    <>
      <Row gutter={[16, 16]}>
        <Col lg={{ span: 24 }} xs={{ span: 24 }}>
          <Card
            title="Your Vendors"
            bordered={false}
            style={{ width: '100%', textAlign: 'left' }}
          >
            <Space direction="vertical" size={20} style={{ width: '100%' }}>
              <p>Total registered vendors: {vendors?.length}</p>

              <Button type="primary">
                <CSVLink
                  filename="Vendors.csv"
                  data={vendors}
                  className="btn btn-primary"
                  onClick={() => {
                    // message.success('The file is downloading')
                  }}
                >
                  Export to CSV
                </CSVLink>
              </Button>
              <div style={{ width: '100%' }}>
                <Table
                  dataSource={vendors}
                  columns={vendorColumns}
                  rowKey="key"
                />
              </div>
            </Space>
          </Card>
        </Col>
        <Col lg={{ span: 24 }} xs={{ span: 24 }}>
          <Card
            title="Register Vendor"
            bordered={false}
            style={{ width: '100%', textAlign: 'left' }}
          >
            <Form
              autoComplete="off"
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              layout="vertical"
            >
              <Row gutter={[16, 16]}>
                <Col lg={{ span: 12 }} xs={{ span: 24 }}>
                  <Upload
                    accept=".csv"
                    showUploadList={false}
                    beforeUpload={handleBeforeUploadUsersCSV}
                  >
                    <Button
                      type="primary"
                      size="large"
                      block
                      className="primary"
                    >
                      {loadingCSVUpload ? 'Uploading...' : 'Upload CSV'}
                    </Button>
                  </Upload>
                  ;
                </Col>
              </Row>
            </Form>
            <Form
              autoComplete="off"
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              layout="vertical"
            >
              <Row gutter={[16, 16]}>
                <Col lg={{ span: 12 }} xs={{ span: 24 }}>
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
                </Col>
                <Col lg={{ span: 12 }} xs={{ span: 24 }}>
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
                </Col>
              </Row>
              <Row gutter={[16, 16]}>
                <Col lg={{ span: 12 }} xs={{ span: 24 }}>
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
                </Col>
                <Col lg={{ span: 12 }} xs={{ span: 24 }}>
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
                </Col>
              </Row>
              <Space direction="vertical" size={20}>
                <Form.Item>
                  <Button
                    type="primary"
                    size="large"
                    block
                    className="primary"
                    htmlType="submit"
                  >
                    Register
                  </Button>
                </Form.Item>
              </Space>
            </Form>
          </Card>
        </Col>
      </Row>
    </>
  )
}



export default User
// /