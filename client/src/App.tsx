import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import axios from 'axios'

function App() {
  const [clientCount, setClientCount] = useState(0)
  const [serverCount, setServerCount] = useState(0)

  useEffect(()=>{
    // fetch count when load
    axios.get('api/count').then(res=>{
      setServerCount(_=>res.data.count)
    })
  },[])

  function addServerCount() {
    // add count
    axios.post('/api/count',{count:1}).then(res=>{
      setServerCount(_=>res.data.count)
    })
  }

  return (
    <div className="App">
      <div style={{
      display:"flex",
      justifyContent: "center",
      alignItems:"center",
      }}>
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo" alt="Vite logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
        <a href="https://expressjs.com" target="_blank" style={{
          color:"white", 
          font: "3em sans-serif",
        }}>
          <div className="express">Express</div>
        </a>
      </div>
      <h1>Vite + React + Express</h1>
      <div className="card">
        <button onClick={() => setClientCount((count) => count + 1)}>
          client count is {clientCount}
        </button>
        <button onClick={addServerCount}>
          server count is {serverCount}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite, React, or Express logos to learn more
      </p>
    </div>
  )
}

export default App
