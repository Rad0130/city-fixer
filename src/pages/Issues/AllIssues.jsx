import React, { useState, useRef, useEffect } from 'react';
import useAxios from '../../Hooks/useAxios';
import { useQuery } from '@tanstack/react-query';
import IssueCard from './IssueCard';
import NoIssuesFound from './NoIssuesFound';

const AllIssues = () => {
  const axios = useAxios();
  const [filters, setFilters] = useState({ categories: [], status: [], priority: [] });
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const searchInputRef = useRef(null);
  const isTypingRef = useRef(false);

  // ── FIX: reset page whenever filters or search change ─────────────────────
  useEffect(() => {
    setCurrentPage(0);
  }, [filters, search]);

  const { data: issues = [], isLoading, isFetching } = useQuery({
    queryKey: ['issues', filters, search, currentPage],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.categories.length) params.append('category', filters.categories.join(','));
      if (filters.status.length) params.append('status', filters.status.join(','));
      if (filters.priority.length) params.append('priority', filters.priority.join(','));
      if (search) params.append('search', search);
      params.append('limit', '10');
      params.append('skip', String(currentPage * 10));
      const res = await axios.get(`/issues?${params.toString()}`);
      return res.data;
    },
    keepPreviousData: true,
    staleTime: 3000,
    cacheTime: 10000,
  });

  const { data: countData } = useQuery({
    queryKey: ['issues-count', filters, search],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.categories.length) params.append('category', filters.categories.join(','));
      if (filters.status.length) params.append('status', filters.status.join(','));
      if (filters.priority.length) params.append('priority', filters.priority.join(','));
      if (search) params.append('search', search);
      const res = await axios.get(`/issues/count?${params.toString()}`);
      return res.data.count;
    },
  });
  const count = countData || 0;

  const handleSearchChange = (e) => {
    isTypingRef.current = true;
    setSearch(e.target.value);
  };

  // Keep focus in search box after re-render
  useEffect(() => {
    if (isTypingRef.current && searchInputRef.current) {
      const input = searchInputRef.current;
      input.focus();
      input.setSelectionRange(input.value.length, input.value.length);
      isTypingRef.current = false;
    }
  }, [issues, filters, search]);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a1a 0%, #0d1b3e 40%, #0a1628 70%, #0f0a2e 100%)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', border: '3px solid rgba(99,102,241,0.2)', borderTop: '3px solid #6366f1', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }} />
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>Loading issues...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    );
  }

  const isSelected = (type, value) => filters[type].includes(value);
  const categories = [...new Set(issues.map(issue => issue.category).filter(Boolean))];

  const toggleFilter = (type, value) => {
    setFilters(prev => {
      const exists = prev[type].includes(value);
      return { ...prev, [type]: exists ? prev[type].filter(i => i !== value) : [...prev[type], value] };
    });
  };

  // FIX: only High and Normal — no Low/Medium
  const allStatus = ['Pending', 'In Progress', 'Resolved', 'Closed', 'Rejected'];
  const priorityOptions = ['High', 'Normal'];
  const totalPages = Math.ceil(count / 10);
  const activeFilterCount = filters.categories.length + filters.status.length + filters.priority.length;

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a1a 0%, #0d1b3e 40%, #0a1628 70%, #0f0a2e 100%)', fontFamily: "'DM Sans', sans-serif", paddingTop: '5rem' }}>
      {/* Background orbs */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '50vw', height: '50vw', maxWidth: 700, background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '10%', left: '-10%', width: '40vw', height: '40vw', maxWidth: 500, background: 'radial-gradient(circle, rgba(236,72,153,0.08) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
      </div>

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '2rem clamp(1rem,4vw,2rem)', position: 'relative', zIndex: 1 }}>

        {/* ── PAGE HEADER ── */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'inline-block', background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(236,72,153,0.2))', border: '1px solid rgba(99,102,241,0.35)', borderRadius: 999, padding: '0.3rem 1rem', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.18em', color: '#a5b4fc', textTransform: 'uppercase' }}>✦ Community Reports</span>
          </div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, background: 'linear-gradient(135deg, #ffffff 30%, #a5b4fc 60%, #f9a8d4 90%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginBottom: '0.5rem' }}>
            All Issues
            <span style={{ marginLeft: '1rem', fontSize: '1.2rem', background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.4)', borderRadius: 999, padding: '0.2rem 0.9rem', color: '#a5b4fc', fontWeight: 700, WebkitTextFillColor: '#a5b4fc' }}>
              {count}
            </span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.95rem' }}>
            Browse, filter, and upvote infrastructure issues reported by citizens.
          </p>
        </div>

        {/* ── CONTROLS BAR ── */}
        <div style={{
          background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 16, padding: '1.2rem 1.5rem', backdropFilter: 'blur(12px)',
          marginBottom: '2rem', display: 'flex', flexWrap: 'wrap', gap: '1rem',
          alignItems: 'center', justifyContent: 'space-between',
          position: 'relative', zIndex: 100,
        }}>
          {/* Search */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '0.6rem 1rem', flex: '1', maxWidth: 360 }}>
            <svg width="16" height="16" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2.5" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
            </svg>
            <input
              ref={searchInputRef}
              onChange={handleSearchChange}
              value={search}
              type="search"
              placeholder="Search by title, category, location..."
              style={{ background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: '0.9rem', width: '100%', fontFamily: "'DM Sans', sans-serif" }}
            />
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
            {activeFilterCount > 0 && (
              <button
                onClick={() => setFilters({ categories: [], status: [], priority: [] })}
                style={{ background: 'rgba(236,72,153,0.15)', border: '1px solid rgba(236,72,153,0.3)', borderRadius: 999, padding: '0.4rem 0.9rem', color: '#f472b6', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
              >
                ✕ Clear {activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''}
              </button>
            )}

            <FilterDropdown label="Category" color="#818cf8">
              {categories.map(cat => (
                <FilterBtn key={cat} label={cat} active={isSelected('categories', cat)} color="#6366f1" onClick={() => toggleFilter('categories', cat)} />
              ))}
            </FilterDropdown>

            <FilterDropdown label="Status" color="#34d399">
              {allStatus.map(s => (
                <FilterBtn key={s} label={s} active={isSelected('status', s)} color="#10b981" onClick={() => toggleFilter('status', s)} />
              ))}
            </FilterDropdown>

            <FilterDropdown label="Priority" color="#f472b6">
              {priorityOptions.map(p => (
                <FilterBtn key={p} label={p} active={isSelected('priority', p)} color="#ec4899" onClick={() => toggleFilter('priority', p)} />
              ))}
            </FilterDropdown>
          </div>
        </div>

        {/* Fetching indicator */}
        {isFetching && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem', color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>
            <div style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid rgba(99,102,241,0.3)', borderTop: '2px solid #6366f1', animation: 'spin 0.8s linear infinite' }} />
            Updating results...
          </div>
        )}

        {/* Issue Grid */}
        {issues.length === 0 && !isFetching ? (
          <NoIssuesFound />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
            {issues.map(issue => (
              <IssueCard key={issue._id} issue={issue} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '3rem', flexWrap: 'wrap' }}>
            <PaginationBtn label="← Prev" disabled={currentPage === 0} onClick={() => setCurrentPage(p => p - 1)} />
            {[...Array(totalPages).keys()].map(i => (
              <PaginationBtn key={i} label={i + 1} active={i === currentPage} onClick={() => setCurrentPage(i)} />
            ))}
            <PaginationBtn label="Next →" disabled={currentPage === totalPages - 1} onClick={() => setCurrentPage(p => p + 1)} />
          </div>
        )}
      </div>
    </div>
  );
};

