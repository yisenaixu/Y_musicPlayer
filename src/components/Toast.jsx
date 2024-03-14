import { useEffect, useImperativeHandle, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
export const toast = { current: undefined }
const Toast = () => {
  const toastRef = useRef()
  const [msg, setMsg] = useState('')
  const [duration, setDuration] = useState(1500)
  const [visible, setVisible] = useState(false)
  useImperativeHandle(toastRef, () => ({
    info,
  }))
  useEffect(() => {
    console.debug(toastRef.current)
    toast.current = toastRef.current
  }, [])
  const info = (msg, duration) => {
    setMsg(msg)
    setDuration(duration)
    setVisible(true)
  }
  useEffect(() => {
    setTimeout(() => {
      setVisible(false)
    }, duration)
  }, [visible])
  const renderDom = visible && (
    <div className="fixed top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] btn btn_util bg-secondary-bg text-text text-base z-50 shadow">
      {msg}
    </div>
  )
  return typeof document !== 'undefined'
    ? createPortal(renderDom, document.body)
    : renderDom
}

export default Toast
