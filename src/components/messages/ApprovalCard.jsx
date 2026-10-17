import React, { useState } from 'react';
import { Check, X, Edit3, Send, MessageSquare, Mail, Smartphone, ExternalLink } from 'lucide-react';
import { Avatar } from '../common/Avatar';
import { ChannelBadge, StatusBadge } from '../common/Badge';
import { messageService } from '../../services/messageService';

export const ApprovalCard = ({
  draft,
  onUpdateMessage,
  onApprove,
  onReject
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [messageText, setMessageText] = useState(draft.message);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleSaveEdit = () => {
    onUpdateMessage(draft.id, messageText);
    setIsEditing(false);
  };

  const isPending = draft.status === 'pending';

  return (
    <div
      className="card"
      style={{
        padding: '22px',
        border: isPending ? '1.5px solid #FFD4E2' : '1px solid var(--border-light)',
        boxShadow: isPending ? 'var(--shadow-md)' : 'var(--shadow-sm)',
        marginBottom: '18px'
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginBottom: '16px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <Avatar src={draft.avatar} name={draft.friendName} size={48} showBorder />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 800 }}>{draft.friendName}</h4>
              <StatusBadge status={draft.status} />
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              {draft.birthdayDetails || `${draft.channel} draft`}
            </p>
          </div>
        </div>

        <ChannelBadge channel={draft.channel} />
      </div>

      {/* Editable Message Box */}
      <div
        style={{
          backgroundColor: '#FFF9FA',
          border: '1.5px solid #FFE4ED',
          borderRadius: 'var(--radius-md)',
          padding: '16px',
          marginBottom: '16px',
          position: 'relative'
        }}
      >
        {isEditing ? (
          <div>
            <textarea
              className="form-textarea"
              rows={3}
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              maxLength={200}
              style={{ backgroundColor: '#FFFFFF', marginBottom: '8px' }}
            />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                {messageText.length}/200
              </span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => {
                    setMessageText(draft.message);
                    setIsEditing(false);
                  }}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={handleSaveEdit}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <p
              style={{
                fontSize: '0.94rem',
                color: 'var(--text-dark)',
                lineHeight: 1.5,
                whiteSpace: 'pre-wrap',
                marginBottom: '10px'
              }}
            >
              {draft.message}
            </p>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderTop: '1px solid #FFE8F0',
                paddingTop: '8px'
              }}
            >
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                {draft.message.length}/200 characters
              </span>

              {isPending && (
                <button
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    color: 'var(--primary-pink)'
                  }}
                  onClick={() => setIsEditing(true)}
                >
                  <Edit3 size={13} />
                  <span>Edit Message</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Prototype Transparent Notice */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          marginBottom: '16px',
          backgroundColor: '#FAF7FA',
          padding: '6px 12px',
          borderRadius: 'var(--radius-sm)'
        }}
      >
        <span>
          ℹ️ UI Prototype: Approval records action locally. Never sends without explicit confirmation.
        </span>
      </div>

      {/* Action Buttons */}
      {isPending ? (
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button
            className="btn btn-reject"
            onClick={() => onReject(draft.id)}
            style={{ minWidth: '100px' }}
          >
            <X size={16} />
            <span>Reject</span>
          </button>

          <button
            className="btn btn-primary"
            onClick={() => onApprove(draft.id)}
            style={{ minWidth: '130px' }}
          >
            <Check size={16} />
            <span>Approve</span>
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
            Status: <strong>{draft.status.toUpperCase()}</strong>
          </span>

          {draft.status === 'approved' && draft.channel === 'WhatsApp' && (
            <a
              href={messageService.getWhatsAppUrl(draft.phone, draft.message)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary btn-sm"
              style={{ color: '#16A34A', borderColor: '#BBF7D0' }}
            >
              <MessageSquare size={14} />
              <span>Open in WhatsApp</span>
              <ExternalLink size={12} />
            </a>
          )}
        </div>
      )}
    </div>
  );
};
