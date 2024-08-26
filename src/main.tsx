import React from 'react'
import ReactDOM from 'react-dom/client'
import { createHashRouter, RouterProvider } from 'react-router-dom'

import App from './App.tsx'
import './index.css'
import Notch from './notch/index.tsx'

const router = createHashRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/notch',
    element: <Notch />,
  },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)

// Use contextBridge
window.ipcRenderer.on('main-process-message', (_event, message) => {
  console.log(message)
})
