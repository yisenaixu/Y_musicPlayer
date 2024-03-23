import { TrackListItem } from './TrackList'
import { useState, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
const VituralList = ({ items, count = 24 }) => {
  const [startIndex, setStartIndex] = useState(0)
  const [endIndex, setEndIndex] = useState(count)
  const observerRef = useRef(null)
  const topElement = useRef()
  const bottomElement = useRef()
  const first = useRef(true)
  const n = items.length
  const styles = {
    height: n * 84 + 'px',
    paddingTop: startIndex * 84 + 'px',
  }
  useEffect(() => {
    console.debug(items)
    if (endIndex === count);
    else {
      let newEndIndex = endIndex + count / 2 > n ? n : endIndex + count / 2
      let newStartIndex = newEndIndex - count
      setStartIndex(newStartIndex)
      setEndIndex(newEndIndex)
    }
  }, [items])
  // 虚拟列表实现
  useEffect(() => {
    first.current = true
    observerRef.current = new IntersectionObserver(
      entries => {
        if (first.current) first.current = false
        else {
          entries.forEach(entry => {
            const { isIntersecting, target } = entry
            // 下滑
            if (isIntersecting > 0 && target.id === 'bottom') {
              console.debug(target)
              let newEndIndex =
                endIndex + count / 2 > n ? n : endIndex + count / 2
              let newStartIndex = newEndIndex - count
              setStartIndex(newStartIndex)
              setEndIndex(newEndIndex)
            }
            // 上滑
            if (isIntersecting > 0 && target.id === 'top') {
              let newStartIndex =
                startIndex - count / 2 < 0 ? 0 : startIndex - count / 2
              let newEndIndex = newStartIndex + count
              setStartIndex(newStartIndex)
              setEndIndex(newEndIndex)
            }
          })
        }
      },
      {
        rootMargin: '-64px',
      },
    )
    if (topElement.current) observerRef.current.observe(topElement.current)
    if (bottomElement.current)
      observerRef.current.observe(bottomElement.current)
    return () => {
      observerRef.current.disconnect()
    }
  }, [endIndex])
  console.debug(items)
  console.debug(startIndex, endIndex)
  let sliceItems = items.slice(startIndex, endIndex)
  return (
    <div className="list container box-border " style={styles}>
      {sliceItems.map((song, index) => {
        const refVal =
          index + startIndex === endIndex - 1
            ? bottomElement
            : index + startIndex === startIndex
              ? topElement
              : null
        const id =
          index + startIndex === endIndex - 1
            ? 'bottom'
            : index + startIndex === startIndex
              ? 'top'
              : ''
        return (
          <div key={song.id} ref={refVal} id={id} className="h-21">
            <TrackListItem track={song} type="playlist" />
          </div>
        )
      })}
    </div>
  )
}
VituralList.propTypes = {
  items: PropTypes.array,
  count: PropTypes.number,
}
export default VituralList
