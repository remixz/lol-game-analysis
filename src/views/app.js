import React from 'react'
import Overview from './overview'

class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isLoading: true,
      showMessage: true
    }
  }

  componentDidMount () {
    this.setState({
      isLoading: false
    })
  }

  toggleMessage () {
    this.setState({
      showMessage: false
    })
  }

  render () {
    return (
      <div className='app-view'>
        {this.state.showMessage ? (
          <div className='hello-friends'>
            <p> Hi! This is an interactive visualization of CLG vs SKT - Game 1 at MSI 2016. Once the data has loaded, a slider will appear, which you can drag to view what was happening in the game at that time. The source code is available <a href='https://github.com/remixz/lol-game-analysis'>on GitHub</a>. Have fun! </p>
            <p> <em>Pssst... Are you a League team coach? If you are, I'm looking for a team to join as a software analyst. I'd like to work with the analyst team, find out how they're doing their analysis, and create tools like these to make their jobs easier, and their analysis better. If you're interested, <a href='mailto:mail@bruggie.com'>please send me an email</a>. I'd be happy to talk more about some of my ambitious ideas, and how I could be of value to the team. </em> </p>
            <button className='pure-button pure-button-primary' onClick={this.toggleMessage.bind(this)}> Close this message </button>
          </div>
        ) : null}
        <h1> CLG vs SKT - Game 1 </h1>
        {this.state.isLoading ? (
          <h2> Loading full game data... (this may take a few seconds!) </h2>
        ) : null}
        <Overview game={this.props.data} />
        <p className='fineprint'> This project isn’t endorsed by Riot Games and doesn’t reflect the views or opinions of Riot Games or anyone officially involved in producing or managing League of Legends. League of Legends and Riot Games are trademarks or registered trademarks of Riot Games, Inc. League of Legends &copy; Riot Games, Inc. </p>
      </div>
    )
  }
}

export default App
