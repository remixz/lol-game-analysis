export function msToGame (ms) {
  let min = (ms / 1000 / 60) << 0
  let sec = (ms / 1000) % 60 << 0

  return min + ':' + (sec < 10 ? '0' : '') + sec
}

export function gameToMs (time) {
  let times = time.split(':')
  let ms = 0
  ms += times[0] * 1000 * 60
  ms += times[1] * 1000

  return ms
}
