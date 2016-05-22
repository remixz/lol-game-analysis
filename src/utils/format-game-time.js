export function msToGame (ms) {
  let min = (ms / 1000 / 60) << 0
  let sec = (ms / 1000) % 60 << 0

  return min + ':' + (sec < 10 ? '0' : '') + sec
}
