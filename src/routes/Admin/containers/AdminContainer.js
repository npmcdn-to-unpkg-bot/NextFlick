import { connect } from 'react-redux'
import { getData,
  getActors,
  getLocations,
  uploadMovies,
  uploadActors,
  uploadDirectors,
  uploadAffiliations,
  uploadConflicts,
  uploadGenres,
  uploadLocations,
  getUploadMovieData,
  deleteMovie,
  getAdditionalData,
  getDirectors, getGenres, getConflicts, getAffiliations, saveMovie, editMovie, uploadMovie } from '../modules/admin'

/*  This is a container component. Notice it does not contain any JSX,
    nor does it import React. This component is **only** responsible for
    wiring in the actions and state necessary to render a presentational
    component - in this case, the counter:   */

import Admin from 'components/Admin'

/*  Object of action creators (can also be function that returns object).
    Keys will be passed as props to presentational components. Here we are
    implementing our wrapper around increment; the component doesn't care   */

const mapActionCreators = {
  getData,
  getActors,
  getDirectors,
  getLocations,
  getGenres,
  getConflicts,
  getAffiliations,
  uploadMovie,
  saveMovie,
  editMovie,
  getUploadMovieData,
  uploadMovies,
  uploadActors,
  uploadDirectors,
  uploadAffiliations,
  uploadConflicts,
  uploadGenres,
  uploadLocations,
  deleteMovie,
  getAdditionalData
}

const mapStateToProps = (state) => {
  return {
    movies: state.admin.movies,
    actors: state.admin.actors,
    directors: state.admin.directors,
    genres: state.admin.genres,
    conflicts: state.admin.conflicts,
    affiliations: state.admin.affiliations,
    locations: state.admin.locations
  } }

/*  Note: mapStateToProps is where you should use `reselect` to create selectors, ie:

    import { createSelector } from 'reselect'
    const counter = (state) => state.counter
    const tripleCount = createSelector(counter, (count) => count * 3)
    const mapStateToProps = (state) => ({
      counter: tripleCount(state)
    })

    Selectors can compute derived data, allowing Redux to store the minimal possible state.
    Selectors are efficient. A selector is not recomputed unless one of its arguments change.
    Selectors are composable. They can be used as input to other selectors.
    https://github.com/reactjs/reselect    */

export default connect(mapStateToProps, mapActionCreators)(Admin)
