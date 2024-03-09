import SvgIcon from './SvgIcon'
import ColorThief from 'colorthief'
import Color from 'color'
import { useContext, useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { StoreContext } from '../context/storeContext'
import LikeButton from './LikeButton'
import Button from './Button'
const FMCard = observer(() => {
  const store = useContext(StoreContext)
  const {
    playerStore: { player },
  } = store
  const { FmTrack: track, isFm } = player
  const [background, setBackground] = useState()
  useEffect(() => {
    getColor()
  }, [track])
  const getColor = () => {
    const colorThief = new ColorThief()
    if (!track.album?.picUrl) return
    const cover = `${track.album.picUrl.replace(
      'http://',
      'https://',
    )}?param=512y512`
    const img = new Image()
    img.addEventListener('load', () => {
      const mainColor = colorThief.getColor(img)
      const color1 = Color.rgb(mainColor)
        .lighten(0.28)
        .rotate(-30)
        .rgb()
        .string()
      const color2 = Color.rgb(mainColor).darken(0.1).rgb().string()
      setBackground(`linear-gradient(to top left, ${color1}, ${color2})`)
    })
    img.crossOrigin = 'Anonymous'
    img.src = cover
    console.debug(cover)
  }
  return (
    <div className="card w-full cursor-pointer z-[1]">
      <div
        className="container rounded-2xl overflow-auto flex relative transition-all"
        style={{ background }}
      >
        <div className="img-box flex flex-1 justify-center items-center">
          <div className="img box-border p-4 w-40 h-40">
            <img
              className="w-full object-cover rounded-lg"
              src={track.album.picUrl}
              alt=""
            />
          </div>
        </div>
        <div className="info flex-[2] relative">
          <div className="info-song text-2xl font-black mt-4">{track.name}</div>
          <div className="info-singer text-lg font-normal mt-2">
            {track.artists[0].name}
          </div>
          <div className="button flex absolute bottom-4">
            <LikeButton
              type={'track'}
              id={track.id}
              className={'bg-transparent hover:bg-transparent'}
            />
            <Button
              type="icon"
              className={'hover:bg-transparent'}
              onClick={() => player.playFm()}
            >
              {' '}
              <SvgIcon symbolId={player.playing && isFm ? 'pause' : 'play'} />
            </Button>
            <Button
              type="icon"
              className={'hover:bg-transparent'}
              onClick={() => player.playNextTrack()}
            >
              {' '}
              <SvgIcon symbolId="next" />
            </Button>
          </div>
          <div className="card-name absolute right-2 bottom-4 text-sm font-semibold select-none flex items-center">
            <SvgIcon symbolId="fm" />
            私人FM
          </div>
        </div>
      </div>
    </div>
  )
})

export default FMCard
