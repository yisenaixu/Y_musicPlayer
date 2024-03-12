import { useState, useContext, useRef } from 'react'
import SvgIcon from './SvgIcon'
import Button from './Button'
import { useLocation, useNavigate } from 'react-router-dom'
import { StoreContext } from '../context/storeContext'
import { observer } from 'mobx-react-lite'
import ContentMenu from './ContentMenu'
import { doLogout, isLoggedIn } from '../utils/auth'
import { useScroll } from '../hooks/useScroll'
const NavBar = observer(() => {
  const navigate = useNavigate()
  const location = useLocation()
  const isScroll = useScroll()
  const [value, setValue] = useState()
  const [inputFocus, setInputFocus] = useState(false)
  const menuRef = useRef(null)
  const store = useContext(StoreContext)
  console.debug(store.userStore.userData)
  const go = () => {
    console.log('go')
    navigate(1)
  }
  const back = () => {
    navigate(-1)
  }
  const showModal = e => {
    console.log('open modal')
    menuRef.current.openMenu(e)
  }
  const search = e => {
    if (e.key === 'Enter') navigate(`/search?keywords=${value}`)
  }
  const isActive = path => {
    return path === location.pathname
  }
  return (
    <>
      <nav
        className={`h-16 sticky top-0 left-0 right-0 flex px-[10vw] items-center z-50 bg-bg transition-all ${isScroll && 'shadow'}`}
      >
        <div className="navigateButtons flex flex-1">
          <Button type={'icon'} onClick={back}>
            <SvgIcon symbolId="arrow-left" />
          </Button>
          <Button type={'icon'} onClick={go}>
            <SvgIcon symbolId="arrow-right" />
          </Button>
        </div>
        <div className="navigateLinks flex justify-center flex-[2] lg:flex-1">
          <Button
            type="link"
            to={'/'}
            className={`${isActive('/') && 'text-primary'}`}
          >
            首页
          </Button>
          <Button
            type="link"
            to={'/explore'}
            className={`${isActive('/explore') && 'text-primary'}`}
          >
            发现
          </Button>
          <Button
            type="link"
            to={'/library'}
            className={`${isActive('/library') && 'text-primary'}`}
          >
            音乐库
          </Button>
        </div>
        <div className="searchBox flex flex-1 justify-end">
          <div
            className={`searchBox-container hidden lg:flex box-border items-center h-8 p-3 rounded-xl ${inputFocus ? 'bg-primary-bg-transparent' : 'bg-secondary-bg-transparent'}`}
          >
            <SvgIcon symbolId={'search'} color={inputFocus && 'blue'} />
            <div className="search">
              <input
                className="text-lg font-semibold bg-transparent focus-visible: outline-none"
                value={value}
                placeholder={inputFocus ? '' : '搜索'}
                onChange={e => setValue(e.target.value)}
                onBlur={() => setInputFocus(false)}
                onFocus={() => setInputFocus(true)}
                onKeyDown={search}
              />
            </div>
          </div>
          <img
            className="avatar rounded-full h-8 cursor-pointer ml-2"
            src={store.userStore.avatarUrl}
            alt=""
            onClick={showModal}
          />
        </div>
      </nav>
      <ContentMenu ref={menuRef}>
        {isLoggedIn() ? (
          <>
            <div
              onClick={() => navigate('/settings')}
              className="item flex items-center text-lg text-text font-black p-2 hover:bg-primary-bg"
            >
              <SvgIcon symbolId="settings" />
              设置
            </div>
            <div
              onClick={() => doLogout()}
              className="item flex items-center text-lg text-text font-black p-2 hover:bg-primary-bg"
            >
              {/* <svg-icon symbolId="icon-logout" class="svg-icon" ></svg-icon> */}
              退出登录
            </div>
          </>
        ) : (
          <div
            onClick={() => navigate('/login')}
            className="item flex items-center text-lg text-text font-black p-2 hover:bg-primary-bg"
          >
            {/* // <svg-icon symbolId="icon-login" class="svg-icon"></svg-icon> */}
            登录
          </div>
        )}
      </ContentMenu>
    </>
  )
})

export default NavBar
