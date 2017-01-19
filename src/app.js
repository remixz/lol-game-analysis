import './styles/index.css'

import React from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute, Redirect, browserHistory } from 'react-router'
import ga from 'react-ga'
import App from './views/app'
import Index from './views/index'
import Match from './views/match'

window.Config = {
  ddragon: '//ddragon.leagueoflegends.com/cdn/7.1.1'
}

ga.initialize('UA-46859303-2')

function logPageView () {
  ga.pageview(window.location.pathname)
}

render((
  <Router history={browserHistory} onUpdate={logPageView}>
    <Route path='/' component={App}>
      <IndexRoute component={Index} />
      <Route path='/match/:id' component={Match} />
      <Redirect from='*' to='/' />
    </Route>
  </Router>
), document.getElementById('root'))
