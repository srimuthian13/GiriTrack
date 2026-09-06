import { useState, useRef, useEffect } from 'react';
import { ArrowRight, Compass } from 'lucide-react';

const EARTH_TONES = ['#452829', '#233729', '#1E2836', '#3A231C'];

const mockGuides = [
  {
    id: 1,
    title: 'Taman Nasional Gede Pangrango',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
    description: 'Panduan lengkap pendakian via Cibodas, Putri, dan Selabintana.',
  },
  {
    id: 2,
    title: 'Gunung Prau via Patakbanteng',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
    description: 'Rute tercepat menuju golden sunrise terbaik se-Asia Tenggara.',
  },
  {
    id: 3,
    title: 'Gunung Merbabu via Suwanting',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    description: 'Menikmati padang sabana luas dengan latar belakang Gunung Merapi.',
  },
  {
    id: 4,
    title: 'Gunung Semeru (Mahameru)',
    image: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=800&q=80',
    description: 'Atap Pulau Jawa dengan keindahan Ranu Kumbolo dan Tanjakan Cinta.',
  },
  {
    id: 5,
    title: 'Gunung Rinjani, Lombok',
    image: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=800&q=80',
    description: 'Pesona Danau Segara Anak dan tantangan menaklukkan puncak 3.726 mdpl.',
  }
];

export default function GuideStackCards() {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 my-16 overflow-hidden py-12" ref={containerRef}>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-[#2B3542] dark:text-[#FAF3F3] flex items-center gap-2">
          <Compass className="w-6 h-6 text-[#DA7F8F]" />
          <span>Rekomendasi Panduan Jalur</span>
        </h2>
        <p className="text-xs text-[#6B7C8C] dark:text-[#A7BBC7] mt-1">
          Jelajahi berbagai gunung dengan panduan komprehensif kami.
        </p>
      </div>

      <div className="flex justify-center items-center h-[450px]">
        {mockGuides.map((guide, index) => {
          const isHovered = hoveredIndex === index;
          const isAnyHovered = hoveredIndex !== null;
          const cardBgColor = EARTH_TONES[index % EARTH_TONES.length];

          // Calculate dynamic overlap
          let transformStyle;
          if (isVisible) {
            // When visible, cards clump together
            const offset = (index - 2) * (isAnyHovered ? 40 : 60); // Spread out more if hovered
            transformStyle = `translateX(${offset}px)`;
          } else {
            // Spread out widely before scroll
            const offset = (index - 2) * 200;
            transformStyle = `translateX(${offset}px)`;
          }

          if (isHovered) {
             transformStyle += ' translateY(-32px) scale(1.05)';
          } else if (isAnyHovered) {
             transformStyle += ' scale(0.95)';
          }

          return (
            <div
              key={guide.id}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`absolute transition-all duration-500 ease-out cursor-pointer w-60 md:w-64 h-[420px] rounded-[2rem] overflow-hidden shadow-xl ${isHovered ? 'z-40 shadow-2xl' : 'z-10'} ${isAnyHovered && !isHovered ? 'brightness-90' : 'brightness-100'}`}
              style={{
                transform: transformStyle,
                marginLeft: index > 0 ? (isVisible ? (isAnyHovered ? '-20px' : '-40px') : '0px') : '0px',
              }}
            >
              <div className="flex flex-col h-full bg-white dark:bg-[#1C2129]">
                <img
                  src={guide.image}
                  alt={guide.title}
                  className="h-52 w-full object-cover rounded-t-[1.5rem]"
                />
                
                <div 
                  className="flex-1 p-5 flex flex-col justify-between text-white"
                  style={{ backgroundColor: cardBgColor }}
                >
                  <div>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-white/70 mb-2">
                      <Compass className="w-3.5 h-3.5 text-[#E8D1C5]" />
                      <span>Panduan Jalur</span>
                    </div>
                    <h3 className="font-bold text-lg leading-tight mb-2 line-clamp-2 drop-shadow-sm">{guide.title}</h3>
                    <p className="text-xs text-white/80 line-clamp-3">{guide.description}</p>
                  </div>

                  <button className={`mt-4 py-2 px-4 rounded-full border-2 text-xs font-bold flex items-center justify-center gap-2 transition-all duration-300 ${isHovered ? 'bg-white text-stone-900 border-white shadow-lg' : 'border-white/70 text-white bg-transparent'}`}>
                    <span>Jelajahi</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
