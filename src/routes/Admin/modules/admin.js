import request from 'axios'
import _ from 'lodash'
// ------------------------------------
// Constants
// ------------------------------------
export const COUNTER_INCREMENT = 'COUNTER_INCREMENT'
export const GET_MOVIES = 'GET_MOVIES'
export const GET_ACTORS = 'GET_ACTORS'
export const GET_DIRECTORS = 'GET_DIRECTORS'
export const GET_GENRES = 'GET_GENRES'
export const GET_CONFLICTS = 'GET_CONFLICTS'
export const GET_LOCATIONS = 'GET_LOCATIONS'
export const GET_AFFILIATIONS = 'GET_AFFILIATIONS'
export const UPLOAD_MOVIES = 'UPLOAD_MOVIES'
export const UPLOAD_ACTORS = 'UPLOAD_ACTORS'
export const UPLOAD_DIRECTORS = 'UPLOAD_DIRECTORS'
export const UPLOAD_GENRES = 'UPLOAD_GENRES'
export const UPLOAD_CONFLICTS = 'UPLOAD_CONFLICTS'
export const UPLOAD_AFFILIATIONS = 'UPLOAD_AFFILIATIONS'
export const UPLOAD_LOCATIONS = 'UPLOAD_LOCATIONS'
export const SAVE_MOVIE = 'SAVE_MOVIE'
export const EDIT_MOVIE = 'EDIT_MOVIE'

// ------------------------------------
// Actions
// ------------------------------------
export function increment (value = 1) {
  return {
    type: COUNTER_INCREMENT,
    payload: value
  }
}

export function receiveMovies (data, movies) {
  return {
    type: GET_MOVIES,
    movies: data,
    oldMovies: movies
  }
}

export function receiveActors (data, movies) {
  return {
    type: GET_ACTORS,
    actors: data
  }
}

export function receiveDirectors (data, movies) {
  return {
    type: GET_DIRECTORS,
    directors: data
  }
}

export function receiveGenres (data, movies) {
  return {
    type: GET_GENRES,
    genres: data
  }
}

export function receiveConflicts (data, movies) {
  return {
    type: GET_CONFLICTS,
    conflicts: data
  }
}

export function receiveAffiliations (data, movies) {
  return {
    type: GET_AFFILIATIONS,
    affiliations: data
  }
}

export function receiveLocations (data, movies) {
  return {
    type: GET_LOCATIONS,
    locations: data
  }
}

export const getData = () => {
  return (dispatch, getState) => {
    return request.get('/api/whatever').then((data) => dispatch(receiveMovies(data, getState().movies)))
  }
}

export const getActors = () => {
  return (dispatch, getState) => {
    return request.get('/api/actors').then((data) => dispatch(receiveActors(data, getState().actors)))
  }
}

export const getGenres = () => {
  return (dispatch, getState) => {
    return request.get('/api/genres').then((data) => dispatch(receiveGenres(data, getState().genres)))
  }
}

export const getDirectors = () => {
  return (dispatch, getState) => {
    return request.get('/api/directors').then((data) => dispatch(receiveDirectors(data, getState().directors)))
  }
}

export const getConflicts = () => {
  return (dispatch, getState) => {
    return request.get('/api/conflicts').then((data) => dispatch(receiveConflicts(data, getState().conflicts)))
  }
}

export const getAffiliations = () => {
  return (dispatch, getState) => {
    return request.get('/api/affiliations').then((data) => dispatch(receiveAffiliations(data, getState().affiliations)))
  }
}
export const getLocations = () => {
  return (dispatch, getState) => {
    return request.get('/api/locations').then((data) => dispatch(receiveLocations(data, getState().locations)))
  }
}

function csvToJson (csv) {
  const content = csv.split('\n')
  const header = content[0].split(',')
  return _.tail(content).map((row) => {
    return _.zipObject(header, row.split(','))
  })
}
function onlyUnique (value, index, self) {
  return self.indexOf(value) === index
}

