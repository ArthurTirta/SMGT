import xbesar from '../assets/bb.jpg'
export default function Banner() {
  return (
    <div className="relative h-100 w-full overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img 
          src= {xbesar}
          alt="Background"
          className="w-full h-full object-cover"
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black opacity-45"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
          Exciting Games Coming Soon!
        </h1>
        
        <p className="text-lg md:text-xl text-white mb-8 max-w-2xl">
          Stay tuned for more fun and engaging games designed just for you and your friends!
        </p>

        {/* Buttons */}
        <div className="flex gap-4">
          {/* <button className="bg-white text-black px-8 py-3 rounded font-semibold hover:bg-gray-100 transition">
            Play
          </button>
           */}
          <button className="bg-transparent border-2 border-white text-white px-8 py-3 rounded font-semibold hover:bg-white hover:text-black text-3xl transition">
            Play
          </button>
        </div>
      </div>
    </div>
  );
}