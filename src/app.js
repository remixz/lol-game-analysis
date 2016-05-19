import './styles/index.css'
import 'whatwg-fetch'
require('es6-promise').polyfill()

import React from 'react'
import { render } from 'react-dom'
import App from './views/app'

window.fetch('/data/TRLT3-70046.json')
  .then((response) => response.json())
  .then((json) => {
    render(<App data={json} />, document.querySelector('#root'))
  })
