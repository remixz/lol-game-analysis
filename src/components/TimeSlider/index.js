import React from 'react'
import Slider from 'react-nouislider'
import { msToGame } from '../../utils/format-game-time'

class TimeSlider extends React.Component {
  shouldComponentUpdate (nextProps) {
    return nextProps.max !== this.props.max
  }

  render () {
    let { min, max, start } = this.props
    let range = { min, max }
    let formatter = { to: msToGame }

    return <div className='time-slider'><Slider range={range} start={[start]} step={1000} tooltips={[formatter]} onSlide={this.props.onSlide} /></div>
  }
}

export default TimeSlider
