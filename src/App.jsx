import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AppProvider } from './context/AppContext';
import { AppLayout } from './components/layout/AppLayout';
import { Dashboard } from './pages/Dashboard';
import { Friends } from './pages/Friends';
import { Approvals } from './pages/Approvals';
import { History } from './pages/History';
import { Settings } from './pages/Settings';
import { Login } from './pages/Login';
import './styles/global.css';

export function App() {
  return (
    <AppProvider>
      <HashRouter>
        <Routes>
          {/* Main App Layout */}
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="friends" element={<Friends />} />
            <Route path="approvals" element={<Approvals />} />
            <Route path="history" element={<History />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Auth Route */}
          <Route path="/login" element={<Login />} />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* Global Toast Notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              background: '#FFFFFF',
              color: '#30243A',
              fontWeight: 600,
              fontSize: '0.88rem',
              borderRadius: '14px',
              border: '1px solid #FFE0EC',
              boxShadow: '0 8px 24px rgba(255, 79, 145, 0.15)',
              padding: '12px 18px'
            },
            success: {
              iconTheme: {
                primary: '#FF4F91',
                secondary: '#FFFFFF'
              }
            }
          }}
        />
      </HashRouter>
    </AppProvider>
  );
}

export default App;
