import { useEffect, useState, useRef } from "react"
import {socials} from "../../constant"
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';


function Navbar() {
    const navRef = useRef(null);  
    const linksRef = useRef([]);  
    // const DlinksRef = useRef([]);  
    const contactRef = useRef(null);  
    const emailRef = useRef(null);  
    const topLineRef = useRef(null);  
    const bottomLineRef = useRef(null);  
    const tl = useRef(null);
    const tlf = useRef(null);
    const iconTL = useRef(null);
    const [isOpen, setIsOpen] = useState(false);
    const [showBurger, SetShowBurger] = useState(true);
    
useEffect(() => {
    let lastscrollY = window.scrollY;
    const handleScrollY =()=>{
        let nowscrollY = window.scrollY;
        SetShowBurger(nowscrollY < lastscrollY || lastscrollY < 10)
        // console.log(`last: ${lastscrollY}`)
        // console.log(`now : ${nowscrollY}`) debugging
        lastscrollY = nowscrollY
    }
    window.addEventListener("scroll", handleScrollY)
    return () => window.removeEventListener("scroll", handleScrollY) 
    })

    useGSAP(() => {
        gsap.set(navRef.current, {xPercent:100});
        gsap.set(linksRef.current, {
            x: 130,
            autoAlpha: 0
        });
        
        tlf.current = gsap.timeline({paused:true})
        .to (navRef.current, {xPercent:0})
        
        tl.current = gsap.timeline({paused:true})
        // .from (linksRef.current, {
        //     x: 130,
        //     // stagger: 0.3,
        //     autoAlpha: 0,
        //     ease: "power3.out"

        // })
        .to (linksRef.current, {
            x: 0,
            autoAlpha: 1,
            stagger: 0.1, 
            ease: "power3.out"
        })

        .from ([emailRef.current ,contactRef.current], {
            x: 130,
            stagger: 0.2,
            autoAlpha: 0,
            ease: "power3.out"

        },">+0.2")
        iconTL.current= gsap.timeline({paused:true})
            
    } )

    const toggleMenu = () => {
        if (isOpen){
            tl.current.reverse()
            tlf.current.reverse()
            iconTL.current.reverse()
        }else{
            tl.current.play()
            tlf.current.play()
            iconTL.current.play()
        }
        setIsOpen(!isOpen)
    }



return(
        <>
        <nav ref={navRef} className="flex flex-col justify-between z-index-50 bg-black fixed w-screen left-1/2 h-full px-10 py-10 text-white/50 md:w-1/2  ">
            <div 
            // ref={linksRef}
             id="pages" className="text-5xl md:text-6xl lg:text-7xl cursor-pointer">
            {["HOME","ABOUT","SERVICES","CONTACT"].map(
                (page,index) =>
                    <div key={index}
                ref={(el)=>(linksRef.current[index] = el)}
                className="hover:text-white transition-all duration-300"> {page}</div> 
            )}
            </div>


            <div id="email" ref={emailRef}>
                <h2> Email</h2>
                <p className="text-white font-light">Arthur Tirtajaya Jehuda</p>

            </div>
            <div id="social" className="" ref={contactRef}>
                <p>SOCIAL MEDIA</p>
                <div className="flex gap-5  "  >

                {socials.map( (socials ,index) => 
                <a  className="text-sm leading-loose tracking-widest uppercase hover:text-white transition-colors duration-300 " key ={index} href={socials.href}>{socials.name} </a>

                )}
                </div>
            </div>

        </nav>

        <div className="fixed z-60 flex flex-col items-center justify-center bg-black w-14 h-14 top-4 right-10 gap-1 rounded-full cursor-pointer" style={showBurger ? {clipPath: "circle(50% at 50% 50%)"}
        : {clipPath: "circle(0% at 50% 50%)"}}
         onClick={toggleMenu}
         >
                    <span ref={ topLineRef } className='block w-8 h-0.5 bg-white rounded-full origin-center'></span>
                    <span ref={ bottomLineRef } className='block w-8 h-0.5 bg-white rounded-full origin-center'></span>

        </div>
        </>
    )
}

export default Navbar