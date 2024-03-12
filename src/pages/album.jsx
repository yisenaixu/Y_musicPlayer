import CoverRow, { Cover } from '../components/CoverRow'
import TrackList from '../components/TrackList'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { transformDate } from '../utils/common'
import { fetchAlbumDetail } from '../api/album'
import { fetchArtistAlbums } from '../api/artist'
import PlayButton from '../components/PlayButton'
import LikeButton from '../components/LikeButton'
const Album = () => {
  const { id } = useParams()
  const [album, setAlbum] = useState({})
  const [moreAlbums, setMoreAlbums] = useState([])
  const [songs, setSongs] = useState([])
  const [songsIds, setSongsIds] = useState([])
  const [publishTime, setPublishTime] = useState()
  useEffect(() => {
    fetchAlbumDetail(id).then(res => {
      setAlbum(res.album)
      setSongs(res.songs)
    })
  }, [])

  useEffect(() => {
    setSongsIds(songs.map(item => item.id))
  }, [songs])

  useEffect(() => {
    setPublishTime(transformDate(album.publishTime))
    fetchArtistAlbums(album?.artist?.id, 5).then(res => {
      setMoreAlbums(res.hotAlbums)
    })
  }, [album])
  return (
    <div className="album flex flex-col">
      <div className="header grid gap-0 lg:gap-16 xl:gap-24 mb-16 grid-cols-10">
        <div className="left w-full col-span-5 xl:col-span-4 2xl:col-span-3">
          <Cover showTitle={false} coverImgUrl={album?.picUrl} />
        </div>
        <div className="info text-text p-4 col-span-5 xl:col-span-6 2xl:col-span-7">
          <div className="title text-3xl font-black ">
            Album by {album.artist?.name}
          </div>
          <div className="creator text-base font-light mt-8">
            album by {album.creator?.nickname}
          </div>
          <div className="other text-sm font-extralight ">
            最近Publish {publishTime}·{songs.length}首歌,
          </div>
          <div className="detail text-sm font-normal  mt-12 line-clamp-3">
            {album.description}
          </div>
          <div className="button mt-20 flex justify-start ">
            <PlayButton id={songsIds} />
            <LikeButton type={'album'} id={album.id} />
          </div>
        </div>
      </div>

      <TrackList songs={songs} type="album" />
      <div className="publishDate mt-4"> 发行于 {publishTime} </div>
      <div className="release text-xs font-extralight ">© {album.company}</div>
      <div className="more mt-12 border">
        <div className="title my-6 text-2xl font-semibold">
          More By {album.artist?.name}
        </div>
        <CoverRow items={moreAlbums} type="album" />
      </div>
    </div>
  )
}

export default Album
