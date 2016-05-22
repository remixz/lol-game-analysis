import React from 'react'
import { Link } from 'react-router'

class App extends React.Component {
  render () {
    return (
      <div className='app-view'>
        <div className='about'>
          <p> Created by <strong><a href='https://twitter.com/zachbruggeman'>@zachbruggeman</a></strong> | <Link to='/'>About</Link> </p>
        </div>
        {this.props.children}
        <p className='fineprint'> This project isn’t endorsed by Riot Games and doesn’t reflect the views or opinions of Riot Games or anyone officially involved in producing or managing League of Legends. League of Legends and Riot Games are trademarks or registered trademarks of Riot Games, Inc. League of Legends &copy; Riot Games, Inc. </p>
      </div>
    )
  }
}

export default App
