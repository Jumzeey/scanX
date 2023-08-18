/* eslint-disable camelcase */
import React, { useEffect, useState } from 'react'
import { notification } from 'antd'
import { useParams, useNavigate } from 'react-router-dom'
import { redeemPrize } from '../../utils/api'

const Redeem: React.FC = () => {
  const params = useParams()
  const [showSuccess, setShowSuccess] = useState<boolean>(false)
  const [showFailed, setShowFailed] = useState<boolean>(false)
  const [prize, setPrize] = useState<any>({})
  const navigate = useNavigate()

  useEffect(() => {
    const ac = new AbortController()

    const { id, name, admin_id } = params
    redeemPrize(id, { name, admin_id }).then((res) => {
      if (!res.error) {
        if (res?.data.message === 'Successfully redeemed') {
          setPrize(res?.data?.prize)
          setShowSuccess(true)
          setTimeout(() => {
            navigate('/admin/')
          }, 1200)
        } else {
          setShowFailed(true)
          // navigate('/admin/')
        }
      } else {
        setShowFailed(true)
        // navigate('/admin/')
      }
    })
    return () => ac.abort()
  }, [])

  useEffect(() => {
    if (showSuccess) {
      notification.success({
        message: `${prize.title} successfully redeemed`,
      })
    }
  }, [showSuccess, prize])

  useEffect(() => {
    if (showFailed) {
      notification.error({
        message: `Could not redeem prize`,
      })
    }
  }, [showFailed, prize])

  return <></>
}

export default Redeem
