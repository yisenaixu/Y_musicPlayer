import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
export function transformTime(Milliseconds, format = 'HH:MM:SS') {
  if (!Milliseconds) return ''
  dayjs.extend(duration)

  let time = dayjs.duration(Milliseconds)
  let hours = time.hours().toString()
  let mins = time.minutes().toString()
  let seconds = time.seconds().toString().padStart(2, '0')
  if (format === 'HH:MM:SS') {
    return hours !== '0'
      ? `${hours}:${mins.padStart(2, '0')}:${seconds}`
      : `${mins}:${seconds}`
  }
}

export function transformDate(timestamp, format = 'MMM D,YYYY') {
  if (!timestamp) return ''
  return dayjs(timestamp).format(format)
}

export function transformNumber(number) {
  if (!number) return ''
  if (number > 100000000) {
    return `${Math.floor((number / 100000000) * 100) / 100}亿` // 2.32 亿
  }
  if (number > 100000) {
    return `${Math.floor((number / 10000) * 10) / 10}万` // 232.1 万
  }
  if (number > 10000) {
    return `${Math.floor((number / 10000) * 100) / 100}万` // 2.3 万
  }
  return number
}

export function formatTime(val) {
  if (!val) return ''
  let min = ~~(val / 60)
  let sec = ~~(val % 60).toString().padStart(2, '0')
  return `${min}:${sec}`
}

export function changeAppearance(apperrance) {
  document.querySelector('#root').setAttribute('data-theme', apperrance)
}
