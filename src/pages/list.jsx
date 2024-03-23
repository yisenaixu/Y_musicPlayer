import { useContext, useEffect, useState } from 'react'
import { getTrackDetail } from '../api/track'
import { PlayerContext } from '../context/storeContext'
import VituralList from '../components/VituralList'
import Loading from '../components/Loading'
const List = () => {
  const [songs, setSongs] = useState([])
  const [loading, setLoading] = useState(true)
  const { player } = useContext(PlayerContext)
  console.debug(player.list)
  useEffect(() => {
    getTrackDetail(player.list.join(',')).then(res => {
      setSongs(res.songs)
      setLoading(false)
    })
  }, [player.list])
  return (
    <div className="list flow-root">
      <div className="title text-text  text-4xl lg:text-6xl font-semibold my-6">
        播放列表
      </div>
      {loading ? <Loading /> : <VituralList items={songs} type="playlist" />}
    </div>
  )
}
export default List
