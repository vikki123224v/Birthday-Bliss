import React, { useState, useMemo } from 'react';
import { useSearchParams, useOutletContext, useNavigate } from 'react-router-dom';
import { Search, Plus, Filter, Users, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { FriendCard } from '../components/friends/FriendCard';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { EmptyState } from '../components/common/EmptyState';

export const Friends = () => {
  const { friends, deleteFriend, sendWishNow } = useApp();
  const { onOpenAddFriend } = useOutletContext();
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();
  const queryFromUrl = searchParams.get('search') || '';
  
  const [searchQuery, setSearchQuery] = useState(queryFromUrl);
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'upcoming' | 'alpha'
  const [friendToDelete, setFriendToDelete] = useState(null);

  // Sync state if URL query changes
  React.useEffect(() => {
    if (queryFromUrl) {
      setSearchQuery(queryFromUrl);
    }
  }, [queryFromUrl]);

  const filteredFriends = useMemo(() => {
    let list = [...friends];

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(f => 
        f.name.toLowerCase().includes(q) ||
        (f.relationship && f.relationship.toLowerCase().includes(q)) ||
        (f.email && f.email.toLowerCase().includes(q))
      );
    }

    // Tab filter
    if (activeFilter === 'upcoming') {
      list.sort((a, b) => a.daysLeft - b.daysLeft);
    } else if (activeFilter === 'alpha') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }

    return list;
  }, [friends, searchQuery, activeFilter]);

  const handleSendWish = (friend) => {
    sendWishNow(friend);
    navigate('/approvals');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Friends & Birthdays</h1>
          <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            Manage your loved ones and their special days ({friends.length} total)
          </p>
        </div>

        <button className="btn btn-primary" onClick={() => onOpenAddFriend()}>
          <Plus size={18} />
          <span>Add New Friend</span>
        </button>
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
        {/* Search input */}
        <div style={{ position: 'relative', flex: 1, minWidth: '240px', maxWidth: '400px' }}>
          <Search
            size={18}
            color="var(--text-muted)"
            style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
          />
          <input
            type="text"
            className="form-input"
            placeholder="Search by name, relationship, email..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSearchParams(e.target.value ? { search: e.target.value } : {});
            }}
            style={{ paddingLeft: '38px', paddingRight: searchQuery ? '36px' : '14px', paddingTop: '8px', paddingBottom: '8px' }}
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSearchParams({});
              }}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)'
              }}
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Filter Chips matching UI mockup: All (12), Upcoming, A-Z */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            className={`btn-sm ${activeFilter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveFilter('all')}
            style={{ borderRadius: '9999px', padding: '6px 14px' }}
          >
            All ({friends.length})
          </button>
          <button
            className={`btn-sm ${activeFilter === 'upcoming' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveFilter('upcoming')}
            style={{ borderRadius: '9999px', padding: '6px 14px' }}
          >
            Upcoming
          </button>
          <button
            className={`btn-sm ${activeFilter === 'alpha' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveFilter('alpha')}
            style={{ borderRadius: '9999px', padding: '6px 14px' }}
          >
            A-Z
          </button>
        </div>
      </div>

      {/* Friends Cards Grid */}
      {filteredFriends.length > 0 ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
            gap: '18px'
          }}
        >
          {filteredFriends.map((friend) => (
            <FriendCard
              key={friend.id}
              friend={friend}
              onSendWish={handleSendWish}
              onEdit={() => onOpenAddFriend(friend)}
              onDelete={(id) => setFriendToDelete(id)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon="🔍"
          title="No friends found"
          description={
            searchQuery
              ? `No results matching "${searchQuery}". Try a different keyword.`
              : 'Your friends list is currently empty.'
          }
          action={
            searchQuery ? (
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  setSearchQuery('');
                  setSearchParams({});
                }}
              >
                Clear Search
              </button>
            ) : (
              <button className="btn btn-primary btn-sm" onClick={() => onOpenAddFriend()}>
                <Plus size={16} /> Add First Friend
              </button>
            )
          }
        />
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(friendToDelete)}
        onClose={() => setFriendToDelete(null)}
        onConfirm={() => {
          if (friendToDelete) {
            deleteFriend(friendToDelete);
          }
        }}
        title="Delete Friend"
        message="Are you sure you want to remove this friend? Their upcoming birthday reminders and saved greetings will be cancelled."
        confirmText="Delete"
        isDestructive={true}
      />
    </div>
  );
};