function getMoviesMetaData (movies) {
  const actors = [].concat.apply([], movies.map(x => x.Actor)).filter(onlyUnique)
  const similarActors = [].concat.apply([], movies.map(x => x.SimilarActor)).filter(onlyUnique)
  const fullActors = _.union(actors, similarActors)
  const actorsObj = []
  fullActors.map(x => actorsObj.push({ name: x }))
  // FILTER DIRECTORS
  const directors = [].concat.apply([], movies.map(x => x.Director)).filter(onlyUnique)
  const similarDirectors = [].concat.apply([], movies.map(x => x.SimilarDirector)).filter(onlyUnique)
  const fullDirectors = _.union(directors, similarDirectors)
  const directorsObj = []
  fullDirectors.map(x => directorsObj.push({ name: x }))
  // FILTER GENRES
  const genres = [].concat.apply([], movies.map(x => x.Genre)).filter(onlyUnique)
  const genresObj = []
  genres.map(x => genresObj.push({ name: x }))
  // FILTER CONFLICTS
  const conflicts = [].concat.apply([], movies.map(x => x.CentralConflict)).filter(onlyUnique)
  const conflictsObj = []
  conflicts.map(x => conflictsObj.push({ name: x }))
  // FILTER AFFILIATIONS
  const affiliations = [].concat.apply([], movies.map(x => x.Affiliation)).filter(onlyUnique)
  const affiliationsObj = []
  affiliations.map(x => affiliationsObj.push({ name: x }))
  // FILTER LOCATIONS
  const locations = [].concat.apply([], movies.map(x => x.Location)).filter(x => x !== '').filter(onlyUnique)
  const locationsObj = []
  locations.map(x => locationsObj.push({ name: x }))

  return {
    actors: actorsObj,
    directors: directorsObj,
    genres: genresObj,
    conflicts: conflictsObj,
    affiliations: affiliationsObj,
    locations: locationsObj
  }
}

export const uploadMovie = (data) => {
  return dispatch => {
    const reader = new FileReader()
    let text = ''
    reader.readAsText(data.file)
    reader.onload = function (e) {
      text = csvToJson(reader.result)
      const array = []
      for (let i = 0; i < text.length; i++) {
        const tempObj = {
          Movie: text[i].Movie,
          Year: text[i].Year,
          Awards: text[i].Awards,
          Indie: text[i].Indie,
          Location: text[i].Location,
          StrongFemaleLead: text[i]['Strong Female Lead'],
          CentralConflict: Object.keys(text[i]).filter(function (k) { return ~k.indexOf('Central Conflict') }).map((e) => text[i][e]),
          Genre: Object.keys(text[i]).filter(function (k) { return ~k.indexOf('Genre') }).map((e) => text[i][e]).filter((x) => x !== ''),
          SimilarActor: Object.keys(text[i]).filter(function (k) { return ~k.indexOf('Similar Actor') }).map((e) => text[i][e]).filter((x) => x !== ''),
          Actor: Object.keys(text[i]).filter(function (k) { return ~k.indexOf('Actor') })
            .map((e) => text[i][e]).filter((x) => x !== '')
            .filter(x => Object.keys(text[i])
              .filter(function (k) { return ~k.indexOf('Similar Actor') })
              .map((e) => text[i][e]).filter((x) => x !== '').indexOf(x) < 0),
          Director: Object.keys(text[i]).filter(function (k) { return ~k.indexOf('Director') })
            .map((e) => text[i][e]).filter((x) => x !== '')
            .filter(x => Object.keys(text[i]).filter(function (k) { return ~k.indexOf('Similar Director') })
              .map((e) => text[i][e]).filter((x) => x !== '').indexOf(x) < 0),
          SimilarDirector: Object.keys(text[i]).filter(function (k) { return ~k.indexOf('Similar Director') }).map((e) => text[i][e]).filter((x) => x !== ''),
          Affiliation: Object.keys(text[i]).filter(function (k) { return ~k.indexOf('Affiliation') }).map((e) => text[i][e]).filter((x) => x !== '' && x !== '\r')
        }
        array.push(tempObj)
      }
      // FILTER ACTORS
      const actors = [].concat.apply([], array.map(x => x.Actor)).filter(onlyUnique)
      const similarActors = [].concat.apply([], array.map(x => x.SimilarActor)).filter(onlyUnique)
      const fullActors = _.union(actors, similarActors)
      const actorsObj = []
      fullActors.map(x => actorsObj.push({ name: x }))
      // FILTER DIRECTORS
      const directors = [].concat.apply([], array.map(x => x.Director)).filter(onlyUnique)
      const similarDirectors = [].concat.apply([], array.map(x => x.SimilarDirector)).filter(onlyUnique)
      const fullDirectors = _.union(directors, similarDirectors)
      const directorsObj = []
      fullDirectors.map(x => directorsObj.push({ name: x }))
      // FILTER GENRES
      const genres = [].concat.apply([], array.map(x => x.Genre)).filter(onlyUnique)
      const genresObj = []
      genres.map(x => genresObj.push({ name: x }))
      // FILTER CONFLICTS
      const conflicts = [].concat.apply([], array.map(x => x.CentralConflict)).filter(onlyUnique)
      const conflictsObj = []
      conflicts.map(x => conflictsObj.push({ name: x }))
      // FILTER AFFILIATIONS
      const affiliations = [].concat.apply([], array.map(x => x.Affiliation)).filter(onlyUnique)
      const affiliationsObj = []
      affiliations.map(x => affiliationsObj.push({ name: x }))
      // FILTER LOCATION
      const locations = [].concat.apply([], array.map(x => x.Location)).filter(x => x !== '').filter(onlyUnique)
      const locationsObj = []
      locations.map(x => locationsObj.push({ name: x }))

      return dispatch(uploadMovies(array))
        .then(dispatch(uploadActors(actorsObj)))
        .then(dispatch(uploadDirectors(directorsObj)))
        .then(dispatch(uploadGenres(genresObj)))
        .then(dispatch(uploadConflicts(conflictsObj)))
        .then(dispatch(uploadAffiliations(affiliationsObj)))
        .then(dispatch(uploadLocations(locationsObj)))
    }
  }
}

