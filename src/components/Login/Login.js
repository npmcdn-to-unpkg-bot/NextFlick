import React, {Component} from 'react'
import $ from 'jquery'

export default class Login extends Component {
  constructor (props) {
    super(props)
    this.state = {
      username: '',
      password: '',
      credViability: 'none'
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.onUsernameChange = this.onUsernameChange.bind(this)
    this.onPasswordChange = this.onPasswordChange.bind(this)
  }

  handleSubmit (e) {
    e.preventDefault()
    const userObj = {
      username: this.state.username,
      password: this.state.password
    }
    this.props.login(userObj).then((r) => {
      if (!r) {
        this.setState({credViability: 'block'})
      } else {
        $('#displayLogout').val('initial')
        window.location = './admin'
      }
    })
  }

  onUsernameChange (e) {
    this.setState({username: e.target.value})
  }

  onPasswordChange (e) {
    this.setState({password: e.target.value})
  }
  render () {
    return (
      <div className={'container'} style={{width: '400px'}}>
        <form onSubmit={this.handleSubmit}>
          <div className={'form-group'}>
            <label htmlFor='exampleInputEmail1'>Username</label>
            <input type='text'
              className={'form-control'}
              id='exampleInputEmail1'
              value={this.state.username}
              onChange={this.onUsernameChange}
              placeholder='Username' />
          </div>
          <div className={'form-group'}>
            <label htmlFor='exampleInputPassword1'>Password</label>
            <input type='password'
              className={'form-control'}
              id='exampleInputPassword1'
              value={this.state.password}
              onChange={this.onPasswordChange}
              placeholder='Password' />
          </div>
          <div className={'alert alert-danger'} role="alert" style={{display: this.state.credViability}}>
            <span className={'glyphicon glyphicon-exclamation-sign'}></span>
            <span className={'sr-only'}>Error:</span>
            Invalid credentials
          </div>
          <button type='submit' className={'btn btn-default'}>Submit</button>
        </form>
      </div>
    )
  }
}
