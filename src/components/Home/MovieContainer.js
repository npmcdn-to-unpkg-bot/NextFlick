import React, {Component} from 'react'
import classes from './Home.scss'
import $ from 'jquery'
import movieTrailer from 'movie-trailer'
import {Modal} from 'react-bootstrap'
const {Header: ModalHeader, Title: ModalTitle, Body: ModalBody, Footer: ModalFooter} = Modal

export default class Home extends Component {
  constructor (props) {
    super(props)
    console.log(this.props)
    this.state = {
      newRow: false,
      showModal: false,
      trailer: ''
    }
    this.close = this.close.bind(this)
    this.openTrailer = this.openTrailer.bind(this)
  }
  close () {
    this.setState({showModal: false})
  }
  openTrailer () {
    const propName = this.props.movie.Movie
    const movieName = propName.replace(' ', '%20')
    $.ajax({
      type: 'GET',
      crossDomain: true,
      dataType: 'jsonp',
      url: 'https://api.themoviedb.org/3/search/movie/?api_key=fa88e72a8e91f5ef492c16015b032449&query=' + movieName
    }).then(res => {
      const movieId = res.results[0].id
      $.ajax({
        type: 'GET',
        crossDomain: true,
        dataType: 'jsonp',
        url: 'https://api.themoviedb.org/3/movie/' + movieId + '/videos?api_key=fa88e72a8e91f5ef492c16015b032449'
      }).then(res => {
        const youtubeKey = res.results.filter(x => x.type === 'Trailer')[0].key
        const youtubeUrl = 'https://www.youtube.com/embed/' + youtubeKey
        this.setState({trailer: youtubeUrl})
      })
    })
    this.setState({showModal: true})
  }
  render () {
    return (
      <div className={'col-md-3 ' + classes['col-centered']} key={this.props.movie._id}>
        <div className={'movie-container-header'} style={{textAlign: 'center'}}>
          {this.props.movie.Movie} <span>{window.sessionStorage['userIsLogedIn'] ? 'Score: ' + this.props.movie.score : ''}</span>
        </div>
        <div className={classes['front']}>
          <img src={this.props.movie.addPoster} width='247' height='366' />
        </div>
        <div className={classes['back']}>
          <div>
            <span style={{fontWeight: 'bold'}}>SUMMARY</span><br /> {this.props.movie.addPlot.length > 182 ? this.props.movie.addPlot.substring(0, 182).concat('...') : this.props.movie.addPlot}
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
            <ModalBody>
              <iframe width='560' height='315' src={this.state.trailer} frameBorder='0' allowFullScreen></iframe>
            </ModalBody>
          </Modal>
        </div>
      </div>
    )
  }
}
