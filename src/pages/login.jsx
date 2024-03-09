import SvgIcon from '../components/SvgIcon'
import PropTypes from 'prop-types'
import { useState } from 'react'
import classNames from 'classnames'
import { useNavigate } from 'react-router'
function Card({ text, subText }) {
  const navigate = useNavigate()
  const [isActive, setIsActive] = useState(false)
  const InfoClass = classNames('transition-all duration-300 info', {
    'translate-x-[-8px]': isActive,
  })
  const svgClass = classNames(
    'transition-all',
    'ml-4',
    'duration-300',
    'opacity-0',
    {
      'translate-x-[8px]': isActive,
      'opacity-100': isActive,
    },
  )
  // 跳转账号登陆页
  const goAccount = () => {
    navigate('/login/account')
  }
  return (
    <div
      className="card w-80 h-32 p-4 my-5 rounded-lg flex items-center justify-center cursor-pointer bg-primary-bg text-primary"
      onMouseEnter={() => setIsActive(true)}
      onMouseLeave={() => setIsActive(false)}
      onClick={goAccount}
    >
      <div className="container flex items-center justify-evenly">
        <div className={InfoClass}>
          <div className="section-1 text-2xl font-bold ">{text}</div>
          <div className="section-2 text-sm font-light indent-1 ">
            {subText}
          </div>
        </div>
        <div className={svgClass}>
          <SvgIcon symbolId={'arrow-right'} width={'20px'} height={'20px'} />
        </div>
      </div>
    </div>
  )
}

function Login() {
  return (
    <div className="login pt-32 flex flex-col justify-center items-center ">
      <div className="title"></div>
      <Card text={'登录网易云账号'} subText={'可访问全部数据'} />
      <Card text={'搜索网易云账号'} subText={'只能读取账号公开数据'} />
    </div>
  )
}

Card.propTypes = {
  text: PropTypes.string,
  subText: PropTypes.string,
}
export default Login
