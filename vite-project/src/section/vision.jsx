import { IoIosArrowForward } from "react-icons/io";

export default function Vision(){



    return(
        <section id="vision" className="min-h-screen min-w-screen flex justify-center items-center">
            <div className="w-4/5 flex flex-row gap-10 ">
                <div className="flex flex-col gap-10 justify-center items-start">
                    <p className="text-5xl"> Vision</p>  
                    <p className="text-2xl"> Nurturing Young Hearts in Christ</p>  
                    <p className="text-xl"> Our mission is to inspire children through the teachings of Jesus Christ. We aim to foster a loving and supportive environment that encourages spiritual growth and lifelong faith.</p>  
                    <div className="flex flex-row w-full gap-20 ">

                        <button className="border-2 w-20 h-10 lg:hover:scale-120"> Learn More</button>
                        <div className="flex flex-row gap-2 justify-center items-center lg:hover:scale-120">
                            <button className="border-black"> Join  </button>
                            <IoIosArrowForward></IoIosArrowForward>
                        </div>
                    </div>
                </div>
                <img src="src\assets\Champ.jpg" className="w-1/3 md:w-2/3 "></img>
            </div>
        </section>
    )
}