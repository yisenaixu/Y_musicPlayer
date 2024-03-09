import PropTypes from 'prop-types'
function SvgIcon({ symbolId, height, width, color }) {
  const iconName = `#icon-${symbolId}`
  const styles = {
    height,
    width,
    color,
  }
  return (
    <svg className="h-4 w-4" style={styles}>
      <use href={iconName}></use>
    </svg>
  )
}
SvgIcon.propTypes = {
  symbolId: PropTypes.string,
  width: PropTypes.string,
  height: PropTypes.string,
  color: PropTypes.string,
}

export default SvgIcon
