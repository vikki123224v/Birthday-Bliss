import React from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Users, Cake, Calendar, Send, Sparkles, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BirthdayHero } from '../components/birthday/BirthdayHero';
import { StatCard } from '../components/birthday/StatCard';
import { TodayBirthdayCard } from '../components/birthday/TodayBirthdayCard';
import { UpcomingBirthdayCard } from '../components/birthday/UpcomingBirthdayCard';
import { EmptyState } from '../components/common/EmptyState';

export const Dashboard = () => {
  const { 
    todayBirthdays, 
    upcomingBirthdays, 
    stats, 
    deleteFriend, 
    sendWishNow,
    triggerConfetti 
  } = useApp();

  const { onOpenAddFriend } = useOutletContext();
  const navigate = useNavigate();

  const primaryTodayFriend = todayBirthdays[0] || null;

  const handleSendWish = (friend) => {
    sendWishNow(friend);
    navigate('/approvals');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Welcome Heading */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-dark)' }}>
            Good things are worth celebrating. 🎉
          </h1>
          <p style={{ fontSize: '0.94rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Keep the people you love close, one birthday at a time.
          </p>
        </div>
      </div>

      {/* Birthday Hero Banner */}
      <BirthdayHero
        todayFriend={primaryTodayFriend}
        onSendWish={handleSendWish}
        onAddFriend={() => onOpenAddFriend()}
      />

      {/* 4 Statistics Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '16px'
        }}
      >
        <StatCard
          icon={Users}
          iconColor="#8B5CF6"
          iconBg="#F5F3FF"
          count={stats.totalFriends}
          label="Total Friends"
          onClick={() => navigate('/friends')}
        />
        <StatCard
          icon={Cake}
          iconColor="#FF4F91"
          iconBg="#FFF0F5"
          count={stats.todayBirthdays}
          label="Birthdays Today"
          onClick={() => {
            if (stats.todayBirthdays > 0) triggerConfetti();
          }}
        />
        <StatCard
          icon={Calendar}
          iconColor="#0EA5E9"
          iconBg="#F0F9FF"
          count={stats.upcomingBirthdays}
          label="Upcoming Birthdays"
          onClick={() => navigate('/friends')}
        />
        <StatCard
          icon={Send}
          iconColor="#FF8066"
          iconBg="#FFF4F0"
          count={stats.pendingApprovals}
          label="Awaiting Approval"
          onClick={() => navigate('/approvals')}
        />
      </div>

      {/* Main Content Sections: Today's Birthdays & Upcoming Birthdays */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.1fr 1fr',
          gap: '24px',
          marginTop: '12px'
        }}
        className="dashboard-two-col"
      >
        {/* Left: Today's Birthdays */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🎉 Today's Birthdays</span>
              <span className="badge badge-today">{todayBirthdays.length}</span>
            </h3>
          </div>

          {todayBirthdays.length > 0 ? (
            todayBirthdays.map((friend) => (
              <TodayBirthdayCard
                key={friend.id}
                friend={friend}
                onSendWish={handleSendWish}
              />
            ))
          ) : (
            <EmptyState
              icon="🎈"
              title="No birthdays today"
              description="No celebrations scheduled for today. Check upcoming birthdays to plan ahead!"
              action={
                <button className="btn btn-secondary btn-sm" onClick={() => onOpenAddFriend()}>
                  Add a Friend
                </button>
              }
            />
          )}

          {/* Quick Message Approval Callout if pending */}
          {stats.pendingApprovals > 0 && (
            <div
              className="card"
              style={{
                background: 'linear-gradient(135deg, #FFF9FA 0%, #FFF0F5 100%)',
                border: '1.5px solid #FFD4E2',
                padding: '18px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: '10px'
              }}
            >
              <div>
                <h5 style={{ fontSize: '0.94rem', fontWeight: 700, color: 'var(--primary-pink)' }}>
                  {stats.pendingApprovals} Message Drafts Ready for Review
                </h5>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Review and approve personalized wishes before sending.
                </p>
              </div>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => navigate('/approvals')}
              >
                Review Now <ArrowRight size={14} />
              </button>
            </div>
          )}
        </div>

        {/* Right: Upcoming Birthdays */}
        <div className="card" style={{ padding: '20px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px'
            }}
          >
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>📅 Upcoming Birthdays</span>
            </h3>
            <button
              style={{
                fontSize: '0.84rem',
                color: 'var(--primary-pink)',
                fontWeight: 700
              }}
              onClick={() => navigate('/friends')}
            >
              View All
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {upcomingBirthdays.slice(0, 5).map((friend) => (
              <UpcomingBirthdayCard
                key={friend.id}
                friend={friend}
                onSendWish={handleSendWish}
                onEdit={() => onOpenAddFriend(friend)}
                onDelete={deleteFriend}
              />
            ))}

            {upcomingBirthdays.length === 0 && (
              <p style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                No upcoming birthdays in your circle yet.
              </p>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .dashboard-two-col {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
