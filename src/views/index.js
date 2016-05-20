import React, { Component } from 'react'
import { Link } from 'react-router'

class IndexView extends Component {
  render () {
    return (
      <div className='index-view'>
        <Link to='/match/TRLT3-70046'>View CLG vs SKT Game 1 at MSI 2016</Link>
      </div>
    )
  }
}

export default IndexView
