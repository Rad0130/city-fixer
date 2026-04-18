import { motion as Motion } from 'framer-motion';

const AboutUsPage = () => {
  const fadeUp = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 },
  };

  const stagger = {
    initial: {},
    whileInView: { transition: { staggerChildren: 0.15 } },
    viewport: { once: true },
  };

  const cardVariant = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a1a 0%, #0d1b3e 40%, #0a1628 70%, #0f0a2e 100%)',
      fontFamily: "'DM Sans', sans-serif",
      overflowX: 'hidden',
    }}>
      {/* ── GLOBAL BACKGROUND ── */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-15%', left: '-10%', width: '65vw', height: '65vw', maxWidth: 850, background: 'radial-gradient(circle, rgba(99,102,241,0.14) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '55vw', height: '55vw', maxWidth: 700, background: 'radial-gradient(circle, rgba(236,72,153,0.1) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', top: '50%', left: '60%', width: '35vw', height: '35vw', maxWidth: 450, background: 'radial-gradient(circle, rgba(6,182,212,0.07) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
      </div>

      {/* ── HERO ── */}
      <section style={{ paddingTop: '8rem', paddingBottom: '6rem', position: 'relative', zIndex: 1, textAlign: 'center', padding: '8rem 1rem 6rem' }}>
        <Motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <div style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(236,72,153,0.2))',
            border: '1px solid rgba(99,102,241,0.4)',
            borderRadius: 999, padding: '0.35rem 1.2rem', marginBottom: '1.5rem',
          }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.18em', color: '#a5b4fc', textTransform: 'uppercase' }}>✦ Our Story</span>
          </div>

          <h1 style={{
            fontFamily: "'Syne', sans-serif", fontWeight: 800,
            fontSize: 'clamp(2.8rem, 7vw, 5rem)', lineHeight: 1.1,
            marginBottom: '1.5rem',
          }}>
            <span style={{ background: 'linear-gradient(135deg, #fff 40%, #a5b4fc 70%, #f9a8d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              About
            </span>{' '}
            <span style={{ background: 'linear-gradient(135deg, #6366f1, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              CityFix
            </span>
          </h1>

          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 'clamp(1rem,2vw,1.2rem)', maxWidth: 560, margin: '0 auto', lineHeight: 1.75 }}>
            Building better cities through community collaboration, transparency, and the power of technology.
          </p>
        </Motion.div>

        {/* Hero stats strip */}
        <Motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
          style={{
            display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem',
            marginTop: '3rem',
          }}
        >
          {[
            { val: '2020', label: 'Founded', color: '#818cf8' },
            { val: '50+', label: 'Cities', color: '#34d399' },
            { val: '10K+', label: 'Issues Fixed', color: '#f472b6' },
            { val: '85%', label: 'Resolution Rate', color: '#22d3ee' },
          ].map((s) => (
            <div key={s.label} style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.09)',
              borderRadius: 16, padding: '1.2rem 2rem',
              backdropFilter: 'blur(12px)', textAlign: 'center', minWidth: 130,
            }}>
              <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: '2rem', color: s.color, textShadow: `0 0 30px ${s.color}60` }}>{s.val}</div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: '0.2rem' }}>{s.label}</div>
            </div>
          ))}
        </Motion.div>
      </section>

      {/* ── OUR STORY ── */}
      <section style={{ position: 'relative', zIndex: 1, padding: '4rem clamp(1rem,6vw,5rem)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'center' }}>

          {/* Left text */}
          <Motion.div {...fadeUp}>
            <div style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.09)',
              borderRadius: 24, padding: '2.5rem',
              backdropFilter: 'blur(12px)',
              position: 'relative', overflow: 'hidden',
            }}>
              {/* Accent glow */}
              <div style={{ position: 'absolute', top: -40, left: -40, width: 200, height: 200, background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
              <div style={{
                display: 'inline-block', background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)',
                borderRadius: 999, padding: '0.25rem 0.9rem', marginBottom: '1.2rem',
              }}>
                <span style={{ color: '#818cf8', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.12em' }}>OUR STORY</span>
              </div>
              <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 'clamp(1.8rem,3vw,2.5rem)', color: '#fff', lineHeight: 1.2, marginBottom: '1.2rem' }}>
                Where It All Began
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.8, marginBottom: '1rem', fontSize: '0.95rem' }}>
                Founded in 2020, CityFix began as a simple idea — what if citizens could easily report public infrastructure issues and track their resolution in real-time?
              </p>
              <p style={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.8, fontSize: '0.95rem' }}>
                Today, we've grown into a comprehensive platform connecting thousands of citizens with local authorities across 50+ cities, resolving over 10,000 issues and making communities safer and better for everyone.
              </p>
            </div>
          </Motion.div>

          {/* Right: milestone grid */}
          <Motion.div {...fadeUp} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {[
              { year: '2020', event: 'Platform launched in Dhaka', color: 'linear-gradient(135deg, #6366f1, #8b5cf6)', glow: 'rgba(99,102,241,0.4)' },
              { year: '2021', event: 'Expanded to 10 cities', color: 'linear-gradient(135deg, #8b5cf6, #ec4899)', glow: 'rgba(139,92,246,0.4)' },
              { year: '2022', event: 'Reached 5,000 resolved issues', color: 'linear-gradient(135deg, #ec4899, #f97316)', glow: 'rgba(236,72,153,0.4)' },
              { year: '2023', event: 'Premium boost feature launched', color: 'linear-gradient(135deg, #10b981, #06b6d4)', glow: 'rgba(16,185,129,0.4)' },
            ].map((m, i) => (
              <Motion.div
                key={m.year}
                initial={{ opacity: 0, scale: 0.85 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.04 }}
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.09)',
                  borderRadius: 18, padding: '1.5rem',
                  backdropFilter: 'blur(12px)',
                  position: 'relative', overflow: 'hidden',
                }}
              >
                <div style={{ position: 'absolute', inset: 0, background: m.color, opacity: 0.07, borderRadius: 18 }} />
                <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: '2rem', color: '#fff', marginBottom: '0.4rem', textShadow: `0 0 20px ${m.glow}` }}>{m.year}</div>
                <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.82rem', lineHeight: 1.5 }}>{m.event}</div>
              </Motion.div>
            ))}
          </Motion.div>
        </div>
      </section>

      {/* ── MISSION & VISION ── */}
      <section style={{ position: 'relative', zIndex: 1, padding: '5rem clamp(1rem,6vw,5rem)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <Motion.div {...fadeUp} style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{
              display: 'inline-block',
              background: 'linear-gradient(135deg, rgba(6,182,212,0.2), rgba(99,102,241,0.2))',
              border: '1px solid rgba(6,182,212,0.35)',
              borderRadius: 999, padding: '0.35rem 1.2rem', marginBottom: '1rem',
            }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.18em', color: '#22d3ee', textTransform: 'uppercase' }}>✦ Purpose</span>
            </div>
            <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 'clamp(1.8rem,4vw,2.8rem)', color: '#fff' }}>
              Mission &{' '}
              <span style={{ background: 'linear-gradient(135deg, #22d3ee, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Vision</span>
            </h2>
          </Motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {[
              {
                icon: '⚡',
                title: 'Our Mission',
                text: 'To empower every citizen to improve city infrastructure through transparency, technology, and community action.',
                color: 'linear-gradient(135deg, #10b981, #06b6d4)',
                glow: 'rgba(16,185,129,0.25)',
                border: 'rgba(16,185,129,0.25)',
              },
              {
                icon: '🔭',
                title: 'Our Vision',
                text: 'A world where no public issue goes unresolved — where technology bridges the gap between citizens and government.',
                color: 'linear-gradient(135deg, #f97316, #ec4899)',
                glow: 'rgba(249,115,22,0.25)',
                border: 'rgba(249,115,22,0.25)',
              },
            ].map((item) => (
              <Motion.div
                key={item.title}
                {...fadeUp}
                whileHover={{ y: -6 }}
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: `1px solid ${item.border}`,
                  borderRadius: 24, padding: '2.5rem',
                  backdropFilter: 'blur(12px)',
                  position: 'relative', overflow: 'hidden',
                }}
              >
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: item.color, borderRadius: '24px 24px 0 0' }} />
                <div style={{ width: 56, height: 56, borderRadius: 14, background: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', marginBottom: '1.3rem', boxShadow: `0 0 25px ${item.glow}` }}>
                  {item.icon}
                </div>
                <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: '1.4rem', color: '#fff', marginBottom: '0.75rem' }}>{item.title}</h3>
                <p style={{ color: 'rgba(255,255,255,0.55)', lineHeight: 1.8, fontSize: '0.95rem' }}>{item.text}</p>
              </Motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEAM ── */}
      <section style={{ position: 'relative', zIndex: 1, padding: '5rem clamp(1rem,6vw,5rem)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <Motion.div {...fadeUp} style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div style={{
              display: 'inline-block',
              background: 'linear-gradient(135deg, rgba(236,72,153,0.2), rgba(139,92,246,0.2))',
              border: '1px solid rgba(236,72,153,0.35)',
              borderRadius: 999, padding: '0.35rem 1.2rem', marginBottom: '1rem',
            }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.18em', color: '#f472b6', textTransform: 'uppercase' }}>✦ The People</span>
            </div>
            <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 'clamp(1.8rem,4vw,2.8rem)', color: '#fff', marginBottom: '0.75rem' }}>
              Meet Our{' '}
              <span style={{ background: 'linear-gradient(135deg, #f472b6, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Team</span>
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '1rem', maxWidth: 460, margin: '0 auto' }}>
              Passionate individuals dedicated to making cities better for everyone.
            </p>
          </Motion.div>

          <Motion.div variants={stagger} initial="initial" whileInView="animate" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
            {[
              { name: 'Alex Chen', role: 'Founder & CEO', emoji: '👨‍💼', bio: 'Urban tech visionary with 10+ years in civic innovation.', color: 'linear-gradient(135deg, #6366f1, #22d3ee)', glow: 'rgba(99,102,241,0.4)' },
              { name: 'Sarah Johnson', role: 'Head of Operations', emoji: '👩‍💻', bio: 'Operations expert who keeps the city fix engine running.', color: 'linear-gradient(135deg, #ec4899, #8b5cf6)', glow: 'rgba(236,72,153,0.4)' },
              { name: 'Marcus Rivera', role: 'Lead Developer', emoji: '🧑‍🔧', bio: 'Full-stack wizard behind the seamless CityFix experience.', color: 'linear-gradient(135deg, #10b981, #06b6d4)', glow: 'rgba(16,185,129,0.4)' },
            ].map((member) => (
              <Motion.div
                key={member.name}
                variants={cardVariant}
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3 }}
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 24, padding: '2.2rem',
                  backdropFilter: 'blur(12px)', textAlign: 'center',
                  position: 'relative', overflow: 'hidden',
                }}
              >
                {/* Glow blob */}
                <div style={{ position: 'absolute', top: -30, left: '50%', transform: 'translateX(-50%)', width: 160, height: 160, background: `radial-gradient(circle, ${member.glow} 0%, transparent 70%)`, borderRadius: '50%', pointerEvents: 'none' }} />

                {/* Avatar */}
                <div style={{
                  width: 90, height: 90, borderRadius: '50%',
                  background: member.color,
                  margin: '0 auto 1.2rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '2.2rem',
                  boxShadow: `0 0 30px ${member.glow}`,
                  border: '3px solid rgba(255,255,255,0.1)',
                }}>
                  {member.emoji}
                </div>

                <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: '1.2rem', color: '#fff', marginBottom: '0.3rem' }}>{member.name}</h3>
                <div style={{
                  display: 'inline-block', marginBottom: '0.9rem',
                  background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)',
                  borderRadius: 999, padding: '0.2rem 0.8rem',
                  color: '#a5b4fc', fontSize: '0.78rem', fontWeight: 600,
                }}>{member.role}</div>
                <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.875rem', lineHeight: 1.65 }}>{member.bio}</p>
              </Motion.div>
            ))}
          </Motion.div>
        </div>
      </section>

      {/* ── CORE VALUES ── */}
      <section style={{ position: 'relative', zIndex: 1, padding: '5rem clamp(1rem,6vw,5rem)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <Motion.div {...fadeUp} style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 'clamp(1.8rem,4vw,2.8rem)', color: '#fff', marginBottom: '0.5rem' }}>
              Our{' '}
              <span style={{ background: 'linear-gradient(135deg, #818cf8, #22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Core Values</span>
            </h2>
            <div style={{ width: 60, height: 3, background: 'linear-gradient(90deg, #6366f1, #22d3ee)', margin: '0 auto', borderRadius: 99 }} />
          </Motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.2rem' }}>
            {[
              { icon: '👁️', title: 'Transparency', text: 'Open communication and clear tracking at every step of the process.', color: '#818cf8', bg: 'rgba(129,140,248,0.08)', border: 'rgba(129,140,248,0.2)' },
              { icon: '🤝', title: 'Community', text: 'The power of collective action and shared civic responsibility.', color: '#34d399', bg: 'rgba(52,211,153,0.08)', border: 'rgba(52,211,153,0.2)' },
              { icon: '💡', title: 'Innovation', text: 'Leveraging cutting-edge technology for smarter city solutions.', color: '#f472b6', bg: 'rgba(244,114,182,0.08)', border: 'rgba(244,114,182,0.2)' },
            ].map((v, i) => (
              <Motion.div
                key={v.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ scale: 1.03 }}
                style={{
                  background: v.bg, border: `1px solid ${v.border}`,
                  borderRadius: 20, padding: '2rem',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <div style={{ fontSize: '2.2rem', marginBottom: '1rem' }}>{v.icon}</div>
                <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: '1.15rem', color: v.color, marginBottom: '0.6rem' }}>{v.title}</h3>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem', lineHeight: 1.7 }}>{v.text}</p>
              </Motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ position: 'relative', zIndex: 1, padding: '4rem clamp(1rem,6vw,5rem) 6rem' }}>
        <Motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{
            maxWidth: 750, margin: '0 auto', textAlign: 'center',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 28, padding: 'clamp(2.5rem,6vw,4rem)',
            backdropFilter: 'blur(20px)',
            position: 'relative', overflow: 'hidden',
          }}
        >
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, #6366f1, #ec4899, #22d3ee)', borderRadius: '28px 28px 0 0' }} />
          <div style={{ position: 'absolute', top: -60, left: '50%', transform: 'translateX(-50%)', width: 300, height: 300, background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

          <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 'clamp(1.6rem,3vw,2.4rem)', color: '#fff', marginBottom: '1rem' }}>
            Join Our Movement
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1rem', lineHeight: 1.75, maxWidth: 460, margin: '0 auto 2.5rem' }}>
            Together, we can build cleaner, safer, and better cities for everyone — one report at a time.
          </p>
          <Motion.a
            href="/reportIssue"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            style={{
              display: 'inline-block',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: '#fff', fontWeight: 700, fontSize: '0.95rem',
              padding: '0.9rem 2.5rem', borderRadius: 999,
              textDecoration: 'none',
              boxShadow: '0 0 35px rgba(99,102,241,0.45)',
            }}
          >
            Start Reporting Issues →
          </Motion.a>
        </Motion.div>
      </section>
    </div>
  );
};

export default AboutUsPage;