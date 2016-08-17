import React, { Component, PropTypes } from 'react'
import { Router } from 'react-router'
import { Provider } from 'react-redux'
import Logo from './assets/newlogo.png'

class AppContainer extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    routes: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {
      displayLogout: typeof window.sessionStorage['userIsLogedIn'] !== 'undefined' ? 'initial' : 'none'
    }
    this.onLogout = this.onLogout.bind(this)
  }

  onLogout () {
    window.sessionStorage.removeItem('userIsLogedIn')
    window.location = './home'
  }

  updateDisplay (e) {
    this.setState({displayLogout: e.target.value})
  }
  render () {
    const { history, routes, store } = this.props

    return (
      <Provider store={store}>
        <div style={{ height: '100%'}}>
        <input type='hidden' id='displayLogout' value={this.state.displayLogout} onChange={this.updateDisplay}/>
        <div id='header-band' style={{width: '100%', height: '40px', backgroundColor: 'black'}}>
          <span style={{fontSize: '17pt', fontFamily: 'fantasy', marginLeft: '12px', color: 'rgba(0,0,0,0.5)'}}>
            <img src={Logo} style={{width: '85px'}} />
          </span>
          <span style={{cursor: 'pointer', display: this.state.displayLogout, color: 'white'}} onClick={this.onLogout} >
          <span style={{float: 'right', marginRight: '30px', marginTop: '10px', cursor: 'pointer'}}>
            LogOut
          </span>
          <span className={'glyphicon glyphicon-user'} style={{float: 'right', marginTop: '13px', marginRight: '7px', cursor: 'pointer'}} aria-hidden='true'></span>
          </span>
        </div>
          <Router history={history} children={routes} />
        </div>
      </Provider>
    )
  }
}

export default AppContainer
