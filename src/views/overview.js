import React from 'react'
import TimeSlider from '../components/TimeSlider'
import Minimap from '../components/Minimap'
import PlayerTable from '../components/PlayerTable'

class Overview extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      selectedGameData: props.game[0],
      timer: null
    }
  }

  onSliderChange (val) {
    let time = parseInt(val[0], 10)
    let closest = this.props.game.reduce((prev, curr) => (Math.abs(curr.t - time) < Math.abs(prev.t - time) ? curr : prev))

    this.setState({
      selectedGameData: closest
    })
  }

  toggleTimer (val) {
    if (this.state.timer) {
      clearInterval(this.state.timer)
      this.setState({
        timer: null
      })
    } else {
      let timer = setInterval(() => {
        let id = this.props.game.indexOf(this.state.selectedGameData)
        this.setState({
          selectedGameData: this.props.game[id + 1]
        })
      }, 1000)
      this.setState({ timer })
    }
  }

  render () {
    let { game } = this.props
    if (game.length === 0) return null
    let min = game[0].t
    let max = game[game.length - 1].t
    let start = this.state.selectedGameData.t

    return (
      <div className='overview'>
        <TimeSlider seeking={this.state.timer !== null} min={min} max={max} start={start} onSlide={this.onSliderChange.bind(this)} />
        <button className='pure-button pure-button-primary play-button' onClick={this.toggleTimer.bind(this)}>{this.state.timer !== null ? 'Pause' : 'Play'}</button>
        <Minimap data={this.state.selectedGameData} />
        <PlayerTable data={this.state.selectedGameData} />
      </div>
    )
  }
}

export default Overview
