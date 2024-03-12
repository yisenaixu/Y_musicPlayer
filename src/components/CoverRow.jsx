import PropTypes from 'prop-types'
import { useLocation, useNavigate } from 'react-router'
import SvgIcon from './SvgIcon'
import { transformNumber } from '../utils/common'
import { useContext, useState } from 'react'
import { PlayerContext } from '../context/storeContext'
export const Cover = ({ item, type, showTitle, coverImgUrl }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const [focus, setFocus] = useState(false)
  const playCount = transformNumber(item?.playCount)
  const imgSrc = item?.picUrl ?? coverImgUrl ?? item?.coverImgUrl
  const goDetail = () => {
    navigate(`/${type}/${item.id}`)
  }
  const { player } = useContext(PlayerContext)
  const play = e => {
    e.stopPropagation()
    const playActions = {
      album: player.playAlbumById,
      playlist: player.playPlaylistById,
      artist: player.playArtistById,
    }
    // this指向变化 bind重新绑定
    playActions[type].bind(player)(item.id)
  }
  return (
    <div
      className="cover w-full cursor-pointer text-text"
      onClick={goDetail}
      onMouseEnter={() => setFocus(true)}
      onMouseLeave={() => setFocus(false)}
    >
      <div className="container w-full">
        <div className="img w-full h-0 pb-[100%] rounded-lg relative ">
          <img
            className={`w-full object-cover ${type === 'artist' ? 'rounded-full' : 'rounded-2xl'}`}
            src={`${imgSrc}?param=512y512`}
            alt=""
          />
          {focus && (
            <div className="shade absolute top-0 w-full h-full flex justify-center items-center ">
              <button
                onClick={play}
                className="flex justify-center items-center w-1/5 h-1/5 text-text backdrop-blur rounded-full cursor-pointer transition-all z-40 bg-secondary-bg-transparent"
              >
                <SvgIcon symbolId="play" width={'28%'} height={'28%'} />
              </button>
            </div>
          )}
        </div>
        {showTitle && (
          <div
            className={`title w-full mt-2 px-1 text-xs lg:text-xl font-semibold line-clamp-2 ${type === 'artist' ? 'text-center' : 'text-left'}`}
          >
            {location.pathname === '/explore' && type === 'playlist' && (
              <div className="flex items-center text-xs font-extralight text-secondary">
                <SvgIcon symbolId="play" width="8px" height="8px" />
                {playCount}
              </div>
            )}
            {item?.name}
          </div>
        )}
        {type !== 'artist' && (
          <div className="subtitle px-1 text-xs font-thin text-left ">
            {type === 'album' ? item?.artist?.name : item?.updateFrequency}
          </div>
        )}
      </div>
    </div>
  )
}

export const MvRow = ({ items, columnNumber, showTime }) => {
  let gridTemplateColumns = `repeat(${columnNumber}, minmax(0, 1fr))`
  const navigate = useNavigate()
  const goMv = id => {
    navigate(`/mv/${id}`)
  }
  return (
    <div className="mv-row grid gap-6" style={{ gridTemplateColumns }}>
      {items?.map(item => (
        <div
          className="cover cursor-pointer text-text"
          key={item.id}
          onClick={() => goMv(item.id)}
        >
          <div className="img w-full">
            <img
              className="w-full rounded-3xl"
              src={item.imgurl ?? item.cover}
              alt=""
            />
          </div>
          <div className="title text-sm font-semibold line-clamp-1">
            {item.name}
          </div>
          {showTime ? (
            <div className="time text-xs font-extralight">
              {item.publishTime}
            </div>
          ) : (
            <div className="name text-xs font-extralight">
              {item.artistName}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

const CoverRow = ({ items, type, columnNumber = 5 }) => {
  let gridTemplateColumns = `repeat(${columnNumber}, minmax(0, 1fr))`
  console.debug(items)
  return (
    <div>
      <div
        className={`container grid gap-6 grid-cols-${columnNumber} justify-center`}
        style={{ gridTemplateColumns }}
      >
        {items?.map((item, index) => (
          <Cover
            key={item.id + index}
            type={type}
            item={item}
            showTitle={true}
          />
        ))}
      </div>
    </div>
  )
}

Cover.propTypes = {
  item: PropTypes.object,
  type: PropTypes.string,
  showTitle: PropTypes.bool,
  coverImgUrl: PropTypes.string,
}

MvRow.propTypes = {
  items: PropTypes.array,
  showTime: PropTypes.bool,
  columnNumber: PropTypes.number,
}

CoverRow.propTypes = {
  items: PropTypes.array,
  type: PropTypes.string,
  columnNumber: PropTypes.number,
}

export default CoverRow
