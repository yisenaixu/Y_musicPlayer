import { getTrackDetail, songUrl } from '../api/track'
import { isLoggedIn } from './auth'
import { Howl, Howler } from 'howler'
import { rootStore } from '../store'
import { getSongListDetail } from '../api/playlist'
import { fetchAlbumDetail } from '../api/album'
import { fetchArtistHotSong } from '../api/artist'
import { fm } from '../api/fm'
import { makeAutoObservable } from 'mobx'
export default class {
  constructor() {
    //播放器状态
    this._playing = false // 是否播放
    this._progress = 0 // 播放歌曲进度
    this._volume = 1 // 音量 0-1

    //播放信息
    this._list = [] // 播放列表
    this._current = 0 // 当前播放歌曲在列表的索引
    this._currentTrack = {} //当前播放歌曲的详细信息
    this._currentTrackDuration = 1000 //当前播放歌曲的时长
    this._shuffleListIndex = [] // list的keys 的随机数组 current = shuffleListIndex[x]
    this._shuffleCurrent = 0 //shuffleListIndex 当前所处位置的索引 x
    this._isFm = false // 是否是fm播放
    this._FmTrack = {} // 当前fm播放歌曲
    this._FmNextTrack = {} // 下一首fm播放歌曲
    this._mode = 'repeat' // 播放模式 repeat | one | shuffle
    // howler 音频库
    this._howler = null
    // 解决循环引用
    Object.defineProperty(this, '_howler', {
      enumerable: false,
    })
    this._init()
    makeAutoObservable(this)
  }

  get playing() {
    return this._playing
  }

  set playing(value) {
    this._playing = value
  }

  get progress() {
    // console.log(this._progress,'get');
    return this._progress
  }

  set progress(value) {
    this._howler?.seek(value)
    this._progress = value
    // console.log('setProgress')
  }

  get volume() {
    console.log(this._volume, 'get')
    return this._volume
  }

  set volume(value) {
    console.log(value, 'set')
    this._volume = value
    this._howler?.volume(value)
  }

  get list() {
    return this._list
  }

  set list(value) {
    this._list = value
  }

  get current() {
    return this._current
  }

  set current(value) {
    this._current = value
  }

  get currentTrack() {
    console.debug('get track')
    return this._currentTrack
  }

  set currentTrack(value) {
    this._currentTrack = value
  }

  get shuffleListIndex() {
    return this._shuffleListIndex
  }

  set shuffleListIndex(value) {
    this._shuffleListIndex = value
  }

  get shuffleCurrent() {
    return this._shuffleCurrent
  }

  set shuffleCurrent(value) {
    this._shuffleCurrent = value
  }

  get mode() {
    return this._mode
  }

  set mode(value) {
    this._mode = value
  }

  get isFm() {
    return this._isFm
  }

  set isFm(value) {
    this._isFm = value
  }

  get FmTrack() {
    return this._FmTrack
  }

  get currentTrackDuration() {
    const trackDuration = this._currentTrack.dt || 1000
    let duration = ~~(trackDuration / 1000)
    console.debug(trackDuration)
    console.debug(duration, 'duration')
    return duration
  }

