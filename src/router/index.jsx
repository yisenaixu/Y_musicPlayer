import { lazy } from 'react'
import { Navigate } from 'react-router-dom'
import { isLoggedIn } from '../utils/auth.js'
import PropTypes from 'prop-types'
const Home = lazy(() => import('../pages/home.jsx'))
const Explore = lazy(() => import('../pages/explore.jsx'))
const Library = lazy(() => import('../pages/library.jsx'))
// 取消
// const Login = lazy(() => import('../pages/login.jsx'))
const LoginAccount = lazy(() => import('../pages/loginAccount.jsx'))
const Playlist = lazy(() => import('../pages/playlist.jsx'))
const Album = lazy(() => import('../pages/album.jsx'))
const Artist = lazy(() => import('../pages/artist.jsx'))
const NewAlbums = lazy(() => import('../pages/newAlbums.jsx'))
const ArtistMvs = lazy(() => import('../pages/artistMvs.jsx'))
const List = lazy(() => import('../pages/list.jsx'))
const Search = lazy(() => import('../pages/search.jsx'))
const DailyTracks = lazy(() => import('../pages/dailyTracks.jsx'))
const Mv = lazy(() => import('../pages/mv.jsx'))
const Lyrics = lazy(() => import('../pages/lyrics.jsx'))
const Settings = lazy(() => import('../pages/settings.jsx'))

const RequiredLogin = ({ children }) => {
  return isLoggedIn() ? (
    children
  ) : (
    <Navigate to={'/login'} replace element={LoginAccount} />
  )
}

RequiredLogin.propTypes = {
  children: PropTypes.element,
}

export default [
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/explore',
    element: <Explore />,
  },
  {
    path: '/library',
    element: (
      <RequiredLogin>
        <Library />
      </RequiredLogin>
    ),
  },
  {
    path: '/login',
    element: <LoginAccount />,
  },
  // {
  //   path: '/login/account',
  //   element: <LoginAccount />,
  // },
  {
    path: '/playlist/:id',
    element: <Playlist />,
  },
  {
    path: '/album/:id',
    element: <Album />,
  },
  {
    path: '/artist/:id',
    element: <Artist />,
  },
  {
    path: '/newAlbums',
    element: <NewAlbums />,
  },
  {
    path: '/artist/:id/mv',
    element: <ArtistMvs />,
  },
  {
    path: '/list',
    element: <List />,
  },
  {
    path: '/search',
    element: <Search />,
  },
  {
    path: '/dailyTracks',
    element: (
      <RequiredLogin>
        <DailyTracks />
      </RequiredLogin>
    ),
  },
  {
    path: '/mv/:id',
    element: <Mv />,
  },
  {
    path: '/lyrics',
    element: <Lyrics />,
  },
  {
    path: '/settings',
    element: (
      <RequiredLogin>
        <Settings />
      </RequiredLogin>
    ),
  },
]
