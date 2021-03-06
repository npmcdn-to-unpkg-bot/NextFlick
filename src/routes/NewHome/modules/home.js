import request from 'axios'
import _ from 'lodash'

// ------------------------------------
// Constants
// ------------------------------------
export const COUNTER_INCREMENT = 'COUNTER_INCREMENT'
export const GET_MOVIES = 'GET_MOVIES'
export const GET_POSTERS = 'GET_POSTERS'

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
export function receivePosters (data) {
  return {
    type: GET_POSTERS,
    posters: data
  }
}
export const getMovies = () => {
  return (dispatch, getState) => {
    return request.get('/api/movies').then((data) => dispatch(receiveMovies(data)))
  }
}

export const getRecommendations = (data) => {
  return (dispatch, getState) => {
    return request.post('/api/recommendations', data).then((data) => dispatch(receiveMovies(data)))
  }
}

export const getPosters = (data) => {
  return (dispatch, getState) => {
    return request.post('/api/posters', data.movies).then((data) => dispatch(receivePosters(data)))
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
  getRecommendations,
  getPosters
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
  },
  [GET_POSTERS]: (state, action) => {
    state.posters = []
    state.posters.push(action.posters.data)
    return state
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  movies: [],
  posters: []
}
export default function counterReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
