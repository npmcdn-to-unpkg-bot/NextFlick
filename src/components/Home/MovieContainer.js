import React, {Component} from 'react'
import classes from './Home.scss'

export default class Home extends Component {
  constructor (props) {
    super(props)
  }

  render () {
    return (
      <div className={'col-md-3'}>
        <div className={'movie-container-header'}>
          {this.props.title}
        </div>
        <div className={classes['movie-container']}>
          <img src={this.props.poster} width='247' />
        </div>
      </div>
    )
  }
}
