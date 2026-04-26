import React from 'react';
import Banner from '../../components/Banner';
import useAxios from '../../Hooks/useAxios';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router';
import Features from '../../components/Features';
import IssueCard from '../Issues/IssueCard';

const Home = () => {
  const axios = useAxios();

  const { data: resolvedIssues = [] } = useQuery({
    queryKey: ['resolvedIssues'],
    queryFn: async () => {
      const res = await axios.get('/issues/resolved');
      return res.data;
    },
  });

  return (
    <div
      className="overflow-x-hidden"
      style={{
        background: 'linear-gradient(135deg, #0a0a1a 0%, #0d1b3e 40%, #0a1628 70%, #0f0a2e 100%)',
        minHeight: '100vh',
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* ── GLOBAL BACKGROUND ORBS ── */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', top: '-20%', left: '-10%',
          width: '70vw', height: '70vw', maxWidth: 900,
          background: 'radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)',
          borderRadius: '50%',
        }} />
        <div style={{
          position: 'absolute', bottom: '-10%', right: '-10%',
          width: '60vw', height: '60vw', maxWidth: 800,
          background: 'radial-gradient(circle, rgba(236,72,153,0.12) 0%, transparent 70%)',
          borderRadius: '50%',
        }} />
        <div style={{
          position: 'absolute', top: '40%', left: '50%',
          width: '40vw', height: '40vw', maxWidth: 500,
          background: 'radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%)',
          borderRadius: '50%',
          transform: 'translateX(-50%)',
        }} />
        {/* subtle grid */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
      </div>

      {/* ── BANNER ── */}
      <div className="relative z-10 mt-16">
        <Banner />
      </div>

      {/* ── HERO TAGLINE STRIP ── */}
      <div className="relative z-10 py-10 overflow-hidden">
        <div style={{
          background: 'linear-gradient(90deg, rgba(99,102,241,0.15), rgba(236,72,153,0.15), rgba(6,182,212,0.15))',
          borderTop: '1px solid rgba(255,255,255,0.07)',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          padding: '1.5rem 0',
        }}>
          <div style={{
            display: 'flex', gap: '4rem', animation: 'marquee 20s linear infinite',
            whiteSpace: 'nowrap', width: 'max-content',
          }}>
            {['Real-time Tracking', 'Community Upvoting', 'Fast Resolution', 'Data Insights', 'Priority Boost', '50+ Cities', 'Real-time Tracking', 'Community Upvoting', 'Fast Resolution', 'Data Insights', 'Priority Boost', '50+ Cities'].map((t, i) => (
              <span key={i} style={{
                fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.2em',
                color: i % 3 === 0 ? '#818cf8' : i % 3 === 1 ? '#f472b6' : '#22d3ee',
                textTransform: 'uppercase',
              }}>
                ◆ {t}
              </span>
            ))}
          </div>
        </div>
        <style>{`
          @keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }
        `}</style>
      </div>

      {/* ── LATEST RESOLVED ISSUES ── */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-screen-xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-14">
            <div style={{
              display: 'inline-block',
              background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(236,72,153,0.2))',
              border: '1px solid rgba(99,102,241,0.4)',
              borderRadius: '999px',
              padding: '0.35rem 1.2rem',
              marginBottom: '1.2rem',
            }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.18em', color: '#a5b4fc', textTransform: 'uppercase' }}>
                ✦ Recently Fixed
              </span>
            </div>
            <h2 style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
              fontWeight: 800,
              background: 'linear-gradient(135deg, #ffffff 30%, #a5b4fc 60%, #f9a8d4 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              lineHeight: 1.15,
              marginBottom: '1rem',
            }}>
              Latest Impact
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '1.05rem', fontWeight: 400 }}>
              Real problems solved by real citizens — see what's been fixed in your city.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
            {resolvedIssues.map((issue) => (
              <div key={issue._id} className="transform transition-all duration-300 hover:-translate-y-2">
                <IssueCard issue={issue} />
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/allissues" style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: '#fff', fontWeight: 600, fontSize: '0.95rem',
              padding: '0.85rem 2.2rem', borderRadius: '999px',
              textDecoration: 'none',
              boxShadow: '0 0 30px rgba(99,102,241,0.4)',
              transition: 'all 0.3s',
            }}>
              Browse All Issues →
            </Link>
          </div>
        </div>
      </section>

      {/* ── FEATURES SECTION ── */}
      <section className="relative z-10 py-24 px-4">
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, transparent, rgba(99,102,241,0.05) 40%, rgba(236,72,153,0.05) 70%, transparent)',
          pointerEvents: 'none',
        }} />
        <div className="max-w-screen-xl mx-auto relative">
          <div className="text-center mb-16">
            <div style={{
              display: 'inline-block',
              background: 'linear-gradient(135deg, rgba(6,182,212,0.2), rgba(99,102,241,0.2))',
              border: '1px solid rgba(6,182,212,0.35)',
              borderRadius: '999px',
              padding: '0.35rem 1.2rem',
              marginBottom: '1.2rem',
            }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.18em', color: '#22d3ee', textTransform: 'uppercase' }}>
                ✦ Platform Features
              </span>
            </div>
            <h2 style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 800,
              color: '#fff',
              marginBottom: '1rem',
            }}>
              Why Choose <span style={{ background: 'linear-gradient(135deg, #22d3ee, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>CityFix?</span>
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.45)', maxWidth: 560, margin: '0 auto', lineHeight: 1.7 }}>
              We bridge the gap between community needs and government action through a seamless, transparent digital ecosystem.
            </p>
          </div>
          <Features />
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="relative z-10 py-24 px-4">
        <div className="max-w-screen-xl mx-auto">
          <div className="text-center mb-16">
            <div style={{
              display: 'inline-block',
              background: 'linear-gradient(135deg, rgba(236,72,153,0.2), rgba(251,146,60,0.2))',
              border: '1px solid rgba(236,72,153,0.35)',
              borderRadius: '999px',
              padding: '0.35rem 1.2rem',
              marginBottom: '1.2rem',
            }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.18em', color: '#f472b6', textTransform: 'uppercase' }}>
                ✦ Simple Process
              </span>
            </div>
            <h2 style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 800,
              color: '#fff',
              marginBottom: '1rem',
            }}>
              Fixing Your City in <span style={{ background: 'linear-gradient(135deg, #f472b6, #fb923c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>4 Steps</span>
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontStyle: 'italic' }}>
              From report to resolution — a transparent, accountable process.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {/* connector */}
            <div className="hidden md:block absolute top-10 left-0 w-full h-px" style={{
              background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.4) 30%, rgba(236,72,153,0.4) 70%, transparent)',
            }} />
            {[
              { step: '01', title: 'Report Issue', desc: 'Capture details, photos, and location via our intuitive interface.', grad: 'linear-gradient(135deg, #6366f1, #22d3ee)', glow: 'rgba(99,102,241,0.4)' },
              { step: '02', title: 'Review & Assign', desc: 'Admins verify and dispatch to the right city department instantly.', grad: 'linear-gradient(135deg, #8b5cf6, #6366f1)', glow: 'rgba(139,92,246,0.4)' },
              { step: '03', title: 'Track Progress', desc: 'Live status updates as your report moves from Pending to In Progress.', grad: 'linear-gradient(135deg, #ec4899, #8b5cf6)', glow: 'rgba(236,72,153,0.4)' },
              { step: '04', title: 'Resolution', desc: 'See the results, rate the service, and celebrate the fix!', grad: 'linear-gradient(135deg, #10b981, #06b6d4)', glow: 'rgba(16,185,129,0.4)' },
            ].map((item, idx) => (
              <div key={idx} className="group flex flex-col items-center text-center relative z-10">
                <div style={{
                  width: 72, height: 72, borderRadius: 18, background: item.grad,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '1.5rem', boxShadow: `0 0 30px ${item.glow}`,
                  transition: 'transform 0.3s', fontSize: '1.4rem', fontWeight: 800,
                  color: '#fff', fontFamily: "'Syne', sans-serif",
                }}>
                  {item.step}
                </div>
                <div style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 20, padding: '1.8rem',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s',
                }}>
                  <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '1.1rem', color: '#fff', marginBottom: '0.6rem' }}>
                    {item.title}
                  </h3>
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', lineHeight: 1.65 }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATISTICS ── */}
      <section className="relative z-10 py-20 px-4">
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(236,72,153,0.1) 50%, rgba(6,182,212,0.08) 100%)',
          borderTop: '1px solid rgba(255,255,255,0.07)',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
        }} />
        <div className="max-w-screen-xl mx-auto relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { val: '10,000+', label: 'Issues Reported', color: '#818cf8' },
              { val: '85%', label: 'Resolution Rate', color: '#34d399' },
              { val: '24h', label: 'Avg Response Time', color: '#f472b6' },
              { val: '50+', label: 'Cities Covered', color: '#22d3ee' },
            ].map((stat, i) => (
              <div key={i} className="text-center" style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 20, padding: '2.5rem 1rem',
                backdropFilter: 'blur(10px)',
              }}>
                <div style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 800,
                  color: stat.color, lineHeight: 1, marginBottom: '0.5rem',
                  textShadow: `0 0 40px ${stat.color}80`,
                }}>
                  {stat.val}
                </div>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="relative z-10 py-24 px-4">
        <div className="max-w-screen-xl mx-auto">
          <div className="text-center mb-16">
            <h2 style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 800, color: '#fff', marginBottom: '0.8rem',
            }}>
              Voices of the <span style={{ background: 'linear-gradient(135deg, #f472b6, #fb923c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>City</span>
            </h2>
            <div style={{ width: 60, height: 3, background: 'linear-gradient(90deg, #f472b6, #fb923c)', margin: '0 auto', borderRadius: 99 }} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Sarah Johnson', role: 'Local Resident', text: 'Reported a broken streetlight in my area. It was fixed within 48 hours! This platform truly works.', grad: 'linear-gradient(135deg, #6366f1, #22d3ee)' },
              { name: 'Michael Chen', role: 'Business Owner', text: 'The pothole in front of my shop was fixed in record time. Great transparency and updates throughout.', grad: 'linear-gradient(135deg, #10b981, #06b6d4)' },
              { name: 'Priya Sharma', role: 'Community Leader', text: 'Our community park cleanup was organized here. 50+ volunteers participated — incredible platform!', grad: 'linear-gradient(135deg, #ec4899, #f97316)' },
            ].map((t, i) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.09)',
                borderRadius: 24, padding: '2.2rem',
                backdropFilter: 'blur(12px)',
                position: 'relative', overflow: 'hidden',
                transition: 'all 0.3s',
              }}>
                {/* quote mark */}
                <div style={{
                  position: 'absolute', top: '1rem', right: '1.5rem',
                  fontSize: '5rem', lineHeight: 1, color: 'rgba(255,255,255,0.04)',
                  fontFamily: 'Georgia, serif', fontWeight: 900,
                }}>❝</div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: 14,
                    background: t.grad, flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: '1.2rem', color: '#fff',
                  }}>
                    {t.name[0]}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: '#fff', fontSize: '1rem' }}>{t.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>{t.role}</div>
                  </div>
                </div>

                <p style={{ color: 'rgba(255,255,255,0.65)', lineHeight: 1.75, fontStyle: 'italic', fontSize: '0.95rem' }}>
                  "{t.text}"
                </p>

                <div style={{ marginTop: '1.2rem', display: 'flex', gap: '0.2rem' }}>
                  {[...Array(5)].map((_, j) => (
                    <span key={j} style={{ color: '#fbbf24', fontSize: '0.9rem' }}>★</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA STRIP ── */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-3xl mx-auto text-center" style={{
          background: 'linear-gradient(135deg, rgba(99,102,241,0.2) 0%, rgba(236,72,153,0.15) 50%, rgba(6,182,212,0.15) 100%)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 32, padding: 'clamp(2.5rem, 6vw, 4rem) clamp(1.5rem, 5vw, 3rem)',
          backdropFilter: 'blur(20px)',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: '-50%', left: '-30%',
            width: '80%', height: '200%',
            background: 'radial-gradient(ellipse, rgba(99,102,241,0.12) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />
          <h2 style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 'clamp(1.8rem, 4vw, 3rem)',
            fontWeight: 800, color: '#fff', marginBottom: '1rem',
          }}>
            Ready to Fix Your City?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.55)', maxWidth: 480, margin: '0 auto 2.5rem', lineHeight: 1.75, fontSize: '1.05rem' }}>
            Join thousands of citizens making a real difference — one report at a time.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/reportIssue" style={{
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: '#fff', fontWeight: 700, fontSize: '0.95rem',
              padding: '0.9rem 2.2rem', borderRadius: '999px',
              textDecoration: 'none',
              boxShadow: '0 0 30px rgba(99,102,241,0.5)',
              transition: 'all 0.3s',
            }}>
              Report an Issue
            </Link>
            <Link to="/allissues" style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.18)',
              color: '#fff', fontWeight: 600, fontSize: '0.95rem',
              padding: '0.9rem 2.2rem', borderRadius: '999px',
              textDecoration: 'none',
              transition: 'all 0.3s',
            }}>
              Browse Issues
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;