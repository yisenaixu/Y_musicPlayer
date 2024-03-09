import { useContext, useEffect } from 'react'
import SvgIcon from './SvgIcon'
import { StoreContext } from '../context/storeContext'
import { observer } from 'mobx-react-lite'
import { useNavigate } from 'react-router'
import Button from './Button'
const DailyRecSongCard = observer(() => {
  const store = useContext(StoreContext)
  const navigate = useNavigate()
  useEffect(() => {
    store.userStore.fetchDailyTracks()
  }, [])
  const trackIds = store.userStore.dailyTracks.map(item => item.id)

  const play = e => {
    e.stopPropagation()
    store.playerStore.player.replacePlaylist(trackIds)
  }
  return (
    <div
      className="card w-full cursor-pointer z-[1]"
      onClick={() => navigate('/dailyTracks')}
    >
      <div className="container rounded-2xl flex relative overflow-hidden">
        <img
          className="animate-move absolute top-0 left-0 w-full z-0"
          src={store.userStore.dailyTracks[0]?.al.picUrl}
          alt=""
        />
        <div className="title-box flex justify-center items-center">
          <div className="title box-border grid w-36 h-36 grid-cols-2 place-items-center z-10">
            <div className="text-3xl font-black">每</div>
            <div className="text-3xl font-black">日</div>
            <div className="text-3xl font-black">推</div>
            <div className="text-3xl font-black">荐</div>
          </div>
        </div>
        <Button
          type={'icon'}
          onClick={play}
          className="hover:bg-transparent absolute right-4 bottom-4"
        >
          <SvgIcon symbolId="play" />
        </Button>
        {/* <button @click.stop="$store.state.player.replacePlaylist(trackIds)">
              <svg-icon symbolId="icon-play" className="svgIcon"></svg-icon>
          </button> */}
      </div>
    </div>
  )
})

export default DailyRecSongCard
