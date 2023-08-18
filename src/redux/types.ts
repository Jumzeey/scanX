import { UserState } from './reducers/userReducer'

export const ADD_NOTIFICATION = 'ADD_NOTIFICATION'
export const REMOVE_NOTIFICATION = 'REMOVE_NOTIFICATION'
export const SET_USER = 'SET_USER'
export const FETCH_SUCCESS = 'FETCH_SUCCESS'
export const FETCH_FAILED = 'FETCH_FAILED'
export const FETCH_END = 'FETCH_END'

export type ReducerRootState = {
  user: UserState
}
