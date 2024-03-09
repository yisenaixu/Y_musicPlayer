import { makeAutoObservable } from 'mobx'
import Player from '../utils/player'

// new Proxy(new Player(), {
//   set(target, prop, val) {
//     target[prop] = val;
//     if (prop === '_howler') return true;
//     target._saveToLocalStorage();
//     return true;
//   }
// })
export class PlayerStore {
  rootStore
  player = new Player()
  constructor(rootStore) {
    makeAutoObservable(this, {
      rootStore: false,
    })
    this.rootStore = rootStore
  }
  updatePlayerProgress(progress) {
    this.player._progress = progress
  }
  updatePlayerTrack(track) {
    this.player.currentTrack = track
  }
}
