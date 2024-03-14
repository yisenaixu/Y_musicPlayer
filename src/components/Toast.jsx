import { useEffect, useImperativeHandle, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Proptypes from 'prop-types'
import { CSSTransition } from 'react-transition-group'
import classNames from 'classnames'
export const toast = { current: undefined }

const ToastMsg = ({ msg, duration }) => {
  const [visible, setVisible] = useState(false)
  const [enter, setEnter] = useState(false)
  useEffect(() => {
    setVisible(true)
    setTimeout(() => {
      setEnter(true)
    }, 500)
    setTimeout(() => {
      setEnter(false)
    }, duration - 500)
    setTimeout(() => {
      setVisible(false)
    }, duration)
  }, [])
  return (
    visible && (
      <CSSTransition
        in={enter}
        timeout={duration}
        classNames="toast"
        unmountOnExit
      >
        <div
          className={classNames(
            'btn btn_util bg-secondary-bg text-text text-base z-50 shadow transition-all duration-500 opacity-0 translate-y-[-50%]',
          )}
        >
          {msg}
        </div>
      </CSSTransition>
    )
  )
}
const Toast = () => {
  const toastRef = useRef()
  const [msgs, setMsgs] = useState([])
  useImperativeHandle(toastRef, () => ({
    info,
  }))
  useEffect(() => {
    console.debug(toastRef.current)
    toast.current = toastRef.current
  }, [])
  const info = (msg, duration) => {
    setMsgs(msgs => [{ msg, duration, id: `${new Date()}` }, ...msgs])
  }
  const renderDom = (
    <div className="fixed top-1/3 left-1/2 translate-x-[-50%] z-50">
      {msgs.map(msg => (
        <ToastMsg key={msg.id} {...msg} />
      ))}
    </div>
  )
  return typeof document !== 'undefined'
    ? createPortal(renderDom, document.body)
    : renderDom
}

ToastMsg.propTypes = {
  msg: Proptypes.string,
  duration: Proptypes.number,
}

export default Toast
