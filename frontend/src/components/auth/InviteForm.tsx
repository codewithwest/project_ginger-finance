'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Lock, User as UserIcon, Loader2 } from 'lucide-react';
import { graphqlFetch } from '@/lib/graphql';

const REGISTER_WITH_INVITE = `
  mutation RegisterWithInvite($token: String!, $username: String!, $password: String!) {
    registerWithInvite(token: $token, username: $username, password: $password) {
      accessToken
    }
  }
`;

interface Props {
  token: string;
}

export default function InviteForm({ token }: Props) {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { data, errors } = await graphqlFetch<{ registerWithInvite: { accessToken: string } }>({
        query: REGISTER_WITH_INVITE,
        variables: { token, username, password },
      });

      if (errors && errors.length > 0) {
        throw new Error(errors[0].message);
      }

      if (data?.registerWithInvite?.accessToken) {
        localStorage.setItem('token', data.registerWithInvite.accessToken);
        // Storing user object to ensure Dashboard.tsx doesn't see a null user
        const userData = {
          username,
          email: '', // Backend doesn't return email in AuthResponse yet, but username is enough for 'Welcome back'
        };
        localStorage.setItem('user', JSON.stringify(userData));
        
        setSuccess(true);
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
      }
    } catch (err: unknown) {
      const errorObject = err instanceof Error ? err : new Error('Registration failed');
      console.error('Registration failed:', errorObject);
      setError(errorObject);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="glass-card p-10 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <ArrowRight className="text-emerald-400" size={32} />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Welcome Aboard!</h3>
        <p className="text-emerald-400/80">Success! Redirecting you to your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="glass-card p-8 w-full max-w-md mx-auto relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-50"></div>
      
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-2 text-center mb-8">
          <h2 className="text-2xl font-bold text-white tracking-tight">Create Your Account</h2>
          <p className="text-sm text-gray-400">Join the household and start managing finances together.</p>
        </div>

        {error && (
          <div className="bg-rose-500/10 text-rose-400 p-4 rounded-xl border border-rose-500/20 text-sm text-center animate-in shake-in duration-300">
            {error.message}
          </div>
        )}

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1 block">Username</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-emerald-500 transition-colors">
                <UserIcon size={18} />
              </div>
              <input
                type="text"
                required
                autoComplete="username"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-300"
                placeholder="Choose a username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1 block">Secret Password</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-emerald-500 transition-colors">
                <Lock size={18} />
              </div>
              <input
                type="password"
                required
                autoComplete="new-password"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-300"
                placeholder="••••••••"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !username || !password}
          className="btn-primary w-full py-4 rounded-xl font-bold text-base flex items-center justify-center gap-3 group relative overflow-hidden transition-all duration-300 active:scale-[0.98]"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              <span>Verifying...</span>
            </>
          ) : (
            <>
              <span>Join Household</span>
              <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
            </>
          )}
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-10 transition-opacity"></div>
        </button>
      </form>
    </div>
  );
}
