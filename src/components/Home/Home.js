import React, {Component} from 'react'
import Matcher from 'did-you-mean'
import classes from './Home.scss'
import MovieContainer from './MovieContainer'
import Logo from './assets/newlogo.png'
import Loader from './assets/ajax-loader.gif'
import $ from 'jquery'
import _ from 'lodash'
import {Pagination} from 'react-bootstrap'

export default class Home extends Component {
  constructor (props) {
    super(props)

    this.getMovies = this.getMovies.bind(this)
    this.getMoviesAlg = this.getMoviesAlg.bind(this)
    this.getMovieData = this.getMovieData.bind(this)
    this.onMovieNameChange = this.onMovieNameChange.bind(this)
    this.onSuggestionClick = this.onSuggestionClick.bind(this)
    this.onPagination = this.onPagination.bind(this)

    this.state = {
      movies: [],
      moviesData: [],
      options: null,
      didYouMeanVisibility: false,
      didYouMeanMessage: 'Did you mean ',
      movieName: '',
      recoMovies: [],
      displayLoader: 'none',
      numberOfMovieis: 0,
      pages: [],
      selectedPage: 1,
      nrOfMoviesPerPage: 50
    }
  }

  componentDidMount () {
    this.getMovieData()
  }

  getMovieData () {
    this.props.getMovies().then((res) => {
      const movieNames = res.movies.data.map(x => x.Movie)
      this.setState({
        movies: movieNames,
        options: new Matcher(),
        moviesData: res.movies.data
      })
      this.state.movies.map(movie => this.state.options.add(movie))
    })
  }
  onPagination (eventKey) {
    const pageHasChanged = this.state.selectedPage !== eventKey
    this.setState({
      selectedPage: eventKey
    })
    if (pageHasChanged) {
      $('html, body').animate({ scrollTop: 0 }, 'fast')
    }
  }

  getMoviesAlg (movieName) {
    this.setState({displayLoader: 'initial', recoMovies: [], numberOfMovieis: 0, pages: 0, selectedPage: 1})
    const movieObj = {
      movie: movieName
    }
    let recoMoviesData = []
    this.props.getRecommendations(movieObj).then(res => {
      recoMoviesData = res.movies.data
      this.setState({
        recoMovies: _.sortBy(recoMoviesData, 'score').reverse(),
        displayLoader: 'none',
        numberOfMovieis: recoMoviesData.length,
        pages: _.range(1, (Math.ceil(recoMoviesData.length / 50)) + 1)
      })
    })
    if (movieName !== '') {
      const suggestion = this.state.options.get(movieName)
      if (suggestion !== null) {
        const movieIsInList = this.state.movies.filter(x => x.toLowerCase() === movieName.toLowerCase()).length === 1
        if (!movieIsInList) {
          this.setState({ didYouMeanVisibility: true, didYouMeanMessage: suggestion })
        } else {
          if (this.state.didYouMeanMessage !== '' || this.state.didYouMeanVisibility) {
            this.setState({didYouMeanVisibility: false, didYouMeanMessage: ''})
          }
        }
      }
    }    
  }

  getMovies (e) {
    e.preventDefault()
    this.getMoviesAlg(this.state.movieName)
  }

  onMovieNameChange (e) {
    this.setState({ movieName: e.target.value })
  }

  onSuggestionClick (e) {
    this.setState({movieName: e.target.innerHTML})
    this.getMoviesAlg(e.target.innerHTML)
  }
  render () {
     // console.log(this.state.recoMovies              .filter((x, i) => this.state.nrOfMoviesPerPage * this.state.selectedPage - this.state.nrOfMoviesPerPage <= i < this.state.nrOfMoviesPerPage * this.state.selectedPage))
    return (
      <div className={'center-block'}>
        <img src={Logo}
          alt='This is a  duck, because Redux!'
          className={classes.duck}
          style={{width: '400px'}}
        />
        <p className={'help-block'}>What will you watch next?</p>
        <form onSubmit={this.getMovies} >
          <div className={'form-group text-center'}>
            <input style={{width: '400px', margin: '0 auto'}} type='text' id='movieName' autoComplete={'off'} value={this.state.movieName} onChange={this.onMovieNameChange} className={'form-control'} />
            {this.state.didYouMeanVisibility ? <p style={{fontStyle: 'italic', color: '#df183e'}}>Did you mean <span style={{fontWeight: 'bold', cursor: 'pointer'}} onClick={this.onSuggestionClick}>{this.state.didYouMeanMessage}</span> ?</p> : null}
            <p className={'help-block'}>Type in the name of a movie or TV show and get movie recommendations!</p>
          </div>
          <button type='submit' className='btn btn-danger'>Recommend !</button>
        </form>
        <br />
        <div className={'panel'}>
          <img src={Loader} alt='Loader' style={{display: this.state.displayLoader}} />
          <div>
            {this.state.recoMovies
              .filter((x, i) => i < this.state.nrOfMoviesPerPage * this.state.selectedPage && i >= this.state.nrOfMoviesPerPage * this.state.selectedPage - this.state.nrOfMoviesPerPage)
              .map((x, i) => <MovieContainer key={i} movie={x} />)}
          </div>
          <div style={{display: this.state.numberOfMovieis === 0 ? 'none' : 'initial'}}>
            <Pagination
              first
              last
              ellipsis
              boundaryLinks
              items={this.state.pages.length}
              maxButtons={5}
              activePage={this.state.selectedPage}
              onSelect={this.onPagination} />
          </div>
        </div>
      </div>
    )
  }
}

