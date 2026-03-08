'use client';

import React, { useState, useEffect } from 'react';
import { Users, Mail, Check, AlertCircle, Copy, Plus } from 'lucide-react';
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
      const parsed = JSON.parse(stored) as { role: string };
      setUserRole(parsed.role ?? '');
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

  if (loading) return <div className="text-gray-400 p-8">Loading household data...</div>;
  if (fetchError) return <div className="text-rose-400 p-8">Error: {fetchError}</div>;

  const isSuperAdmin = userRole === 'SUPER_ADMIN';
  const isAdmin = userRole === 'ADMIN' || isSuperAdmin;

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Users className="w-8 h-8 text-emerald-400" />
          Household Settings
        </h1>
        <p className="text-gray-400 mt-2">
          {isSuperAdmin ? 'Super Admin — manage all households and invitations.' : 'Manage your household members and invitations.'}
        </p>
      </div>

      {/* SUPER ADMIN: Create Household */}
      {isSuperAdmin && (
        <div className="bg-black/40 backdrop-blur-md rounded-2xl border border-amber-500/20 p-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
          <h2 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4 flex items-center gap-2">
            <Plus className="w-5 h-5 text-amber-400" /> Create New Household
          </h2>
          <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Household Name</label>
              <input
                type="text"
                required
                value={newHouseholdName}
                onChange={evt => setNewHouseholdName(evt.target.value)}
                placeholder="Smith Family"
                className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Admin Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="email"
                  required
                  value={newAdminEmail}
                  onChange={evt => setNewAdminEmail(evt.target.value)}
                  placeholder="admin@example.com"
                  className="w-full pl-10 pr-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              {createError && (
                <div className="mb-3 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" /> {createError}
                </div>
              )}
              <button
                type="submit"
                disabled={creating || !newHouseholdName || !newAdminEmail}
                className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-50 font-semibold transition-all text-white"
              >
                {creating ? 'Creating...' : 'Create Household & Invite Admin'}
              </button>
            </div>
          </form>
          {createResult && (
            <div className="mt-4 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3">
              <Check className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <span className="text-sm text-emerald-300 flex-1">
                Household created! Admin invite email sent. Link: <span className="font-mono text-xs">{inviteLink(createResult.token)}</span>
              </span>
              <button onClick={() => copyToClipboard(createResult.token)} className="text-emerald-400 hover:text-emerald-300">
                <Copy className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Current Household */}
      {householdData ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Members List */}
          <div className="bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 p-6 shadow-xl">
            <h2 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">
              {householdData.name} — Members
            </h2>
            <div className="space-y-3">
              {householdData.members?.map(member => (
                <div key={member._id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                  <div>
                    <div className="text-white font-medium">{member.username}</div>
                    <div className="text-sm text-gray-400">{member.email}</div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                    member.role === 'ADMIN'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/20'
                      : 'bg-blue-500/20 text-blue-400 border border-blue-500/20'
                  }`}>
                    {member.role}
                  </span>
                </div>
              ))}
              {(!householdData.members || householdData.members.length === 0) && (
                <p className="text-center text-gray-500 text-sm py-4">No members yet.</p>
              )}
            </div>
          </div>

          {/* Invite Form (ADMIN+) */}
          {isAdmin && (
            <div className="bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 p-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
              <h2 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4 relative z-10">
                Invite Member
              </h2>
              <form onSubmit={handleInvite} className="space-y-4 relative z-10">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="email"
                    required
                    value={inviteEmail}
                    onChange={evt => setInviteEmail(evt.target.value)}
                    placeholder="member@example.com"
                    className="w-full pl-10 pr-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  />
                </div>
                {inviteError && (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-sm flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" /> {inviteError}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={inviting || !inviteEmail}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 font-semibold text-white transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                >
                  {inviting ? 'Sending Invite...' : 'Send Invite Email'}
                </button>
              </form>
              {inviteResult && (
                <div className="mt-4 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3 relative z-10">
                  <Check className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <span className="text-sm text-emerald-300 flex-1">Invite email sent!</span>
                  <button onClick={() => copyToClipboard(inviteResult.token)} className="text-emerald-400 hover:text-emerald-300" title="Copy link">
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      ) : !isSuperAdmin ? (
        <div className="p-8 text-center text-gray-400 border border-white/5 bg-black/20 rounded-2xl">
          <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">No Household</h2>
          <p>You are not yet a member of any household.</p>
        </div>
      ) : null}
    </div>
  );
}
