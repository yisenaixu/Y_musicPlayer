import { Cover } from '../components/CoverRow'
import TrackList from '../components/TrackList'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { getSongListDetail } from '../api/playlist'
import { getPartTrack } from '../utils/songlist'
import { transformDate } from '../utils/common'
import PlayButton from '../components/PlayButton'
import LikeButton from '../components/LikeButton'
import Button from '../components/Button'
const Playlist = () => {
  const { id } = useParams()
  const [playlist, setPlaylist] = useState({})
  const [songs, setSongs] = useState([])
  const [offset, setOffset] = useState(0)
  const [updateTime, setUpdateTime] = useState()
  const [haveMore, setHaveMore] = useState()
  useEffect(() => {
    getSongListDetail(id).then(res => {
      //歌单所有歌曲id转化
      res.playlist.trackIds = res.playlist.trackIds.map(item => item.id)
      setPlaylist(res.playlist)
      console.log('playlist')
    })
    getPartTrack(id, offset).then(res => {
      console.debug(res.songs, 'songs')
      setSongs(res.songs)
      setOffset(offset + 50)
    })
  }, [])
  useEffect(() => {
    setUpdateTime(transformDate(playlist.updateTime))
    setHaveMore(playlist.trackCount > songs.length)
  }, [playlist, songs])
  const loadMore = () => {
    getPartTrack(id, offset).then(res => {
      console.log(res)
      setSongs([...songs, ...res.songs])
      setOffset(offset + 50)
    })
  }
  return (
    <div className="playlist flex flex-col">
      <div className="header grid gap-0 lg:gap-16 xl:gap-24 mb-16 grid-cols-10">
        <div className="left w-full col-span-5 xl:col-span-4 2xl:col-span-3">
          <Cover showTitle={false} coverImgUrl={playlist?.coverImgUrl} />
        </div>
        <div className="info text-text p-4 col-span-5 xl:col-span-6 2xl:col-span-7">
          <div className="title text-3xl font-black line-clamp-1">
            {playlist.name}
          </div>
          <div className="creator text-base font-light mt-1 md:mt-4 lg:mt-8">
            PlayList by {playlist.creator?.nickname}
          </div>
          <div className="other text-sm font-extralight ">
            最近更新{updateTime} | 播放次数{playlist.playCount}
          </div>
          <div className="detail text-sm font-normal mt-1 md:mt-6 lg:mt-12 line-clamp-3">
            {playlist.description}
          </div>
          <div className="button mt-20 flex justify-start ">
            <PlayButton id={playlist.trackIds} />
            <LikeButton type={'playlist'} id={playlist.id} />
          </div>
        </div>
      </div>

      <TrackList songs={songs} type="playlist" />
      {haveMore && (
        <div className="flex justify-center">
          {' '}
          <Button type={'util'} onClick={loadMore}>
            加载更多
          </Button>{' '}
        </div>
      )}
    </div>
  )
}

export default Playlist
