import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Navbar from './section/navbar' 
import Hero from './section/hero'
import Service from './section/service'
import NavbarDP from './section/NavbarDP'
import HeroDp from './section/HeroDP'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <div className='w-screen min-h-screen p-0 m-0'>
      <NavbarDP></NavbarDP>
      <HeroDp></HeroDp>

      {/* <Navbar></Navbar> */}

      {/* <Hero></Hero> */}
      {/* <Service/> */}
      
      <section className='min-h-screen'></section>
      <section className='min-h-screen'></section>
      <section className='min-h-screen'></section>
    </div>
    </>
  )
}

export default App
