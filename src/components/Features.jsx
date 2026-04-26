import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectCoverflow } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const features = [
  {
    icon: (
      <svg width="32" height="32" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    gradient: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
    glow: 'rgba(99,102,241,0.35)',
    title: 'Real-time Tracking',
    description: 'Track your reported issues from submission to resolution with live status updates and a full audit timeline.',
  },
  {
    icon: (
      <svg width="32" height="32" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    gradient: 'linear-gradient(135deg, #10b981, #06b6d4)',
    glow: 'rgba(16,185,129,0.35)',
    title: 'Fast Response',
    description: 'Priority routing ensures critical issues get immediate attention from the relevant city departments.',
  },
  {
    icon: (
      <svg width="32" height="32" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    gradient: 'linear-gradient(135deg, #f97316, #ef4444)',
    glow: 'rgba(249,115,22,0.35)',
    title: 'Community Support',
    description: 'Upvote issues to show importance and collaborate with neighbours to push critical problems to the top.',
  },
  {
    icon: (
      <svg width="32" height="32" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    gradient: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
    glow: 'rgba(139,92,246,0.35)',
    title: 'Data Insights',
    description: 'Comprehensive analytics help city officials make data-driven decisions for smarter infrastructure planning.',
  },
  {
    icon: (
      <svg width="32" height="32" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M4 6h16M4 10h16M4 14h16M4 18h16" />
      </svg>
    ),
    gradient: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
    glow: 'rgba(6,182,212,0.35)',
    title: 'Smart Categorisation',
    description: 'Automatically categorises reported problems to ensure faster routing to the right city departments.',
  },
  {
    icon: (
      <svg width="32" height="32" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M12 11c1.657 0 3-1.343 3-3S13.657 5 12 5 9 6.343 9 8s1.343 3 3 3zm0 0c-3.314 0-6 1.79-6 4v2h12v-2c0-2.21-2.686-4-6-4z" />
      </svg>
    ),
    gradient: 'linear-gradient(135deg, #10b981, #84cc16)',
    glow: 'rgba(16,185,129,0.35)',
    title: 'Verified Authority Updates',
    description: 'Receive transparent progress updates directly from verified city officials for full accountability.',
  },
];

const Features = () => {
  const [breakpoint, setBreakpoint] = useState('desktop'); // 'mobile' | 'tablet' | 'desktop'

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 640) setBreakpoint('mobile');
      else if (w < 1024) setBreakpoint('tablet');
      else setBreakpoint('desktop');
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const isMobile = breakpoint === 'mobile';
  const isTablet = breakpoint === 'tablet';
  const isDesktop = breakpoint === 'desktop';

  // ── Swiper config per breakpoint ─────────────────────────────────────────
  // On mobile/tablet: plain slide, 1 card, NO coverflow (no rotation, no side cards)
  // On desktop: coverflow with 3 cards
  const commonAutoplay = { delay: 3500, disableOnInteraction: false, pauseOnMouseEnter: true };
  const commonPagination = { clickable: true, dynamicBullets: true };

  const swiperProps = isDesktop
    ? {
        modules: [EffectCoverflow, Autoplay, Pagination, Navigation],
        effect: 'coverflow',
        slidesPerView: 3,
        spaceBetween: 24,
        centeredSlides: true,
        loop: true,
        grabCursor: true,
        coverflowEffect: { rotate: 35, stretch: 0, depth: 120, modifier: 1, slideShadows: true },
        autoplay: commonAutoplay,
        pagination: commonPagination,
        navigation: true,
      }
    : isTablet
    ? {
        // Tablet: show 1.4 cards so user can see a hint of the next
        modules: [Autoplay, Pagination],
        effect: 'slide',
        slidesPerView: 1.15,
        spaceBetween: 20,
        centeredSlides: true,
        loop: true,
        grabCursor: true,
        autoplay: commonAutoplay,
        pagination: commonPagination,
      }
    : {
        // Mobile: strictly 1 card, fully front-facing, no peeking
        modules: [Autoplay, Pagination],
        effect: 'slide',
        slidesPerView: 1,
        spaceBetween: 16,
        centeredSlides: true,
        loop: true,
        grabCursor: true,
        autoplay: commonAutoplay,
        pagination: commonPagination,
      };

  return (
    <div style={{
      position: 'relative',
      padding: isMobile ? '1rem 0' : isTablet ? '1.5rem 0' : '2rem 2rem',
      width: '100%',
      overflow: 'hidden',
    }}>
      <style>{`
        /* ── Pagination dots ── */
        .feat-swiper .swiper-pagination { bottom: 0 !important; }
        .feat-swiper .swiper-pagination-bullet {
          background: rgba(255,255,255,0.3);
          width: 8px; height: 8px;
          transition: all 0.2s;
        }
        .feat-swiper .swiper-pagination-bullet-active {
          background: #6366f1;
          width: 22px;
          border-radius: 4px;
        }

        /* ── Nav arrows (desktop only) ── */
        .feat-swiper .swiper-button-next,
        .feat-swiper .swiper-button-prev {
          color: #818cf8;
          background: rgba(255,255,255,0.06);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(99,102,241,0.25);
          width: 40px; height: 40px;
          border-radius: 50%;
          transition: all 0.2s;
        }
        .feat-swiper .swiper-button-next:hover,
        .feat-swiper .swiper-button-prev:hover {
          background: rgba(99,102,241,0.2);
          transform: scale(1.1);
        }
        .feat-swiper .swiper-button-next::after,
        .feat-swiper .swiper-button-prev::after {
          font-size: 15px; font-weight: 900;
        }

        /* ── Keep slides same height ── */
        .feat-swiper .swiper-wrapper { align-items: stretch; }
        .feat-swiper .swiper-slide { height: auto; display: flex; }

        /* ── On mobile/tablet, every slide is fully opaque and front-facing ── */
        @media (max-width: 1023px) {
          .feat-swiper .swiper-slide { opacity: 1 !important; transform: none !important; filter: none !important; }
          .feat-swiper .swiper-button-next,
          .feat-swiper .swiper-button-prev { display: none !important; }
        }

        /* ── Card hover (desktop only) ── */
        @media (min-width: 1024px) {
          .feat-card:hover {
            transform: translateY(-6px);
            border-color: rgba(99,102,241,0.45) !important;
            box-shadow: 0 24px 48px rgba(0,0,0,0.35) !important;
          }
        }
      `}</style>

      <Swiper {...swiperProps} className="feat-swiper" style={{ paddingBottom: '3rem' }}>
        {features.map((f, i) => (
          <SwiperSlide key={i} style={{ padding: isMobile ? '0 12px' : isTablet ? '0 8px' : '0' }}>
            <FeatureCard feature={f} isMobile={isMobile} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

// ── Individual feature card ────────────────────────────────────────────────────
const FeatureCard = ({ feature, isMobile }) => (
  <div
    className="feat-card"
    style={{
      background: 'linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.03) 100%)',
      backdropFilter: 'blur(12px)',
      borderRadius: 24,
      padding: isMobile ? '1.75rem 1.5rem' : '2rem',
      border: '1px solid rgba(255,255,255,0.1)',
      transition: 'all 0.3s ease',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      boxSizing: 'border-box',
    }}
  >
    {/* Icon */}
    <div style={{
      width: isMobile ? 56 : 64,
      height: isMobile ? 56 : 64,
      borderRadius: '50%',
      background: feature.gradient,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
      boxShadow: `0 8px 24px ${feature.glow}`,
    }}>
      {feature.icon}
    </div>

    {/* Text */}
    <div>
      <h3 style={{
        fontSize: isMobile ? '1.15rem' : '1.25rem',
        fontWeight: 700,
        color: '#fff',
        marginBottom: '0.5rem',
        fontFamily: "'Syne', sans-serif",
        lineHeight: 1.3,
      }}>
        {feature.title}
      </h3>
      <p style={{
        fontSize: isMobile ? '0.875rem' : '0.9rem',
        color: 'rgba(255,255,255,0.65)',
        lineHeight: 1.65,
        margin: 0,
      }}>
        {feature.description}
      </p>
    </div>

    {/* Bottom accent line */}
    <div style={{
      marginTop: 'auto',
      height: 3,
      borderRadius: 999,
      background: feature.gradient,
      opacity: 0.5,
    }} />
  </div>
);

export default Features;