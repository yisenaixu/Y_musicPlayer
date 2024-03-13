import {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from 'react'
import PropTypes from 'prop-types'

const Menu = (props, ref) => {
  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState({})
  const [positionStyle, setPositionStyle] = useState({})
  const menuRef = useRef(null)
  useEffect(() => {
    setPositionStyle({ top: `${position.y}px`, left: `${position.x}px` })
  }, [position])
  const openMenu = e => {
    setPosition({ x: e.clientX, y: e.clientY })
    setOpen(true)
  }
  useEffect(() => {
    if (open === true) menuRef.current.focus()
  }, [open])
  useImperativeHandle(ref, () => ({
    openMenu,
  }))
  const closeMenu = () => {
    console.log('close')
    setOpen(false)
  }
  return (
    <div
      ref={menuRef}
      className={`menu min-w-32 fixed select-none cursor-pointer rounded-lg z-[999] outline-none
        border-2 border-solid border-[rgba(0, 0, 0, 0.08)] shadow-md
        ${open ? 'block' : 'hidden'}`}
      style={positionStyle}
      tabIndex="-1"
      onBlur={closeMenu}
      onClick={closeMenu}
    >
      {props.children}
    </div>
  )
}

Menu.propTypes = {
  children: PropTypes.element,
}

const ContentMenu = forwardRef(Menu)

export default ContentMenu
