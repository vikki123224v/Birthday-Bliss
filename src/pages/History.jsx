import React, { useState, useMemo } from 'react';
import { Search, History as HistoryIcon, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ChannelBadge, StatusBadge } from '../components/common/Badge';
import { EmptyState } from '../components/common/EmptyState';

export const History = () => {
  const { history } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredHistory = useMemo(() => {
    return history.filter((item) => {
      const matchSearch =
        !searchTerm.trim() ||
        item.recipient.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
        item.message.toLowerCase().includes(searchTerm.toLowerCase().trim());

      const matchStatus = statusFilter === 'all' || item.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [history, searchTerm, statusFilter]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Message History</h1>
        <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', marginTop: '2px' }}>
          Audit trail of all prepared, approved, dispatched, and delivered birthday wishes.
        </p>
      </div>

      {/* Search & Filter Toolbar */}
      <div
        className="card"
        style={{
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px'
        }}
      >
        <div style={{ position: 'relative', flex: 1, minWidth: '240px', maxWidth: '380px' }}>
          <Search
            size={18}
            color="var(--text-muted)"
            style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
          />
          <input
            type="text"
            className="form-input"
            placeholder="Search by recipient or content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '38px', paddingTop: '8px', paddingBottom: '8px' }}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)' }}
            >
              <X size={15} color="var(--text-muted)" />
            </button>
          )}
        </div>

        {/* Status Filters */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {['all', 'sent', 'delivered', 'approved', 'rejected', 'failed'].map((st) => (
            <button
              key={st}
              className={`btn-sm ${statusFilter === st ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setStatusFilter(st)}
              style={{ borderRadius: '9999px', textTransform: 'capitalize', padding: '6px 14px' }}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* History Items List */}
      {filteredHistory.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredHistory.map((item) => (
            <div
              key={item.id}
              className="card card-hover"
              style={{
                padding: '18px 22px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{item.recipient}</h4>
                  <ChannelBadge channel={item.channel} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <StatusBadge status={item.status} />
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.date}</span>
                </div>
              </div>

              <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                "{item.message}"
              </p>

              {item.errorReason && (
                <div
                  style={{
                    fontSize: '0.78rem',
                    color: 'var(--color-danger)',
                    backgroundColor: '#FEF2F2',
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-sm)',
                    marginTop: '4px'
                  }}
                >
                  Gateway response: {item.errorReason}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon="📜"
          title="No history records found"
          description={
            searchTerm
              ? `No messages matched "${searchTerm}".`
              : 'As birthday messages are approved and dispatched, your delivery history will be listed here.'
          }
        />
      )}
    </div>
  );
};
