import Dexie from 'dexie'
export const db = new Dexie('cache')

db.version(2).stores({
  trackDetail: '&id',
  trackSource: '&id',
  trackLyrics: '&id',
})
db.version(1).stores({
  trackDetail: '&id',
})

export function cacheTrackDetail(track) {
  console.debug(track)
  db.trackDetail.add({
    id: track.id,
    detail: track,
  })
}
export function getTrackDetailCache(ids) {
  return db.trackDetail
    .filter(track => {
      // track.id number
      return ids.includes(String(track.id))
    })
    .toArray()
    .then(tracks => {
      let res = { songs: [] }
      // 按请求顺序输出
      ids.map(id => {
        let track = tracks.find(track => String(track.id) === id)
        res.songs.push(track?.detail)
      })
      return res.songs.includes(undefined) ? undefined : res
    })
}

export function cacheTrackSource(id, source) {
  console.debug(source)
  db.trackSource.add({
    id,
    source,
  })
}

export function getTrackSourceFromCache(id) {
  return db.trackSource
    .filter(source => source.id === id)
    .toArray()
    .then(source => {
      return source.length > 0 && source[0].source
        ? source[0].source
        : undefined
    })
}

export function cacheTrackLyrics(id, lyrics) {
  console.debug(lyrics)
  db.trackLyrics.add({
    id,
    lyrics,
  })
}
export function getTrackLyricsFromCache(id) {
  return db.trackLyrics
    .filter(lyrics => lyrics.id === id)
    .toArray()
    .then(res => {
      console.debug(res)
      return res.length > 0 && res[0].lyrics ? res[0] : undefined
    })
}

export function clearCache() {
  return new Promise(resolve => {
    db.tables.forEach(function (table) {
      table.clear()
    })
    resolve()
  })
}
