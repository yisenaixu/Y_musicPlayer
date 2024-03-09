import { useContext, useEffect, useState } from 'react'
import { getLyrics } from '../api/track'
import { PlayerContext } from '../context/storeContext'
import { parseLyric } from '../utils/lyric'
import { observer } from 'mobx-react-lite'
import ColorThief from 'colorthief'
import Color from 'color'
import Button from '../components/Button'
import SvgIcon from '../components/SvgIcon'
import ReactSlider from 'react-slider'
import '../assets/css/scrollbar.css'
import { useNavigate } from 'react-router'
import { formatTime } from '../utils/common'
import LikeButton from '../components/LikeButton'

const Lyrics = observer(() => {
  const navigate = useNavigate()
  const [lyrics, setLyrics] = useState([])
  const [hightIndex, setHightIndex] = useState(-1)
  const [oldHightIndex, setOldHightIndex] = useState()
  const [background, setBackground] = useState()
  const [, setLyricInterval] = useState(null)
  const { player } = useContext(PlayerContext)
  let picUrl = player.currentTrack.al.picUrl
  useEffect(() => {
    getLyrics(player.currentTrack.id).then(res => {
      setLyrics(parseLyric(res.lrc.lyric))
      setLyricInt()
    })
    getColor()
    return () => {
      setLyricInterval(null)
    }
  }, [player.currentTrack])
  const setLyricInt = () => {
    setLyricInterval(
      setInterval(() => {
        const progress = player.progress
        setOldHightIndex(hightIndex)
        let newHightIndex = lyrics.findIndex((lyric, index) => {
          // 跳过空白歌词
          if (lyric.lyr === '') return
          let nextLyric = lyrics[index + 1]
          while (nextLyric.lyr === '') {
            index = index + 1
            nextLyric = lyrics[index + 1]
          }
          return progress > lyric.time && nextLyric
            ? progress < nextLyric.time
            : true
        })
        if (newHightIndex !== hightIndex) {
          setHightIndex(newHightIndex)
        }
      }, 50),
    )
  }
  useEffect(() => {
    console.debug(hightIndex, oldHightIndex)
    if (hightIndex !== oldHightIndex) {
      const el = document.getElementById(`line${hightIndex}`)
      if (el) {
        el.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        })
      }
    }
  }, [hightIndex])
  const getColor = () => {
    const colorThief = new ColorThief()
    if (!picUrl) return
    const cover = `${picUrl.replace('http://', 'https://')}?param=512y512`
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
  const handleClick = time => {
    console.debug(time)
    player.seek(time)
  }
  const playAndPause = () => {
    if (player.playing) {
      player.pause()
    } else {
      player.play()
    }
  }
  return (
    <div
      className="lyric flex absolute top-0 left-0 right-0 bottom-0 z-[100]"
      style={{ background }}
    >
      <div className="absolute left-8 top-8">
        <Button
          type={'icon'}
          onClick={() => navigate(-1)}
          className="hover:bg-transparent"
        >
          <SvgIcon
            symbolId="arrow-down"
            width="25px"
            height="25px"
            color="white"
          />
        </Button>
      </div>
      <div className="left flex-1 h-full">
        <div className="container flex flex-col items-center justify-center h-full w-full">
          <div className="img w-1/2">
            <img
              className="rounded-2xl w-full h-full object-cover"
              src={picUrl}
            />
          </div>
          <div className="infOpt w-1/2 flex justify-between mt-9">
            <div className="info ">
              <div className="name text-2xl font-semibold text-white ">
                {player.currentTrack.name}
              </div>
              <div className="ar text-lg font-extralight">
                {player.currentTrack.ar[0].name}
              </div>
            </div>
            <div className="opt flex items-center">
              <div className="volumeControl flex items-center ">
                <Button type={'icon'} className="hover:bg-transparent">
                  <SvgIcon
                    symbolId={
                      player.volume > 0.66
                        ? 'volume'
                        : player.volume !== 0
                          ? 'volume-half'
                          : 'volume-mute'
                    }
                  />
                </Button>
                <div className="volumeBar w-20">
                  <ReactSlider
                    value={player.volume}
                    onChange={value => (player.volume = value)}
                    min={0}
                    max={1}
                    step={0.01}
                    className="horizontal-slider"
                    thumbClassName="example-thumb"
                    trackClassName="example-track"
                  />
                </div>
              </div>
              <LikeButton
                type="track"
                id={player.currentTrack.id}
                className="bg-transparent hover:bg-transparent text-black"
              />
            </div>
          </div>
          <div className="progressBox w-1/2 mt-3 flex justify-around items-center font-light text-base">
            0:00
            <div className="progressBar w-4/5">
              <ReactSlider
                value={player.progress}
                onChange={value => (player.progress = value)}
                min={0}
                max={player.currentTrackDuration}
                step={1}
                className="horizontal-slider"
                thumbClassName="example-thumb"
                trackClassName="example-track"
              />
            </div>
            {formatTime(player.currentTrackDuration)}
          </div>
          <div className="middleControl w-1/2 mt-3 flex items-center justify-center">
            <Button
              type={'icon'}
              onClick={() => player.playPrevTrack()}
              className="hover:bg-transparent"
            >
              {' '}
              <SvgIcon symbolId="previous" />{' '}
            </Button>
            <Button
              type={'icon'}
              onClick={playAndPause}
              className="hover:bg-transparent"
            >
              {' '}
              <SvgIcon
                symbolId={player.playing ? 'pause' : 'play'}
                width="25px"
                height="25px"
              />{' '}
            </Button>
            <Button
              type={'icon'}
              onClick={() => player.playNextTrack()}
              className="hover:bg-transparent"
            >
              {' '}
              <SvgIcon symbolId="next" />{' '}
            </Button>
          </div>
        </div>
      </div>
      <div className="right flex-1 flex h-full items-center">
        <div className="container scrollbar overflow-y-scroll h-[90%]">
          {lyrics.map((lyric, index) => {
            return (
              <div
                key={lyric.time}
                onClick={() => handleClick(lyric.time)}
                id={`line${index}`}
                className={`px-2 py-3 rounded-lg text-2xl font-semibold cursor-pointer hover:bg-secondary-bg-transparent
                            ${hightIndex === index ? 'text-primary' : 'text-white'}
                           `}
              >
                {lyric.lyr}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
})

export default Lyrics
