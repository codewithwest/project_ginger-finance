'use client';

import { User, Shield, Mail, Calendar, Edit } from 'lucide-react';

const mockProfile = {
  username: 'west',
  email: 'west@gingerfinance.app',
  role: 'ADMIN',
  createdAt: '2026-03-08',
};

function InfoRow({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '1rem',
      padding: '1rem 1.25rem',
      background: 'rgba(255,255,255,0.025)',
      borderRadius: '10px',
      border: '1px solid var(--color-border)',
    }}>
      <div style={{
        width: '36px', height: '36px', borderRadius: '8px',
        background: 'rgba(79,163,224,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon size={16} color="var(--color-accent-primary)" />
      </div>
      <div>
        <div style={{ color: 'var(--color-text-muted)', fontSize: '0.78rem', marginBottom: '0.15rem' }}>{label}</div>
        <div style={{ fontWeight: 500, fontSize: '0.9rem' }}>{value}</div>
      </div>
    </div>
  );
}

export default function ProfilePage() {

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '640px' }}>
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '0.3rem' }}>Profile</h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>Your account details and access permissions.</p>
      </div>

      {/* Avatar Card */}
      <div className="glass-card" style={{
        padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem',
        background: 'linear-gradient(135deg, rgba(79,163,224,0.1), rgba(56,178,172,0.06))',
      }}>
        <div style={{
          width: '72px', height: '72px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #4fa3e0, #38b2ac)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.75rem', fontWeight: 700, color: 'white',
          flexShrink: 0,
        }}>
          {mockProfile.username[0].toUpperCase()}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: '1.25rem', marginBottom: '0.25rem' }}>
            {mockProfile.username}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="badge-income" style={{
              padding: '0.2rem 0.65rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600
            }}>
              {mockProfile.role}
            </span>
            <span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Full Access</span>
          </div>
        </div>
        <button className="btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
          <Edit size={14} /> Edit
        </button>
      </div>

      {/* Info */}
      <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <h2 style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '0.25rem' }}>Account Details</h2>
        <InfoRow icon={User} label="Username" value={mockProfile.username} />
        <InfoRow icon={Mail} label="Email Address" value={mockProfile.email} />
        <InfoRow icon={Shield} label="Access Role" value={mockProfile.role} />
        <InfoRow icon={Calendar} label="Member Since" value={mockProfile.createdAt} />
      </div>

      {/* Permissions Info */}
      <div className="glass-card" style={{ padding: '1.25rem' }}>
        <h2 style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '0.75rem' }}>Permissions</h2>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
          As an <strong style={{ color: 'var(--color-accent-primary)' }}>ADMIN</strong>, you have full access to all financial data, including the ability to manage assets, log transactions, and invite new users.
        </p>
      </div>
    </div>
  );
}
