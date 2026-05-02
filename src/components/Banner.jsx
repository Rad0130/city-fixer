import React, { useState, useEffect } from 'react';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import banner1 from '../assets/banner1.png';
import banner2 from '../assets/banner2.png';
import banner3 from '../assets/banner3.png';
import city1 from '../assets/city1.png';
import city2 from '../assets/city2.png';
import city3 from '../assets/city3.png';
import { Carousel } from 'react-responsive-carousel';
import { Link } from 'react-router';
import useAuth from '../Hooks/useAuth';

const Banner = () => {
  const [carouselHeight, setCarouselHeight] = useState('500px');
  const { user } = useAuth();

  useEffect(() => {
    const updateHeight = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setCarouselHeight('200px'); // Mobile small
      } else if (width < 768) {
        setCarouselHeight('250px'); // Mobile medium
      } else if (width < 1024) {
        setCarouselHeight('350px'); // Tablet
      } else if (width < 1280) {
        setCarouselHeight('450px'); // Small desktop
      } else {
        setCarouselHeight('550px'); // Large desktop
      }
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  // Banner content for each slide
  const slides = [
    {
      image: city1,
      title: "Report Civic Issues",
      subtitle: "Potholes, broken lights, garbage dumping — report any civic problem in your neighborhood",
      buttonText: "Report Now",
      buttonLink: "/reportIssue",
      position: "left"
    },
    {
      image: city2,
      title: "Track Your Issues",
      subtitle: "Get real-time updates with unique tracking IDs. Know exactly where your report stands.",
      buttonText: "Track Issues",
      buttonLink: "/allissues",
      position: "right"
    },
    {
      image: city3,
      title: "Join Our Community",
      subtitle: "Together we can make our city cleaner, safer, and better for everyone.",
      buttonText: "Join Now",
      buttonLink: "/register",
      position: "center"
    },
    {
      image: banner1,
      title: "Make a Difference",
      subtitle: "Your voice matters! Report issues and help improve your community.",
      buttonText: "Get Started",
      buttonLink: user ? "/dashboard" : "/register",
      position: "left"
    },
    {
      image: banner2,
      title: "Premium Benefits",
      subtitle: "Get unlimited reports, priority support, and early access to new features.",
      buttonText: "Learn More",
      buttonLink: "/dashboard/profile",
      position: "right"
    },
    {
      image: banner3,
      title: "Be the Change",
      subtitle: "Every report helps build a better city. Start making a difference today!",
      buttonText: "Report Issue",
      buttonLink: "/reportIssue",
      position: "center"
    }
  ];

  return (
    <div style={{ marginTop: '64px' }}>
      <Carousel 
        autoPlay={true} 
        infiniteLoop={true} 
        showThumbs={false} 
        showStatus={false}
        swipeable={true}
        dynamicHeight={false}
        interval={5000}
        transitionTime={500}
      >
        {slides.map((slide, index) => (
          <div key={index} style={{ position: 'relative', height: carouselHeight }}>
            <img 
              src={slide.image} 
              alt={slide.title}
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover',
                objectPosition: 'center'
              }} 
            />
            {/* Overlay Gradient */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(135deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 100%)',
            }} />
            
            {/* Text Content */}
            <div style={{
              position: 'absolute',
              top: '50%',
              transform: 'translateY(-50%)',
              left: slide.position === 'left' ? '10%' : slide.position === 'right' ? 'auto' : '50%',
              right: slide.position === 'right' ? '10%' : 'auto',
              textAlign: slide.position === 'center' ? 'center' : slide.position === 'left' ? 'left' : 'right',
              maxWidth: '500px',
              width: '90%',
              color: '#fff',
              ...(slide.position === 'center' && { transform: 'translate(-50%, -50%)', left: '50%' }),
              ...(slide.position === 'right' && { right: '10%', left: 'auto' }),
            }}>
              <h1 style={{
                fontSize: 'clamp(1.2rem, 5vw, 2.5rem)',
                fontWeight: 800,
                marginBottom: '0.5rem',
                fontFamily: "'Syne', sans-serif",
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
              }}>
                {slide.title}
              </h1>
              <p style={{
                fontSize: 'clamp(0.75rem, 3vw, 1rem)',
                marginBottom: '1rem',
                lineHeight: 1.5,
                textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                opacity: 0.95,
              }}>
                {slide.subtitle}
              </p>
              <Link to={slide.buttonLink}>
                <button style={{
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  border: 'none',
                  borderRadius: '999px',
                  padding: 'clamp(0.5rem, 2vw, 0.8rem) clamp(1rem, 3vw, 2rem)',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: 'clamp(0.75rem, 2.5vw, 0.9rem)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 0 20px rgba(99,102,241,0.4)',
                  fontFamily: "'DM Sans', sans-serif",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 0 30px rgba(99,102,241,0.6)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 0 20px rgba(99,102,241,0.4)';
                }}>
                  {slide.buttonText} →
                </button>
              </Link>
            </div>
          </div>
        ))}
      </Carousel>

      <style>
        {`
          /* Responsive carousel container */
          .carousel-root {
            width: 100%;
          }
          
          .carousel .slide {
            background: #0a0a1a;
          }
          
          .carousel .control-dots .dot {
            background: rgba(255,255,255,0.5);
            box-shadow: none;
            width: 8px;
            height: 8px;
            margin: 0 4px;
          }
          
          .carousel .control-dots .dot.selected {
            background: #6366f1;
            width: 20px;
            border-radius: 10px;
          }
          
          .carousel .control-prev.control-arrow:before,
          .carousel .control-next.control-arrow:before {
            border: solid rgba(255,255,255,0.8);
            border-width: 0 2px 2px 0;
            display: inline-block;
            padding: 5px;
          }
          
          .carousel .control-prev.control-arrow:hover,
          .carousel .control-next.control-arrow:hover {
            background: rgba(0,0,0,0.2);
          }
          
          /* Hide arrows on mobile */
          @media (max-width: 768px) {
            .carousel .control-prev.control-arrow,
            .carousel .control-next.control-arrow {
              display: none;
            }
          }
          
          /* Adjust text position on mobile */
          @media (max-width: 640px) {
            .carousel .control-dots {
              bottom: 10px;
            }
            .carousel .control-dots .dot {
              width: 6px;
              height: 6px;
              margin: 0 3px;
            }
            .carousel .control-dots .dot.selected {
              width: 16px;
            }
          }
        `}
      </style>
    </div>
  );
};

export default Banner;