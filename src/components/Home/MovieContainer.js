import React, {Component} from 'react'
import classes from './Home.scss'
import $ from 'jquery'
import theMovieDb from 'themoviedb-javascript-library'
require('./load_image.js')
import {Modal} from 'react-bootstrap'
const {Header: ModalHeader, Title: ModalTitle, Body: ModalBody, Footer: ModalFooter} = Modal

export default class Home extends Component {
  constructor (props) {
    super(props)
    theMovieDb.common.api_key = 'fa88e72a8e91f5ef492c16015b032449'
    theMovieDb.common.base_uri = 'https://api.themoviedb.org/3/'
    this.state = {
      newRow: false,
      showModal: false,
      trailer: '',
      poster: '',
      posterContId: 'posterContainerId'.concat(this.props.movie._id)
    }
    this.close = this.close.bind(this)
    this.openTrailer = this.openTrailer.bind(this)
    this.loadImage = this.loadImage.bind(this)
  }

  close () {
    this.setState({showModal: false})
  }
  openTrailer () {
    const propName = this.props.movie.Movie
    const movieName = propName.replace(' ', '%20')
    const self = this
    theMovieDb.search.getMovie({'query': encodeURIComponent(propName)}, function (e) {
      const movieId = JSON.parse(e).results[0].id
      theMovieDb.movies.getTrailers({ 'id': movieId },
      function (res) {
        console.log(JSON.parse(res))
        const youtubeKey = JSON.parse(res).youtube.filter(x => x.type === 'Trailer')[0].source
        const youtubeUrl = 'https://www.youtube.com/embed/' + youtubeKey
        self.setState({trailer: youtubeUrl})
      }, function (err) {
        console.log(err)
      })
    }, function (er) {
      console.log(er)
    })
    this.setState({showModal: true})
  }

  loadImage (e) {
    console.log(e)
    
  }

  render () {
    let plot = this.props.movie.addPlot

    if (typeof plot !== 'undefined') {
      plot = this.props.movie.addPlot.length > 182 ? this.props.movie.addPlot.substring(0, 182).concat('...') : this.props.movie.addPlot
    }

    return (
      <div className={'col-md-3 ' + classes['col-centered']} key={this.props.movie._id}>
        <div className={'movie-container-header'} style={{textAlign: 'center'}}>
          {this.props.movie.Movie} <span>{window.sessionStorage['userIsLogedIn'] ? 'Score: ' + this.props.movie.score : ''}</span>
        </div>
        <div className={classes['front']} id={this.state.posterContId}>
          <img crossOrigin='' src={this.props.movie.addPoster} width='247' height='366' />
        </div>
        <div className={classes['back']}>
          <div>
            <span style={{fontWeight: 'bold'}}>SUMMARY</span><br /> {plot}
          </div>
          <br />
          <div>
            <span style={{fontWeight: 'bold'}}>CAST</span><br /> {this.props.movie.addActors}
          </div>
          <br />
          <div>
            <span style={{fontWeight: 'bold'}}>DIRECTOR</span><br /> {this.props.movie.addDirector}
          </div>
          <br />
          <div>
            <div style={{float: 'left', marginRight: '2px'}}>Average Rating<br /> {this.props.movie.addTomatoRating}</div>
            <div style={{float: 'left', marginRight: '2px'}}>RT Rating<br /> {this.props.movie.addTomatoMeter}%</div>
            <div style={{float: 'left'}}>RT Audience<br /> {this.props.movie.addTomatoUserMeter}%</div>
          </div>
          <br />
          <div style={{textAlign: 'center'}}>
            <span className={'glyphicon glyphicon-play-circle'}
              style={{fontSize: '30px', cursor: 'pointer'}}
              aria-hidden='true'
              onClick={this.openTrailer}>
            </span>
          </div>
          <Modal show={this.state.showModal} onHide={this.close}>
            <ModalHeader closeButton>
            </ModalHeader>
            <ModalBody>
              <iframe width='560' height='315' src={this.state.trailer} frameBorder='0' allowFullScreen></iframe>
            </ModalBody>
          </Modal>
        </div>
      </div>
    )
  }
}
