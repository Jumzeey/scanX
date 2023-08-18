import { message, notification } from 'antd'
/**
 *
 * @param { import("axios").AxiosError } errorObject
 */

const returnValue = (errorMessage) => {
  if (typeof errorMessage !== 'string') {
    errorMessage.forEach((message) => {
      notification.error({
        message: message[0],
      })
    })
  } else {
    notification.error({
      message: errorMessage,
    })
  }
  return { isError: true, errorMessage }
}

const parseError = (errorObject) => {
  if (errorObject?.message) {
    return returnValue(errorObject?.message)
  }
  const values = Object.values(errorObject)

  if (values.length) {
    return returnValue(values)
  }

  // returnValue(errorObject)
  const { request, response, error } = errorObject
  if (response) {
    if (response?.data) {
      const {
        data: { message },
      } = response
      const errorsArr = response.data.errors

      if (errorsArr) {
        // console.log(errorsArr)
        const errorMessages = Object.values(errorsArr)
        if (errorMessages.length > 0) {
          return returnValue(errorMessages)
        }
      }

      return returnValue(response.data[0] || message)
    }

    return returnValue(response.statusText)
  }
  if (request) {
    const statusCodeForNoInternet = 0

    const { status, statusText: errorMessage } = request

    if (status === statusCodeForNoInternet) {
      return returnValue(
        'Seems you are not connected to the internet, refresh your browser'
      )
    }

    // return returnValue(errorMessage)
  }
  return returnValue(error)

  // return "Error Occured";
}

export default parseError
