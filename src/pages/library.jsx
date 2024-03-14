import { useContext, useEffect, useRef, useState } from 'react'
import { PlayerContext, StoreContext } from '../context/storeContext'
import TrackList from '../components/TrackList'
import ContentMenu from '../components/ContentMenu'
import CoverRow from '../components/CoverRow'
import SvgIcon from '../components/SvgIcon'
import { observer } from 'mobx-react-lite'
import Button from '../components/Button'
const Library = observer(() => {
  const store = useContext(StoreContext)
  const { player } = useContext(PlayerContext)
  const menuRef = useRef(null)
  const [currentTab, setCurrentTab] = useState('playlist')
  const [playlistType, setPlaylistType] = useState('mine')
  const {
    userStore: { userData, liked },
  } = store
  const { playlists, playHistory, albums, artists } = liked
  const [filterPlaylists, setFilterPlaylists] = useState([])
  console.debug(playlists)
  let contentMap = {
    playlist: filterPlaylists,
    playHistory: playHistory,
    album: albums,
    artist: artists,
  }
  console.debug(contentMap)
  let playlistSelect = {
    mine: '创建的歌单',
    liked: '收藏的歌单',
    all: '全部歌单',
  }
  const [content, setContent] = useState(playlists)

  useEffect(() => {
    console.debug('setFilter')
    setFilterPlaylists(filterPlaylist(playlists))
  }, [playlistType, playlists])

  useEffect(() => {
    console.debug('setContent')
    setContent(contentMap[currentTab])
  }, [filterPlaylists, playHistory, albums, artists])

  useEffect(() => {
    setContent(contentMap[currentTab])
  }, [currentTab])

  const filterPlaylist = playlists => {
    //筛除我喜欢的歌单
    let filterPlaylists = playlists.slice(1)
    // 用户uid
    const userId = userData.user.userId
    if (playlistType === 'mine') {
      filterPlaylists = filterPlaylists.filter(
        item => item.creator.userId === userId,
      )
    } else if (playlistType === 'liked') {
      filterPlaylists = filterPlaylists.filter(
        item => item.creator.userId !== userId,
      )
    } else {
      return playlists
    }
    return filterPlaylists
  }

  const showModal = e => {
    menuRef.current.openMenu(e)
    e.stopPropagation()
    console.log('open modal')
  }
  return (
    <div className="library flow-root">
      <h1 className="flex items-center">
        <img
          className="avatar w-11 h-11 rounded-full mr-1"
          src={userData.user?.avatarUrl}
          alt=""
        />
        {userData.user?.nickname}的音乐库
      </h1>
      <div className="section-one">
        <div className="flex-wrap flex min-h-[18rem]">
          <div className="like-songs flex-[5] lg:flex-[3] mr-5 rounded-2xl bg-primary-bg-transparent flex flex-col">
            <div className="lyrics flex-1"></div>
            <div className="bottom flex p-2">
              <div className="text flex-1 flex flex-col items-center justify-center text-2xl font-semibold text-primary">
                我喜欢的音乐
                <div className="subtext text-base font-normal">
                  {liked.playlists[0]?.trackCount}首歌
                </div>
              </div>
              <div className="button flex-1 flex justify-center items-center">
                <div
                  onClick={() => player.playPlaylistById(playlists[0].id)}
                  className="bg-bg text-primary p-3 rounded-full cursor-pointer  transition-all hover:scale-110 active:scale-90"
                >
                  <SvgIcon symbolId="play"></SvgIcon>
                </div>
              </div>
            </div>
          </div>
          <div className="tracklist flex-[7] flex justify-center items-center">
            <TrackList
              type="tracklist"
              columnNumber={4}
              songs={liked.songsDetails}
              isShowTime={false}
            />
          </div>
        </div>
      </div>
      <div className="section-two mt-5">
        <div className="tabs flex flex-wrap">
          <Button
            type={'switch'}
            className={`${currentTab === 'playlist' ? 'bg-primary-bg text-primary' : 'bg-secondary-bg text-secondary'}`}
            onClick={() => setCurrentTab('playlist')}
          >
            {playlistSelect[playlistType]} &nbsp;
            <button onClick={showModal}>
              <SvgIcon symbolId="arrow-down" />
            </button>
          </Button>
          <Button
            type={'switch'}
            className={`${currentTab === 'album' ? 'bg-primary-bg text-primary' : 'bg-secondary-bg text-secondary'}`}
            onClick={() => setCurrentTab('album')}
          >
            专辑
          </Button>
          <Button
            type={'switch'}
            className={`${currentTab === 'artist' ? 'bg-primary-bg text-primary' : 'bg-secondary-bg text-secondary'}`}
            onClick={() => setCurrentTab('artist')}
          >
            艺人
          </Button>
          <Button
            type={'switch'}
            className={`${currentTab === 'mv' ? 'bg-primary-bg text-primary' : 'bg-secondary-bg text-secondary'}`}
            onClick={() => setCurrentTab('mv')}
          >
            MV
          </Button>
          <Button
            type={'switch'}
            className={`${currentTab === 'cloud' ? 'bg-primary-bg text-primary' : 'bg-secondary-bg text-secondary'}`}
            onClick={() => setCurrentTab('cloud')}
          >
            云盘
          </Button>
          <Button
            type={'switch'}
            className={`${currentTab === 'playHistory' ? 'bg-primary-bg text-primary' : 'bg-secondary-bg text-secondary'}`}
            onClick={() => setCurrentTab('playHistory')}
          >
            听歌排行
          </Button>
        </div>
      </div>
      <ContentMenu ref={menuRef}>
        <div
          className="item flex items-center text-lg font-black bg-bg p-2 rounded hover:bg-primary-bg"
          onClick={() => {
            setPlaylistType('all')
            setCurrentTab('playlist')
          }}
        >
          全部歌单
        </div>
        <div
          className="item flex items-center text-lg font-black p-2 bg-bg hover:bg-primary-bg"
          onClick={() => {
            setPlaylistType('mine')
            setCurrentTab('playlist')
          }}
        >
          创建的歌单
        </div>
        <div
          className="item flex items-center text-lg font-black p-2 bg-bg rounded hover:bg-primary-bg"
          onClick={() => {
            setPlaylistType('liked')
            setCurrentTab('playlist')
          }}
        >
          收藏的歌单
        </div>
      </ContentMenu>
      <div className="tab-content">
        {currentTab === 'playHistory' ? (
          <TrackList type="tracklist" songs={liked.playHistory['weekData']} />
        ) : (
          <CoverRow type={currentTab} items={content} />
        )}
      </div>

      {/* <div className="tab-content" v-show="currentTab === 'mv'">
      </div>
      <div className="tab-content" v-show="currentTab === 'cloud'">
      </div> */}
    </div>
  )
})
export default Library
