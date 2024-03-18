import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import CoverRow, { Cover, MvRow } from '../components/CoverRow'
import TrackList from '../components/TrackList'
import Loading from '../components/Loading'
import {
  fetchArtistAlbums,
  fetchArtistDetail,
  fetchArtistHotSong,
  fetchArtistMv,
} from '../api/artist'
import { Link } from 'react-router-dom'
import LikeButton from '../components/LikeButton'
import PlayButton from '../components/PlayButton'

const Artist = () => {
  const { id } = useParams()
  const [artist, setArtist] = useState({})
  const [songs, setSong] = useState([])
  const [limitSongs, setLimitSongs] = useState([])
  const [songsIds, setSongIds] = useState([])
  const [albums, setAlbums] = useState([])
  const [mvs, setMvs] = useState([])
  const [songsLimit, setSongsLimit] = useState(16)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    loadData()
  }, [])
  useEffect(() => {
    setSongIds(songs.map(item => item.id))
    setLimitSongs(songs.slice(0, songsLimit))
  }, [songs, songsLimit])
  const loadData = () => {
    Promise.all([
      fetchArtistDetail(id),
      fetchArtistHotSong(id),
      fetchArtistAlbums(id),
      fetchArtistMv({ id: id, limit: 10 }),
    ]).then(res => {
      setArtist(res[0].data.artist)
      setSong(res[1].songs)
      setAlbums(res[2].hotAlbums)
      setMvs(res[3].mvs)
      setLoading(false)
    })
  }
  return (
    <div className="artist flex flex-col ">
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="header grid grid-cols-10 gap-0 lg:gap-16 xl:gap-24 mb-16">
            <div className="left w-full col-span-5 xl:col-span-4 2xl:col-span-3">
              <Cover
                showTitle={false}
                coverImgUrl={artist.cover}
                type="artist"
              />
            </div>
            <div className="info text-text p-4 col-span-5 xl:col-span-6 2xl:col-span-7">
              <div className="name text-3xl font-black">{artist.name}</div>
              <div className="artists text-base font-light mt-8 ">艺人</div>
              <div className="statistics text-sm font-extralight">
                {artist.musicSize}首歌,{artist.albumSize}张专辑,{artist.mvSize}
                个mv
              </div>
              <div className="detail text-sm font-normal  mt-12 line-clamp-3">
                {artist.briefDesc}
              </div>
              <div className="button mt-20 flex justify-start">
                <PlayButton id={songsIds} />
                <LikeButton type={'artist'} id={artist.id} />
              </div>
            </div>
          </div>
          <div className="hot-songs">
            <h1>热门歌曲</h1>
            <TrackList
              columnNumber={4}
              type="tracklist"
              songs={limitSongs}
              isShowTime={false}
            />
            <div className="button font-extralight text-xs cursor-pointer ml-2 mt-2">
              {songsLimit === 16 ? (
                <span onClick={() => setSongsLimit(32)}>显示更多</span>
              ) : (
                <span onClick={() => setSongsLimit(16)}>收起</span>
              )}
            </div>
          </div>
          <div className="album">
            <h1>专辑</h1>
            <CoverRow items={albums} type="album" />
          </div>
          <div className="mv">
            <div className="mv-header flex justify-between items-center mr-4">
              <h1>MVs</h1>
              <Link className="text-sm font-light" to={`/artist/${id}/mv`}>
                查看全部
              </Link>
            </div>
            <MvRow items={mvs} columnNumber={5} />
          </div>
        </>
      )}
    </div>
  )
}

export default Artist
