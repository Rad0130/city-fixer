import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import useAuth from '../../Hooks/useAuth';
import useRole from '../../Hooks/useRole';

const QUICK_QUESTIONS = [
  'How do I report an issue?',
  'What is Premium membership?',
  'How does issue tracking work?',
  'How can I become staff?',
  'What happens after I report?',
];

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      text: "Hi! I'm the CityFix Assistant 🏙️\n\nI can help you with:\n• Reporting & tracking issues\n• Premium plans & payments\n• How the platform works\n• Staff & admin features\n\nWhat can I help you with today?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [unread, setUnread] = useState(0);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const { user } = useAuth();
  const { role, isPremium } = useRole();

  useEffect(() => {
    if (isOpen) {
      setUnread(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text) => {
    const messageText = text || input.trim();
    if (!messageText || loading) return;
    setInput('');

    const userMsg = { text: messageText, isUser: true, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      // Get the token from localStorage (Firebase stores it)
      const token = await user?.getIdToken();
      
      const response = await axios.post('http://localhost:3000/api/chat', {
        message: messageText,
        context: {
          userRole: role || 'citizen',
          isPremium: !!isPremium,
          userName: user?.displayName || 'there',
        },
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      const botMsg = { text: response.data.reply, isUser: false, timestamp: new Date() };
      setMessages(prev => [...prev, botMsg]);
      if (!isOpen) setUnread(u => u + 1);
    } catch (error) {
      console.error('Chat error details:', error.response?.data || error.message);
      let errorMessage = "I'm having trouble connecting right now. Please try again in a moment, or check our Help section for answers to common questions.";
      
      // Try to provide more specific error messages
      if (error.response?.status === 401) {
        errorMessage = "Your session has expired. Please refresh the page and log in again.";
      } else if (error.response?.status === 500) {
        errorMessage = "The AI service is temporarily unavailable. Please try again in a few minutes.";
      }
      
      setMessages(prev => [
        ...prev,
        {
          text: errorMessage,
          isUser: false,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatMessage = (text) => {
    return text.split('\n').map((line, i) => (
      <React.Fragment key={i}>
        {line}
        {i < text.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };

  const formatTime = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  // ── Floating button (closed state) ──────────────────────────────────────
  if (!isOpen) {
    return (
      <button
        onClick={() => { setIsOpen(true); setUnread(0); }}
        style={{
          position: 'fixed', bottom: '1.5rem', right: '1.5rem',
          width: 56, height: 56, borderRadius: '50%',
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          border: 'none', cursor: 'pointer',
          boxShadow: '0 4px 24px rgba(99,102,241,0.5)',
          zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'transform 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        title="Chat with CityFix Assistant"
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          <path d="M8 10h.01" /><path d="M12 10h.01" /><path d="M16 10h.01" />
        </svg>
        {unread > 0 && (
          <div style={{
            position: 'absolute', top: -4, right: -4,
            width: 20, height: 20, borderRadius: '50%',
            background: '#ef4444', color: '#fff',
            fontSize: '0.7rem', fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '2px solid #0a0a1a',
          }}>
            {unread}
          </div>
        )}
      </button>
    );
  }

  // ── Chat window ──────────────────────────────────────────────────────────
  return (
    <div style={{
      position: 'fixed', bottom: '1.5rem', right: '1.5rem',
      width: 380, height: isMinimized ? 62 : 520,
      background: 'rgba(10,10,26,0.98)',
      backdropFilter: 'blur(24px)',
      border: '1px solid rgba(99,102,241,0.3)',
      borderRadius: 20,
      boxShadow: '0 24px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(99,102,241,0.1)',
      zIndex: 1000,
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
      transition: 'height 0.3s ease',
      fontFamily: "'DM Sans', sans-serif",
    }}>

      {/* ── Header ── */}
      <div style={{
        padding: '0.85rem 1.1rem',
        background: 'linear-gradient(135deg, rgba(99,102,241,0.25), rgba(139,92,246,0.15))',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{
            width: 34, height: 34, borderRadius: '50%',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1rem', boxShadow: '0 0 12px rgba(99,102,241,0.5)',
            flexShrink: 0,
          }}>🤖</div>
          <div>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: '0.88rem', lineHeight: 1.2 }}>
              CityFix Assistant
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#34d399' }} />
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.68rem' }}>Online</span>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          <button
            onClick={() => setIsMinimized(m => !m)}
            style={{
              background: 'rgba(255,255,255,0.08)', border: 'none',
              borderRadius: 8, width: 28, height: 28, cursor: 'pointer',
              color: 'rgba(255,255,255,0.7)', fontSize: '1rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
            title={isMinimized ? 'Expand' : 'Minimize'}
          >
            {isMinimized ? '▲' : '▼'}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            style={{
              background: 'rgba(255,255,255,0.08)', border: 'none',
              borderRadius: 8, width: 28, height: 28, cursor: 'pointer',
              color: 'rgba(255,255,255,0.7)', fontSize: '1rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
            title="Close"
          >✕</button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* ── Messages ── */}
          <div style={{
            flex: 1, overflowY: 'auto', padding: '1rem',
            display: 'flex', flexDirection: 'column', gap: '0.85rem',
            scrollbarWidth: 'thin', scrollbarColor: 'rgba(99,102,241,0.3) transparent',
          }}>
            {messages.map((msg, idx) => (
              <div key={idx} style={{
                display: 'flex',
                flexDirection: msg.isUser ? 'row-reverse' : 'row',
                alignItems: 'flex-end', gap: '0.5rem',
              }}>
                {!msg.isUser && (
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.75rem',
                  }}>🤖</div>
                )}
                <div style={{ maxWidth: '78%' }}>
                  <div style={{
                    padding: '0.7rem 0.9rem',
                    borderRadius: msg.isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    background: msg.isUser
                      ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                      : 'rgba(255,255,255,0.07)',
                    border: msg.isUser ? 'none' : '1px solid rgba(255,255,255,0.08)',
                    color: '#fff',
                    fontSize: '0.845rem',
                    lineHeight: 1.55,
                    wordBreak: 'break-word',
                  }}>
                    {formatMessage(msg.text)}
                  </div>
                  <div style={{
                    color: 'rgba(255,255,255,0.2)', fontSize: '0.65rem',
                    marginTop: '0.25rem',
                    textAlign: msg.isUser ? 'right' : 'left',
                    paddingLeft: msg.isUser ? 0 : '0.25rem',
                    paddingRight: msg.isUser ? '0.25rem' : 0,
                  }}>
                    {formatTime(msg.timestamp)}
                  </div>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem' }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.75rem', flexShrink: 0,
                }}>🤖</div>
                <div style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '18px 18px 18px 4px',
                  background: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  display: 'flex', gap: '0.3rem', alignItems: 'center',
                }}>
                  {[0, 0.2, 0.4].map((delay, i) => (
                    <div key={i} style={{
                      width: 7, height: 7, borderRadius: '50%',
                      background: '#818cf8',
                      animation: `cfBounce 1.2s ${delay}s infinite ease-in-out`,
                    }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* ── Quick questions (show only at start) ── */}
          {messages.length <= 2 && (
            <div style={{
              padding: '0 1rem 0.75rem',
              display: 'flex', flexWrap: 'wrap', gap: '0.4rem',
            }}>
              {QUICK_QUESTIONS.map(q => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  style={{
                    background: 'rgba(99,102,241,0.1)',
                    border: '1px solid rgba(99,102,241,0.25)',
                    borderRadius: 999, padding: '0.3rem 0.7rem',
                    color: '#818cf8', fontSize: '0.72rem', fontWeight: 600,
                    cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.2)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.1)'; }}
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* ── Input area ── */}
          <div style={{
            padding: '0.75rem 1rem',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            display: 'flex', gap: '0.5rem', alignItems: 'flex-end',
            flexShrink: 0,
          }}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask me anything... (Enter to send)"
              rows={1}
              style={{
                flex: 1,
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '12px', padding: '0.65rem 0.9rem',
                color: '#fff', fontSize: '0.85rem', outline: 'none',
                fontFamily: "'DM Sans', sans-serif",
                resize: 'none', lineHeight: 1.5, maxHeight: 80,
                overflowY: 'auto',
              }}
            />
            <button
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
              style={{
                background: input.trim() && !loading
                  ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                  : 'rgba(99,102,241,0.2)',
                border: 'none', borderRadius: '12px',
                width: 38, height: 38, flexShrink: 0,
                cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s',
              }}
              title="Send message"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </>
      )}

      <style>{`
        @keyframes cfBounce {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default Chatbot;