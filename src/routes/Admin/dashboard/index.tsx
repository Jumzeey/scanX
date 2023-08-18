import React, { useEffect, useState } from 'react'
import {
  PlusOutlined,
  LoadingOutlined,
  DeleteOutlined,
} from '@ant-design/icons'
import {
  Button,
  Modal,
  Input,
  Row,
  Col,
  Card,
  Table,
  Tooltip,
  Space,
} from 'antd'
import QRCode from 'react-qr-code'
import { useLocation } from 'react-router-dom'
import { QrReader } from 'react-qr-reader'
import { CSVLink } from 'react-csv'
import {
  getWins,
  getUserAllRedeemList,
  getUserRedeemList,
} from '../../../utils/api'
import { useQueryUser } from '../../../lib/hooks'

const columns = [
  {
    title: 'Prize Name',
    dataIndex: 'title',
    key: 'title',
  },
  {
    title: 'Winner',
    dataIndex: 'name',
    key: 'winner',
  },
  {
    title: 'Winner Phone',
    dataIndex: 'phone',
    key: 'phone',
  },
  {
    title: 'Redeemed By',
    dataIndex: 'fullname',
    key: 'redeemed_by',
  },
]

const winsColumns = [
  {
    title: 'Prize Name',
    dataIndex: 'title',
    key: 'title',
  },
  {
    title: 'Winner',
    dataIndex: 'name',
    key: 'winner',
  },
  {
    title: 'Phone',
    dataIndex: 'phone',
    key: 'phone',
  },
]

