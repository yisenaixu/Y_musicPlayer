import SvgIcon from '../components/SvgIcon'
import { useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import QRcode from 'qrcode'
import classNames from 'classnames'
import md5 from 'js-md5'
import { setCookies } from '../utils/auth'
import {
  generateQrcodeKey,
  generateQrcode,
  checkQrcode,
  loginByEmail,
  loginByPhone,
} from '../api/auth'
import { StoreContext } from '../context/storeContext'
import { rootStore } from '../store'
import { useNavigate } from 'react-router'
const InputPhone = ({
  countryCode,
  setCountryCode,
  phone,
  setPhone,
  password,
  setPassword,
}) => {
  const [inputFocus, setInputFocus] = useState(0)
  return (
    <>
      <div
        className={classNames(
          'container flex items-center justify-center rounded-lg h-10 w-80 p-2 mt-4',
          {
            'bg-secondary-bg-transparent': !inputFocus,
            'bg-primary-bg-transparent': inputFocus,
          },
        )}
      >
        <div className="svg mr-1 op1acity-35">
          <SvgIcon
            symbolId="mobile"
            width={'20px'}
            height={'20px'}
            color={inputFocus === 1 ? 'blue' : ''}
          />
        </div>
        <div className="input flex w-[85%]">
          <input
            type="text"
            placeholder="+86"
            value={countryCode}
            onChange={e => setCountryCode(e.target.value)}
            className="flex-[3] w-full text-xl font-semibold bg-transparent focus-visible:outline-none"
          />
          <input
            className={classNames(
              'flex-[12] w-full text-xl font-semibold bg-transparent focus-visible:outline-none',
              {
                'text-primary': inputFocus === 1,
              },
            )}
            placeholder="手机号"
            type="text"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            onFocus={() => setInputFocus(1)}
            onBlur={() => setInputFocus(0)}
          />
        </div>
      </div>
      <div
        className={classNames(
          'container flex items-center justify-center rounded-lg h-10 w-80 p-2 mt-4',
          {
            'bg-secondary-bg-transparent': !inputFocus,
            'bg-primary-bg-transparent': inputFocus,
          },
        )}
      >
        <div className="svg mr-1 op1acity-35">
          <SvgIcon
            symbolId="lock"
            width={'20px'}
            height={'20px'}
            color={inputFocus === 2 ? 'blue' : ''}
          />
        </div>
        <div className="input flex w-[85%]">
          <input
            className={classNames(
              'w-full text-xl font-semibold bg-transparent focus-visible:outline-none',
              {
                'text-primary': inputFocus === 2,
              },
            )}
            placeholder="密码"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onFocus={() => setInputFocus(2)}
            onBlur={() => setInputFocus(0)}
          />
        </div>
      </div>
    </>
  )
}

const InputEmail = ({ email, setEmail, password, setPassword }) => {
  const [inputFocus, setInputFocus] = useState(0)
  return (
    <>
      <div
        className={classNames(
          'container flex items-center justify-center rounded-lg h-10 w-80 p-2 mt-4',
          {
            'bg-secondary-bg-transparent': !inputFocus,
            'bg-primary-bg-transparent': inputFocus,
          },
        )}
      >
        <div className="svg mr-1 op1acity-35">
          <SvgIcon
            symbolId="mail"
            width={'20px'}
            height={'20px'}
            color={inputFocus === 1 ? 'blue' : ''}
          />
        </div>
        <div className="input flex w-[85%]">
          <input
            className={classNames(
              'w-full text-xl font-semibold bg-transparent focus-visible:outline-none',
              {
                'text-primary': inputFocus === 1,
              },
            )}
            placeholder="邮箱"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onFocus={() => setInputFocus(1)}
            onBlur={() => setInputFocus(0)}
          />
        </div>
      </div>
      <div
        className={classNames(
          'container flex items-center justify-center rounded-lg h-10 w-80 p-2 mt-4',
          {
            'bg-secondary-bg-transparent': !inputFocus,
            'bg-primary-bg-transparent': inputFocus,
          },
        )}
      >
        <div className="svg mr-1 op1acity-35">
          <SvgIcon
            symbolId="lock"
            width={'20px'}
            height={'20px'}
            color={inputFocus === 2 ? 'blue' : ''}
          />
        </div>
        <div className="input flex w-[85%]">
          <input
            className={classNames(
              'w-full text-xl font-semibold bg-transparent focus-visible:outline-none',
              {
                'text-primary': inputFocus === 2,
              },
            )}
            placeholder="密码"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onFocus={() => setInputFocus(2)}
            onBlur={() => setInputFocus(0)}
          />
        </div>
      </div>
    </>
  )
}

const LoginQrcode = ({ handleLoginResponse }) => {
  const [qrcodeSvg, setQrcodeSvg] = useState()
  const [qrcodeInformation, setQrcodeInformation] = useState()
  useEffect(() => {
    getQrcode()
    return () => {
      clearInterval(qrcodeCheckInterval)
    }
  }, [])
  let qrcodeKey
  let qrcodeCheckInterval
  const getQrcode = () => {
    generateQrcodeKey().then(res => {
      console.log(res)
      qrcodeKey = res.data.unikey
      generateQrcode({ key: qrcodeKey }).then(res => {
        console.log(res.data.qrurl)
        QRcode.toString(res.data.qrurl, {
          width: 192,
          margin: 0,
          color: {
            dark: '#335eea',
            light: '#00000000',
          },
          type: 'svg',
        })
          .then(svg => {
            // dataURI data:<mediaType>;编码,data
            let qrcodeSvg = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
            setQrcodeSvg(qrcodeSvg)
          })
          .catch(err => {
            Promise.reject(err)
          })
      })
    })
    checkQrCodeLogin()
  }
  const checkQrCodeLogin = () => {
    clearInterval(qrcodeCheckInterval)
    qrcodeCheckInterval = setInterval(() => {
      if (qrcodeKey === '') return
      checkQrcode(qrcodeKey).then(res => {
        if (res.code === 800) {
          getQrcode()
          setQrcodeInformation('二维码已失效,请重新扫码')
        } else if (res.code === 802) {
          setQrcodeInformation('扫描成功,请在手机上确认登陆')
        } else if (res.code === 801) {
          setQrcodeInformation('打开网易云app扫码登陆')
        } else if (res.code === 803) {
          clearInterval(qrcodeCheckInterval)
          setQrcodeInformation('登录成功,请稍等...')
          console.log(res)
          //修改res内容
          res.code = 200
          res.cookie = res.cookie.replaceAll(' HTTPOnly', '')
          console.log(res.cookie)
          handleLoginResponse(res)
        }
      })
    }, 1000)
  }
  return (
    <div className="input-box qr-code">
      {qrcodeSvg && (
        <div className="qr-code-container">
          <img src={qrcodeSvg} alt="" />
        </div>
      )}
      <div className="qr-code-info"> {qrcodeInformation} </div>
    </div>
  )
}

function LoginAccount() {
  const [mode, setMode] = useState('qrcode')
  const [phone, setPhone] = useState('')
  const [countryCode, setCountryCode] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const store = useContext(StoreContext)
  console.debug(store.userStore.userData)
  const login = () => {
    if (mode === 'phone') {
      console.log(phone, password)
      loginByPhone({
        phone: phone.replace(/\s/g, ''),
        password: 'fakePassword',
        md5_password: md5(password),
      }).then(
        res => {
          console.log(res)
          handleLoginResponse(res)
        },
        err => {
          Promise.reject(err)
        },
      )
    } else {
      console.log(email, password)
      loginByEmail({
        email: email.replace(/\s/g, ''),
        password: password,
      }).then(
        res => {
          console.log(res)
          handleLoginResponse(res)
        },
        err => {
          Promise.reject(err)
        },
      )
    }
  }
  const handleLoginResponse = async res => {
    if (!res) {
      return
    }
    if (res.code === 200) {
      console.debug(res)
      setCookies(res.cookie)
      await rootStore.userStore.fetchUserProfile()
      await rootStore.userStore.fetchAllLiked()
      navigate('/library')
    }
  }
  return (
    <div className="login flex justify-center items-center pt-32">
      <div className="login-container flex flex-col items-center justify-evenly">
        <SvgIcon symbolId={'heart'} width={'100px'} height={'100px'} />
        <div className="title my-12 text-2xl font-black">登录网易云账号</div>
        {mode !== 'qrcode' && (
          <div className="input_box">
            {mode === 'phone' && (
              <InputPhone
                phone={phone}
                setPhone={setPhone}
                password={password}
                setPassword={setPassword}
                countryCode={countryCode}
                setCountryCode={setCountryCode}
              />
            )}
            {mode === 'email' && (
              <InputEmail
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
              />
            )}
            <button
              className="w-80 h-10 flex items-center justify-center mt-8 p-2 text-xl text-primary
                bg-primary-bg-transparent font-semibold cursor-pointer transition-all duration-300 hover:scale-105"
              onClick={login}
            >
              登录
            </button>
          </div>
        )}
        {mode === 'qrcode' && (
          <LoginQrcode handleLoginResponse={handleLoginResponse} />
        )}
        <div className="change-login mt-6 text-sm font-extralight">
          {mode !== 'phone' && (
            <span
              className="cursor-pointer px-1"
              onClick={() => setMode('phone')}
            >
              手机号登陆
            </span>
          )}
          {mode === 'qrcode' && <span className="cursor-pointer px-1">|</span>}
          {mode !== 'email' && (
            <span
              className="cursor-pointer px-1"
              onClick={() => setMode('email')}
            >
              邮箱登陆
            </span>
          )}
          {mode !== 'phone' && <span className="cursor-pointer px-1">|</span>}
          {mode !== 'qrcode' && (
            <span
              className="cursor-pointer px-1"
              onClick={() => setMode('qrcode')}
            >
              二维码登陆
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

InputPhone.propTypes = {
  countryCode: PropTypes.string,
  setCountryCode: PropTypes.func,
  phone: PropTypes.string,
  setPhone: PropTypes.func,
  password: PropTypes.string,
  setPassword: PropTypes.func,
}

InputEmail.propTypes = {
  email: PropTypes.string,
  setEmail: PropTypes.func,
  password: PropTypes.string,
  setPassword: PropTypes.func,
}

LoginQrcode.propTypes = {
  handleLoginResponse: PropTypes.func,
}
export default LoginAccount
