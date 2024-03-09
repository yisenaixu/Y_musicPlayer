import { observer } from 'mobx-react-lite'
import TrackList from '../components/TrackList'
import { useContext } from 'react'
import { StoreContext } from '../context/storeContext'
const DailyTracks = observer(() => {
  const store = useContext(StoreContext)
  const {
    userStore: { dailyTracks },
  } = store
  return (
    <div className="dailyTracks flex flex-col">
      <div className="header flex flex-col justify-center items-center h-[35rem]">
        <div className="title text-[5.5rem] font-black tracking-widest bg-gradient-to-tr from-red-600 to-orange-500 text-transparent bg-clip-text ">
          {' '}
          每日歌曲推荐{' '}
        </div>
        <div className="subtitle text-text mt-6 text-lg font-normal tracking-wider">
          根据你的音乐口味生成 · 每天6:00更新
        </div>
      </div>
      <TrackList type="playlist" songs={dailyTracks} />
    </div>
  )
})

export default DailyTracks
