import { useState } from 'react'
import Carousel from './components/Carousel'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Carousel />
    </>
  )
}

export default App
