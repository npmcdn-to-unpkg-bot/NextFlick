import request from 'axios'
import _ from 'lodash'

// ------------------------------------
// Constants
// ------------------------------------
export const COUNTER_INCREMENT = 'COUNTER_INCREMENT'
export const GET_MOVIES = 'GET_MOVIES'
export const LOGIN = 'LOGIN'

// ------------------------------------
// Actions
// ------------------------------------
export function increment (value = 1) {
  return {
    type: COUNTER_INCREMENT,
    payload: value
  }
}
export function receiveMovies (data) {
  return {
    type: GET_MOVIES,
    movies: data
  }
}
export const getMovies = () => {
  return (dispatch, getState) => {
    return request.get('/api/whatever').then((data) => dispatch(receiveMovies(data)))
  }
}

export const login = (data) => {
  return (dispatch, getState) => {
    return request.post('/api/login', data).then((result) => {
      if (result.data) {
        window.sessionStorage.setItem('userIsLogedIn', true)
      } else {
        window.sessionStorage.removeItem('userIsLogedIn')
      }
      return result.data
    })
  }
}
/*  This is a thunk, meaning it is a function that immediately
    returns a function for lazy evaluation. It is incredibly useful for
    creating async actions, especially when combined with redux-thunk!

    NOTE: This is solely for demonstration purposes. In a real application,
    you'd probably want to dispatch an action of COUNTER_DOUBLE and let the
    reducer take care of this logic.  */

export const doubleAsync = () => {
  return (dispatch, getState) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        dispatch(increment(getState().counter))
        resolve()
      }, 300)
    })
  }
}

export const actions = {
  increment,
  doubleAsync,
  getMovies,
  login
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [COUNTER_INCREMENT]: (state, action) => state + action.payload,
  [GET_MOVIES]: (state, action) => {
    state.movies = []
    state.movies.push(action.movies.data)
    return state
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  movies: []
}
export default function counterReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
