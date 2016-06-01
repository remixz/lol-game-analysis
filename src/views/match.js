import React, { Component } from 'react'
import xhr from 'xhr'
import { Link } from 'react-router'

import TimeSlider from '../components/TimeSlider'
import Minimap from '../components/Minimap'
import PlayerTable from '../components/PlayerTable'

class Match extends Component {
  constructor (props) {
    super(props)
    let game = [{
      playerStats: {},
      teamStats: { '100': { teamId: 100 }, '200': { teamId: 200 } },
      t: 0
    }]
    this.state = {
      game,
      events: [],
      loading: true,
      notFound: false,
      selectedGameData: game[0],
      timer: null,
      timerSpeed: 1000,
      finished: false
    }
  }

  onSliderChange (val) {
    let time = parseInt(val[0], 10)
    let closest = this.state.game.reduce((prev, curr) => (Math.abs(curr.t - time) < Math.abs(prev.t - time) ? curr : prev))

    this.setState({
      selectedGameData: closest,
      finished: (this.state.game.indexOf(closest) + 1 === this.state.game.length)
    })
  }

  _createTimer (speed) {
    let timer = setInterval(() => {
      let id = this.state.game.indexOf(this.state.selectedGameData)
      if (id + 1 === this.state.game.length) {
        clearInterval(timer)
        return this.setState({
          timer: null,
          finished: true
        })
      }

      this.setState({
        selectedGameData: this.state.game[id + 1]
      })
    }, speed)
    this.setState({ timer })
  }

  toggleTimer () {
    if (this.state.timer) {
      clearInterval(this.state.timer)
      this.setState({
        timer: null
      })
    } else {
      if (this.state.finished) {
        this.setState({
          finished: false,
          selectedGameData: this.state.game[0]
        })
      }
      this._createTimer(this.state.timerSpeed)
    }
  }

  changeSpeed (ev) {
    let newValue = ev.target.value

    this.setState({
      timerSpeed: newValue
    })

    if (this.state.timer !== null) {
      clearInterval(this.state.timer)
      this._createTimer(newValue)
    }
  }

  componentDidMount () {
    let host = (process.env.NODE_ENV === 'production' ? 'https://timeline-cdn.bruggie.com/matches' : '/matches')
    xhr({
      method: 'GET',
      uri: `${host}/${this.props.params.id}.json`,
      json: true
    }, (err, resp, game) => {
      if (err) throw err
      if (resp.statusCode !== 200) {
        return this.setState({
          notFound: true
        })
      }
      let nameInfo = game[0].generatedName.split('|')

      // @TODO - figure out way to determine version properly...
      // new games are gonna be 6.10+, the icons shouldn't change much during the season
      // and shouldn't have any removed items, so just manually updating in src/app.js
      // should work... for this one game before midseason, we'll just use the patch played on
      // yeah this is a mess lol
      if (this.props.params.id === 'TRLT3-70046') {
        window.Config.ddragon = '//ddragon.leagueoflegends.com/cdn/6.8.1'
        this.props.location.query.gameHash = '7c49caa814dfa403' // for those old URLs :)
      }

      this.setState({
        game,
        loading: false,
        selectedGameData: game[0],
        gameTitle: `${nameInfo[0]} vs ${nameInfo[1]} - Game ${nameInfo[2].split('G')[1]}`
      })

      // unless the user is instantly clicking on the timeline, they'll never notice this isn't loaded in immediately
      // even if they do... it'll take, like, 1 second at most to load the data
      let splitId = this.props.params.id.split('-')
      xhr({
        method: 'GET',
        uri: `https://lol-mh-proxy.now.sh/game/${splitId[0]}/${splitId[1]}?gameHash=${this.props.location.query.gameHash}`,
        json: true
      }, (err, resp, body) => {
        if (err) throw err

        this.setState({
          events: body.events
        })
      })
    })
  }

  render () {
    if (this.state.notFound) {
      return (
        <div className='not-found'>
          <h1> Game Not Found </h1>
          <p> The timeline data for this game couldn't be found. It's likely that the timeline data wasn't exported for this match, either because it was a match that happened before this tool was created, or because the tournament didn't export this data. <Link to='/'>Visit the homepage</Link> to see which tournaments are supported.</p>
        </div>
      )
    }

    let { game } = this.state
    if (game.length === 0) return (<h1> Loading game data... </h1>)
    let min = game[0].t
    let max = game[game.length - 1].t
    let start = this.state.selectedGameData.t
    let playButtonText = (this.state.finished ? 'Replay' : (this.state.timer !== null ? 'Pause' : 'Play'))

    return (
      <div className='overview'>
        <h1>{this.state.loading ? 'Loading game data...' : this.state.gameTitle}</h1>
        <TimeSlider seeking={this.state.timer !== null} min={min} max={max} start={start} onSlide={this.onSliderChange.bind(this)} />
        <button className='pure-button pure-button-primary play-button' onClick={this.toggleTimer.bind(this)}>{playButtonText}</button>
        <div className='pure-form speed-form'>
          <label for='speed-select'>Playback Speed: </label>
          <select id='speed-select' value={this.state.timerSpeed} onChange={this.changeSpeed.bind(this)}>
            <option value={1000}>1x</option>
            <option value={500}>2x</option>
            <option value={200}>5x</option>
            <option value={100}>10x</option>
          </select>
        </div>
        <Minimap data={this.state.selectedGameData} events={this.state.events} seeking={this.state.timer !== null} speed={this.state.timerSpeed} />
        <PlayerTable data={this.state.selectedGameData} />
      </div>
    )
  }
}

export default Match
