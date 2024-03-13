import { useContext, useState, useEffect } from 'react'
import { useWindowSize } from '../hooks/useWindowSize'
import SvgIcon from './SvgIcon'
import PropTypes from 'prop-types'
import { transformTime } from '../utils/common'
import Button from './Button'
import LikeButton from './LikeButton'
import { PlayerContext } from '../context/storeContext'
import { observer } from 'mobx-react-lite'

export const TrackListItem = observer(
  ({
    track,
    type,
    trackNo,
    isShowTime = true,
    highLightPlayingTrack = true,
  }) => {
    const { al, dt, ar, name } = track
    const [isHover, setIsHover] = useState(false)
    const { player } = useContext(PlayerContext)
    const addTrackToList = bool => {
      player.addTrackToList(track.id, bool)
    }
    const highLight =
      player.currentTrack.id === track.id && highLightPlayingTrack
    let dtime = transformTime(dt)
    return (
      <div
        className={`track flex items-center rounded-lg cursor-pointer transition-all hover:bg-secondary-bg-transparent text-text
                ${type === 'playlist' ? 'p-4' : 'p-2'} ${highLight && 'bg-primary-bg text-primary hover:bg-primary-bg'}`}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
        onDoubleClick={() => addTrackToList(true)}
      >
        <div className="left flex items-center flex-1">
          {type !== 'album' ? (
            type === 'tracklist' ? (
              <img
                src={al?.picUrl}
                alt=""
                className="w-10 h-10 object-cover mr-3 rounded-lg"
              />
            ) : (
              <img
                src={al?.picUrl}
                alt=""
                className="w-12 h-12 object-cover mr-4 rounded-lg"
              />
            )
          ) : (
            <div className="order w-7 h-7 mr-4 rounded-lg text-sm font-extralight flex justify-center items-center">
              {!isHover && <span>{trackNo}</span>}
              {isHover && <SvgIcon symbolId="play" />}
            </div>
          )}
          <div className="nameInfo">
            <div
              className={`songName font-black line-clamp-1 ${type === 'playlist' ? 'text-2xl' : 'text-lg '}`}
            >
              {name}
            </div>
            {type !== 'album' && (
              <div className="ar text-sm font-extralight line-clamp-1">
                {ar?.name ?? ar?.length ? ar[0].name : ''}
              </div>
            )}
          </div>
        </div>
        {type === 'playlist' && (
          <div className="al flex flex-1 justify-center text-base font-extralight">
            {al?.name}
          </div>
        )}
        {isShowTime && (
          <div className="time flex flex-1 justify-end items-center font-light">
            {isHover && (
              <>
                <Button
                  type={'icon'}
                  className={'p-0 m-0 px-2'}
                  onClick={() => addTrackToList(true)}
                >
                  {' '}
                  <SvgIcon symbolId="play" className="mr-8" />{' '}
                </Button>
                <Button
                  type={'icon'}
                  className={'p-0 m-0 px-2'}
                  onClick={() => addTrackToList(false)}
                >
                  {' '}
                  <SvgIcon symbolId="plus" className="mr-8" />{' '}
                </Button>
                <LikeButton
                  type={'track'}
                  id={track.id}
                  className={'bg-transparent p-0 m-0 px-2'}
                />
              </>
            )}
            {/* <SvgIcon symbolId={isLiked ? 'icon-heart-solid' : 'icon-heart'} className="svgIcon mr" @click="() => LikeATrack({id: track.id,t:isLiked ? 2 : 1 })"/> */}
            {dtime}
          </div>
        )}
      </div>
    )
  },
)

const TrackList = ({
  songs,
  columnNumber,
  type,
  isShowTime,
  highLightPlayingTrack,
}) => {
  const { innerWidth } = useWindowSize()
  let gridTemplateColumns = `repeat(${columnNumber}, minmax(0, 1fr))`
  const [isLg, setIsLg] = useState(innerWidth > 1024)
  const [styles, setStyles] = useState({
    gridTemplateColumns,
  })
  useEffect(() => {
    if (innerWidth < 1024 && isLg) {
      console.log(111)
      setIsLg(false)
    } else if (innerWidth >= 1024 && !isLg) {
      console.log(222)
      setIsLg(true)
    }
  }, [innerWidth])
  useEffect(() => {
    if (isLg) {
      setStyles({
        gridTemplateColumns: `repeat(${columnNumber}, minmax(0, 1fr))`,
      })
    } else {
      setStyles({
        gridTemplateColumns: `repeat(${columnNumber > 1 ? columnNumber - 1 : columnNumber}, minmax(0, 1fr))`,
      })
    }
  }, [isLg])
  return (
    <div className="trackList">
      <div className={`container grid gap-2`} style={styles}>
        {songs.map((song, index) => (
          <TrackListItem
            key={song.id}
            track={song}
            type={type}
            trackNo={index + 1}
            isShowTime={isShowTime}
            highLightPlayingTrack={highLightPlayingTrack}
          />
        ))}
      </div>
    </div>
  )
}

TrackList.propTypes = {
  songs: PropTypes.array,
  isShowTime: PropTypes.bool,
  highLightPlayingTrack: PropTypes.bool,
  type: PropTypes.string,
  columnNumber: PropTypes.number,
}
TrackListItem.propTypes = {
  track: PropTypes.object,
  trackNo: PropTypes.number,
  isShowTime: PropTypes.bool,
  highLightPlayingTrack: PropTypes.bool,
  type: PropTypes.string,
  columnNumber: PropTypes.number,
}

export default TrackList
