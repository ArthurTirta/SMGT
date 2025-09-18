export default function NavbarDP() {
return(
    <section className=" min-w-screen z-50 fixed top-0 left-0">
    {/* <nav id="desktop" className="flex flex-row justify-around p-3 bg-primary"> */}
    <nav id="desktop" className="flex flex-row justify-around p-3 bg-primary border-2">
        <div className="flex flex-row gap-10 font-jersey text-xl "> 
            <span>Logo</span>
            <span>Home Page</span>
            <span>About Us</span>
            <span>Clasess</span>
            <span>Event</span>

        </div>
        <div className="flex flex-row gap-5 w-1/5">
            <button type="button" className="border-2 w-1/2">Join</button> 
            <button type="button" className="bg-black text-white w-1/2">Play</button> 

        </div>



        
    </nav>
    

    </section>
)
}