export const saveMovie = (data) => {
  return dispatch => {
    dispatch(saveNewMovie(data))
  }
}

export const editMovie = (data) => {
  return dispatch => {
    dispatch(editNewMovie(data))
  }
}

export function upload (data) {
  return {
    type: UPLOAD_MOVIES,
    uploadedFile: data
  }
}

export function uploadNewDirectors (data, st) {
  return {
    type: UPLOAD_DIRECTORS,
    directors: data,
    state: st
  }
}

export const getUploadMovieData = (data) => {
    const reader = new FileReader()
    let text = ''
    reader.readAsText(data.file)
    reader.onload = function (e) {
      text = csvToJson(reader.result)
      const array = []
      for (let i = 0; i < text.length; i++) {
        const tempObj = {
          Movie: text[i].Movie,
          Year: text[i].Year,
          Awards: text[i].Awards,
          Indie: text[i].Indie,
          Location: text[i].Location,
          StrongFemaleLead: text[i]['Strong Female Lead'],
          CentralConflict: Object.keys(text[i]).filter(function (k) { return ~k.indexOf('Central Conflict') }).map((e) => text[i][e]),
          Genre: Object.keys(text[i]).filter(function (k) { return ~k.indexOf('Genre') }).map((e) => text[i][e]).filter((x) => x !== ''),
          SimilarActor: Object.keys(text[i]).filter(function (k) { return ~k.indexOf('Similar Actor') }).map((e) => text[i][e]).filter((x) => x !== ''),
          Actor: Object.keys(text[i]).filter(function (k) { return ~k.indexOf('Actor') })
          .map((e) => text[i][e]).filter((x) => x !== '')
          .filter(x => Object.keys(text[i])
            .filter(function (k) { return ~k.indexOf('Similar Actor') })
            .map((e) => text[i][e]).filter((x) => x !== '').indexOf(x) < 0),
          Director: Object.keys(text[i]).filter(function (k) { return ~k.indexOf('Director') })
          .map((e) => text[i][e]).filter((x) => x !== '')
          .filter(x => Object.keys(text[i]).filter(function (k) { return ~k.indexOf('Similar Director') })
            .map((e) => text[i][e]).filter((x) => x !== '').indexOf(x) < 0),
          SimilarDirector: Object.keys(text[i]).filter(function (k) { return ~k.indexOf('Similar Director') }).map((e) => text[i][e]).filter((x) => x !== ''),
          Affiliation: Object.keys(text[i]).filter(function (k) { return ~k.indexOf('Affiliation') }).map((e) => text[i][e]).filter((x) => x !== '' && x !== '\r')
        }
        array.push(tempObj)
      }
      // FILTER ACTORS
      const actors = [].concat.apply([], array.map(x => x.Actor)).filter(onlyUnique)
      const similarActors = [].concat.apply([], array.map(x => x.SimilarActor)).filter(onlyUnique)
      const fullActors = _.union(actors, similarActors)
      const actorsObj = []
      fullActors.map(x => actorsObj.push({ name: x }))
      // FILTER DIRECTORS
      const directors = [].concat.apply([], array.map(x => x.Director)).filter(onlyUnique)
      const similarDirectors = [].concat.apply([], array.map(x => x.SimilarDirector)).filter(onlyUnique)
      const fullDirectors = _.union(directors, similarDirectors)
      const directorsObj = []
      fullDirectors.map(x => directorsObj.push({ name: x }))
      // FILTER GENRES
      const genres = [].concat.apply([], array.map(x => x.Genre)).filter(onlyUnique)
      const genresObj = []
      genres.map(x => genresObj.push({ name: x }))
      // FILTER CONFLICTS
      const conflicts = [].concat.apply([], array.map(x => x.CentralConflict)).filter(onlyUnique)
      const conflictsObj = []
      conflicts.map(x => conflictsObj.push({ name: x }))
      // FILTER AFFILIATIONS
      const affiliations = [].concat.apply([], array.map(x => x.Affiliation)).filter(onlyUnique)
      const affiliationsObj = []
      affiliations.map(x => affiliationsObj.push({ name: x }))
      // FILTER LOCATION
      const locations = [].concat.apply([], array.map(x => x.Location)).filter(x => x !== '').filter(onlyUnique)
      const locationsObj = []
      locations.map(x => locationsObj.push({ name: x }))

      return {
        movies: array,
        actors: actorsObj,
        directors: directorsObj,
        genres: genresObj,
        concat: conflictsObj,
        affiliations: affiliationsObj,
        locations: locationsObj
      }
    }
}

