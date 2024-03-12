import NavBar from './NavBar'
import Player from './Player'
import PropTypes from 'prop-types'
function Layout({ children }) {
  return (
    <div className="min-w-[640px]">
      <NavBar />
      <div className="px-[10vw] min-h-[calc(100vh-8rem)] bg-bg">{children}</div>
      <Player />
    </div>
  )
}
Layout.propTypes = {
  children: PropTypes.element,
}

export default Layout
