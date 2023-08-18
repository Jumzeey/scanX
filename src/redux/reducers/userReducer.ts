/* eslint-disable camelcase */
import { Reducer } from 'react'
import { SET_USER } from '../types'

export type UserState = {
  fullname: string
  created_at: string
  email: string
  id: number | null
  redeem_count: number | null
  role: string
  updated_at: string
}

export const initialUserState: UserState = {
  fullname: '',
  created_at: '',
  email: '',
  id: null,
  redeem_count: null,
  role: '',
  updated_at: '',
}

type ActionType = {
  readonly type: typeof SET_USER
  readonly payload: any
}

const userReducer: Reducer<UserState, ActionType> = (
  state = initialUserState,
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
export default userReducer
