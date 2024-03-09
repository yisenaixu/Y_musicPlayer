import TrackList from './TrackList'
import SvgIcon from './SvgIcon'
import { useLocation, useNavigate } from 'react-router-dom'
import ReactSlider from 'react-slider'
import { useContext } from 'react'
import { StoreContext } from '../context/storeContext'
import '../assets/css/slider.css'
import { observer } from 'mobx-react-lite'
import Button from './Button'
import LikeButton from './LikeButton'
const Player = observer(() => {
  const store = useContext(StoreContext)
  const location = useLocation()
  const navigate = useNavigate()
  const {
    playerStore: { player },
  } = store
  const { currentTrack, playing, isFm } = player
  const playAndPause = () => {
    if (playing) {
      player.pause()
    } else {
      player.play()
    }
  }

  const goList = () => {
    if (location.pathname === '/list') {
      navigate(-1)
    } else {
      navigate('/list')
    }
  }

  const goLyrics = () => {
    if (location.pathname === '/lyrics') {
      navigate(-1)
    } else {
      navigate('/lyrics')
    }
  }
  return (
    <div className="player sticky bottom-0 left-0 right-0 bg-bg z-50">
      <div className="progressBar">
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
        {/* <vue-slider
          v-model="progress"
          :min="0"
          :max="player.currentTrackDuration"
          :interval="1"
          :height="2"
          :duration="0"
          :dotSize="8"
          :dragOnClick="true"
          :tooltip-formatter="formatTrackTime"
          :lazy="true"
          :silent="true"
        ></vue-slider> */}
      </div>
      <div className="control w-full flex justify-between items-center px-[10vw]">
        <div className="leftControl flex items-center flex-1">
          <TrackList
            type="tracklist"
            isShowTime={false}
            highLightPlayingTrack={false}
            songs={[currentTrack]}
          />
          <LikeButton
            id={currentTrack.id}
            type="track"
            className="bg-transparent hover:bg-transparent"
          />
        </div>
        <div className="middleControl flex flex-1 justify-center items-center">
          {!isFm && (
            <Button type={'icon'} onClick={() => player.playPrevTrack()}>
              {' '}
              <SvgIcon symbolId="previous" />{' '}
            </Button>
          )}
          <Button type={'icon'} onClick={playAndPause}>
            {' '}
            <SvgIcon
              symbolId={playing ? 'pause' : 'play'}
              width="25px"
              height="25px"
            />{' '}
          </Button>
          <Button type={'icon'} onClick={() => player.playNextTrack()}>
            {' '}
            <SvgIcon symbolId="next" />{' '}
          </Button>
        </div>
        <div className="rightControl flex flex-1 justify-end items-center">
          {/* <button-icon v-show="!isFm"
                         @click="player.mode === 'repeat'
                                ? player.switchModeOne()
                                : player.mode === 'one'
                                  ? player.switchModeShuffle()
                                  : player.switchModeRepeat() ">
                <svg-icon v-show="player.mode === 'shuffle'" symbolId="icon-shuffle" className="svgIcon"></svg-icon>
                <svg-icon v-show="player.mode === 'repeat'" symbolId="icon-repeat" className="svgIcon"></svg-icon>
                <svg-icon v-show="player.mode === 'one'" symbolId="icon-repeat-1" className="svgIcon"></svg-icon>
            </button-icon> */}
          <div className="volumeControl flex items-center">
            <Button type={'icon'}>
              {' '}
              <SvgIcon
                symbolId={
                  player.volume > 0.66
                    ? 'volume'
                    : player.volume !== 0
                      ? 'volume-half'
                      : 'volume-mute'
                }
              />{' '}
            </Button>
            {/* <!-- <svg-icon symbolId="icon-volume-mute" className="svgIcon"></svg-icon>
                   <svg-icon symbolId="icon-volume-half" className="svgIcon"></svg-icon> --> */}
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
          <Button type={'icon'} onClick={goList}>
            {' '}
            <SvgIcon symbolId="list" />{' '}
          </Button>
          <Button type={'icon'} onClick={goLyrics}>
            {' '}
            <SvgIcon symbolId="arrow-up" />{' '}
          </Button>
        </div>
      </div>
    </div>
  )
})
export default Player
