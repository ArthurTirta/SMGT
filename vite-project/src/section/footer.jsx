import {kontak} from "../constant/index.js"

function Contact(){
return(
    <section id="contact" className="min-h-fit overflow-hidden bg-primary rounded-t-3xl flex flex-col gap-10 ">
        <h1 className="text-white text-5xl font-light px-10 pt-10">Contact Me</h1>
        <h1 className="text-white text-2xl font-light px-10 pt-10">Stay updated with our latest news and events</h1>

        {kontak.map((medsos,medsosIndex)=>(
            <div className="mb-5" key={medsosIndex}>
                <h1 className="text-white text-4xl font-light px-10">{medsos.name}</h1>
                <div className="w-full h-1 bg-white "/>
                <a className="flex items-center mt-3 px-10" href={medsos.href}>
                <img className="mr-10" src={medsos.gambar} alt="" />
                <h3 className="text-white text-2xl font-light">{medsos.title}</h3>
                </a>
            </div>
        ))}
    </section>
)
}export default Contact