const Dashboard: React.FC = () => {
  const [qrCodeValue, setQrCodeValue] = useState<string>('')
  const [inputValue, setInputValue] = useState<string>('')
  const [result, setResult] = useState<any>()
  const [showScanner, setShowScanner] = useState<boolean>(false)
  const [wins, setWins] = useState<any[]>([])
  const [redeemList, setRedeemList] = useState([])
  const [myRedeemList, setMyRedeemList] = useState([])
  const [queryUser] = useQueryUser()
  const location = useLocation()

  useEffect(() => {
    const ac = new AbortController()
    if (queryUser?.role === 'admin') {
      getWins().then((resp) => {
        if (!resp.error) {
          setWins(resp.data)
        }
      })
    }
    return () => ac.abort()
  }, [queryUser])

  useEffect(() => {
    const ac = new AbortController()
    getUserRedeemList().then((resp) => {
      if (!resp.error) {
        setMyRedeemList(resp.data)
      }
    })
    return () => ac.abort()
  }, [])

  useEffect(() => {
    const ac = new AbortController()
    if (queryUser?.role === 'admin') {
      getUserAllRedeemList().then((resp) => {
        if (!resp.error) {
          setRedeemList(resp.data)
        }
      })
      return () => ac.abort()
    }
  }, [queryUser])

  // set QRcode input to domain irl
  useEffect(() => {
    const url = `${window.location.origin}/${queryUser.id}/win`
    setQrCodeValue(url)
    setInputValue(url)
  }, [queryUser])

  const handlePrint = () => {
    document.querySelector('qrcode')?.classList.add('printable')
    window.print()
  }
  const handleScan = (data: any) => {
    setResult(data)
    // setShowScanner(false)
  }

  const previewStyle = {
    height: 240,
    overflow: 'auto',
  }

  useEffect(() => {
    if (result) {
      if (result.text.length > 0) {
        window.location = result.text
      }
    }
  }, [result])

  return (
    <>
      <div id="qrcode" className="printable">
        <QRCode value={qrCodeValue} bgColor="#ffffff" size={256} />

        <h3 style={{ marginTop: '20px', color: '#111' }} className="font-4x">
          Scan to win!
        </h3>
      </div>

      <Row gutter={[16, 16]} id="print-hide">
        <Col lg={{ span: 16 }} xs={{ span: 24 }}>
          <Row gutter={[16, 16]}>
            {queryUser?.role === 'admin' && (
              <Col lg={{ span: 24 }} xs={{ span: 24 }}>
                <Card
                  title="Wins list"
                  bordered={false}
                  style={{ width: '100%', textAlign: 'left' }}
                >
                  <Space
                    direction="vertical"
                    size={20}
                    style={{ width: '100%' }}
                  >
                    <Button type="primary">
                      <CSVLink
                        filename="Wins.csv"
                        data={wins}
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
                        dataSource={wins}
                        columns={winsColumns}
                        rowKey="key"
                      />
                    </div>
                  </Space>
                </Card>
              </Col>
            )}
            {queryUser?.role === 'admin' && (
              <Col lg={{ span: 24 }} xs={{ span: 24 }}>
                <Card
                  title="All Redeemed list"
                  bordered={false}
                  style={{ width: '100%', textAlign: 'left' }}
                >
                  <Space
                    direction="vertical"
                    size={20}
                    style={{ width: '100%' }}
                  >
                    <Button type="primary">
                      <CSVLink
                        filename="AllRedeemList.csv"
                        data={redeemList}
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
                        rowKey="key"
                        dataSource={redeemList}
                        columns={columns}
                      />
                    </div>
                  </Space>
                </Card>
              </Col>
            )}
            {queryUser?.role === 'user' && (
              <Col lg={{ span: 24 }} xs={{ span: 24 }}>
                <Card
                  title="My Redeem list"
                  bordered={false}
                  style={{ width: '100%', textAlign: 'left' }}
                >
                  <Space
                    direction="vertical"
                    size={20}
                    style={{ width: '100%' }}
                  >
                    <Button type="primary">
                      <CSVLink
                        filename="MyRedeemList.csv"
                        data={myRedeemList}
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
                        rowKey="key"
                        dataSource={myRedeemList}
                        columns={winsColumns}
                      />
                    </div>
                  </Space>
                </Card>
              </Col>
            )}
          </Row>
        </Col>
        <Col lg={{ span: 8 }} xs={{ span: 24 }}>
          <Row gutter={[16, 16]}>
            {queryUser?.role === 'user' && (
              <Col lg={{ span: 24 }} xs={{ span: 24 }}>
                <Card
                  title="Scan QR Code"
                  bordered={false}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                  }}
                >
                  <QrReader
                    scanDelay={100}
                    containerStyle={previewStyle}
                    onResult={handleScan}
                    constraints={{ facingMode: 'environment' }}
                  />
                  <p>Use Firefox/Safari for better experience</p>
                </Card>
              </Col>
            )}
            {queryUser?.role === 'admin' && (
              <Col lg={{ span: 24 }} xs={{ span: 24 }}>
                <Card
                  title="Generate QR Code"
                  bordered={false}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                  }}
                >
                  <Space
                    direction="vertical"
                    size={20}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      flexDirection: 'column',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <div id="qrcode">
                      <QRCode
                        value={qrCodeValue}
                        bgColor="#ffffff"
                        size={128}
                      />
                    </div>

                    <div>
                      <Button
                        size="middle"
                        type="primary"
                        className="secondary"
                        onClick={handlePrint}
                      >
                        Print
                      </Button>
                    </div>
                    <Input.Group compact>
                      <Input
                        style={{ width: 'calc(100% - 100px)' }}
                        defaultValue={inputValue}
                        value={inputValue}
                        size="middle"
                        onChange={(e) => {
                          setInputValue(e.target.value)
                        }}
                      />
                      <Tooltip title="copy landing page url">
                        <Button
                          size="middle"
                          type="primary"
                          className="primary"
                          onClick={() => setQrCodeValue(inputValue)}
                        >
                          Generate
                        </Button>
                      </Tooltip>
                    </Input.Group>
                  </Space>
                </Card>
              </Col>
            )}
          </Row>
        </Col>
      </Row>
    </>
  )
}

export default Dashboard
