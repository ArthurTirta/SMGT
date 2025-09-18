export default function HeroDP() {
  return (
    <section className="h-screen w-screen ">
        <div className="bg-red-900 flex w-full h-4/6">
        <img src="../src/assets/any.jpg" className=" w-full object-cover" alt="" />
        
        </div>
        <div className="flex flex-row justify-around bg-primary items-center h-2/6 p-10">
            <p className="w-1/2 font-jersey text-5xl flex flex-col"> 
            <span> Welcome to Our</span>
            <span> Children's Ministry</span>
            <span> Adventure</span></p> 
            <div className="flex flex-col w-1/2 font-jersey text-xl"> Join us as we explore the joy of faith through fun and engaging activities designed just for kids. Our mission is to nurture young hearts and minds in a loving Christian environment.
            <div className="flex flex-row gap-5 mt-5">

             <button type="button" className="bg-black w-20 text-white" >Join</button>   
             <button type="button" className="border-2 w-40">Learn More</button>   
            </div>
                </div> 

        </div>
        <div></div>

    </section>
  )
}