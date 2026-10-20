import React, { useState, useEffect } from 'react';
import { Camera, Calendar, Phone, Mail, User, Sparkles, MessageSquare } from 'lucide-react';
import { Modal } from '../common/Modal';
import { generateMessage } from '../../services/birthdayService';

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'
];

export const FriendFormModal = ({
  isOpen,
  onClose,
  onSave,
  initialData = null
}) => {
  const isEditing = Boolean(initialData?.id);

  const [formData, setFormData] = useState({
    name: '',
    birthdate: '',
    phone: '',
    email: '',
    relationship: 'Friend',
    preferredChannel: 'WhatsApp',
    customMessage: '',
    avatar: '',
    notes: '',
    autoSend: false
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        birthdate: initialData.birthdate || '',
        phone: initialData.phone || '',
        email: initialData.email || '',
        relationship: initialData.relationship || 'Friend',
        preferredChannel: initialData.preferredChannel || 'WhatsApp',
        customMessage: initialData.customMessage || '',
        avatar: initialData.avatar || '',
        notes: initialData.notes || '',
        autoSend: Boolean(initialData.autoSend)
      });
    } else {
      setFormData({
        name: '',
        birthdate: '',
        phone: '',
        email: '',
        relationship: 'Friend',
        preferredChannel: 'WhatsApp',
        customMessage: '',
        avatar: '',
        notes: '',
        autoSend: false
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const applyTemplate = (style) => {
    const msg = generateMessage(formData.name || 'Friend', style);
    setFormData(prev => ({ ...prev, customMessage: msg }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) {
      errs.name = 'Full name is required';
    }
    if (!formData.birthdate) {
      errs.birthdate = 'Date of birth is required';
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Please enter a valid email address';
    }
    if (formData.customMessage && formData.customMessage.length > 200) {
      errs.customMessage = 'Message exceeds 200 characters limit';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSave(formData);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Friend' : 'Add New Friend'}
      maxWidth="580px"
    >
      <form onSubmit={handleSubmit}>
        {/* Avatar Picker / Uploader */}
        <div style={{ textAlign: 'center', marginBottom: '22px' }}>
          <div
            style={{
              width: '84px',
              height: '84px',
              borderRadius: '50%',
              backgroundColor: '#FFF0F5',
              border: '2px dashed #FFB3CB',
              margin: '0 auto 10px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              overflow: 'hidden',
              position: 'relative'
            }}
            onClick={() => {
              // Cycle through preset avatars
              const nextIdx = (AVATAR_PRESETS.indexOf(formData.avatar) + 1) % AVATAR_PRESETS.length;
              setFormData(prev => ({ ...prev, avatar: AVATAR_PRESETS[nextIdx] }));
            }}
            title="Click to cycle avatar photos"
          >
            {formData.avatar ? (
              <img
                src={formData.avatar}
                alt="Selected"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <>
                <Camera size={26} color="var(--primary-pink)" />
                <span style={{ fontSize: '0.66rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Add Photo
                </span>
              </>
            )}
          </div>
          <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
            Click photo circle to pick an avatar, or paste image URL
          </p>
        </div>

        {/* Full Name */}
        <div className="form-group">
          <label className="form-label" htmlFor="friend-name">
            Full Name <span className="required">*</span>
          </label>
          <input
            id="friend-name"
            name="name"
            type="text"
            className="form-input"
            placeholder="Enter friend's name (e.g. Priya Verma)"
            value={formData.name}
            onChange={handleChange}
            required
          />
          {errors.name && <span className="form-error">{errors.name}</span>}
        </div>

        {/* Date of Birth */}
        <div className="form-group">
          <label className="form-label" htmlFor="friend-birthdate">
            Date of Birth <span className="required">*</span>
          </label>
          <div style={{ position: 'relative' }}>
            <input
              id="friend-birthdate"
              name="birthdate"
              type="date"
              className="form-input"
              value={formData.birthdate}
              onChange={handleChange}
              required
            />
          </div>
          {errors.birthdate && <span className="form-error">{errors.birthdate}</span>}
        </div>

        {/* Contact Info (Two Columns) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="friend-phone">
              Phone Number
            </label>
            <input
              id="friend-phone"
              name="phone"
              type="tel"
              className="form-input"
              placeholder="+91 98765 43210"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="friend-email">
              Email Address
            </label>
            <input
              id="friend-email"
              name="email"
              type="email"
              className="form-input"
              placeholder="friend@example.com"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <span className="form-error">{errors.email}</span>}
          </div>
        </div>

        {/* Relationship & Preferred Channel */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="friend-relationship">
              Relationship
            </label>
            <select
              id="friend-relationship"
              name="relationship"
              className="form-select"
              value={formData.relationship}
              onChange={handleChange}
            >
              <option value="Best Friend">Best Friend</option>
              <option value="Friend">Friend</option>
              <option value="Family">Family</option>
              <option value="Sister">Sister</option>
              <option value="Brother">Brother</option>
              <option value="Colleague">Colleague</option>
              <option value="Partner">Partner</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="friend-channel">
              Preferred Channel
            </label>
            <select
              id="friend-channel"
              name="preferredChannel"
              className="form-select"
              value={formData.preferredChannel}
              onChange={handleChange}
            >
              <option value="WhatsApp">💬 WhatsApp</option>
              <option value="Email">✉️ Email</option>
              <option value="SMS">📱 SMS</option>
            </select>
          </div>
        </div>

        {/* Automatic Send Option */}
        <div
          style={{
            backgroundColor: '#F9FAFB',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-md)',
            padding: '12px 16px',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-dark)' }}>
              Automatic Birthday Wishes
            </div>
            <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
              Automatically send wish on birthday (Email only). If disabled, creates a pending draft for review.
            </div>
          </div>
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <input
              type="checkbox"
              name="autoSend"
              checked={Boolean(formData.autoSend)}
              onChange={(e) => setFormData(prev => ({ ...prev, autoSend: e.target.checked }))}
              style={{ width: '18px', height: '18px', accentColor: 'var(--primary-pink)', cursor: 'pointer' }}
            />
          </label>
        </div>

        {/* Custom Birthday Message with Template Assistant */}
        <div className="form-group" style={{ marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <label className="form-label" htmlFor="friend-message" style={{ marginBottom: 0 }}>
              Custom Birthday Message
            </label>
            <span style={{ fontSize: '0.74rem', color: formData.customMessage.length > 200 ? 'var(--color-danger)' : 'var(--text-muted)' }}>
              {formData.customMessage.length}/200
            </span>
          </div>

          {/* Quick template triggers */}
          <div style={{ display: 'flex', gap: '6px', marginBottom: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', alignSelf: 'center' }}>
              Quick Templates:
            </span>
            <button
              type="button"
              className="btn-sm"
              style={{ padding: '3px 10px', fontSize: '0.74rem', backgroundColor: '#FFF0F5', color: 'var(--primary-pink)', borderRadius: '9999px' }}
              onClick={() => applyTemplate('friendly')}
            >
              Friendly 🎂
            </button>
            <button
              type="button"
              className="btn-sm"
              style={{ padding: '3px 10px', fontSize: '0.74rem', backgroundColor: '#FFF4E5', color: '#D97706', borderRadius: '9999px' }}
              onClick={() => applyTemplate('funny')}
            >
              Funny 🍕
            </button>
            <button
              type="button"
              className="btn-sm"
              style={{ padding: '3px 10px', fontSize: '0.74rem', backgroundColor: '#F0E9FF', color: '#7C3AED', borderRadius: '9999px' }}
              onClick={() => applyTemplate('emotional')}
            >
              Heartfelt 🌸
            </button>
            <button
              type="button"
              className="btn-sm"
              style={{ padding: '3px 10px', fontSize: '0.74rem', backgroundColor: '#EFF6FF', color: '#2563EB', borderRadius: '9999px' }}
              onClick={() => applyTemplate('formal')}
            >
              Formal 🌟
            </button>
          </div>

          <textarea
            id="friend-message"
            name="customMessage"
            className="form-textarea"
            rows={3}
            placeholder="Write a personal birthday message..."
            value={formData.customMessage}
            onChange={handleChange}
            maxLength={200}
          />
          {errors.customMessage && <span className="form-error">{errors.customMessage}</span>}
        </div>

        {/* Modal Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            {isEditing ? 'Save Changes' : 'Save Friend'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
