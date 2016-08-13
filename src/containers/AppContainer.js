import React, { Component, PropTypes } from 'react'
import { Router } from 'react-router'
import { Provider } from 'react-redux'

class AppContainer extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    routes: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
  }

  render () {
    const { history, routes, store } = this.props

    return (
      <Provider store={store}>
        <div style={{ height: '100%'}}>
        <div id='header-band' style={{width: '100%', height: '40px', backgroundColor: '#13202d'}}>
          <span style={{fontSize: '17pt', fontFamily: 'fantasy', marginLeft: '12px', color: 'rgba(0,0,0,0.5)'}}>
            NextFLICK
          </span>
        </div>
          <Router history={history} children={routes} />
        </div>
      </Provider>
    )
  }
}

export default AppContainer
