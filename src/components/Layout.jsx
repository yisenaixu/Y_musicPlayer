import NavBar from './NavBar'
import Player from './Player'
import PropTypes from 'prop-types'
function Layout({ children }) {
  return (
    <>
      <NavBar />
      <div className="px-[10vw] min-h-[calc(100vh-8rem)] bg-bg">{children}</div>
      <Player />
    </>
  )
}
Layout.propTypes = {
  children: PropTypes.element,
}

export default Layout
