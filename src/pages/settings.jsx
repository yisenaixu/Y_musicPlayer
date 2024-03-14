import { useContext } from 'react'
import { StoreContext } from '../context/storeContext'
import Select from '../components/Select'
import SvgIcon from '../components/SvgIcon'
import Button from '../components/Button'
import { doLogout } from '../utils/auth'
import { observer } from 'mobx-react-lite'
import { clearCache } from '../utils/db'

const Settings = observer(() => {
  const store = useContext(StoreContext)
  const {
    userStore: { userData },
    settingStore: {
      settings: { appearance, musicQuality },
    },
  } = store
  console.log(appearance, musicQuality)
  const levelOptions = [
    { value: 'standard', label: '标准' },
    { value: 'higher', label: '较高' },
    { value: 'exhigh', label: '极高' },
    { value: 'lossless', label: '无损' },
    { value: 'hires', label: 'Hi-Res' },
    { value: 'jyeffect', label: '高清环绕声' },
    { value: 'sky', label: '沉浸环绕声' },
    { value: 'jymaster', label: '超清母带' },
  ]
  const appearanceOptions = [
    { value: '', label: '明亮' },
    { value: 'dark', label: '黑暗' },
  ]
  return (
    <div className="settings max-w-[50rem] mx-auto">
      <div className="container w-full px-6 py-4 ">
        <div className="personal text-text flex items-center bg-secondary-bg-transparent px-6 py-3 rounded-2xl ">
          <div className="left flex-1 flex justify-start items-center">
            <img
              className="avatar h-16 w-16 rounded-full mr-2"
              src={userData.user?.avatarUrl}
              alt=""
            />
            <div className="info">
              <div className="name text-xl font-semibold mb-4 ">
                {userData.user?.nickname}
              </div>
              <div className="vip text-sm font-extralight">黑胶vip</div>
            </div>
          </div>
          <div className="right flex justify-end">
            <Button type={'util'} onClick={() => doLogout()}>
              <SvgIcon symbolId="logout" />
              登出
            </Button>
          </div>
        </div>
        <div className="global mt-4">
          <Select name="语言" options={[]} />
          <Select
            name="外观"
            k={'appearance'}
            v={appearance ?? appearanceOptions[0].value}
            options={appearanceOptions}
          />
        </div>
        <div className="music-quality mt-4">
          <div className="title text-2xl text-text font-semibold ">音质</div>
          <hr className="opacity-30" />
          <Select
            name="音质选择"
            k={'musicQuality'}
            v={musicQuality ?? levelOptions[0].value}
            options={levelOptions}
          />
        </div>
        <div className="lyric mt-4">
          <div className="title text-2xl text-text font-semibold ">歌词</div>
          <hr className="opacity-30" />
          <Select name="歌词字体大小" options={[]} />
        </div>
        <div className="other mt-4 flex justify-center">
          <Button type={'util'} onClick={clearCache}>
            清空本地缓存
          </Button>
        </div>
      </div>
    </div>
  )
})
export default Settings