  _init() {
    console.debug('init')
    this._loadFromLocalStorage()

    // 读缓存中歌曲新建立播放器
    this._replaceCurrentTrack(this.currentTrack?.id)
    this._howler?.volume(this.volume)
    this.pause()

    // 初始化fm
    if (Object.keys(this._FmTrack).length === 0) {
      fm().then(res => {
        this._FmTrack = res.data[0]
        this._FmNextTrack = res.data[1]
      })
    }
    this._setProgerss()
  }
  _setProgerss() {
    setInterval(() => {
      if (this._howler === null) return
      // this._progress = this._howler.seek();
      rootStore.playerStore.updatePlayerProgress(this._howler.seek())
      // store.commit('updatePlayerProgress', this._howler.seek())
      // console.log('计时器');
    }, 1000)
  }
  // 从localStorage加载Player
  _loadFromLocalStorage() {
    const player = JSON.parse(localStorage.getItem('player'))
    if (!player) return
    for (const [key, value] of Object.entries(player)) {
      this[key] = value
    }
  }
  _saveToLocalStorage() {
    const player = {}
    for (const [key, value] of Object.entries(this)) {
      if (key === '_playing') continue
      player[key] = value
    }
    localStorage.setItem('player', JSON.stringify(player))
  }
  /**
   * @description 添加歌曲到播放队列
   * @param {number} trackId 歌曲id
   * @param {boolean} playNow 立刻播放 | 下一首
   */
  addTrackToList(trackId, playNow) {
    if (playNow) {
      if (this.list.length === 0) {
        this.list.push(trackId)
        this.current = 0
        this._replaceCurrentTrack(trackId)
      } else {
        //去重
        if (this.list.includes(trackId)) {
          //被删除的索引
          const index = this.list.findIndex(item => {
            return item === trackId
          })
          console.debug(index, this.current)
          //列表索引变化，current对应改变
          if (this.current > index) {
            this.current = this.current - 1
          }
          this.list.splice(index, 1)
          console.debug(this.list)
        }
        this.list.splice(this.current + 1, 0, trackId)
        console.debug(this.list)
        this.current = this.current + 1
        this._replaceCurrentTrack(trackId)
      }
    } else {
      this.list.push(trackId)
    }
  }
  /**
   * @description 替换当前播放器播放歌曲 player.current currentTrack
   */
  _replaceCurrentTrack(id) {
    return getTrackDetail(id).then(res => {
      const track = res.songs[0]
      rootStore.playerStore.updatePlayerTrack(track)
      return this._replaceCurrentTrackAudio(track)
    })
  }
  /**
   * @description 替换当前播放器播放歌曲的音频资源
   */
  _replaceCurrentTrackAudio(track) {
    return this._getAudioSource(track).then(source => {
      if (source) {
        return this._playAudioSource(source)
      }
    })
  }
  /**
   * @description 根据音乐详情 获取音乐音频信息
   * @param {*} track
   */
  _getAudioSource(track) {
    if (isLoggedIn()) {
      return songUrl({
        id: track.id,
        level: rootStore.settingStore.settings.musicQuality ?? 'exhigh',
      }).then(res => {
        console.log('获取音频url...', res)
        // 音频资源
        const source = res.data[0].url
        return source
      })
    }
  }
  /**
   * @description 播放器根据音频播放
   */
  _playAudioSource(source) {
    //卸载当前播放器
    Howler.unload()

    this._howler = new Howl({
      src: [source], // 播放源
      html5: true, // html5 audio 流式播放 适合大文件
      format: ['mp3', 'flac'], // 播放器默认使用文件默认后缀，不符合时使用此类转换
      onend: () => {
        this.playNextTrack(true)
      },
    })
    console.log('播放器初始化完成')
    this.play()
  }

  /**
   * @description 获取下一首歌的id
   * @returns
   */
  _getNextTrack(auto) {
    let next
    // auto 自动加载下一首歌
    if (auto === false) {
      next = this.current + 1
      if (next === this.list.length) {
        next = 0
      }
    } else {
      // 单曲循环 or 循环播放
      if (this.mode === 'one') {
        next = this.current
      } else if (this.mode === 'repeat') {
        next = this.current + 1
        if (next === this.list.length) {
          next = 0
        }
      }
    }

    return [this.list[next], next]
  }
  /**
   * @description 获取上一首歌的id
   * @returns
   */
  _getPrevTrack() {
    let next = this.current - 1
    if (next === -1) {
      next = this.list.length - 1
    }
    return [this.list[next], next]
  }

