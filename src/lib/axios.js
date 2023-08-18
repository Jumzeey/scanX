import axios from 'axios'
import { notification } from 'antd'
import config from '../config'
import parseError from '../utils/parseError'

const openNotificationWithIcon = (type) => {
  notification[type]({
    message: 'Notification Title',
    description:
      'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
  })
}

/**
 * Axios defaults
 */
axios.defaults.baseURL = config.baseUrl

// Headers
axios.defaults.headers.common['Content-Type'] = 'application/json'
axios.defaults.headers.common.Accept = 'application/json'

/**
 * Request Interceptor
 */
axios.interceptors.request.use(
  async (inputConfig) => {
    const axiosConfig = inputConfig

    // Check for and add the stored Auth Token to the header request
    let token = ''
    try {
      token = await localStorage.getItem('@Auth:token')
    } catch (error) {
      /* Nothing */
    }
    if (token) {
      axiosConfig.headers.common.Authorization = `Bearer ${token}`
    }

    return axiosConfig
  },
  (error) => {
    throw error
  }
)

/**
 * Response Interceptor
 */
axios.interceptors.response.use(
  (res) => {
    // Status code isn't a success code - throw error
    if (!`${res.status}`.startsWith('2')) {
      throw res.data
    }

    // Otherwise just return the data
    return res
  },
  (error) => {
    // Pass the response from the API, rather than a status code
    if (error && error.response && error.response.data) {
      parseError(error.response.data)
      throw error.response.data
    }

    parseError(error)
    throw error
  }
)

export default axios
