import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { BottomNav } from './BottomNav';
import { MobileDrawer } from './MobileDrawer';
import { FriendFormModal } from '../friends/FriendFormModal';
import { useApp } from '../../context/AppContext';

export const AppLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAddFriendOpen, setIsAddFriendOpen] = useState(false);
  const [editingFriend, setEditingFriend] = useState(null);

  const { addFriend, updateFriend } = useApp();

  const handleOpenAdd = (friendToEdit = null) => {
    setEditingFriend(friendToEdit);
    setIsAddFriendOpen(true);
  };

  const handleSaveFriend = (data) => {
    if (editingFriend?.id) {
      updateFriend(editingFriend.id, data);
    } else {
      addFriend(data);
    }
    setEditingFriend(null);
  };

  return (
    <div className="app-container">
      {/* Desktop Sidebar */}
      <div className="desktop-sidebar-container">
        <Sidebar />
      </div>

      {/* Main Column */}
      <div className="main-content">
        <Topbar
          onOpenMenu={() => setIsMobileMenuOpen(true)}
          onOpenAddFriend={() => handleOpenAdd()}
        />

        <main className="page-wrapper">
          <Outlet context={{ onOpenAddFriend: handleOpenAdd }} />
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav onOpenAddFriend={() => handleOpenAdd()} />

      {/* Mobile Slide-in Drawer */}
      <MobileDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Global Add/Edit Friend Modal */}
      <FriendFormModal
        isOpen={isAddFriendOpen}
        onClose={() => {
          setIsAddFriendOpen(false);
          setEditingFriend(null);
        }}
        onSave={handleSaveFriend}
        initialData={editingFriend}
      />

      <style>{`
        @media (max-width: 1023px) {
          .desktop-sidebar-container {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};
