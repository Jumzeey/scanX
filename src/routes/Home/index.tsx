import React, { useEffect, useState } from 'react'
import FadingBalls from 'react-cssfx-loading/lib/FadingBalls'
import { useParams } from 'react-router-dom'
import HomeWrapper from './wrapper'
import { getSettings } from '../../utils/api'

const App: React.FC = () => {
  const [loading, setLoading] = useState(true)
  const [formMessage, setFormMessage] = useState<string>('')
  const params = useParams()

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 3000)
  })

  useEffect(() => {
    if (params.admin_id) {
      getSettings(params.admin_id).then((resp) => {
        const { data } = resp
        const settings = data?.settings
        if (settings?.length) {
          setFormMessage(settings[0]?.form_message)
          document.documentElement?.style?.setProperty(
            '--primary-color',
            settings[0]?.brand_theme_color
          )
          document.documentElement?.style?.setProperty(
            '--background-color',
            settings[0]?.brand_background_color
          )
          document.documentElement?.style?.setProperty(
            '--background-image',
            `url('${settings[0]?.brand_background_image}')`
          )
          const logoElement: HTMLImageElement[] = Array.from(
            document.querySelectorAll('.logo-dyno')
          )

          logoElement.forEach((element: HTMLImageElement) => {
            // eslint-disable-next-line no-param-reassign
            element.src = settings[0]?.brand_logo
          })

          const appElement = Array.from(document.querySelectorAll('.App'))
          appElement.forEach((element: any) => {
            // eslint-disable-next-line no-param-reassign
            element.style.backgroundImage = `url('${settings[0]?.brand_background_image}')`
          })
        }
      })
    }
  }, [params])

  if (loading) {
    return (
      <>
        <div className="App">
          <div className="center-page flex-1">
            <FadingBalls
              color="#222222"
              width="8px"
              height="8px"
              duration=".45s"
            />
          </div>
        </div>
      </>
    )
  }
  return <HomeWrapper formMessage={formMessage} />
}

export default App
