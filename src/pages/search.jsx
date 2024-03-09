import CoverRow from '../components/CoverRow'
import TrackList from '../components/TrackList'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { search as serachServer } from '../api/other'
import Button from '../components/Button'
const Search = () => {
  const [searchParams] = useSearchParams()
  const keywords = searchParams.get('keywords')
  console.debug(keywords)
  const [type, setType] = useState('all')
  const [res, setRes] = useState({
    artists: [],
    albums: [],
    songs: [],
    playlists: [],
  })
  const { artists, albums, songs, playlists } = res
  const typeTable = {
    all: 1018,
    musicVideos: 1004,
    tracks: 1,
    albums: 10,
    artists: 100,
    playlists: 1000,
  }
  const search = () => {
    serachServer(keywords, typeTable[type], 16).then(r => {
      let result = {}
      if (type === 'all') {
        const { artist, album, song, playList } = r.result
        result = {
          artists: artist?.artists,
          albums: album?.albums,
          songs: song?.songs,
          playlists: playList?.playLists,
        }
      } else {
        result = { ...res, ...r.result }
      }
      setRes(result)
    })
  }
  useEffect(() => {
    search()
  }, [type, keywords])
  return (
    <>
      <div className="search">
        <div className="header">
          <div className="info text-sm font-extralight">
            <span>{searchParams.get('keywords')}</span>&nbsp;的相关搜索如下
          </div>
          <div className="buttons flex">
            <Button
              type={'switch'}
              onClick={() => setType('all')}
              className={`${type === 'all' && 'text-primary bg-primary-bg'}`}
            >
              综合
            </Button>
            <Button
              type={'switch'}
              onClick={() => setType('tracks')}
              className={`${type === 'tracks' && 'text-primary bg-primary-bg'}`}
            >
              歌曲
            </Button>
            <Button
              type={'switch'}
              onClick={() => setType('albums')}
              className={`${type === 'albums' && 'text-primary bg-primary-bg'}`}
            >
              专辑
            </Button>
            <Button
              type={'switch'}
              onClick={() => setType('artists')}
              className={`${type === 'artists' && 'text-primary bg-primary-bg'}`}
            >
              歌手
            </Button>
            <Button
              type={'switch'}
              onClick={() => setType('playlists')}
              className={`${type === 'playlists' && 'text-primary bg-primary-bg'}`}
            >
              歌单
            </Button>
          </div>
        </div>
        {type === 'all' && (
          <div className="content">
            <div className="section-1 flex">
              <div className="left flex-1 mr-6">
                <h3>歌手</h3>
                <CoverRow items={artists} type="artist" columnNumber={3} />
              </div>
              <div className="right flex-1">
                <h3>专辑</h3>
                <CoverRow items={albums} type="album" columnNumber={3} />
              </div>
            </div>
            <div className="section-2">
              <h3>歌曲</h3>
              <TrackList
                songs={songs}
                columnNumber={4}
                type="tracklist"
                isShowTime={false}
              />
            </div>
            <div className="section-3">
              <h3>歌单</h3>
              <CoverRow items={playlists} type="playlist" />
            </div>
          </div>
        )}
        {type === 'tracks' && (
          <div className="content">
            <TrackList songs={songs} type="playlist" />
          </div>
        )}
        {type === 'albums' && (
          <div className="content">
            <CoverRow items={albums} type="album" />
          </div>
        )}
        {type === 'playlists' && (
          <div className="content">
            <CoverRow items={playlists} type="playlist" />
          </div>
        )}
        {type === 'artists' && (
          <div className="content">
            <CoverRow items={artists} type="artist" />
          </div>
        )}
      </div>
    </>
  )
}
export default Search
