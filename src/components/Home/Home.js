import React, {Component} from 'react'
import Matcher from 'did-you-mean'
import classes from './Home.scss'
import MovieContainer from './MovieContainer'
import Logo from './assets/newlogo.png'
import Loader from './assets/ajax-loader.gif'
import $ from 'jquery'
import _ from 'lodash'

export default class Home extends Component {
  constructor (props) {
    super(props)

    this.getMovies = this.getMovies.bind(this)
    this.getMovieData = this.getMovieData.bind(this)
    this.onMovieNameChange = this.onMovieNameChange.bind(this)
    this.onSuggestionClick = this.onSuggestionClick.bind(this)

    this.state = {
      movies: [],
      moviesData: [],
      options: null,
      didYouMeanVisibility: false,
      didYouMeanMessage: 'Did you mean ',
      movieName: '',
      recoMovies: [],
      displayLoader: 'none'
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

  getMovies (e) {
    e.preventDefault()
    this.setState({displayLoader: 'initial'})
    console.log(this.state.options)
    if (this.state.movieName !== '') {
      const suggestion = this.state.options.get(this.state.movieName)
      if (suggestion !== null) {
        const movieIsInList = this.state.movies.filter(x => x.toLowerCase() === this.state.movieName.toLowerCase()).length === 1

        if (!movieIsInList) {
          this.setState({ didYouMeanVisibility: true, didYouMeanMessage: suggestion })
        } else {
          if (this.state.didYouMeanMessage !== '' || this.state.didYouMeanVisibility) {
            this.setState({didYouMeanVisibility: false, didYouMeanMessage: ''})
          }
        }
      }
    }
    let movieScores = []
    const thisMovieData = this.state.moviesData.filter(x => x.Movie.toLowerCase() === this.state.movieName.toLowerCase())
    if (thisMovieData.length === 1) {
      const thisMovie = thisMovieData[0]
      console.log(thisMovie)
      // genres
      for (let i = 0; i < thisMovie.Genre.length; i++) {
        const moviesWithSameGeners = this.state.moviesData
          .filter(x => x.Genre.indexOf(thisMovie.Genre[i]) !== -1)
          .filter(x => x.Movie !== thisMovie.Movie)
        for (let j = 0; j < moviesWithSameGeners.length; j++) {
          let movieScore = movieScores.filter(x => x.movie === moviesWithSameGeners[j].Movie)
          if (movieScore.length === 0) {
            movieScores.push({movie: moviesWithSameGeners[j].Movie, score: 5})
          } else {
            const currMovie = movieScores.filter(x => x.movie === moviesWithSameGeners[j].Movie)[0]
            currMovie.score = currMovie.score + 5
          }
        }
      }
      // actors
      for (let i = 0; i < thisMovie.Actor.length; i++) {
        const moviesWithSameActors = this.state.moviesData
          .filter(x => x.Actor.indexOf(thisMovie.Actor[i]) !== -1)
          .filter(x => x.Movie !== thisMovie.Movie)

        const moviesWithSimActors = this.state.moviesData
          .filter(x => x.SimilarActor.indexOf(thisMovie.Actor[i]) !== -1)
          .filter(x => x.Movie !== thisMovie.Movie)

        for (let j = 0; j < moviesWithSameActors.length; j++) {
          let movieScore = movieScores.filter(x => x.movie === moviesWithSameActors[j].Movie)
          if (movieScore.length === 0) {
            movieScores.push({movie: moviesWithSameActors[j].Movie, score: 10})
          } else {
            const currMovie = movieScores.filter(x => x.movie === moviesWithSameActors[j].Movie)[0]
            currMovie.score = currMovie.score + 10
          }
        }

        for (let j = 0; j < moviesWithSimActors.length; j++) {
          let movieScore = movieScores.filter(x => x.movie === moviesWithSimActors[j].Movie)
          if (movieScore.length === 0) {
            movieScores.push({movie: moviesWithSimActors[j].Movie, score: 5})
          } else {
            const currMovie = movieScores.filter(x => x.movie === moviesWithSimActors[j].Movie)[0]
            currMovie.score = currMovie.score + 5
          }
        }
      }

      // directors
      for (let i = 0; i < thisMovie.Director.length; i++) {
        const moviesWithSameDirectors = this.state.moviesData
          .filter(x => x.Director.indexOf(thisMovie.Director[i]) !== -1)
          .filter(x => x.Movie !== thisMovie.Movie)

        const moviesWithSimDirectors = this.state.moviesData
          .filter(x => x.SimilarDirector.indexOf(thisMovie.Director[i]) !== -1)
          .filter(x => x.Movie !== thisMovie.Movie)

        for (let j = 0; j < moviesWithSameDirectors.length; j++) {
          let movieScore = movieScores.filter(x => x.movie === moviesWithSameDirectors[j].Movie)
          if (movieScore.length === 0) {
            movieScores.push({movie: moviesWithSameDirectors[j].Movie, score: 10})
          } else {
            const currMovie = movieScores.filter(x => x.movie === moviesWithSameDirectors[j].Movie)[0]
            currMovie.score = currMovie.score + 10
          }
        }

        for (let j = 0; j < moviesWithSimDirectors.length; j++) {
          let movieScore = movieScores.filter(x => x.movie === moviesWithSimDirectors[j].Movie)
          if (movieScore.length === 0) {
            movieScores.push({movie: moviesWithSimDirectors[j].Movie, score: 5})
          } else {
            const currMovie = movieScores.filter(x => x.movie === moviesWithSimDirectors[j].Movie)[0]
            currMovie.score = currMovie.score + 5
          }
        }
      }

      // conflicts
      for (let i = 0; i < thisMovie.CentralConflict.length; i++) {
        const moviesWithSameConflicts = this.state.moviesData
          .filter(x => x.CentralConflict.indexOf(thisMovie.CentralConflict[i]) !== -1)
          .filter(x => x.Movie !== thisMovie.Movie)
        for (let j = 0; j < moviesWithSameConflicts.length; j++) {
          let movieScore = movieScores.filter(x => x.movie === moviesWithSameConflicts[j].Movie)
          if (movieScore.length === 0) {
            movieScores.push({movie: moviesWithSameConflicts[j].Movie, score: 3})
          } else {
            const currMovie = movieScores.filter(x => x.movie === moviesWithSameConflicts[j].Movie)[0]
            currMovie.score = currMovie.score + 3
          }
        }
      }

      // affiliations
      for (let i = 0; i < thisMovie.Affiliation.length; i++) {
        const moviesWithSameAffiliation = this.state.moviesData
          .filter(x => x.Affiliation.indexOf(thisMovie.Affiliation[i]) !== -1)
          .filter(x => x.Movie !== thisMovie.Movie)
        for (let j = 0; j < moviesWithSameAffiliation.length; j++) {
          let movieScore = movieScores.filter(x => x.movie === moviesWithSameAffiliation[j].Movie)
          if (movieScore.length === 0) {
            movieScores.push({movie: moviesWithSameAffiliation[j].Movie, score: 1})
          } else {
            const currMovie = movieScores.filter(x => x.movie === moviesWithSameAffiliation[j].Movie)[0]
            currMovie.score = currMovie.score + 1
          }
        }
      }

      // indie
      if (thisMovie.Indie === 'Yes') {
        const moviesWithSameIndie = this.state.moviesData
          .filter(x => x.Indie === thisMovie.Indie)
          .filter(x => x.Movie !== thisMovie.Movie)

        for (let j = 0; j < moviesWithSameIndie.length; j++) {
          let movieScore = movieScores.filter(x => x.movie === moviesWithSameIndie[j].Movie)
          if (movieScore.length === 0) {
            movieScores.push({movie: moviesWithSameIndie[j].Movie, score: 1})
          } else {
            const currMovie = movieScores.filter(x => x.movie === moviesWithSameIndie[j].Movie)[0]
            currMovie.score = currMovie.score + 1
          }
        }
      }

      // awards
      if (thisMovie.Awards === 'Yes') {
        const moviesWithSameAwards = this.state.moviesData
          .filter(x => x.Awards === thisMovie.Awards)
          .filter(x => x.Movie !== thisMovie.Movie)

        for (let j = 0; j < moviesWithSameAwards.length; j++) {
          let movieScore = movieScores.filter(x => x.movie === moviesWithSameAwards[j].Movie)
          if (movieScore.length === 0) {
            movieScores.push({movie: moviesWithSameAwards[j].Movie, score: 1})
          } else {
            const currMovie = movieScores.filter(x => x.movie === moviesWithSameAwards[j].Movie)[0]
            currMovie.score = currMovie.score + 1
          }
        }
      }

      // strong female lead
      if (thisMovie.StrongFemaleLead === 'Yes') {
        const moviesWithSameStrongFemaleLead = this.state.moviesData
          .filter(x => x.StrongFemaleLead === thisMovie.StrongFemaleLead)
          .filter(x => x.Movie !== thisMovie.Movie)

        for (let j = 0; j < moviesWithSameStrongFemaleLead.length; j++) {
          let movieScore = movieScores.filter(x => x.movie === moviesWithSameStrongFemaleLead[j].Movie)
          if (movieScore.length === 0) {
            movieScores.push({movie: moviesWithSameStrongFemaleLead[j].Movie, score: 5})
          } else {
            const currMovie = movieScores.filter(x => x.movie === moviesWithSameStrongFemaleLead[j].Movie)[0]
            currMovie.score = currMovie.score + 5
          }
        }
      }

      // location
      if (thisMovie.Location !== '') {
        const moviesWithSameLocation = this.state.moviesData
          .filter(x => x.Location === thisMovie.Location)
          .filter(x => x.Movie !== thisMovie.Movie)

        for (let j = 0; j < moviesWithSameLocation.length; j++) {
          let movieScore = movieScores.filter(x => x.movie === moviesWithSameLocation[j].Movie)
          if (movieScore.length === 0) {
            movieScores.push({movie: moviesWithSameLocation[j].Movie, score: 3})
          } else {
            const currMovie = movieScores.filter(x => x.movie === moviesWithSameLocation[j].Movie)[0]
            currMovie.score = currMovie.score + 3
          }
        }
      }

      movieScores = _.sortBy(movieScores, 'score').reverse().filter(x => x.score >= 15)

      const moviesWithYear = this.state.moviesData
        .filter(x => {
          for (let j = 0; j < movieScores.length; j++) {
            if (x.Movie.trim().toLowerCase() === movieScores[j].movie.trim().toLowerCase()) {
              return true
            }
          }
          return false
        })
      moviesWithYear.map(x => {
        if (Math.abs(x.Year - thisMovie.Year) >= 10) {
          const currMovie = movieScores.filter(y => y.movie === x.Movie)[0]
          currMovie.score = currMovie.score - 3
        }
      })

      console.log(movieScores)
    }

    let recoMoviesData = []

    Promise.resolve(movieScores.map(x => {
      const concatenatedName = x.movie.replace(' ', '+')
      $.ajax({
        url: '//www.omdbapi.com/?t=' + concatenatedName + '&y=&plot=short&r=json&tomatoes=true',
        async: false,
        cache: true,
        success: (result) => {
          if (result.Response === 'True') {
            recoMoviesData.push(result)
          }
        }
      })
    })).then(this.setState({recoMovies: recoMoviesData, displayLoader: 'none'}))
  }

  onMovieNameChange (e) {
    this.setState({ movieName: e.target.value })
  }

  onSuggestionClick (e) {
    this.setState({movieName: e.target.innerHTML})
    this.getMovies()
  }
  render () {
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
            {this.state.didYouMeanVisibility ? <p style={{fontStyle: 'italic', color: 'blue'}}>Did you mean <span style={{fontWeight: 'bold'}} onClick={this.onSuggestionClick}>{this.state.didYouMeanMessage}</span> ?</p> : null}
            <p className={'help-block'}>Type in the name of a movie or TV show and get movie recommendations!</p>
          </div>
          <button type='submit' className='btn btn-danger'>Recommend !</button>
        </form>
        <br />
        <div className={'panel'}>
          <img src={Loader} alt='Loader' style={{display: this.state.displayLoader}} />
          <div>
            {this.state.recoMovies.map((x, i) => <MovieContainer key={i} movie={x} title={x.Title} poster={x.Poster} />)}
          </div>
        </div>
      </div>
    )
  }
}

