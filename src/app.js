import './styles/index.css'

import React from 'react'
import { render } from 'react-dom'
import App from './views/app'

window.fetch('/data/CLG-SKT-G1-1c0aa97a8b1c4ecabdc.json')
  .then((response) => response.json())
  .then((json) => {
    render(<App data={json} />, document.querySelector('#root'))
  })
