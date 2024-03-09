import { makeAutoObservable } from 'mobx'
import { changeAppearance } from '../utils/common'

export class SettingStore {
  rootStore
  settings = JSON.parse(localStorage.getItem('settings')) ?? {
    enabledPlaylistCategories: [],
  }
  constructor(rootStore) {
    makeAutoObservable(this, {
      rootStore: false,
    })
    this.rootStore = rootStore
  }
  updateSettings({ key, value }) {
    this.settings[key] = value
    if (key === 'appearance') {
      changeAppearance(value)
    }
  }
  togglePlaylistCategory(name) {
    const index = this.settings.enabledPlaylistCategories?.findIndex(
      c => c === name,
    )
    console.log(index)
    if (index === -1) {
      this.settings.enabledPlaylistCategories.push(name)
    } else {
      this.settings.enabledPlaylistCategories =
        this.settings.enabledPlaylistCategories.filter(c => c !== name)
    }
  }
}
