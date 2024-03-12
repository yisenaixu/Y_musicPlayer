import TrackList from '../components/TrackList'
import { useContext, useEffect, useState } from 'react'
import { getTrackDetail } from '../api/track'
import { PlayerContext } from '../context/storeContext'
const List = () => {
  const [songs, setSongs] = useState([])
  const { player } = useContext(PlayerContext)
  useEffect(() => {
    getTrackDetail(player.list.join(',')).then(res => {
      setSongs(res.songs)
    })
  }, [player.list])
  return (
    <div className="list flow-root">
      <div className="title text-text  text-4xl lg:text-6xl font-semibold my-6">
        播放列表
      </div>
      <TrackList type="playlist" isShowTime={false} songs={songs} />
    </div>
  )
}
export default List
