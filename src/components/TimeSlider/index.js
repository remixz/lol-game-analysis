import React from 'react'
import Slider from 'react-nouislider'
import { msToGame } from '../../utils/format-game-time'

class TimeSlider extends React.Component {
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
    let formatter = { to: msToGame }

    return <div className='time-slider'><Slider ref={(c) => { this._el = c }} range={range} start={[start]} step={1000} tooltips={[formatter]} onSlide={this.props.onSlide} /></div>
  }
}

export default TimeSlider
