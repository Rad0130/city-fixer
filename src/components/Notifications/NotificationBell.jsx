import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import useAuth from '../../Hooks/useAuth';
import { io } from 'socket.io-client';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [dropdownTop, setDropdownTop] = useState(60);
  const dropdownRef = useRef(null);
  const socketRef = useRef(null);
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Update dropdown top position when opening
  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      setDropdownTop(rect.bottom + 8);
    }
  }, [isOpen]);

  // Get API URL from environment
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  // Fetch notifications
  const fetchNotifications = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [notifRes, countRes] = await Promise.all([
        axiosSecure.get('/notifications'),
        axiosSecure.get('/notifications/unread-count'),
      ]);
      setNotifications(notifRes.data);
      setUnreadCount(countRes.data.count);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  // Connect to Socket.IO
  useEffect(() => {
    if (!user) return;

    socketRef.current = io(API_URL, {
      transports: ['websocket'],
      withCredentials: true,
    });

    socketRef.current.on('connect', () => {
      console.log('Socket connected');
      socketRef.current.emit('user-connected', user.email);
    });

    socketRef.current.on('new-notification', (notification) => {
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
    });

    fetchNotifications();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [user]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Mark single notification as read
  const markAsRead = async (id) => {
    try {
      await axiosSecure.patch(`/notifications/${id}/read`);
      setNotifications(prev =>
        prev.map(notif =>
          notif._id === id ? { ...notif, read: true } : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      await axiosSecure.patch('/notifications/read-all');
      setNotifications(prev =>
        prev.map(notif => ({ ...notif, read: true }))
      );
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  const getNotificationIcon = (type) => {
    const icons = {
      NEW_USER_REGISTERED: '👤',
      EMAIL_VERIFIED: '✅',
      NEW_ISSUE_REPORTED: '📝',
      ISSUE_ASSIGNED: '🔧',
      ISSUE_ASSIGNED_TO_STAFF: '🛠️',
      ISSUE_STATUS_UPDATED: '🔄',
      STAFF_REQUEST_APPROVED: '🎉',
      STAFF_REQUEST_REJECTED: '📬',
      NEW_COMMENT: '💬',
      ISSUE_UPVOTED: '👍',
    };
    return icons[type] || '🔔';
  };

  const getNotificationColor = (type) => {
    const colors = {
      NEW_USER_REGISTERED: '#818cf8',
      EMAIL_VERIFIED: '#34d399',
      NEW_ISSUE_REPORTED: '#f472b6',
      ISSUE_ASSIGNED: '#34d399',
      ISSUE_STATUS_UPDATED: '#22d3ee',
      STAFF_REQUEST_APPROVED: '#34d399',
      NEW_COMMENT: '#818cf8',
      ISSUE_UPVOTED: '#fbbf24',
    };
    return colors[type] || '#64748b';
  };

  const formatTime = (date) => {
    const now = new Date();
    const diff = now - new Date(date);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return new Date(date).toLocaleDateString();
  };

  if (!user) return null;

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      {/* Bell Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'relative',
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '10px',
          width: isMobile ? 36 : 40,
          height: isMobile ? 36 : 40,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
      >
        <svg width={isMobile ? "18" : "20"} height={isMobile ? "18" : "20"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'rgba(255,255,255,0.7)' }}>
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute',
            top: -4,
            right: -4,
            background: '#ef4444',
            color: '#fff',
            fontSize: '0.6rem',
            fontWeight: 700,
            minWidth: isMobile ? '16px' : '18px',
            height: isMobile ? '16px' : '18px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 3px',
            border: '2px solid #0a0a1a',
          }}>
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          top: dropdownTop,
          right: isMobile ? '0.75rem' : '1rem',
          width: isMobile ? `min(300px, calc(100vw - 1.5rem))` : '380px',
          background: 'rgba(13,17,30,0.98)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '16px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          zIndex: 10000,
          overflow: 'hidden',
        }}>
          {/* Header */}
          <div style={{
            padding: isMobile ? '0.65rem 0.75rem' : '1rem',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '0.5rem',
          }}>
            <h3 style={{
              color: '#fff',
              margin: 0,
              fontSize: isMobile ? '0.85rem' : '1rem',
              fontWeight: 600,
            }}>
              Notifications
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                style={{
                  background: 'rgba(99,102,241,0.15)',
                  border: '1px solid rgba(99,102,241,0.3)',
                  borderRadius: '6px',
                  padding: isMobile ? '0.2rem 0.5rem' : '0.25rem 0.75rem',
                  color: '#818cf8',
                  fontSize: isMobile ? '0.65rem' : '0.7rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                Mark all as read
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div style={{
            maxHeight: isMobile ? '55vh' : '400px',
            overflowY: 'auto',
          }}>
            {loading ? (
              <div style={{
                padding: '2rem',
                textAlign: 'center',
                color: '#64748b',
                fontSize: isMobile ? '0.8rem' : '0.9rem',
              }}>
                Loading...
              </div>
            ) : notifications.length === 0 ? (
              <div style={{
                padding: '2rem',
                textAlign: 'center',
                color: '#64748b',
                fontSize: isMobile ? '0.8rem' : '0.9rem',
              }}>
                No notifications yet
              </div>
            ) : (
              notifications.map((notif) => (
                <Link
                  key={notif._id}
                  to={notif.link || '#'}
                  onClick={() => {
                    if (!notif.read) markAsRead(notif._id);
                    setIsOpen(false);
                  }}
                  style={{
                    display: 'flex',
                    gap: isMobile ? '0.5rem' : '0.75rem',
                    padding: isMobile ? '0.6rem 0.75rem' : '0.75rem 1rem',
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    textDecoration: 'none',
                    transition: 'all 0.2s',
                    background: notif.read ? 'transparent' : 'rgba(99,102,241,0.05)',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = notif.read
                      ? 'transparent'
                      : 'rgba(99,102,241,0.05)';
                  }}
                >
                  {/* Icon */}
                  <div style={{
                    width: isMobile ? 32 : 40,
                    height: isMobile ? 32 : 40,
                    borderRadius: '50%',
                    background: `${getNotificationColor(notif.type)}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: isMobile ? '0.9rem' : '1.2rem',
                    flexShrink: 0,
                  }}>
                    {getNotificationIcon(notif.type)}
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      color: '#e2e8f0',
                      fontSize: isMobile ? '0.75rem' : '0.85rem',
                      fontWeight: notif.read ? 500 : 600,
                      marginBottom: '0.2rem',
                    }}>
                      {notif.title}
                    </div>
                    <p style={{
                      color: '#94a3b8',
                      fontSize: isMobile ? '0.68rem' : '0.75rem',
                      margin: 0,
                      lineHeight: 1.4,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                    }}>
                      {notif.message}
                    </p>
                    <div style={{
                      color: '#475569',
                      fontSize: isMobile ? '0.58rem' : '0.65rem',
                      marginTop: '0.2rem',
                    }}>
                      {formatTime(notif.createdAt)}
                    </div>
                  </div>

                  {/* Unread dot */}
                  {!notif.read && (
                    <div style={{
                      width: isMobile ? 6 : 8,
                      height: isMobile ? 6 : 8,
                      borderRadius: '50%',
                      background: '#818cf8',
                      flexShrink: 0,
                      marginTop: '8px',
                    }} />
                  )}
                </Link>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;