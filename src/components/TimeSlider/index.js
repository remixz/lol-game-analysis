import React, { Component } from 'react'
import Slider from 'react-nouislider'
import { msToGame } from '../../utils/format-game-time'

class TimeSlider extends Component {
  shouldComponentUpdate (nextProps) {
    return nextProps.max !== this.props.max
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.seeking && nextProps.start !== this.props.start) {
      this._el.slider.set(nextProps.start)
    }
  }

  render () {
    let { min, max, start } = this.props
    let range = { min, max }
    if (range.max === 0) range.max = 1 // min and max can't be the same, this only happens when loading the data
    let formatter = { to: msToGame }

    return <div className='time-slider'><Slider ref={(c) => { this._el = c }} range={range} start={[start]} step={1000} tooltips={[formatter]} onSlide={this.props.onSlide} disabled={range.max === 1} /></div>
  }
}

export default TimeSlider