  /**
   * @description 播放下一首歌
   * @returns
   */
  _playNextTrack(auto) {
    const [trackId, index] = this._getNextTrack(auto)
    if (trackId === undefined) {
      console.log('停止播放')
      this._howler?.stop()
      this.playing = false
      return false
    }
    this.current = index
    this._replaceCurrentTrack(trackId)
    return true
  }
  playNextTrack(auto) {
    if (this._isFm) {
      return this._playNextFmTrack()
    } else {
      return this._playNextTrack(auto)
    }
  }
  /**
   * @description 播放上一首歌
   * @returns
   */
  _playPrevTrack() {
    const [trackId, index] = this._getPrevTrack()
    if (trackId === undefined) {
      console.log('停止播放')
      this._howler?.stop()
      this.playing = false
      return false
    }
    this.current = index
    this._replaceCurrentTrack(trackId)
    return true
  }
  playPrevTrack() {
    return this._playPrevTrack()
  }
  /**
   * @description 添加整个歌单/专辑/歌手热曲到播放队列
   */
  replacePlaylist(trackIds) {
    this._isFm = false
    this.list = trackIds
    this.current = 0
    this._replaceCurrentTrack(this.list[0])
  }

  /**
   * @description 获取fm下一首歌曲
   */
  _loadFmNextTrack() {
    return fm()
      .then(res => {
        this._FmNextTrack = res.data[0]
      })
      .catch(err => {
        console.err(err)
      })
  }
  /**
   * @description 播放fm
   */
  playFm() {
    console.log('fm启动!')
    this.isFm = true
    if (this.currentTrack.id !== this._FmTrack.id) {
      this._replaceCurrentTrack(this._FmTrack.id)
    } else {
      if (this._howler?.playing()) {
        this.pause()
      } else {
        this.play()
      }
    }
  }
  /**
   * fm状态下播放下一首歌
   */
  _playNextFmTrack() {
    // 当前歌曲切换下一首歌
    this._FmTrack = this._FmNextTrack
    this._replaceCurrentTrack(this._FmTrack.id)
    // 提前下载下一首个
    this._loadFmNextTrack()
    return true
  }

  /**
   * @description 播放
   * @returns
   */
  play() {
    console.log('播放')
    if (this._howler.playing()) return
    this._howler?.play()
    console.log(this._howler)
    this._howler?.once('play', () => {
      console.log('播放1')
      this._howler?.fade(0, this.volume, 200)
      this.playing = true
    })
  }
  /**
   * @description 暂停
   */
  pause() {
    this._howler?.fade(this.volume, 0, 200)

    this._howler?.once('fade', () => {
      this._howler?.pause()
      console.log('播放停止')
      this.playing = false
    })
  }
  /**
   * @description 切换进度
   */
  seek(time) {
    if (time !== null) {
      this._howler?.seek(time)
    }
    return this._howler === null ? 0 : this._howler.seek()
  }
  /**
   * @description 切换播放模式 到单曲循环
   */
  switchModeOne() {
    this.mode = 'one'
  }
  /**
   * @description 切换播放模式 到随机播放
   */
  switchModeShuffle() {
    this.mode = 'shuffle'
  }
  /**
   * @description 切换播放模式 到循环播放
   */
  switchModeRepeat() {
    this.mode = 'repeat'
  }

  /**
   * @description 播放歌单歌曲 cover组件表面使用
   */
  playPlaylistById(id) {
    getSongListDetail(id).then(res => {
      let trackIds = res.playlist.trackIds.map(item => item.id)
      console.log(this)
      this.replacePlaylist(trackIds)
    })
  }
  /**
   * @description 播放专辑歌曲 cover组件表面使用
   */
  playAlbumById(id) {
    fetchAlbumDetail(id).then(res => {
      let trackIds = res.songs.map(item => item.id)
      this.replacePlaylist(trackIds)
    })
  }
  /**
   * @description 播放歌手歌曲 cover组件表面使用
   */
  playArtistById(id) {
    fetchArtistHotSong(id).then(res => {
      let trackIds = res.songs.map(item => item.id)
      console.log(this)
      this.replacePlaylist(trackIds)
    })
  }
}
