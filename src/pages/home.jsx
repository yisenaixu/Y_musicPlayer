import CoverRow from '../components/CoverRow'
import DailyRecSongCard from '../components/DailyRecSongCard'
import FMCard from '../components/FMCard'
import {
  fetchLimitRankList,
  getPersonalRecommendSongList,
} from '../utils/songlist'
import { fetchTopArtists } from '../api/artist'
import { fetchLimitNewAlbums } from '../utils/album'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
const Home = () => {
  const [RecommendSongList, setRecommendSongList] = useState([])
  const [recommendIndex, setRecommendIndex] = useState(10)
  const [rankList, setRankList] = useState([])
  const [artists, setArtists] = useState([])
  const [albums, setAlbums] = useState([])

  useEffect(() => {
    getPersonalRecommendSongList(recommendIndex - 10, recommendIndex).then(
      items => {
        console.log(items)
        setRecommendSongList(items)
      },
    )
  }, [recommendIndex])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    fetchLimitRankList(5).then(res => setRankList(res))
    fetchTopArtists(5, 0).then(res => setArtists(res.artists))
    fetchLimitNewAlbums(5).then(res => setAlbums(res))
  }
  return (
    <div className="home relative flex flex-col">
      <div className="index-row mt-[2rem]">
        <div className="title text-3xl text-text font-black mb-6 flex justify-between items-center mt-4 ">
          For you
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8 md:gap-16 lg:gap-40 xl:gap-60 2xl:gap-80  px-12 place-items-center">
          <DailyRecSongCard />
          <FMCard />
        </div>
      </div>
      <div className="index-row mt-[4.5rem]">
        <div className="title text-3xl text-text font-black mb-6 flex justify-between items-center mt-4 ">
          推荐歌单
          <div className="seeAll text-sm font-light cursor-pointer">
            <span
              onClick={() => setRecommendIndex(recommendIndex === 10 ? 20 : 10)}
            >
              换一批
            </span>
          </div>
        </div>
        <CoverRow items={RecommendSongList} type="playlist" />
      </div>
      <div className="index-row mt-[4.5rem]">
        <div className="title text-3xl text-text font-black mb-6 flex justify-between items-center mt-4 ">
          排行榜
          <div className="seeAll text-sm font-light cursor-pointer">
            <Link to="/explore?cat=排行榜">查看全部</Link>
          </div>
        </div>
        <CoverRow items={rankList} type="playlist" />
      </div>
      <div className="index-row mt-[4.5rem]">
        <div className="title text-3xl text-text font-black mb-6 flex justify-between items-center mt-4 ">
          歌手推荐
        </div>
        <CoverRow items={artists} type="artist" />
      </div>
      <div className="index-row mt-[4.5rem]">
        <div className="title text-3xl text-text font-black mb-6 flex justify-between items-center mt-4 ">
          <div>新专速递</div>
          <div className="seeAll text-sm font-light cursor-pointer">
            <Link to="/newAlbums">查看全部</Link>
          </div>
        </div>
        <CoverRow items={albums} type="album" />
      </div>
    </div>
  )
}
export default Home
