import React, { Component } from 'react'
import { Link, withRouter } from 'react-router'

class IndexView extends Component {
  constructor (props) {
    super(props)

    this.state = {
      matchHistory: '',
      message: null
    }
  }

  onChange (ev) {
    this.setState({
      matchHistory: ev.target.value
    })
  }

  onSubmit (ev) {
    ev.preventDefault()

    let message = null
    let mh = this.state.matchHistory
    if (mh.indexOf('?gameHash') === -1) message = 'This tool currently only works for competitive games.'
    if (mh.indexOf('#match-details') === -1) message = 'You must enter a valid match history URL.'

    if (message !== null) {
      return this.setState({ message })
    }

    let id = mh.split('#match-details/')[1].split('?')[0].replace('/', '-')
    this.props.router.push(`/match/${id}`)
  }

  render () {
    return (
      <div className='index-view'>
        <h1> League Interactive Timeline </h1>
        <div className='msi-box'>
          <p> Looking for CLG vs SKT - Game 1 at MSI 2016? <strong><Link to='/match/TRLT3-70046?gameHash=7c49caa814dfa403' href='/match/TRLT3-70046?gameHash=7c49caa814dfa403'>Click here!</Link></strong> </p>
        </div>

        <div className='info-box'>
          <p> This tool automatically creates interactive timelines for competitive League of Legends games across the world. Follow the Esportspedia links below to view a list of timelines available, or enter a match history URL.</p>
          <div className='esportspedia-links'>
            <h2> Tournaments: </h2>
            <a href='http://lol.esportspedia.com/wiki/League_Championship_Series/North_America/2016_Season/Summer_Season/Match_Details'> NA LCS - Summer 2016 Regular Split </a>
            <a href='http://lol.esportspedia.com/wiki/League_Championship_Series/Europe/2016_Season/Summer_Season/Match_Details'> EU LCS - Summer 2016 Regular Split </a>
          </div>
          <form className='pure-form' onSubmit={this.onSubmit.bind(this)}>
            <h2> Enter URL: </h2>
            {this.state.message !== null ? <p className='error-message'>Error: {this.state.message}</p> : null}
            <input type='text' placeholder='Match History URL' value={this.state.matchHistory} onChange={this.onChange.bind(this)} />
            <input type='submit' className='pure-button pure-button-primary' value='View Timeline' />
          </form>
          <p className='btw'>
            <em> By the way... </em> I'm looking for work right now, and I'd love to keep doing this sort of work in esports, whether it be with League or other games. I think esports analysis could become a lot more useful with visualizations like these, and more tools specifically created for esports. If you work with any sort of esports organization, whether it be a team, a news site, or something else entirely, and you're interested in this sort of thing as well, I'd love to talk. Feel free to either <a href='mailto:mail@bruggie.com'>email me</a> or <a href='https://twitter.com/zachbruggeman' target='_blank'>DM me on Twitter</a>, and I'll respond as soon as I can. Thanks!
          </p>
        </div>

      </div>
    )
  }
}

export default withRouter(IndexView)
