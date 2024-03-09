import { useContext } from 'react'
import Button from './Button'
import SvgIcon from './SvgIcon'
import { PlayerContext } from '../context/storeContext'
import PropTypes from 'prop-types'

const PlayButton = ({ id }) => {
  const { player } = useContext(PlayerContext)
  const play = () => {
    player.replacePlaylist(id)
  }
  return (
    <Button type={'util'} onClick={play}>
      <SvgIcon symbolId="play" />
      播放
    </Button>
  )
}

PlayButton.propTypes = {
  id: PropTypes.string,
}

export default PlayButton
