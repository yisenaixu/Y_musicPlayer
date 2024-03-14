import { useContext, useEffect, useState } from 'react'
import Button from './Button'
import SvgIcon from './SvgIcon'
import { StoreContext } from '../context/storeContext'
import { observer } from 'mobx-react-lite'
import { trace } from 'mobx'
import classNames from 'classnames'
import { toast } from './Toast'

const LikeButton = observer(({ type, id, className }) => {
  const typeMap = {
    album: 'albums',
    track: 'songsId',
    artist: 'artists',
    playlist: 'playlists',
    mv: 'mvs',
  }
  trace()
  const { userStore } = useContext(StoreContext)
  const { liked } = userStore
  const items = liked[typeMap[type]]
  const likeFunction = {
    album: userStore.LikeAAlbum,
    track: userStore.LikeATrack,
    playlist: userStore.LikeAPlaylist,
    artists: userStore.LikeAArtist,
    mv: userStore.LikeAMV,
  }
  const [ids, setIds] = useState(items.map(item => item.id ?? item.vid ?? item))
  const [isLike, setIsLike] = useState()
  useEffect(() => {
    console.debug(liked.playlists)
    console.debug(id, type)
    console.debug(items, ids, isLike)
    setIds(items.map(item => item.id ?? item.vid ?? item))
  }, [items])
  useEffect(() => {
    console.log(id)
    setIsLike(ids.includes(id))
  }, [ids, id])
  const like = () => {
    const params = {
      id,
      t: isLike ? 2 : 1,
      like: !isLike,
    }
    likeFunction[type]
      .bind(userStore)(params)
      ?.then(() =>
        toast.current.info(
          ` ${isLike ? '已取消喜欢' : '已添加到我的喜欢'}`,
          3000,
        ),
      )
    console.log('like')
  }
  return (
    <Button
      onClick={like}
      type={'icon'}
      className={classNames('text-red-500 bg-primary-bg', className)}
    >
      <SvgIcon symbolId={isLike ? 'heart-solid' : 'heart'} />
    </Button>
  )
})
export default LikeButton
