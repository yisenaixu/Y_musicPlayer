import { useEffect, useState } from 'react'

export function useScroll() {
  const [isScroll, setIsScroll] = useState(false)
  const handleScroll = () => {
    const scrollY = window.scrollY
    setIsScroll(scrollY > 0)
  }
  useEffect(() => {
    window.onscroll = handleScroll
    return () => {
      window.onscroll = null
    }
  }, [])
  return isScroll
}
