import CoverRow from '../components/CoverRow'
import { useEffect, useState } from 'react'
import { fetchNewAlbums } from '../api/album'
import Button from '../components/Button'
const NewAlbums = () => {
  const [albums, setAlbums] = useState([])
  const [offset, setOffset] = useState(0)
  const [total, setTotal] = useState(0)
  const [limit] = useState(100)
  const [haveMore, setHaveMore] = useState()
  useEffect(() => {
    fetchNewAlbums({ limit, offset: offset }).then(res => {
      console.log(res)
      setTotal(res.total)
      setOffset(offset + limit)
      setAlbums([...albums, ...res.albums])
    })
  }, [])
  const loadMore = () => {
    fetchNewAlbums({ limit, offset: offset }).then(res => {
      console.log(res)
      setTotal(res.total)
      setOffset(offset + limit)
      setAlbums([...albums, ...res.albums])
    })
  }
  useEffect(() => {
    setHaveMore(albums.length < total)
  }, [albums])
  return (
    <div className="newAlbums flow-root">
      <div className="title text-6xl text-text font-semibold mt-6">
        新专速递
      </div>
      <div className="albums flex justify-center mt-6">
        <CoverRow type="album" items={albums} />
      </div>
      {haveMore && (
        <div className="flex justify-center">
          <Button type={'util'} onClick={loadMore}>
            加载更多
          </Button>
        </div>
      )}
    </div>
  )
}

export default NewAlbums
