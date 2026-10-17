import React from 'react';
import { MessageSquare, Mail, Smartphone, Clock, CheckCircle2, Send, CheckCheck, XCircle, AlertCircle } from 'lucide-react';

export const ChannelBadge = ({ channel = 'WhatsApp', size = 'sm' }) => {
  const ch = channel.toLowerCase();
  
  if (ch === 'whatsapp') {
    return (
      <span className="badge badge-whatsapp">
        <MessageSquare size={13} />
        WhatsApp
      </span>
    );
  }

  if (ch === 'email') {
    return (
      <span className="badge badge-email">
        <Mail size={13} />
        Email
      </span>
    );
  }

  return (
    <span className="badge badge-sms">
      <Smartphone size={13} />
      SMS
    </span>
  );
};

export const StatusBadge = ({ status = 'pending' }) => {
  const st = status.toLowerCase();

  switch (st) {
    case 'pending':
      return (
        <span className="badge badge-status-pending">
          <Clock size={13} />
          Pending
        </span>
      );
    case 'approved':
      return (
        <span className="badge badge-status-approved">
          <CheckCircle2 size={13} />
          Approved
        </span>
      );
    case 'sent':
      return (
        <span className="badge badge-status-sent">
          <Send size={13} />
          Sent
        </span>
      );
    case 'delivered':
      return (
        <span className="badge badge-status-delivered">
          <CheckCheck size={13} />
          Delivered
        </span>
      );
    case 'rejected':
      return (
        <span className="badge badge-status-rejected">
          <XCircle size={13} />
          Rejected
        </span>
      );
    case 'failed':
      return (
        <span className="badge badge-status-failed">
          <AlertCircle size={13} />
          Failed
        </span>
      );
    default:
      return <span className="badge">{status}</span>;
  }
};
