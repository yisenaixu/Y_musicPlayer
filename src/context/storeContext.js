import { rootStore } from '../store'
import { createContext } from 'react'
export const StoreContext = createContext(rootStore)
export const PlayerContext = createContext(rootStore.playerStore)
