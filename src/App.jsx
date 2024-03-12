import './App.css'
import { useRoutes } from 'react-router'
import routes from './router/index'
import Layout from './components/Layout'
import { rootStore } from './store/index.js'
import { useEffect } from 'react'
import { PlayerContext, StoreContext } from './context/storeContext.js'
import { autorun, trace } from 'mobx'
import { changeAppearance } from './utils/common.js'
function App() {
  const router = useRoutes(routes)
  const { userStore, playerStore, settingStore } = rootStore
  console.debug(userStore, playerStore)
  useEffect(() => {
    userStore.fetchAllLiked()
  }, [])
  autorun(() => {
    console.log(
      'settings',
      settingStore.settings.enabledPlaylistCategories.length,
    )
    console.log('user', userStore.userData)
    localStorage.setItem('settings', JSON.stringify(settingStore.settings))
    localStorage.setItem('user', JSON.stringify(userStore.userData))
    trace()
  })
  autorun(() => {
    console.log('player', playerStore.player.list)
    const player = {}
    for (const [key, value] of Object.entries(playerStore.player)) {
      if (key === '_playing' || key === '_howler') continue
      player[key] = value
    }
    localStorage.setItem('player', JSON.stringify(player))
  })
  autorun(() => {
    localStorage.setItem('settings', JSON.stringify(settingStore.settings))
    changeAppearance(settingStore.settings.appearance)
  })
  return (
    <StoreContext.Provider value={rootStore}>
      <PlayerContext.Provider value={playerStore}>
        <Layout>{router}</Layout>
      </PlayerContext.Provider>
    </StoreContext.Provider>
  )
}

export default App
