import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function PhotoGallery() {
  const column1Ref = useRef(null);
  const column2Ref = useRef(null);
  const column3Ref = useRef(null);
  const tween1Ref = useRef(null);
  const tween2Ref = useRef(null);
  const tween3Ref = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  // Sample images - ganti dengan gambar Anda
  const column1Images = [
    '../src/assets/aa.jpg',
    '../src/assets/bb.jpg',
    '../src/assets/cc.jpg',
    '../src/assets/dd.jpg',
  ];

  const column2Images = [
    '../src/assets/dd.jpg',
    '../src/assets/any.jpg',
    '../src/assets/Champ.jpg',
     '../src/assets/Indria.jpg',
  ];

  const column3Images = [
    '../src/assets/Indria.jpg',
    '../src/assets/kecil.jpg',
    '../src/assets/remaja.jpg',
    '../src/assets/xbesar.jpg',
     '../src/assets/Champ.jpg',
  ];


  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) return; // Disable animation on mobile

    const animateColumn = (ref, tweenRef, direction, duration) => {
      const column = ref.current;
      if (!column || !column.children[0]) return;
      
      const imageHeight = column.children[0].offsetHeight + 16; // +gap
      const totalHeight = imageHeight * (column.children.length / 2);

      if (direction === 'down') {
        // Animasi turun
        tweenRef.current = gsap.to(column, {
          y: -totalHeight,
          duration: duration,
          ease: 'none',
          repeat: -1,
          modifiers: {
            y: (y) => {
              const val = parseFloat(y);
              return `${val % totalHeight}px`;
            }
          }
        });
      } else {
        // Animasi naik - mulai dari posisi bawah
        gsap.set(column, { y: -totalHeight });
        
        tweenRef.current = gsap.to(column, {
          y: 0,
          duration: duration,
          ease: 'none',
          repeat: -1,
          modifiers: {
            y: (y) => {
              const val = parseFloat(y);
              if (val >= 0) {
                return `${-totalHeight}px`;
              }
              return `${val}px`;
            }
          }
        });
      }
    };

    // Kolom 1: turun (lambat)
    animateColumn(column1Ref, tween1Ref, 'down', 25);
    
    // Kolom 2: naik (sedang)
    animateColumn(column2Ref, tween2Ref, 'up', 20);
    
    // Kolom 3: turun (cepat)
    animateColumn(column3Ref, tween3Ref, 'down', 18);

    return () => {
      tween1Ref.current?.kill();
      tween2Ref.current?.kill();
      tween3Ref.current?.kill();
    };
  }, [isMobile]);

  const handleMouseEnter = (tweenRef) => {
    if (isMobile) return;
    gsap.to(tweenRef.current, { timeScale: 0.3, duration: 0.5 });
  };

  const handleMouseLeave = (tweenRef) => {
    if (isMobile) return;
    gsap.to(tweenRef.current, { timeScale: 1, duration: 0.5 });
  };

  const renderColumn = (images, ref, tweenRef, shouldAnimate = true) => (
    <div 
      className="flex-1 overflow-hidden md:h-full"
      onMouseEnter={() => handleMouseEnter(tweenRef)}
      onMouseLeave={() => handleMouseLeave(tweenRef)}
    >
      <div ref={ref} className="flex flex-col gap-3 md:gap-4">
        {/* Mobile: render sekali saja, Desktop: render 2x untuk loop */}
        {(isMobile ? images : [...images, ...images]).map((img, index) => (
          <div 
            key={index}
            className="relative rounded-lg md:rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300"
          >
            <img 
              src={img}
              alt={`Gallery ${index}`}
              className="w-full h-48 sm:h-56 md:h-80 object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white py-8 md:py-16">
      {/* Header */}
      <div className="text-center mb-6 md:mb-12 px-4">
        <h1 className="text-3xl md:text-5xl font-bold mb-2 md:mb-4">Photo Gallery</h1>
        <p className="text-sm md:text-lg text-gray-600">
          Explore our vibrant moments through engaging activities!
        </p>
      </div>

      {/* Gallery Grid */}
      <div className="max-w-7xl mx-auto px-3 md:px-4">
        {isMobile ? (
          // Mobile: Grid 2 kolom statis
          <div className="grid grid-cols-2 gap-3">
            {[...column1Images, ...column2Images, ...column3Images].map((img, index) => (
              <div 
                key={index}
                className="relative rounded-lg overflow-hidden shadow-lg"
              >
                <img 
                  src={img}
                  alt={`Gallery ${index}`}
                  className="w-full h-48 object-cover"
                />
              </div>
            ))}
          </div>
        ) : (
          // Desktop: 3 kolom dengan scroll animation
          <div className="flex gap-6 h-[600px]">
            {renderColumn(column1Images, column1Ref, tween1Ref)}
            {renderColumn(column2Images, column2Ref, tween2Ref)}
            {renderColumn(column3Images, column3Ref, tween3Ref)}
          </div>
        )}
      </div>

    </div>
  );
}