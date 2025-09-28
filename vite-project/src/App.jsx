import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Navbar from './section/trash/navbar' 
import Hero from './section/trash/hero'
import Service from './section/service'
import NavbarDP from './section/NavbarDP'
import HeroDp from './section/HeroDP'
import Vision from './section/vision'
import ChatInterface from './section/ChatInterface'
import Classes from './section/classes'
import Photo from './section/Photogallery'
function App() {
  return (
    <>
    <div className='w-screen min-h-screen p-0 m-0'>
      <NavbarDP></NavbarDP>
      <HeroDp></HeroDp>
      <Vision></Vision>
      <Classes></Classes>
      <ChatInterface />
      <Photo></Photo>

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
