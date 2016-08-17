import React, {Component} from 'react'
import classes from './Home.scss'

export default class Home extends Component {
  constructor (props) {
    super(props)
    console.log(this.props)
  }

  render () {
    return (
      <div className={'col-md-3 ' + classes['col-centered']} key={this.props.movie.Title}>
        <div className={'movie-container-header'}>
          {this.props.movie.Title}
        </div>
        <div className={classes['front']}>
          <img src={this.props.movie.Poster} width='247' />
        </div>
        <div className={classes['back']}>
          <div>
            <span style={{fontWeight: 'bold'}}>SUMMARY</span><br /> {this.props.movie.Plot}
          </div>
          <br />
          <div>
            <span style={{fontWeight: 'bold'}}>CAST</span><br /> {this.props.movie.Actors}
          </div>
          <br />
          <div>
            <span style={{fontWeight: 'bold'}}>DIRECTOR</span><br /> {this.props.movie.Director}
          </div>
          <br />
          <div>
            <div style={{fontWeight: 'bold', float: 'left', marginRight: '3px'}}>Average Rating<br /> {this.props.movie.tomatoRating}</div>
            <div style={{fontWeight: 'bold', float: 'left', marginRight: '3px'}}>RT Rating<br /> {this.props.movie.tomatoMeter}%</div>
            <div style={{fontWeight: 'bold', float: 'left'}}>RT Audience<br /> {this.props.movie.tomatoUserMeter}%</div>
          </div>
        </div>
      </div>
    )
  }
}
