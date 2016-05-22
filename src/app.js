import './styles/index.css'

import React from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute, Redirect, browserHistory } from 'react-router'
import App from './views/app'
import Index from './views/index'
import Match from './views/match'

window.Config = {
  ddragon: '//ddragon.leagueoflegends.com/cdn/6.10.1'
}

render((
  <Router history={browserHistory}>
    <Route path='/' component={App}>
      <IndexRoute component={Index} />
      <Route path='/match/:id' component={Match} />
      <Redirect from='*' to='/' />
    </Route>
  </Router>
), document.getElementById('root'))
