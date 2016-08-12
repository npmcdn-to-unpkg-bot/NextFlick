import React, {Component} from 'react'
import Matcher from 'did-you-mean'
import classes from './Home.scss'
import $ from 'jquery'

export default class Home extends Component {
  constructor (props) {
    super(props)

    this.getMovies = this.getMovies.bind(this)
    this.getMovieData = this.getMovieData.bind(this)
    this.onMovieNameChange = this.onMovieNameChange.bind(this)
    this.state = {
      movies: [],
      options: null,
      didYouMeanVisibility: false,
      didYouMeanMessage: 'Did you mean ',
      movieName: ''
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
        options: new Matcher()
      })
      this.state.movies.map(movie => this.state.options.add(movie))
    })
  }
  getMovies (e) {
    e.preventDefault()

    console.log(this.state.options)
    if (this.state.movieName !== '') {
      console.log(this.state.options.get(this.state.movieName))
      this.setState({ didYouMeanVisibility: true, didYouMeanMessage: 'Did you mean Star Wars' })
    }
  }

  onMovieNameChange (e) {
    this.setState({ movieName: e.target.value })
  }
  render () {
    return (
      <div className={'center-block'}>
        <img
          alt='This is a duck, because Redux!'
          className={classes.duck}
        />
        <p className={'help-block'}>What will you watch next?</p>
        <form onSubmit={this.getMovies}>
          <div className={'form-group text-center'}>
            <input type='text' id='movieName' value={this.state.movieName} onChange={this.onMovieNameChange} className={'form-control'} />
            {this.state.didYouMeanVisibility ? <p>{this.state.didYouMeanMessage}</p> : null}
            <p className={'help-block'}>Type in the name of a movie or TV show and get movie recommendations!</p>
          </div>
          <button type='submit' className='btn btn-default'>Recommend !</button>
        </form>
      </div>
    )
  }
}

