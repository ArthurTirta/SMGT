import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const AutoScrollGallery = () => {
  const column1Ref = useRef(null);
  const column2Ref = useRef(null);
  const column3Ref = useRef(null);
  const column4Ref = useRef(null);

  // Sample photos - you can replace these with your actual image URLs
  const photos = [
    "../src/assets/any.jpg",
    "../src/assets/aa.jpg",
    "../src/assets/bb.jpg",
    "../src/assets/cc.jpg",
    "../src/assets/dd.jpg",
    "../src/assets/Champ.jpg",
    "../src/assets/Indria.jpg",
    "../src/assets/kecil.jpg",
    "../src/assets/remaja.jpg",
    "../src/assets/xbesar.jpg",
    'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=500&fit=crop',
 
  ];

  // Distribute photos into 4 columns
  const column1Photos = photos.slice(0, 3).concat(photos.slice(0, 3)); // Duplicate for seamless loop
  const column2Photos = photos.slice(3, 6).concat(photos.slice(3, 6));
  const column3Photos = photos.slice(6, 9).concat(photos.slice(6, 9));
  const column4Photos = photos.slice(9, 12).concat(photos.slice(9, 12));

  useEffect(() => {
    const columns = [
      { ref: column1Ref, direction: -1 }, // Down
      { ref: column2Ref, direction: 1 },  // Up
      { ref: column3Ref, direction: -1 }, // Down
      { ref: column4Ref, direction: 1 },  // Up
    ];

    columns.forEach(({ ref, direction }, index) => {
      if (ref.current) {
        const columnHeight = ref.current.scrollHeight / 2; // Half because we duplicated images
        
        gsap.set(ref.current, { y: direction === -1 ? 0 : -columnHeight });
        
        gsap.to(ref.current, {
          y: direction === -1 ? -columnHeight : 0,
          duration: 15 + index * 2, // Different speeds for each column
          ease: 'none',
          repeat: -1,
        });
      }
    });

    // Pause on hover
    const handleMouseEnter = (ref) => {
      if (ref.current) {
        gsap.to(ref.current, { timeScale: 0, duration: 0.3 });
      }
    };

    const handleMouseLeave = (ref) => {
      if (ref.current) {
        gsap.to(ref.current, { timeScale: 1, duration: 0.3 });
      }
    };

    columns.forEach(({ ref }) => {
      const element = ref.current?.parentElement;
      if (element) {
        element.addEventListener('mouseenter', () => handleMouseEnter(ref));
        element.addEventListener('mouseleave', () => handleMouseLeave(ref));
      }
    });

    return () => {
      columns.forEach(({ ref }) => {
        const element = ref.current?.parentElement;
        if (element) {
          element.removeEventListener('mouseenter', () => handleMouseEnter(ref));
          element.removeEventListener('mouseleave', () => handleMouseLeave(ref));
        }
      });
    };
  }, []);

  const renderColumn = (photos, ref, columnIndex) => (
    <div key={columnIndex} className="relative h-full overflow-hidden rounded-lg">
      <div ref={ref} className="flex flex-col gap-4">
        {photos.map((photo, index) => (
          <div
            key={`${columnIndex}-${index}`}
            className="relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
          >
            <img
              src={photo}
              alt={`Gallery image ${index + 1}`}
              className="w-full h-auto object-cover hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-primary py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            Photo Gallery
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Explore our vibrant moments through engaging activities!
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 h-[800px]">
          {[column1Photos, column2Photos, column3Photos, column4Photos].map((photos, index) =>
            renderColumn(
              photos,
              [column1Ref, column2Ref, column3Ref, column4Ref][index],
              index
            )
          )}
        </div>

        {/* Footer Text */}
        <div className="text-center mt-12">
          <p className="text-gray-400 text-lg">
            Hover over columns to pause the animation
          </p>
        </div>
      </div>
    </div>
  );
};

export default AutoScrollGallery;