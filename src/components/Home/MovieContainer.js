import React, {Component} from 'react'
import classes from './Home.scss'

export default class Home extends Component {
  constructor (props) {
    super(props)
    console.log(this.props)
    this.state = {
      newRow: false
    }
  }

  render () {
    if ((this.props.index + 1) % 3 === 0) {

    }
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
            <span style={{fontWeight: 'bold'}}>SUMMARY</span><br /> {this.props.movie.addPlot}
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
            <div style={{fontWeight: 'bold', float: 'left', marginRight: '3px'}}>Average Rating<br /> {this.props.movie.addTomatoRating}</div>
            <div style={{fontWeight: 'bold', float: 'left', marginRight: '3px'}}>RT Rating<br /> {this.props.movie.addTomatoMeter}%</div>
            <div style={{fontWeight: 'bold', float: 'left'}}>RT Audience<br /> {this.props.movie.addTomatoUserMeter}%</div>
          </div>
        </div>
      </div>
    )
  }
}
