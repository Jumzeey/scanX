import React, { useEffect, useState } from 'react'
import useWindowSize from 'react-use/lib/useWindowSize'
import QRCode from 'react-qr-code'
import { notification, Button } from 'antd'
import Confetti from 'react-confetti'
import { useParams } from 'react-router-dom'
import Form from './components/form'
import { getRandomPrize, getSettings } from '../../utils/api'

import Blocked from './components/blocked'

const HomeWrapper: React.FC<{
  formMessage: string
}> = ({ formMessage }) => {
  const { width, height } = useWindowSize()
  const params = useParams()
  const [showConfetti, setShowConfetti] = useState<boolean>(true)
  const [loaded, setLoaded] = useState<boolean>(false)
  const [showTryAgain, setShowTryAgain] = useState<boolean>(false)
  const [blockUser, setBlockUser] = useState(false)
  const [prize, setPrize] = useState<any>({})
  const [win, setWin] = useState<any>({})
  const [user, setUser] = useState<any>()
  const [showError, setShowError] = useState<any>(false)
  const [outOfStock, setOutOfStock] = useState<boolean>(false)
  const [exceededLimit, setExceededLimit] = useState<boolean>(false)
  const [settingsValues, setSettingsValue] = useState<any>()

  useEffect(() => {
    if (loaded) {
      setTimeout(() => {
        setShowConfetti(false)
      }, 3000)
    }
  }, [loaded])

  // useEffect(() => {
  //   if (localStorage.getItem('blocked') === 'true') {
  //     setBlockUser(true)
  //   }
  // }, [])

  const handleOnSubmitForm = (val: any) => {
    const payload = { ...val, id: params.admin_id }
    getRandomPrize(payload).then((resp: any) => {
      if (!resp.error) {
        if (resp.data?.type === 'prize') {
          setPrize(resp.data.prize)
          setOutOfStock(resp.data?.prize?.current_quantity < 1)
          setWin(resp.data.win)
          setUser(resp.data.user)
          setTimeout(() => {
            setLoaded(true)
          }, 700)
        } else {
          setShowTryAgain(true)
          setLoaded(true)
        }
      } else if (
        resp?.error?.message === 'You already exceeded the win limit'
      ) {
        setLoaded(true)
        setExceededLimit(true)
        // localStorage.setItem('blocked', 'true')
      } else if (resp?.error?.message === 'You already won up to 3 prizes') {
        setBlockUser(true)
        // localStorage.setItem('blocked', 'true')
      } else if (resp?.error?.phone[0]?.length) {
        setLoaded(false)
        // localStorage.setItem('blocked', 'true')
      } else {
        setLoaded(true)
        setOutOfStock(true)
        notification.error({
          message: 'No prizes available right now',
        })
      }
    })
  }

  useEffect(() => {
    if (params.admin_id) {
      getSettings(params.admin_id).then((resp) => {
        const { data } = resp
        const settings = data?.settings
        if (settings?.length) setSettingsValue(settings[0])
      })
    }
  }, [params])

  if (blockUser) return <Blocked />

  if (!loaded)
    return (
      <Form
        onSubmit={handleOnSubmitForm}
        customMessage={settingsValues?.custom_message}
        formMessage={formMessage}
        logo={settingsValues?.brand_logo}
      />
    )

  if (exceededLimit)
    return (
      <div className="center-page flex-1">
        <div className="card">
          <h1 className="">You have already been rewarded. Try again later!</h1>
        </div>
      </div>
    )

  if (outOfStock)
    return (
      <div className="center-page flex-1">
        <div className="card">
          <h1 className="">
            All prizes for today have been won! Try again tomorrow
          </h1>
        </div>
      </div>
    )

  if (showTryAgain)
    return (
      <div className="center-page flex-1">
        <div className="card">
          <h1 className="">
            {settingsValues?.try_again_text || 'Please try again!'}
          </h1>

          <Button
            type="primary"
            size="large"
            block
            className="primary"
            onClick={() => {
              setShowTryAgain(false)
              setLoaded(false)
            }}
          >
            Try again
          </Button>
        </div>
      </div>
    )

  return (
    <>
      <Confetti
        recycle={showConfetti}
        width={width}
        gravity={0.15}
        height={height}
      />
      <div className="App">
        <div className="center-page">
          {settingsValues?.brand_logo && (
            <img
              src={settingsValues?.brand_logo}
              alt="prize"
              style={{ height: '35px', marginBottom: '10px' }}
            />
          )}
          {settingsValues && <h1 className="">{settingsValues.message}</h1>}
          <img src={prize?.image} alt="prize" className="price" />
          <p className="font-1x color-primary">
            Claim your prize at <br />
            <span className="h3 font-2x">
              {settingsValues && (
                <strong>{settingsValues?.redeeming_point}</strong>
              )}
            </span>
          </p>
          <div className="qr-code">
            <QRCode
              value={`${process.env.REACT_APP_ADMIN_URL}/redeem/${win?.id}/${user}/${params.admin_id}`}
              bgColor="#fcf5df"
              size={128}
            />
          </div>

          {settingsValues?.custom_message && (
            <div style={{ background: '#cd2929', padding: '5px 10px' }}>
              <p className="font-1x" style={{ color: '#fff' }}>
                {settingsValues?.custom_message}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default HomeWrapper
