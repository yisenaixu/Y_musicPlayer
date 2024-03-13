import { useContext, useEffect, useState } from 'react'
import { getHotPlayListCats, fetchAllCatlist } from '../api/cat'
import {
  fetchPlaylistByCat as fetchPlaylistByCat1,
  fetchRankList,
} from '../api/playlist'
import bigCats from '../utils/bigCats'
import CoverRow from '../components/CoverRow'
import { StoreContext } from '../context/storeContext'
import { useSearchParams } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import Button from '../components/Button'
const Explore = observer(() => {
  const [searchParams] = useSearchParams()
  const [activeCat, setActiveCat] = useState(searchParams.get('cat') ?? '全部')
  const [isShow, setIsShow] = useState(false)
  const [isMore, setIsMore] = useState(false)
  const [showCat, setShowCat] = useState([])
  const [catlist, setCatlist] = useState([])
  const [total, setTotal] = useState(25)
  const [limit] = useState(25)
  const [currentTotal, setCurrentTotal] = useState(0)
  const [playlists, setPlaylists] = useState([])
  const store = useContext(StoreContext)
  useEffect(() => {
    getHotCats()
    fetchAllCats()
    console.debug(store.settings)
  }, [])
  useEffect(() => {
    fetchPlaylistByCat()
  }, [activeCat])
  const getHotCats = async () => {
    await getHotPlayListCats().then(res => {
      setShowCat(res.tags.map(tag => tag.name))
    })
    if (store.settingStore.settings.enabledPlaylistCategories === 'null') {
      console.log('设置默认settings')
      store.settingStore.updateSettings({
        key: 'enabledPlaylistCategories',
        value: showCat,
      })
    }
  }
  const fetchAllCats = () => {
    fetchAllCatlist().then(res => {
      setCatlist(
        res.sub.map(tag => ({ name: tag.name, category: tag.category })),
      )
    })
  }
  const getCatsByBigCats = category => {
    return catlist.filter(item => item.category === category)
  }
  const fetchPlaylistByCat = (isReplace = true) => {
    if (activeCat === '排行榜') {
      fetchRankList().then(res => {
        setPlaylists(res.list)
        setCurrentTotal(res.list.length)
      })
    } else {
      fetchPlaylistByCat1(activeCat, limit, playlists.length).then(res => {
        if (isReplace) {
          setPlaylists(res.playlists)
        } else {
          setPlaylists([...playlists, ...res.playlists])
        }
        setTotal(res.total)
        setCurrentTotal(currentTotal + limit)
      })
    }
  }
  useEffect(() => {
    setIsMore(playlists.length < total)
  }, [playlists])

  const loadmore = () => {
    fetchPlaylistByCat(false)
  }
  return (
    <div className="explore">
      <div className="buttons flex flex-wrap">
        <Button
          type={'switch'}
          className={`${activeCat === '全部' && 'bg-primary-bg text-primary'}`}
          onClick={() => setActiveCat('全部')}
        >
          全部
        </Button>
        <Button
          type={'switch'}
          className={`${activeCat === '排行榜' && 'bg-primary-bg text-primary'}`}
          onClick={() => setActiveCat('排行榜')}
        >
          排行榜
        </Button>
        {store.settingStore.settings.enabledPlaylistCategories?.map(cat => (
          <Button
            type={'switch'}
            className={`${activeCat === cat && 'bg-primary-bg text-primary'}`}
            onClick={() => setActiveCat(cat)}
            key={cat}
          >
            {cat}
          </Button>
        ))}
        <Button type={'switch'} onClick={() => setIsShow(is => !is)}>
          {' '}
          ...
        </Button>
      </div>
      {isShow && (
        <div className="panel mt-3 bg-secondary-bg overflow-hidden">
          <div className="container flex flex-col justify-center ml-3 mt-6">
            {bigCats.map(bigCat => (
              <div className="row flex mb-8 " key={bigCat.name}>
                <div className="bigCat text-3xl font-extrabold min-w-[60px] text-secondary ">
                  {bigCat.name}
                </div>
                <div className="cats flex flex-wrap ml-6 ">
                  {getCatsByBigCats(bigCat.category)?.map(cat => (
                    <div
                      key={cat.name}
                      className={`cat cursor-pointer flex justify-center items-center min-w-20 mx-6 my-2
                               ${store.settingStore.settings.enabledPlaylistCategories?.includes(cat.name) && 'text-primary'}`}
                      onClick={() =>
                        store.settingStore.togglePlaylistCategory(cat.name)
                      }
                    >
                      {cat.name}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="playlist">
        <div className="container">
          <CoverRow items={playlists} type="playlist" />
        </div>
      </div>
      {isMore && (
        <div className="moreButton flex justify-center">
          <Button type={'util'} onClick={loadmore}>
            加载更多
          </Button>
        </div>
      )}
    </div>
  )
})

export default Explore
