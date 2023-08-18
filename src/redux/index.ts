import { createStore, compose, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import rootReducer from './reducers'

const middleware = [thunk]

const initialState = {}
// const windowObj: any = window

const store = createStore(
  rootReducer,
  initialState,
  compose(
    applyMiddleware(...middleware)
    // windowObj.__REDUX_DEVTOOLS_EXTENSION__ && windowObj.__REDUX_DEVTOOLS_EXTENSION__()
  )
)
export default store
