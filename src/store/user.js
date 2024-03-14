import { makeAutoObservable } from 'mobx'
import {
  likeAlbum,
  likeArtist,
  likeMV,
  likePlaylist,
  likeSong,
} from '../api/like'
import { getSongListDetail } from '../api/playlist'
import { dailyTracks } from '../api/track'
import {
  likedAlbums,
  likedArtists,
  likedMVs,
  userAccount,
  userLikeSongsIDs,
  userPlayHistory,
  userPlaylist,
} from '../api/user'
import { isLoggedIn } from '../utils/auth'
import { toast } from '../components/Toast'

export class UserStore {
  userData = JSON.parse(localStorage.getItem('user')) ?? {}
  liked = {
    songsId: [],
    songsDetails: [],
    playlists: [],
    albums: [],
    mvs: [],
    artists: [],
    cloud: [],
    playHistory: {
      weekData: [],
      allData: [],
    },
  }
  dailyTracks = []
  rootStore
  constructor(rootStore) {
    makeAutoObservable(this, {
      rootStore: false,
    })
    this.rootStore = rootStore
  }
  get avatarUrl() {
    return this.userData?.user?.avatarUrl && isLoggedIn()
      ? `${this.userData?.user?.avatarUrl}?param=50y50`
      : 'http://s4.music.126.net/style/web2/img/default/default_avatar.jpg?param=60y60'
  }
  updateUserData({ key, value }) {
    this.userData[key] = value
  }
  updateLiked({ key, value }) {
    this.liked[key] = value
  }
  updateDailyTracks(val) {
    this.dailyTracks = val
  }
  /**
   * @description 获取用户数据
   */
  fetchUserProfile() {
    if (!isLoggedIn()) return
    return userAccount().then(res => {
      if (res.code === 200) {
        this.updateUserData({ key: 'user', value: res.profile })
      }
    })
  }
  /**
   * @description 获取播放历史
   */
  fetchPlayHistory() {
    if (!isLoggedIn()) return
    return Promise.all([
      userPlayHistory({ uid: this.userData.user?.userId, type: 0 }), //allData
      userPlayHistory({ uid: this.userData.user?.userId, type: 1 }), //weekData
    ]).then(res => {
      const data = {}
      const dataType = { 0: 'allData', 1: 'weekData' }
      //res [{song,playCount,score}]
      console.log(res)
      for (let i = 0; i < res.length; i++) {
        const songData = res[i][dataType[i]].map(item => {
          const song = item.song
          song.playCount = item.playCount
          return song
        })
        data[dataType[i]] = songData
      }
      this.updateLiked({ key: 'playHistory', value: data })
    })
  }
  /**
   * @description 获取喜欢的歌曲id
   */
  fetchLikedSongs() {
    if (!isLoggedIn()) return
    return userLikeSongsIDs(this.userData.user.userId).then(res => {
      if (res.ids) {
        console.log('更新喜欢歌曲ID')
        this.updateLiked({ key: 'songsId', value: res.ids })
      }
    })
  }
  /**
   * @description 获取喜欢的歌曲及其具体信息
   */
  fetchLikedSongsDetail() {
    if (!isLoggedIn()) return
    return getSongListDetail(this.userData.likedPlaylistId).then(res => {
      if (res.playlist.tracks.length > 0) {
        console.log(res.playlist.tracks)
        let songs = res.playlist.tracks.slice(0, 16)
        console.log(songs)
        this.updateLiked({ key: 'songsDetails', value: songs })
      }
    })
  }
  /**
   * @description 获取喜欢的歌单并在userData添加 我的喜欢 歌单的id
   */
  fetchLikedPlaylist() {
    if (!isLoggedIn()) return
    return userPlaylist({
      uid: this.userData.user?.userId,
      limit: 2000, // max
    }).then(res => {
      if (res.playlist) {
        console.debug('更新喜欢歌单')
        this.updateLiked({ key: 'playlists', value: res.playlist })
        this.updateUserData({
          key: 'likedPlaylistId',
          value: res.playlist[0].id,
        })
      }
    })
  }
  /**
   * @description 获取喜欢的专辑
   */
  fetchLikedAlbums() {
    if (!isLoggedIn()) return
    return likedAlbums({ limit: 2000 }).then(res => {
      if (res.data) {
        console.debug('更新喜欢专辑')
        this.updateLiked({ key: 'albums', value: res.data })
      }
    })
  }
  /**
   * @description 获取喜欢的歌手
   */
  fetchLikedArtists() {
    if (!isLoggedIn()) return
    return likedArtists({ limit: 2000 }).then(res => {
      if (res.data) {
        this.updateLiked({ key: 'artists', value: res.data })
      }
    })
  }
  /**
   * @description 获取喜欢的mv
   */
  fetchLikedMVs() {
    if (!isLoggedIn()) return
    return likedMVs().then(res => {
      console.debug(res)
      if (res.data) {
        this.updateLiked({ key: 'mvs', value: res.data })
      }
    })
  }
  /**
   * @description 获取日推歌曲
   */
  fetchDailyTracks() {
    if (!isLoggedIn()) return
    return dailyTracks().then(res => {
      console.debug('daily', res)
      if (res.data) {
        this.updateDailyTracks(res.data.dailySongs)
      }
    })
  }
  /**
   * @description 更新所有喜欢
   */
  fetchAllLiked() {
    if (isLoggedIn()) {
      console.debug('get liked')
      this.fetchLikedSongs()
      this.fetchLikedSongsDetail()
      this.fetchLikedPlaylist()
      this.fetchLikedAlbums()
      this.fetchLikedArtists()
      this.fetchPlayHistory()
      this.fetchLikedMVs()
    }
  }

  /**
   * 喜欢一首歌曲
   * @param {object} payload
   * @param {number} payload.id
   * @param {number} payload.t
   */
  LikeATrack(payload) {
    if (!isLoggedIn()) {
      toast.current.info('请先登录', 2000)
      return
    }
    return likeSong(payload).then(res => {
      console.log(res)
      this.fetchLikedSongs()
      this.fetchLikedSongsDetail()
    })
  }

  /**
   * 喜欢一个专辑
   * @param {object} payload
   * @param {number} payload.id
   * @param {number} payload.t
   */
  LikeAAlbum(payload) {
    if (!isLoggedIn()) {
      toast.current.info('请先登录', 2000)
      return
    }
    console.debug(payload)
    return likeAlbum(payload).then(res => {
      console.log(res)
      this.fetchLikedAlbums()
    })
  }

  /**
   * 喜欢一个歌单
   * @param {object} payload
   * @param {number} payload.id
   * @param {number} payload.t
   */
  LikeAPlaylist(payload) {
    if (!isLoggedIn()) {
      toast.current.info('请先登录', 2000)
      return
    }
    return likePlaylist(payload).then(res => {
      console.log(res)
      this.fetchLikedPlaylist()
    })
  }

  /**
   * 喜欢一个歌手
   * @param {object} payload
   * @param {number} payload.id
   * @param {number} payload.t
   */
  LikeAArtist(payload) {
    if (!isLoggedIn()) {
      toast.current.info('请先登录', 2000)
      return
    }
    return likeArtist(payload).then(res => {
      console.log(res)
      this.fetchLikedArtists()
    })
  }

  /**
   * 喜欢一个MV
   * @param {object} payload
   * @param {number} payload.id
   * @param {number} payload.t
   */
  LikeAMV(payload) {
    if (!isLoggedIn()) {
      toast.current.info('请先登录', 2000)
      return
    }
    return likeMV(payload).then(res => {
      console.log(res)
      this.fetchLikedMVs()
    })
  }
}
