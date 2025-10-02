import {kelas} from "../constant/index.js"
import { IoIosArrowForward } from "react-icons/io";

export default function Classes(){

    return(
        <section id="classes" className="bg-primary min-h-screen min-w-screen flex-col justify-center items-center text-black gap-10 flex p-3">
            <p> CLASSES</p>
            <p className="text-5xl"> Engaging Ministry Classes for All Ages</p>
            <p className="text-xl">Our ministry offers a variety of classes designed to nurture children's spiritual growth. Each program is tailored to meet the unique needs of different age groups.</p>

            <div className="flex flex-col md:flex-row gap-10">
                {kelas.map((bagian,index) => (
                    <div key={index} className="">
                        <img src={bagian.image} alt="" className="w-full h-64 object-cover rounded-lg"/>
                        <p className="text-lg md:text-2xl">{bagian.name}</p>
                        <p className="text-sm md:text-xl">{bagian.description}</p>
                        
                    </div>
                ) )}

            </div>
            <div className="flex flex-row w-full gap-20 justify-center items-center">

                <button className="border-2 w-20 h-10 lg:hover:scale-120"> Learn More</button>
                <div className="flex flex-row gap-2 justify-center items-center lg:hover:scale-120">
                    <button className="border-black"> Join  </button>
                <IoIosArrowForward></IoIosArrowForward>
            </div>
                </div>
        </section>
    )
}