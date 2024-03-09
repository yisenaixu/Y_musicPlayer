import { useEffect, useState, useRef, useContext } from 'react'
import { fetchMvDetail, fetchMvUrl, simiMv } from '../api/mv'
import { MvRow } from '../components/CoverRow'
import { useParams } from 'react-router'
import Plyr from 'plyr'
import '../assets/css/plyr.css'
import { observer } from 'mobx-react-lite'
import { StoreContext } from '../context/storeContext'
import LikeButton from '../components/LikeButton'
const Mv = observer(() => {
  const store = useContext(StoreContext)
  const {
    playerStore: { player },
  } = store
  const { id } = useParams()
  const [mv, setMv] = useState({})
  const [simiMvs, setSimiMvs] = useState()
  const [videoPlayer, setVideoPlayer] = useState(null)
  const videoRef = useRef(null)
  const options = {
    settings: ['quality'],
    autoplay: false,
    quality: {
      default: 1080,
      options: [1080, 720, 480, 240],
    },
  }
  useEffect(() => {
    fetchMvDetail(id).then(res => {
      setMv(res.data)
      let requests = res.data.brs.map(br => {
        return fetchMvUrl({ id: id, r: br.br })
      })
      Promise.all(requests).then(mvs => {
        let sources = mvs.map(mv => {
          return {
            src: mv.data.url,
            type: 'video/mp4',
            size: mv.data.r,
          }
        })
        const Player = new Plyr(videoRef.current, options)
        Player.volume = player.volume
        Player.on('playing', () => {
          player.pause()
        })
        Player.source = {
          type: 'video',
          sources,
          title: mv.name,
        }
        setVideoPlayer(Player)
      })
    })
    simiMv(id).then(res => {
      setSimiMvs(res.mvs)
    })
  }, [id])
  console.log(videoPlayer)
  const { artistName, name, commentCount, publishTime } = mv
  return (
    <div className="mv">
      <div className="video-container mb-9">
        <div className="video">
          <video ref={videoRef} className="plyr"></video>
        </div>
        <div className="video-info">
          <div className="title text-2xl font-semibold mb-2 ">
            {artistName}-{name}
            <div className="button flex">
              <LikeButton type={'mv'} id={mv.id} />
            </div>
          </div>
          <div className="count-time text-xs font-light">
            {commentCount} views·{publishTime}
          </div>
        </div>
      </div>
      <div className="other-mvs">
        <div className="title text-xl font-semibold mb-4">更多视频</div>
        <MvRow items={simiMvs} columnNumber={5} showTime={false} />
      </div>
    </div>
  )
})
export default Mv
