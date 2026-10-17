import React, { useState, useMemo } from 'react';
import { CheckSquare, ShieldCheck, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ApprovalCard } from '../components/messages/ApprovalCard';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { EmptyState } from '../components/common/EmptyState';

export const Approvals = () => {
  const { drafts, updateDraft, approveDraft, rejectDraft } = useApp();

  const [activeTab, setActiveTab] = useState('pending'); // 'pending' | 'approved' | 'rejected'
  const [draftToApprove, setDraftToApprove] = useState(null);
  const [draftToReject, setDraftToReject] = useState(null);

  const pendingCount = useMemo(() => {
    return drafts.filter(d => d.status === 'pending').length;
  }, [drafts]);

  const filteredDrafts = useMemo(() => {
    return drafts.filter(d => d.status === activeTab);
  }, [drafts, activeTab]);

  const handleConfirmApproval = () => {
    if (draftToApprove) {
      approveDraft(draftToApprove.id, true);
      setDraftToApprove(null);
    }
  };

  const handleConfirmRejection = () => {
    if (draftToReject) {
      rejectDraft(draftToReject.id, 'Rejected by user');
      setDraftToReject(null);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Approval Center</h1>
          <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            Review, personalize, and explicitly authorize birthday wishes before dispatch.
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#F0E9FF',
            color: '#6B21A8',
            padding: '8px 14px',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.82rem',
            fontWeight: 700
          }}
        >
          <ShieldCheck size={16} />
          <span>Zero Auto-Dispatch Without Consent</span>
        </div>
      </div>

      {/* Tabs matching UI mockup: Pending (3), Approved, Rejected */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          borderBottom: '1px solid var(--border-light)',
          paddingBottom: '12px'
        }}
      >
        <button
          className={`btn-sm ${activeTab === 'pending' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('pending')}
          style={{ borderRadius: '9999px', padding: '7px 18px' }}
        >
          Pending ({pendingCount})
        </button>
        <button
          className={`btn-sm ${activeTab === 'approved' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('approved')}
          style={{ borderRadius: '9999px', padding: '7px 18px' }}
        >
          Approved
        </button>
        <button
          className={`btn-sm ${activeTab === 'rejected' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('rejected')}
          style={{ borderRadius: '9999px', padding: '7px 18px' }}
        >
          Rejected
        </button>
      </div>

      {/* Drafts List */}
      <div style={{ maxWidth: '820px', width: '100%' }}>
        {filteredDrafts.length > 0 ? (
          filteredDrafts.map((draft) => (
            <ApprovalCard
              key={draft.id}
              draft={draft}
              onUpdateMessage={updateDraft}
              onApprove={() => setDraftToApprove(draft)}
              onReject={() => setDraftToReject(draft)}
            />
          ))
        ) : (
          <EmptyState
            icon={activeTab === 'pending' ? '🎉' : '📂'}
            title={`No ${activeTab} drafts`}
            description={
              activeTab === 'pending'
                ? 'All birthday wishes have been reviewed! When new birthdays are detected, drafts will appear here.'
                : `There are currently no ${activeTab} messages.`
            }
          />
        )}
      </div>

      {/* Explicit Approval Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(draftToApprove)}
        onClose={() => setDraftToApprove(null)}
        onConfirm={handleConfirmApproval}
        title="Approve Birthday Wish"
        message={`Are you sure you want to approve this birthday message for ${draftToApprove?.friendName} via ${draftToApprove?.channel}? In this prototype stage, this records the approval and prepares your message.`}
        confirmText="Approve & Send"
      />

      {/* Rejection Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(draftToReject)}
        onClose={() => setDraftToReject(null)}
        onConfirm={handleConfirmRejection}
        title="Reject Wish Draft"
        message={`Reject message draft for ${draftToReject?.friendName}? It will be archived and will not be dispatched.`}
        confirmText="Reject Draft"
        isDestructive={true}
      />
    </div>
  );
};
