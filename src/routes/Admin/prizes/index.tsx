import React, { useCallback, useEffect, useState } from 'react'

import {
  PlusOutlined,
  LoadingOutlined,
  DeleteOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import {
  Button,
  Modal,
  Input,
  Row,
  Col,
  Card,
  Table,
  Space,
  Upload,
  message,
  notification,
  
  
} from 'antd'
import { CSVLink } from 'react-csv'

import { addPrize, deletePrize, getPrizes } from '../../../utils/api'
import { useQueryUser } from '../../../lib/hooks'
import styled from 'styled-components'

function getBase64(img: any, callback?: (val: unknown) => unknown) {
  const reader = new FileReader()
  reader.addEventListener('load', () => {
    if (typeof callback === 'function') callback(reader.result)
  })
  reader.readAsDataURL(img)
}

function beforeUpload(file: any) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!')
  }
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!')
  }
  return isJpgOrPng && isLt2M
}

const Prizes: React.FC = () => {
  const [qrCodeValue, setQrCodeValue] = useState<string>('')
  const [inputValue, setInputValue] = useState<string>('')
  const [uploadImageLoading, setUploadImageLoading] = useState<boolean>(false)
  const [imageUrl, setImageUrl] = useState<any | undefined>()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [modal1Open, setModal1Open] = useState(false);
  const [modal2Open, setModal2Open] = useState(false);
  const [fileList, setFileList] = useState<Blob | any>({})
  const [prizes, setPrizes] = useState<any[]>([])
  const [imageData, setImageData] = useState<any>()
  const [formValues, setFormValues] = useState({ name: '', quantity: 0 })
  const [queryUser] = useQueryUser()
  const navigate = useNavigate()
  

  const handleDeletePrize = useCallback(
    async (id: number, idx: number) => {
      const tmp = [...prizes]
      tmp.splice(idx, 1)

      setPrizes(tmp)
      const response = await deletePrize(id)
      if (!response.error) {
        notification.success({
          message: 'Successfully Delete',
        })
      }
      // setIsModalVisible(false)
      // setImageUrl(undefined)
    },
    [prizes]
  )

  const columns = [
    {
      title: 'Name',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Remaining Quantity',
      dataIndex: 'current_quantity',
      key: 'current_quantity',
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (text: any, record: any, index: number) => {
        return (
          <Space>
            <Button
              danger
              icon={<DeleteOutlined />}
              size="middle"
              onClick={() => {
                handleDeletePrize(record?.id, index)
              }}
            />
            <Button size="large"
                  type="primary"
                  className="primary" onClick={() => setModal1Open(true)}>
             Edit Prize
            </Button>
             <Modal
            title="Edit product details here"
            style={{ top: 20 }}
            open={modal1Open}
            onOk={() => setModal1Open(false)}
            onCancel={() => setModal1Open(false)}
            >
          <Input
            size="large"
            placeholder="Name"
            value={formValues.name}
            className="primary"
            onChange={(e) => {
              setFormValues({ ...formValues, name: e.target.value })
            }}
          />
           <br />
           <br />
          <Input
            size="large"
            placeholder="Quantity"
            type="number"
            value={formValues.quantity}
            className="primary"
            onChange={(e) => {
              setFormValues({ ...formValues, quantity: +e.target.value })
            }}
          />
           <br />
           <br />
          <Input
            size="large"
            placeholder="Quantity"
            type="number"
            value={formValues.quantity}
            className="primary"
            onChange={(e) => {
              setFormValues({ ...formValues, quantity: +e.target.value })
            }}
          />
          <br />
          <br />
          <Input
            size="large"
            placeholder="Edit Quantity"
            type="number"
            value={formValues.quantity}
            className="primary"
            onChange={(e) => {
                  setFormValues({ ...formValues, quantity: +e.target.value })
            }}
          />
          
      </Modal>
          </Space>
        )
      },
    },
  ]

  const showModal = () => {
    setIsModalVisible(true)
  }
  const showEditModal = () => {
    setIsEditModalVisible(true)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
    setImageUrl(undefined)
  }

  const handleChange = (info: any) => {
    if (info.file.status === 'uploading') {
      setUploadImageLoading(true)
      return
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (imgUrl) => {
        setUploadImageLoading(false)
        setFileList(info.file)
        setImageUrl(imgUrl)
      })
    }
    // console.log
    getBase64(info.file.originFileObj, (imgUrl) => {
      setUploadImageLoading(false)
      setFileList(info.file)
      setImageUrl(imgUrl)
    })
  }

  useEffect(() => {
    getPrizes().then((resp) => {
      setPrizes(resp.data)
    })
  }, [])

  const handleCreatePrize = async () => {
    const formData = new FormData()
    const file = fileList.originFileObj

    delete file.uid
    formData.append('image', file)
    formData.append('title', formValues.name)
    formData.append('quantity', `${formValues.quantity}`)
    formData.append('current_quantity', `${formValues.quantity}`)

    if (formData) {
      const response = await addPrize(formData)
      try {
        const respPrize: any = response.data.prize
        setPrizes([...prizes, respPrize])
        notification.success({
          message: 'Successfully Added Prize',
        })
      } catch (e) {
        console.log(e)
      }
    }

    setIsModalVisible(false)
    setImageUrl(undefined)
  }

  const uploadButton = (
    <div>
      {uploadImageLoading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload Prize Image</div>
    </div>
  )

  useEffect(() => {
    if (queryUser.role === 'user') {
      navigate('/admin/')
    }
  }, [queryUser])

  return (
    <>
      <Row gutter={[16, 16]}>
        <Col lg={{ span: 24 }} xs={{ span: 24 }}>
          <Card
            title="Prizes"
            bordered={false}
            style={{ width: '100%', textAlign: 'left' }}
          >
            <Space direction="vertical" size={20} style={{ width: '100%' }}>
              <div style={{ textAlign: 'right' }}>
                <Button
                  size="large"
                  type="primary"
                  className="primary"
                  onClick={showModal}
                >
                  Add Prize
                </Button>
              </div>

              <Button type="primary">
                <CSVLink
                  filename="Prizes.csv"
                  data={prizes}
                  className="btn btn-primary"
                  onClick={() => {
                    // message.success('The file is downloading')
                  }}
                >
                  Export to CSV
                </CSVLink>
              </Button>
              <div style={{ width: '100%' }}>
                <Table dataSource={prizes} columns={columns} rowKey="key" />
              </div>
            </Space>
          </Card>
        </Col>
      </Row>
      <Modal
        title="Add Prize"
        visible={isModalVisible}
        onOk={handleCreatePrize}
        onCancel={handleCancel}
      >
        <Space direction="vertical" size={8}>
          <Input
            size="large"
            placeholder="Name"
            value={formValues.name}
            className="primary"
            onChange={(e) => {
              setFormValues({ ...formValues, name: e.target.value })
            }}
          />

          <Input
            size="large"
            placeholder="Quantity"
            type="number"
            value={formValues.quantity}
            className="primary"
            onChange={(e) => {
              setFormValues({ ...formValues, quantity: +e.target.value })
            }}
          />
          <Upload
            name="avatar"
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            beforeUpload={beforeUpload}
            onChange={handleChange}
          >
            {imageUrl ? (
              <img src={imageUrl} alt="avatar" style={{ width: '100%' }} />
            ) : (
              uploadButton
            )}
          </Upload>
        </Space>
      </Modal>
    </>
  )
}

export default Prizes
