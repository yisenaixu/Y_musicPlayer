import { PlayerStore } from './player'
import { SettingStore } from './settting'
import { UserStore } from './user'
class RootStore {
  constructor() {
    this.userStore = new UserStore(this)
    this.playerStore = new PlayerStore(this)
    this.settingStore = new SettingStore(this)
  }
}

export const rootStore = new RootStore()
