import React from 'react';
import { Modal } from './Modal';
import { AlertCircle } from 'lucide-react';

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDestructive = false
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="440px">
      <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
        <div
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '9999px',
            backgroundColor: isDestructive ? '#FEE2E2' : '#FFF0F5',
            color: isDestructive ? '#EF4444' : '#FF4F91',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}
        >
          <AlertCircle size={22} />
        </div>
        <div>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            {message}
          </p>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '12px',
          marginTop: '24px'
        }}
      >
        <button className="btn btn-secondary" onClick={onClose}>
          {cancelText}
        </button>
        <button
          className={`btn ${isDestructive ? 'btn-reject' : 'btn-primary'}`}
          onClick={() => {
            onConfirm();
            onClose();
          }}
          style={isDestructive ? { backgroundColor: '#EF4444', color: '#FFF' } : {}}
        >
          {confirmText}
        </button>
      </div>
    </Modal>
  );
};