export function uploadNewGenres (data, st) {
  return {
    type: UPLOAD_GENRES,
    genres: data,
    state: st
  }
}

export function uploadNewConflicts (data, st) {
  return {
    type: UPLOAD_CONFLICTS,
    conflicts: data,
    state: st
  }
}

export function uploadNewAffiliations (data, st) {
  return {
    type: UPLOAD_AFFILIATIONS,
    affiliations: data,
    state: st
  }
}

export function uploadNewLocations (data, st) {
  return {
    type: UPLOAD_LOCATIONS,
    locations: data,
    state: st
  }
}

export function uploadNewActors (data, st) {
  return {
    type: UPLOAD_ACTORS,
    actors: data,
    state: st
  }
}

export function saveNewMovieReducer (data, st) {
  return {
    type: SAVE_MOVIE,
    movie: data,
    state: st
  }
}
export function editNewMovieReducer (data, st) {
  return {
    type: EDIT_MOVIE,
    movie: data,
    state: st
  }
}
export const uploadMovies = (data) => {
  return (dispatch, getState) => {
    return request.post('/api/movies', data).then((data) => dispatch(upload(data)))
  }
}

export const uploadActors = (data) => {
  return (dispatch, getState) => {
    return request.post('/api/actors', data).then((data) => dispatch(uploadNewActors(data, getState())))
  }
}

export const uploadDirectors = (data) => {
  return (dispatch, getState) => {
    return request.post('/api/directors', data).then((data) => dispatch(uploadNewDirectors(data, getState())))
  }
}

export const uploadGenres = (data) => {
  return (dispatch, getState) => {
    return request.post('/api/genres', data).then((data) => dispatch(uploadNewGenres(data, getState())))
  }
}

export const uploadConflicts = (data) => {
  return (dispatch, getState) => {
    return request.post('/api/conflicts', data).then((data) => dispatch(uploadNewConflicts(data, getState())))
  }
}

export const uploadAffiliations = (data) => {
  return (dispatch, getState) => {
    return request.post('/api/affiliations', data).then((data) => dispatch(uploadNewAffiliations(data, getState())))
  }
}

export const uploadLocations = (data) => {
  return (dispatch, getState) => {
    return request.post('/api/locations', data).then((data) => dispatch(uploadNewLocations(data, getState())))
  }
}

