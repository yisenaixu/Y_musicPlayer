export function parseLyric(lyric) {
  let lines = lyric.split('\n')
  lines.pop()
  //显示用歌词
  lines = lines.map(line => {
    let res = line.split(']')
    // eslint-disable-next-line no-useless-escape
    let time = res[0].replace(/[\[\]]/g, '')
    const [min, r] = time.split(':')
    const [sec, minsec] = r.split('.')
    time = min * 60 + sec * 1 + parseFloat(minsec / 1000)
    console.debug(time)
    let lyr = res[1]
    return {
      time,
      lyr,
    }
  })
  return lines
}
