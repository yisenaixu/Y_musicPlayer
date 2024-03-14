import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { Suspense } from 'react'
import { BrowserRouter } from 'react-router-dom'
import 'virtual:svg-icons-register'
import './index.css'
import './assets/css/global.css'
import Toast from './components/Toast.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Suspense fallback={<div>loading...</div>}>
        <App />
      </Suspense>
      <Toast />
    </BrowserRouter>
  </React.StrictMode>,
)
