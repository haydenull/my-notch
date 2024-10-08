import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import './App.css'
import reactLogo from './assets/react.svg'
import viteLogo from '/electron-vite.animate.svg'

function App() {
  const [count, setCount] = useState(0)
  const navigate = useNavigate()
  return (
    <>
      <button onClick={() => navigate('/notch')}>Go to Notch</button>
      <div className="flex justify-center">
        <a href="https://electron-vite.github.io" target="_blank" rel="noreferrer">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>count is {count}</button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">Click on the Vite and React logos to learn more</p>
    </>
  )
}

export default App
