import { Reducer } from 'react'
import { SET_USER } from '../types'

export type UserState = {
  firstName: string
}

const initialState: UserState = {
  firstName: '',
}

type ActionType = {
  readonly type: typeof SET_USER
  readonly payload: any
}

const uiReducer: Reducer<UserState, ActionType> = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        ...action.payload,
      }
    default:
      return state
  }
}
export default uiReducer