export const saveNewMovie = (data) => {
  return (dispatch, getState) => {
    const movieMeta = getMoviesMetaData(data)
    return request.post('/api/saveMovie', data)
      .then((data) => dispatch(saveNewMovieReducer(data, getState())))
      .then(dispatch(uploadActors(movieMeta.actors)))
      .then(dispatch(uploadDirectors(movieMeta.directors)))
      .then(dispatch(uploadGenres(movieMeta.genres)))
      .then(dispatch(uploadConflicts(movieMeta.conflicts)))
      .then(dispatch(uploadAffiliations(movieMeta.affiliations)))
      .then(dispatch(uploadLocations(movieMeta.locations)))
  }
}

export const editNewMovie = (data) => {
  return (dispatch, getState) => {
    const movieMeta = getMoviesMetaData(data)
    return request.post('/api/editMovie', data)
      .then((data) => dispatch(editNewMovieReducer(data, getState())))
      .then(dispatch(uploadActors(movieMeta.actors)))
      .then(dispatch(uploadDirectors(movieMeta.directors)))
      .then(dispatch(uploadGenres(movieMeta.genres)))
      .then(dispatch(uploadConflicts(movieMeta.conflicts)))
      .then(dispatch(uploadAffiliations(movieMeta.affiliations)))
      .then(dispatch(uploadLocations(movieMeta.locations)))
  }
}

/*  This is a thunk, meaning it is a function that immediately
    returns a function for lazy evaluation. It is incredibly useful for
    creating async actions, especially when combined with redux-thunk!

    NOTE: This is solely for demonstration purposes. In a real application,
    you'd probably want to dispatch an action of COUNTER_DOUBLE and let the
    reducer take care of this logic.  */
export const actions = {
  getData,
  getActors,
  getDirectors,
  getGenres,
  getLocations,
  getConflicts,
  getAffiliations,
  saveMovie,
  editMovie,
  uploadMovie,
  getUploadMovieData,
  uploadMovies,
  uploadActors,
  uploadDirectors,
  uploadAffiliations,
  uploadConflicts,
  uploadGenres,
  uploadLocations
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [GET_MOVIES]: (state, action) => {
    state.movies = []
    state.movies.push(action.movies.data)
    return state
  },
  [GET_ACTORS]: (state, action) => {
    state.actors = []
    state.actors.push(action.actors.data)
    return state
  },
  [GET_DIRECTORS]: (state, action) => {
    state.directors = []
    state.directors.push(action.directors.data)
    return state
  },
  [GET_GENRES]: (state, action) => {
    state.genres = []
    state.genres.push(action.genres.data)
    return state
  },
  [GET_CONFLICTS]: (state, action) => {
    state.conflicts = []
    state.conflicts.push(action.conflicts.data)
    return state
  },
  [GET_LOCATIONS]: (state, action) => {
    state.locations = []
    state.locations.push(action.locations.data)
    return state
  },
  [GET_AFFILIATIONS]: (state, action) => {
    state.affiliations = []
    state.affiliations.push(action.affiliations.data)
    return state
  },
  [UPLOAD_MOVIES]: (state, action) => {
    console.log(state)
    console.log(action)
    return state
  },
  [UPLOAD_ACTORS]: (state, action) => {
    state.actors = []
    state.actors.push(action.actors.data)
    return state
  },
  [UPLOAD_DIRECTORS]: (state, action) => {
    state.directors = []
    state.directors.push(action.directors.data)
    return state
  },
  [UPLOAD_LOCATIONS]: (state, action) => {
    state.locations = []
    state.locations.push(action.locations.data)
    return state
  },
  [UPLOAD_GENRES]: (state, action) => {
    state.genres = []
    state.genres.push(action.genres.data)
    return state
  },
  [UPLOAD_CONFLICTS]: (state, action) => {
    state.conflicts = []
    state.conflicts.push(action.conflicts.data)
    return state
  },
  [UPLOAD_AFFILIATIONS]: (state, action) => {
    state.affiliations = []
    state.affiliations.push(action.affiliations.data)
    return state
  },
  [SAVE_MOVIE]: (state, action) => {
    state.movies = []
    state.movies.push(action.movie.data)
    return state
  },
  [EDIT_MOVIE]: (state, action) => {
    state.movies = []
    state.movies.push(action.movie.data)
    return state
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  movies: [],
  actors: [],
  directors: [],
  genres: [],
  conflicts: [],
  affiliations: [],
  locations: []
}
export default function adminReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