const FilterDropdown = ({ label, color, children }) => (
  <div className="dropdown dropdown-end">
    <div tabIndex={0} role="button" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, padding: '0.5rem 1rem', color: color || '#fff', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
      {label}
      <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
    <ul tabIndex="-1" className="dropdown-content" style={{ background: 'rgba(13,17,30,0.97)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, padding: '0.6rem', minWidth: 160, marginTop: '0.4rem', boxShadow: '0 20px 60px rgba(0,0,0,0.5)', listStyle: 'none', zIndex: 9999 }}>
      {children}
    </ul>
  </div>
);

const FilterBtn = ({ label, active, color, onClick }) => (
  <li style={{ marginBottom: '0.3rem' }}>
    <button onClick={onClick} style={{ width: '100%', textAlign: 'left', padding: '0.5rem 0.75rem', borderRadius: 8, background: active ? `${color}25` : 'transparent', border: active ? `1px solid ${color}60` : '1px solid transparent', color: active ? color : 'rgba(255,255,255,0.6)', fontSize: '0.85rem', fontWeight: active ? 700 : 400, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      {active && <span style={{ color }}>✓</span>}
      {label}
    </button>
  </li>
);

const PaginationBtn = ({ label, active, disabled, onClick }) => (
  <button onClick={onClick} disabled={disabled} style={{ minWidth: 40, height: 40, borderRadius: 10, background: active ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'rgba(255,255,255,0.04)', border: active ? 'none' : '1px solid rgba(255,255,255,0.08)', color: active ? '#fff' : disabled ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.6)', fontSize: '0.875rem', fontWeight: active ? 700 : 500, cursor: disabled ? 'not-allowed' : 'pointer', padding: '0 0.75rem', boxShadow: active ? '0 0 20px rgba(99,102,241,0.4)' : 'none', fontFamily: "'DM Sans', sans-serif" }}>
    {label}
  </button>
);

export default AllIssues;