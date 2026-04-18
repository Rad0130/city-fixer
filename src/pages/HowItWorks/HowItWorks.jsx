import { motion as Motion } from 'framer-motion';
import { FaMapMarkerAlt, FaUserCheck, FaTools, FaCheckCircle } from 'react-icons/fa';

const HowItWorks = () => {
  const fadeUp = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 },
  };

  const steps = [
    {
      icon: FaMapMarkerAlt,
      num: '01',
      title: 'Report & Locate',
      description: 'Citizens submit a report, upload photos, and pinpoint the exact location of the infrastructure issue.',
      color: 'linear-gradient(135deg, #6366f1, #22d3ee)',
      glow: 'rgba(99,102,241,0.45)',
      accent: '#818cf8',
      delay: 0,
    },
    {
      icon: FaUserCheck,
      num: '02',
      title: 'Assign & Verify',
      description: 'The Admin reviews the incoming issue, assigns it to the relevant Staff member, and status moves to In-Progress.',
      color: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
      glow: 'rgba(139,92,246,0.45)',
      accent: '#c084fc',
      delay: 0.1,
    },
    {
      icon: FaTools,
      num: '03',
      title: 'Track & Resolve',
      description: 'Staff members work on the issue, updating the timeline with notes. Status changes to Resolved upon completion.',
      color: 'linear-gradient(135deg, #f97316, #ec4899)',
      glow: 'rgba(249,115,22,0.45)',
      accent: '#fb923c',
      delay: 0.2,
    },
    {
      icon: FaCheckCircle,
      num: '04',
      title: 'Close & Audit',
      description: 'Once resolved, the Staff or Admin closes the issue. The complete lifecycle and audit trail are preserved.',
      color: 'linear-gradient(135deg, #10b981, #06b6d4)',
      glow: 'rgba(16,185,129,0.45)',
      accent: '#34d399',
      delay: 0.3,
    },
  ];

  const timelineItems = [
    { event: 'Issue Closed by Staff', time: 'Dec 10, 2025 — 4:15 PM', color: '#34d399', icon: '✅' },
    { event: 'Marked as Resolved', time: 'Dec 10, 2025 — 2:00 PM', color: '#818cf8', icon: '🔧' },
    { event: 'Work Started on Issue', time: 'Dec 9, 2025 — 9:30 AM', color: '#fbbf24', icon: '⚙️' },
    { event: 'Issue Assigned to Staff: John Doe', time: 'Dec 8, 2025 — 3:45 PM', color: '#22d3ee', icon: '👤' },
    { event: 'Issue Reported by Citizen', time: 'Dec 7, 2025 — 10:30 AM', color: '#f472b6', icon: '🚩' },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a1a 0%, #0d1b3e 40%, #0a1628 70%, #0f0a2e 100%)',
      fontFamily: "'DM Sans', sans-serif",
      overflowX: 'hidden',
    }}>
      {/* ── GLOBAL BG ── */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-15%', right: '-10%', width: '60vw', height: '60vw', maxWidth: 800, background: 'radial-gradient(circle, rgba(99,102,241,0.13) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '-10%', left: '-5%', width: '50vw', height: '50vw', maxWidth: 650, background: 'radial-gradient(circle, rgba(6,182,212,0.09) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', top: '50%', left: '30%', width: '35vw', height: '35vw', maxWidth: 450, background: 'radial-gradient(circle, rgba(236,72,153,0.07) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
      </div>

      {/* ── HERO ── */}
      <section style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '8rem 1rem 5rem' }}>
        <Motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }}>
          <div style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg, rgba(6,182,212,0.2), rgba(99,102,241,0.2))',
            border: '1px solid rgba(6,182,212,0.35)',
            borderRadius: 999, padding: '0.35rem 1.2rem', marginBottom: '1.5rem',
          }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.18em', color: '#22d3ee', textTransform: 'uppercase' }}>✦ The Process</span>
          </div>

          <h1 style={{
            fontFamily: "'Syne', sans-serif", fontWeight: 800,
            fontSize: 'clamp(2.5rem, 7vw, 4.5rem)', lineHeight: 1.1, marginBottom: '1.5rem',
          }}>
            <span style={{ color: '#fff' }}>The </span>
            <span style={{ background: 'linear-gradient(135deg, #22d3ee, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>4-Step Cycle</span>
            <br />
            <span style={{ background: 'linear-gradient(135deg, #f472b6, #fb923c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>to City Repair</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 'clamp(0.95rem,2vw,1.15rem)', maxWidth: 520, margin: '0 auto', lineHeight: 1.75 }}>
            See exactly how your report moves from a pending issue to a fully resolved solution — with complete transparency.
          </p>
        </Motion.div>
      </section>

      {/* ── STEPS ── */}
      <section style={{ position: 'relative', zIndex: 1, padding: '3rem clamp(1rem,6vw,5rem) 5rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Motion.div {...fadeUp} style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 'clamp(1.6rem,3vw,2.4rem)', color: '#fff' }}>
              How the System Works
            </h2>
          </Motion.div>

          {/* Steps grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', position: 'relative' }}>
            {/* Connector line desktop */}
            <div style={{
              position: 'absolute', top: 56, left: '12%', right: '12%', height: 1,
              background: 'linear-gradient(90deg, rgba(99,102,241,0.4), rgba(236,72,153,0.4), rgba(6,182,212,0.4))',
              display: 'none',
            }} className="hidden lg:block" />

            {steps.map((step) => (
              <Motion.div
                key={step.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: step.delay }}
                whileHover={{ y: -8 }}
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.09)',
                  borderRadius: 22, padding: '2rem 1.5rem',
                  backdropFilter: 'blur(12px)',
                  textAlign: 'center',
                  position: 'relative', overflow: 'hidden',
                }}
              >
                {/* Top gradient bar */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: step.color, borderRadius: '22px 22px 0 0' }} />

                {/* Step number badge */}
                <div style={{
                  position: 'absolute', top: '1rem', right: '1rem',
                  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 999, padding: '0.15rem 0.6rem',
                  fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: '0.7rem',
                  color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em',
                }}>STEP {step.num}</div>

                {/* Icon circle */}
                <div style={{
                  width: 70, height: 70, borderRadius: '50%',
                  background: step.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 1.3rem',
                  fontSize: '1.6rem', color: '#fff',
                  boxShadow: `0 0 30px ${step.glow}`,
                  border: '3px solid rgba(255,255,255,0.1)',
                }}>
                  <step.icon />
                </div>

                <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: '1.1rem', color: '#fff', marginBottom: '0.7rem' }}>
                  {step.title}
                </h3>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem', lineHeight: 1.7 }}>
                  {step.description}
                </p>

                {/* Bottom accent */}
                <div style={{
                  marginTop: '1.5rem', display: 'inline-block',
                  background: `${step.accent}15`, border: `1px solid ${step.accent}30`,
                  borderRadius: 999, padding: '0.2rem 0.8rem',
                  color: step.accent, fontSize: '0.75rem', fontWeight: 700,
                }}>
                  Phase {step.num}
                </div>
              </Motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRANSPARENCY + TIMELINE MOCKUP ── */}
      <section style={{ position: 'relative', zIndex: 1, padding: '4rem clamp(1rem,6vw,5rem)' }}>
        <div style={{
          maxWidth: 1100, margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '3rem', alignItems: 'center',
        }}>
          {/* Left: text */}
          <Motion.div {...fadeUp}>
            <div style={{
              display: 'inline-block',
              background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(6,182,212,0.2))',
              border: '1px solid rgba(99,102,241,0.35)',
              borderRadius: 999, padding: '0.35rem 1.2rem', marginBottom: '1.2rem',
            }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.18em', color: '#a5b4fc', textTransform: 'uppercase' }}>✦ Transparency</span>
            </div>

            <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 'clamp(1.6rem,3vw,2.4rem)', color: '#fff', lineHeight: 1.2, marginBottom: '1.2rem' }}>
              Full Transparency,{' '}
              <span style={{ background: 'linear-gradient(135deg, #818cf8, #22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Every Step
              </span>
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.8, marginBottom: '2rem', fontSize: '0.95rem' }}>
              Our Issue Tracking & Timeline feature gives you a complete, read-only audit history of your report. You'll never be left in the dark.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { icon: '✅', text: 'Detailed timeline entries for every status change.', color: '#34d399' },
                { icon: '💳', text: 'Tracking records for staff assignment and boost payments.', color: '#818cf8' },
                { icon: '🔔', text: 'Notifications delivered directly to citizens and staff.', color: '#f472b6' },
              ].map((item) => (
                <Motion.div
                  key={item.text}
                  {...fadeUp}
                  style={{
                    display: 'flex', alignItems: 'flex-start', gap: '1rem',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: 14, padding: '1rem 1.2rem',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  <div style={{
                    width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                    background: `${item.color}15`, border: `1px solid ${item.color}30`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem',
                  }}>{item.icon}</div>
                  <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.9rem', lineHeight: 1.6, margin: 0, paddingTop: '0.4rem' }}>{item.text}</p>
                </Motion.div>
              ))}
            </div>
          </Motion.div>

          {/* Right: Timeline mockup */}
          <Motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 24, padding: '2rem',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 30px 80px rgba(0,0,0,0.4)',
              position: 'relative', overflow: 'hidden',
            }}>
              {/* Top bar */}
              <div style={{ height: 3, background: 'linear-gradient(90deg, #6366f1, #ec4899, #22d3ee)', borderRadius: '24px 24px 0 0', position: 'absolute', top: 0, left: 0, right: 0 }} />

              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.8rem' }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: 'linear-gradient(135deg, #6366f1, #22d3ee)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>📋</div>
                <div>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>Issue Timeline</div>
                  <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem' }}>CF-2025-00042 • Pothole on Main St.</div>
                </div>
              </div>

              {/* Timeline entries */}
              <div style={{ position: 'relative', paddingLeft: '1.5rem' }}>
                {/* Vertical line */}
                <div style={{
                  position: 'absolute', left: 7, top: 0, bottom: 0, width: 2,
                  background: 'linear-gradient(to bottom, rgba(99,102,241,0.5), rgba(6,182,212,0.2), rgba(255,255,255,0.05))',
                  borderRadius: 99,
                }} />

                {timelineItems.map((item, i) => (
                  <Motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08, duration: 0.4 }}
                    style={{
                      position: 'relative', marginBottom: i < timelineItems.length - 1 ? '1.4rem' : 0,
                      display: 'flex', alignItems: 'flex-start', gap: '0.9rem',
                    }}
                  >
                    {/* Dot */}
                    <div style={{
                      position: 'absolute', left: -22,
                      width: 16, height: 16, borderRadius: '50%',
                      background: item.color, border: '2px solid rgba(13,17,30,0.8)',
                      boxShadow: `0 0 10px ${item.color}80`,
                      flexShrink: 0,
                      top: 2,
                    }} />
                    <div style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.07)',
                      borderRadius: 12, padding: '0.65rem 0.9rem', flex: 1,
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                        <span style={{ fontSize: '0.8rem' }}>{item.icon}</span>
                        <span style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 600 }}>{item.event}</span>
                      </div>
                      <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.73rem' }}>{item.time}</div>
                    </div>
                  </Motion.div>
                ))}
              </div>
            </div>
          </Motion.div>
        </div>
      </section>

      {/* ── ROLES SECTION ── */}
      <section style={{ position: 'relative', zIndex: 1, padding: '4rem clamp(1rem,6vw,5rem)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <Motion.div {...fadeUp} style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{
              display: 'inline-block',
              background: 'linear-gradient(135deg, rgba(236,72,153,0.2), rgba(251,146,60,0.2))',
              border: '1px solid rgba(236,72,153,0.35)',
              borderRadius: 999, padding: '0.35rem 1.2rem', marginBottom: '1rem',
            }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.18em', color: '#f472b6', textTransform: 'uppercase' }}>✦ Who Does What</span>
            </div>
            <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 'clamp(1.6rem,3vw,2.4rem)', color: '#fff' }}>
              Three Roles,{' '}
              <span style={{ background: 'linear-gradient(135deg, #f472b6, #fb923c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>One Goal</span>
            </h2>
          </Motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.2rem' }}>
            {[
              {
                role: 'Citizen',
                icon: '👤',
                color: '#818cf8',
                bg: 'rgba(129,140,248,0.08)', border: 'rgba(129,140,248,0.2)',
                duties: ['Submit & track issues', 'Upvote community reports', 'Boost priority via payment', 'Edit/delete own issues'],
              },
              {
                role: 'Staff',
                icon: '🔧',
                color: '#34d399',
                bg: 'rgba(52,211,153,0.08)', border: 'rgba(52,211,153,0.2)',
                duties: ['View assigned issues', 'Update issue status', 'Add progress notes', 'Mark issues as resolved'],
              },
              {
                role: 'Admin',
                icon: '🛡️',
                color: '#f472b6',
                bg: 'rgba(244,114,182,0.08)', border: 'rgba(244,114,182,0.2)',
                duties: ['Manage all issues', 'Assign staff to issues', 'Block/unblock citizens', 'View all payments'],
              },
            ].map((r, i) => (
              <Motion.div
                key={r.role}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ y: -6 }}
                style={{ background: r.bg, border: `1px solid ${r.border}`, borderRadius: 20, padding: '1.8rem', backdropFilter: 'blur(10px)' }}
              >
                <div style={{ width: 52, height: 52, borderRadius: 14, background: `${r.color}20`, border: `1px solid ${r.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', marginBottom: '1rem' }}>
                  {r.icon}
                </div>
                <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: '1.15rem', color: r.color, marginBottom: '1rem' }}>{r.role}</h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                  {r.duties.map(d => (
                    <li key={d} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255,255,255,0.55)', fontSize: '0.865rem' }}>
                      <span style={{ color: r.color, fontSize: '0.7rem' }}>◆</span> {d}
                    </li>
                  ))}
                </ul>
              </Motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ position: 'relative', zIndex: 1, padding: '3rem clamp(1rem,6vw,5rem) 6rem' }}>
        <Motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{
            maxWidth: 700, margin: '0 auto', textAlign: 'center',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 28, padding: 'clamp(2.5rem,6vw,4rem)',
            backdropFilter: 'blur(20px)',
            position: 'relative', overflow: 'hidden',
          }}
        >
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, #10b981, #06b6d4, #6366f1)', borderRadius: '28px 28px 0 0' }} />
          <div style={{ position: 'absolute', top: -60, left: '50%', transform: 'translateX(-50%)', width: 280, height: 280, background: 'radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

          <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 'clamp(1.5rem,3vw,2.2rem)', color: '#fff', marginBottom: '0.9rem' }}>
            Ready to Make a Difference?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '1rem', lineHeight: 1.75, maxWidth: 440, margin: '0 auto 2rem' }}>
            Start the cycle of change by submitting your first report today. Every issue you report makes your city better.
          </p>
          <Motion.a
            href="/reportIssue"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            style={{
              display: 'inline-block',
              background: 'linear-gradient(135deg, #10b981, #06b6d4)',
              color: '#fff', fontWeight: 700, fontSize: '0.95rem',
              padding: '0.9rem 2.5rem', borderRadius: 999,
              textDecoration: 'none',
              boxShadow: '0 0 35px rgba(16,185,129,0.4)',
            }}
          >
            🚩 Report an Issue Now
          </Motion.a>
        </Motion.div>
      </section>
    </div>
  );
};

export default HowItWorks;