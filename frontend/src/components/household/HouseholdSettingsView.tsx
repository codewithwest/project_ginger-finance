'use client';

import React, { useState, useEffect } from 'react';
import { Users, Mail, Check, AlertCircle, Copy, Plus, Shield } from 'lucide-react';
import { graphqlFetch } from '@/lib/graphql';

const GET_MY_HOUSEHOLD = `
  query GetMyHousehold {
    myHousehold {
      _id
      name
      members {
        _id
        username
        email
        role
      }
    }
  }
`;

const INVITE_MEMBER = `
  mutation InviteMember($email: String!) {
    inviteMember(email: $email) {
      token
      status
    }
  }
`;

const CREATE_HOUSEHOLD = `
  mutation CreateHousehold($name: String!, $adminEmail: String!) {
    createHouseholdAndAdminInvite(name: $name, adminEmail: $adminEmail) {
      token
      status
    }
  }
`;

interface Member {
  _id: string;
  username: string;
  email: string;
  role: string;
}

interface HouseholdData {
  _id: string;
  name: string;
  members: Member[];
}

export default function HouseholdSettingsView() {
  const [householdData, setHouseholdData] = useState<HouseholdData | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [userRole, setUserRole] = useState('');

  // Invite member state
  const [inviting, setInviting] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteResult, setInviteResult] = useState<{ token: string } | null>(null);
  const [inviteError, setInviteError] = useState('');

  // SUPER_ADMIN: create household state
  const [creating, setCreating] = useState(false);
  const [newHouseholdName, setNewHouseholdName] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [createResult, setCreateResult] = useState<{ token: string } | null>(null);
  const [createError, setCreateError] = useState('');

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as { role: string };
        setUserRole(parsed.role ?? '');
      } catch (e) {
        console.error('Failed to parse stored user', e);
      }
    }

    let mounted = true;
    graphqlFetch<{ myHousehold: HouseholdData | null }>({ query: GET_MY_HOUSEHOLD })
      .then(res => {
        if (!mounted) return;
        if (res.errors?.length) setFetchError(res.errors[0].message as string);
        else setHouseholdData(res.data?.myHousehold ?? null);
      })
      .catch((err: Error) => { if (mounted) setFetchError(err.message); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  const handleInvite = async (evt: React.FormEvent) => {
    evt.preventDefault();
    setInviteError('');
    setInviteResult(null);
    setInviting(true);
    try {
      const res = await graphqlFetch<{ inviteMember: { token: string } }>({
        query: INVITE_MEMBER,
        variables: { email: inviteEmail },
      });
      if (res.errors?.length) throw new Error(res.errors[0].message as string);
      setInviteResult({ token: res.data.inviteMember.token });
      setInviteEmail('');
    } catch (err: unknown) {
      setInviteError(err instanceof Error ? err.message : 'Failed to send invite');
    } finally {
      setInviting(false);
    }
  };

  const handleCreate = async (evt: React.FormEvent) => {
    evt.preventDefault();
    setCreateError('');
    setCreateResult(null);
    setCreating(true);
    try {
      const res = await graphqlFetch<{ createHouseholdAndAdminInvite: { token: string } }>({
        query: CREATE_HOUSEHOLD,
        variables: { name: newHouseholdName, adminEmail: newAdminEmail },
      });
      if (res.errors?.length) throw new Error(res.errors[0].message as string);
      setCreateResult({ token: res.data.createHouseholdAndAdminInvite.token });
      setNewHouseholdName('');
      setNewAdminEmail('');
    } catch (err: unknown) {
      setCreateError(err instanceof Error ? err.message : 'Failed to create household');
    } finally {
      setCreating(false);
    }
  };

  const copyToClipboard = (token: string) => {
    const link = `${window.location.origin}/invite/${token}`;
    void navigator.clipboard.writeText(link);
  };

  const inviteLink = (token: string) =>
    `${typeof window !== 'undefined' ? window.location.origin : ''}/invite/${token}`;

  if (loading) return (
    <div className="loader-container">
      <div className="loader-3d"></div>
    </div>
  );
  
  if (fetchError) return (
    <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', margin: '2rem' }}>
      <h2 style={{ color: '#ef4444' }}>Error loading household</h2>
      <p>{fetchError}</p>
      <button onClick={() => window.location.reload()} className="btn-primary" style={{ margin: '1rem auto' }}>
        Retry
      </button>
    </div>
  );

  const isSuperAdmin = userRole === 'SUPER_ADMIN';
  const isAdmin = userRole === 'ADMIN' || isSuperAdmin;

  return (
    <div className="view-container">
      <header className="view-header">
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Users className="gradient-text" size={32} />
            Household Management
          </h2>
          <p style={{ color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
            {isSuperAdmin ? 'Super Admin Portal — Orchestrate households and permissions.' : 'Configure your farm household members.'}
          </p>
        </div>
      </header>

      <div className="household-grid">
        {/* SUPER ADMIN: Create Household */}
        {isSuperAdmin && (
          <section className="glass-card admin-section">
            <div className="card-header">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
                <Plus size={20} color="var(--color-accent-primary)" />
                Create New Household
              </h3>
            </div>
            
            <form onSubmit={handleCreate} className="admin-form">
              <div className="form-group">
                <label>Household Name</label>
                <input
                  type="text"
                  required
                  value={newHouseholdName}
                  onChange={evt => setNewHouseholdName(evt.target.value)}
                  placeholder="e.g. Smith Family Farm"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Admin Email</label>
                <div className="input-with-icon">
                  <Mail size={18} />
                  <input
                    type="email"
                    required
                    value={newAdminEmail}
                    onChange={evt => setNewAdminEmail(evt.target.value)}
                    placeholder="admin@example.com"
                    className="form-input"
                  />
                </div>
              </div>

              {createError && (
                <div className="error-message">
                  <AlertCircle size={16} /> {createError}
                </div>
              )}

              <button
                type="submit"
                disabled={creating || !newHouseholdName || !newAdminEmail}
                className="btn-primary"
                style={{ width: '100%', marginTop: '1rem' }}
              >
                {creating ? 'Creating...' : 'Launch Household'}
              </button>
            </form>

            {createResult && (
              <div className="success-banner">
                <Check size={18} color="var(--color-income)" />
                <div className="success-content">
                  <p>Household initialized! Send this link:</p>
                  <code>{inviteLink(createResult.token)}</code>
                </div>
                <button onClick={() => copyToClipboard(createResult.token)} className="icon-btn">
                  <Copy size={16} />
                </button>
              </div>
            )}
          </section>
        )}

        {/* Current Household */}
        {householdData ? (
          <>
            <section className="glass-card members-section">
              <div className="card-header">
                <h3 style={{ fontWeight: 700 }}>{householdData.name} — Members</h3>
                <span className="badge">{householdData.members?.length || 0} TOTAL</span>
              </div>
              
              <div className="member-list">
                {householdData.members?.map(member => (
                  <div key={member._id} className="member-item">
                    <div className="member-avatar">
                      {member.username[0].toUpperCase()}
                    </div>
                    <div className="member-info">
                      <span className="member-name">{member.username}</span>
                      <span className="member-email">{member.email}</span>
                    </div>
                    <span className={`role-badge ${member.role.toLowerCase()}`}>
                      {member.role === 'ADMIN' ? <Shield size={12} /> : null}
                      {member.role}
                    </span>
                  </div>
                ))}
                {(!householdData.members || householdData.members.length === 0) && (
                  <div className="empty-state">No members identified.</div>
                )}
              </div>
            </section>

            {isAdmin && (
              <section className="glass-card invite-section">
                <div className="card-header">
                  <h3 style={{ fontWeight: 700 }}>Invite New Member</h3>
                </div>
                
                <form onSubmit={handleInvite} className="invite-form">
                  <div className="form-group">
                    <label>Member Email Address</label>
                    <div className="input-with-icon">
                      <Mail size={18} />
                      <input
                        type="email"
                        required
                        value={inviteEmail}
                        onChange={evt => setInviteEmail(evt.target.value)}
                        placeholder="newmember@farm.com"
                        className="form-input"
                      />
                    </div>
                  </div>

                  {inviteError && (
                    <div className="error-message">
                      <AlertCircle size={16} /> {inviteError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={inviting || !inviteEmail}
                    className="btn-primary"
                    style={{ width: '100%' }}
                  >
                    {inviting ? 'Sending Envoy...' : 'Send Invitation'}
                  </button>
                </form>

                {inviteResult && (
                  <div className="success-banner">
                    <Check size={18} color="var(--color-income)" />
                    <div className="success-content">
                      <p>Invitation dispatch successful!</p>
                    </div>
                    <button onClick={() => copyToClipboard(inviteResult.token)} className="icon-btn">
                      <Copy size={16} />
                    </button>
                  </div>
                )}
              </section>
            )}
          </>
        ) : !isSuperAdmin ? (
          <div className="glass-card empty-household">
            <AlertCircle size={48} color="var(--color-accent-primary)" />
            <h3>No Household Found</h3>
            <p>You haven&apos;t been connected to a farm household yet. Please contact your administrator.</p>
          </div>
        ) : null}
      </div>

      <style jsx>{`
        .household-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 2rem;
          margin-top: 1rem;
        }

        .admin-section, .members-section, .invite-section {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          padding-bottom: 1rem;
        }

        .admin-form, .invite-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-group label {
          font-size: 0.85rem;
          color: var(--color-text-muted);
          font-weight: 500;
        }

        .input-with-icon {
          position: relative;
        }

        .input-with-icon :global(svg) {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--color-text-muted);
          pointer-events: none;
        }

        .input-with-icon .form-input {
          padding-left: 3rem;
        }

        .error-message {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          border-radius: 10px;
          color: var(--color-expense);
          font-size: 0.85rem;
        }

        .success-banner {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: rgba(104, 211, 145, 0.1);
          border: 1px solid rgba(104, 211, 145, 0.2);
          border-radius: 12px;
          margin-top: 1rem;
        }

        .success-content {
          flex: 1;
        }

        .success-content p {
          font-size: 0.8rem;
          margin-bottom: 0.25rem;
          color: var(--color-income);
        }

        .success-content code {
          display: block;
          font-family: monospace;
          font-size: 0.7rem;
          background: rgba(0,0,0,0.3);
          padding: 0.4rem;
          border-radius: 6px;
          color: white;
          word-break: break-all;
        }

        .member-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .member-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: rgba(255,255,255,0.03);
          border-radius: 12px;
          transition: transform 0.2s, background 0.2s;
        }

        .member-item:hover {
          background: rgba(255,255,255,0.06);
          transform: translateX(5px);
        }

        .member-avatar {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: var(--color-accent-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          color: white;
        }

        .member-info {
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .member-name {
          font-weight: 600;
          font-size: 0.95rem;
        }

        .member-email {
          font-size: 0.75rem;
          color: var(--color-text-muted);
        }

        .role-badge {
          font-size: 0.7rem;
          font-weight: 800;
          padding: 0.25rem 0.6rem;
          border-radius: 6px;
          display: flex;
          align-items: center;
          gap: 0.3rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .role-badge.admin, .role-badge.super_admin {
          background: rgba(246, 173, 85, 0.15);
          color: #f6ad55;
        }

        .role-badge.member {
          background: rgba(66, 153, 225, 0.15);
          color: #4299e1;
        }

        .empty-household {
          grid-column: 1 / -1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 5rem 2rem;
          gap: 1.5rem;
        }

        .empty-household h3 {
          font-size: 1.5rem;
          font-weight: 700;
        }

        .empty-household p {
          max-width: 400px;
          color: var(--color-text-muted);
        }

        @media (max-width: 768px) {
          .household-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
