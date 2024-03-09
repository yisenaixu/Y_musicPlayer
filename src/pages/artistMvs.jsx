import { useEffect, useState } from 'react'
import { MvRow } from '../components/CoverRow'
import { fetchArtistMv } from '../api/artist'
import { useParams } from 'react-router'
import Button from '../components/Button'

const ArtistMvs = () => {
  const { id } = useParams()
  const [offset, setOffset] = useState(0)
  const [artist, setArtist] = useState()
  const [mvs, setMvs] = useState([])
  const [haveMore, setHaveMore] = useState()
  const [limit] = useState(100)
  useEffect(() => {
    console.debug(id)
    fetchArtistMv({ id, limit, offset }).then(res => {
      setMvs([...mvs, ...res.mvs])
      setOffset(offset + 100)
      if (res.mvs.length) {
        setArtist(res.mvs[0].artist.name)
      }
    })
  }, [id])
  const loadMore = () => {
    fetchArtistMv({ id, limit, offset }).then(res => {
      setMvs([...mvs, ...res.mvs])
      setOffset(offset + 100)
      setHaveMore(res.haveMore)
    })
  }
  return (
    <div className="artistMvs flow-root">
      <div className="title text-6xl text-text font-semibold mt-6">
        {artist} s Music Videos
      </div>
      <div className="flex justify-center mt-6">
        <MvRow items={mvs} columnNumber={5} />
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
export default ArtistMvs
