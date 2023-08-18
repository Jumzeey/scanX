/* eslint-disable camelcase */
import React, { useEffect, useState } from 'react'
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons'
import {
  Button,
  Input,
  Row,
  Form,
  Col,
  Card,
  Tooltip,
  Space,
  Upload,
  message,
  notification,
  Modal,
  Switch,
} from 'antd'
import { useNavigate } from 'react-router-dom'
import {
  changeSettings,
  getSettings,
  getSiteKey,
  refreshApp,
} from '../../../utils/api'
import { useQueryUser } from '../../../lib/hooks'

type RequiredMark = boolean | 'optional'

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

const Settings: React.FC = () => {
  const [uploadImageLoading, setUploadImageLoading] = useState<boolean>(false)
  const [uploadLogoLoading, setUploadLogoLoading] = useState<boolean>(false)
  const [brandName, setBrandName] = useState<string>('')
  const [brandColor, setBrandColor] = useState<string>('red')
  const [backgroundColor, setBackgroundColor] = useState<string>('red')
  const [siteKey, setSiteKey] = useState<any>('')
  const [imageUrl, setImageUrl] = useState<any | undefined>()
  const [logoUrl, setLogoUrl] = useState<any | undefined>()
  const [imageFileList, setImageFileList] = useState<any | undefined>({})
  const [logoFileList, setLogoFileList] = useState<any | undefined>({})
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [loadingRefresh, setLoadingRefresh] = useState<boolean>(false)
  const [confirmRefreshApp, setConfirmRefreshApp] = useState(false)
  const [congratulationsMessage, setCongratulationsMessage] =
    useState<string>('')
  const [redeemingPoint, setRedeemingPoint] = useState<string>('')
  const [customMessage, setCustomMessage] = useState<string>('')
  const [formMessage, setFormMessage] = useState<string>('')
  const [tryAgainText, setTryAgainText] = useState<string>('')
  const [limitScan, setLimitScan] = useState<string>('')
  const [showTryAgain, setShowTryAgain] = useState<boolean>(false)

  const [user] = useQueryUser()
  const navigate = useNavigate()
  // const [fileLst, setFileList] = useState()

  const [form] = Form.useForm()
  const [requiredMark, setRequiredMarkType] = useState<RequiredMark>('optional')

  const onRequiredTypeChange = ({
    requiredMarkValue,
  }: {
    requiredMarkValue: RequiredMark
  }) => {
    setRequiredMarkType(requiredMarkValue)
  }

  const showModal = () => {
    setIsModalVisible(true)
  }

  const refresh = async () => {
    setConfirmRefreshApp(false)
    await refreshApp()

    notification.success({
      message: 'Successfully Refreshed App',
    })
    setLoadingRefresh(false)
  }

  const handleLogoChange = (info: any) => {
    if (info.file.status === 'uploading') {
      setUploadLogoLoading(true)
      return
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (imgUrl) => {
        setUploadLogoLoading(false)
        setLogoFileList(info.file)
        setLogoUrl(imgUrl)
      })
    }
    getBase64(info.file.originFileObj, (imgUrl) => {
      setUploadLogoLoading(false)
      setLogoFileList(info.file)
      setLogoUrl(imgUrl)
    })
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
        setImageFileList(info.file)
        setImageUrl(imgUrl)
      })
    }
    getBase64(info.file.originFileObj, (imgUrl) => {
      setUploadImageLoading(false)
      setImageFileList(info.file)
      setImageUrl(imgUrl)
    })
  }
  const uploadButton = (loadingImage: boolean) => (
    <div>
      {loadingImage ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  )

  useEffect(() => {
    if (user?.id) {
      getSettings(user?.id).then((resp) => {
        const { data, error } = resp

        if (!error) {
          setBrandName(data.settings[0]?.brand_name)
          setBackgroundColor(data.settings[0]?.brand_background_color)
          setBrandColor(data.settings[0]?.brand_theme_color)
          setLogoUrl(data.settings[0]?.brand_logo)
          setImageUrl(data.settings[0]?.brand_background_image)
          setRedeemingPoint(data.settings[0]?.redeeming_point)
          setCustomMessage(data.settings[0]?.custom_message)
          setFormMessage(data.settings[0]?.form_message)
          setCongratulationsMessage(data.settings[0]?.message)
          setLimitScan(data.settings[0]?.limit_scan)
          setTryAgainText(data.settings[0]?.try_again_text)
          setShowTryAgain(data.settings[0]?.show_try_again === '1')
        }
      })
    }
  }, [user])

  const convertBoolToInt = (val: boolean): number => {
    if (val) return 1
    return 0
  }

  // fetch site key
  useEffect(() => {
    getSiteKey().then((resp) => {
      const { data } = resp
      if (!resp.error) {
        setSiteKey(data)
      }
    })
  }, [])

  const getFileList = (file: any) => {
    if (file === null || file === undefined) return file
    if (Object.keys(file).length > 0) {
      const tmp = file.originFileObj

      delete tmp.uid
      return tmp
    }
    return file
  }

  const onFinish = async (values: any) => {
    const {
      brand_logo,
      background_image,
      background_color,
      brand_name,
      brand_color,
      show_try_again,
      limit_scan,
      try_again_text,
    } = values

    const brandImage = getFileList(background_image?.file)
    const brandLogo = getFileList(brand_logo?.file)

    const formData = new FormData()
    formData.append('brand_name', brand_name)
    formData.append('admin_id', `${user?.id}`)
    formData.append('brand_background_color', background_color)
    formData.append('brand_theme_color', brand_color)
    formData.append('brand_logo', brandLogo)
    formData.append('brand_background_image', brandImage)
    formData.append('message', congratulationsMessage)
    formData.append('redeeming_point', redeemingPoint)
    formData.append('custom_message', customMessage)
    formData.append('form_message', formMessage)
    formData.append('show_try_again', `${convertBoolToInt(show_try_again)}`)
    formData.append('limit_scan', limit_scan)
    formData.append('try_again_text', try_again_text || tryAgainText)

    // console.log({ congratulationsMessage, redeemingPoint, customMessage })
    // return
    const response = await changeSettings(formData)

    if (!response.error) {
      notification.success({
        message: 'Successfully Saved Changes',
      })
      // localStorage.setItem('@Auth:token', response.data.access_token)
    }
    setLoading(false)
  }

  useEffect(() => {
    if (user.role === 'user') {
      navigate('/admin/')
    }
  }, [user])

  return (
    <>
      <Row gutter={[16, 16]}>
        <Col lg={{ span: 16 }} xs={{ span: 24 }}>
          <Card
            title="General"
            bordered={false}
            style={{ width: '100%', textAlign: 'left' }}
          >
            <Form
              form={form}
              layout="vertical"
              initialValues={{
                requiredMarkValue: requiredMark,
                brand_name: brandName,
                background_color: backgroundColor,
                brand_color: brandColor,
                background_image: getFileList(imageFileList),
                brand_logo: getFileList(logoFileList),
                message: congratulationsMessage,
                redeeming_point: redeemingPoint,
                custom_message: customMessage,
                form_message: formMessage,
                show_try_again: showTryAgain,
                limit_scan: limitScan,
                try_again_text: tryAgainText,
              }}
              onValuesChange={onRequiredTypeChange}
              fields={[
                { name: 'brand_name', value: brandName },
                { name: 'background_color', value: backgroundColor },
                { name: 'brand_color', value: brandColor },
                { name: 'message', value: congratulationsMessage },
                { name: 'custom_message', value: customMessage },
                { name: 'redeeming_point', value: redeemingPoint },
                { name: 'form_message', value: formMessage },
                { name: 'show_try_again', value: showTryAgain },
                { name: 'limit_scan', value: limitScan },
                { name: 'try_again_text', value: tryAgainText },
              ]}
              requiredMark={requiredMark}
              onFinish={onFinish}
            >
              <Space direction="vertical" size={20} style={{ width: '100%' }}>
                <Space direction="vertical" size={1}>
                  <Form.Item label="Brand name" required name="brand_name">
                    <Input
                      size="large"
                      placeholder="Name"
                      className="primary"
                      onChange={(e) => setBrandName(e.target.value)}
                    />
                  </Form.Item>
                  <Form.Item
                    label="Brand Background Color"
                    required
                    name="background_color"
                  >
                    <Input
                      size="large"
                      placeholder="Hex/rgb value"
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      prefix={
                        <div
                          style={{ background: backgroundColor }}
                          className="color-picker"
                        />
                      }
                      className="primary"
                    />
                  </Form.Item>
                  <Form.Item label="Theme Color" required name="brand_color">
                    <Input
                      size="large"
                      placeholder="Hex/rgb value"
                      prefix={
                        <div
                          style={{ background: brandColor }}
                          className="color-picker"
                        />
                      }
                      onChange={(e) => {
                        setBrandColor(e.target.value)
                      }}
                      className="primary"
                    />
                  </Form.Item>
                  <Form.Item label="Brand Logo" required name="brand_logo">
                    <Upload
                      name="avatar"
                      listType="picture-card"
                      className="avatar-uploader"
                      showUploadList={false}
                      action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                      beforeUpload={beforeUpload}
                      onChange={handleLogoChange}
                    >
                      {logoUrl ? (
                        <div style={{ overflow: 'hidden' }}>
                          <img
                            src={logoUrl}
                            alt="avatar"
                            style={{ width: '100%' }}
                          />
                        </div>
                      ) : (
                        uploadButton(uploadLogoLoading)
                      )}
                    </Upload>
                  </Form.Item>
                  <Form.Item
                    label="Brand Background Image"
                    name="background_image"
                  >
                    <Upload
                      name="avatar"
                      listType="picture-card"
                      className="avatar-uploader"
                      showUploadList={false}
                      action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                      beforeUpload={beforeUpload}
                      onChange={handleChange}
                    >
                      {imageUrl ? (
                        <div style={{ overflow: 'hidden' }}>
                          <img
                            src={imageUrl}
                            alt="avatar"
                            style={{ width: '100%' }}
                          />
                        </div>
                      ) : (
                        uploadButton(uploadImageLoading)
                      )}
                    </Upload>
                  </Form.Item>
                  <Form.Item
                    label="Congratulations message"
                    required
                    name="message"
                  >
                    <Input
                      size="large"
                      placeholder="Congratulations Message"
                      className="primary"
                      onChange={(e) =>
                        setCongratulationsMessage(e.target.value)
                      }
                    />
                  </Form.Item>
                  <Form.Item
                    label="Redeeming point"
                    required
                    name="redeeming_point"
                  >
                    <Input
                      size="large"
                      placeholder="Redeeming point"
                      className="primary"
                      onChange={(e) => setRedeemingPoint(e.target.value)}
                    />
                  </Form.Item>
                  <Form.Item label="Form message" required name="form_message">
                    <Input
                      size="large"
                      placeholder="Form message"
                      className="primary"
                      onChange={(e) => setFormMessage(e.target.value)}
                    />
                  </Form.Item>
                  <Form.Item
                    label="Custom message"
                    required
                    name="custom_message"
                  >
                    <Input
                      size="large"
                      placeholder="Custom message"
                      className="primary"
                      onChange={(e) => setCustomMessage(e.target.value)}
                    />
                  </Form.Item>
                  <Form.Item
                    label="Show Try Again"
                    required
                    name="show_try_again"
                    valuePropName={showTryAgain ? 'checked' : ''}
                    initialValue
                  >
                    <Switch
                      defaultChecked={showTryAgain}
                      onChange={(checked) => {
                        setShowTryAgain(checked)
                      }}
                    />
                  </Form.Item>
                  <Form.Item
                    label="Try again text"
                    required
                    name="try_again_text"
                  >
                    <Input
                      size="large"
                      placeholder="Try again text"
                      className="primary"
                      onChange={(e) => setTryAgainText(e.target.value)}
                    />
                  </Form.Item>
                  <Form.Item label="Limit Win to" required name="limit_scan">
                    <Input
                      size="large"
                      placeholder="Limit Win to "
                      type="number"
                      min={1}
                      className="primary"
                      onChange={(e) => setLimitScan(e.target.value)}
                    />
                  </Form.Item>
                </Space>
                <div style={{ textAlign: 'right' }}>
                  <Form.Item>
                    <Button
                      size="large"
                      type="primary"
                      className="primary"
                      onClick={showModal}
                      loading={loading}
                      htmlType="submit"
                    >
                      Save Changes
                    </Button>
                  </Form.Item>
                </div>
              </Space>
            </Form>
          </Card>
        </Col>
        <Col lg={{ span: 8 }} xs={{ span: 24 }}>
          <Row gutter={[16, 16]}>
            <Col lg={{ span: 24 }} xs={{ span: 24 }}>
              <Card
                title="Site Keys"
                bordered={false}
                style={{ width: '100%', textAlign: 'left' }}
              >
                <Space direction="vertical" size={20}>
                  {user.role === 'admin' && (
                    <Tooltip title="This would be used to register for admin role users">
                      <p>Your admin site key is: {siteKey?.admin_key}</p>
                    </Tooltip>
                  )}
                  <Tooltip title="This would be used to register for normal role users">
                    <p>Your user site key is: {siteKey?.user_key}</p>
                  </Tooltip>
                </Space>
              </Card>
            </Col>
            <Col lg={{ span: 24 }} xs={{ span: 24 }}>
              <Card
                title="Refresh App"
                bordered={false}
                style={{ width: '100%', textAlign: 'left' }}
              >
                <Tooltip title="This would all data set by admin">
                  <Button
                    size="large"
                    type="primary"
                    className="primary"
                    onClick={() => setConfirmRefreshApp(true)}
                    loading={loadingRefresh}
                  >
                    Refresh
                  </Button>
                </Tooltip>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
      <Modal
        title="Refresh App"
        visible={confirmRefreshApp}
        onOk={refresh}
        onCancel={() => {
          setConfirmRefreshApp(false)
        }}
      >
        <p>Are you sure you want to refresh the app?</p>
      </Modal>
    </>
  )
}

export default Settings
