import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { TextHoverEffect } from "../../components/ui/text-hover-effeect"
import { useRef } from "react"
import { ScrollTrigger } from "gsap/all"

gsap.registerPlugin(ScrollTrigger)

function Hero(){
    const slide= useRef(null)

useGSAP(()=>{
    gsap.to(slide.current,{
        xPercent : 30,
        scrollTrigger:{
            target  :slide.current,
            scrub   : 1
        },
    })
    gsap.from("#Welcome",{
        autoAlpha:0,
        yPercent:50,
        duration:1,
        ease: "power3.out"

    })
})
    return(
        <>
        <section className="border-2 min-h-screen min-w-screen bg-pink-400 flex flex-col  justify-between ">
            <TextHoverEffect text={"SMGT"}/>
            
            <h1 id="Welcome" className="text-5xl font-light ml-5"> Welcome to Website SMGT Jemaat Pniel Manggar  </h1>
             <div className="bg-white min-w-screen h-15 ">
                <div id="tes" ref={slide} className=" ml-10 flex">
                    {["Cheerfull", "Kindnes", "Joyful"].map((bagian, index)=>(
                        <span className="flex flex-row items-center text-3xl font-light gap-10" key={index} > 
                        <div className="text-xl w-10 h-2 rounded-2xl bg-gold"></div>
                        {bagian} 
                        <div className="text-xl w-10 h-2 rounded-2xl bg-gold"></div>
                        </span>

                ))}
                </div>
             </div>
        </section>

        </>
    )
}export default Hero