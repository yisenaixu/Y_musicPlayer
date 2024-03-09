// button类型    基础button iconButton linkButton swtichButton utilButton
// 基础button 最基础的样式 无 padding 和 bg color 等属性
// iconButton padding相同及正方形 一般情况 hover为sec-bg 特殊情况如歌词界面另外考虑
// linkButton 主要是navbar上方路由切换 表现为hover:sec-bg active：text-primary
// switchButton 切换内容的按钮 表现为sec-bg  hover:primary-bg text-primary active: primary-bg text-primary
// utilButton 功能按钮 主要为加载更多按钮 表现为 primary-bg text-primary

import PropTypes from 'prop-types'
import classNames from 'classnames'
import { Link } from 'react-router-dom'

const typeButton = {
  icon: 'btn_icon',
  switch: 'btn_switch',
  link: 'btn_link',
  util: 'btn_util',
}

function Button({ children, onClick, className, type, to }) {
  return (
    <>
      {type === 'link' ? (
        <Link to={to}>
          <button
            onClick={onClick}
            className={classNames('btn', typeButton[type], className)}
          >
            {children}
          </button>
        </Link>
      ) : (
        <div
          onClick={onClick}
          className={classNames('btn', typeButton[type], className)}
        >
          {children}
        </div>
      )}
    </>
  )
}

Button.propTypes = {
  children: PropTypes.element,
  onClick: PropTypes.func,
  className: PropTypes.string,
  type: PropTypes.string,
  to: PropTypes.string,
}

export default Button
