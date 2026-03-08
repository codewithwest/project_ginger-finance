'use client';

import { useState } from 'react';
import { useRouter } from 'next/router';
import { ArrowRight, Lock, User as UserIcon } from 'lucide-react';
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { data, errors } = await graphqlFetch<any>({
        query: REGISTER_WITH_INVITE,
        variables: { token, username, password },
      });

      if (errors && errors.length > 0) {
        throw new Error(errors[0].message);
      }

      if (data?.registerWithInvite?.accessToken) {
        localStorage.setItem('token', data.registerWithInvite.accessToken);
        setSuccess(true);
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
      }
    } catch (err: any) {
      console.error('Registration failed:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-emerald-500/10 text-emerald-400 p-6 rounded-xl border border-emerald-500/20 text-center animate-pulse">
        Registration successful! Redirecting to dashboard...
      </div>
    );
  }

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      {error && (
        <div className="bg-rose-500/10 text-rose-400 p-4 rounded-xl border border-rose-500/20 text-sm text-center">
          {error.message}
        </div>
      )}
      <div className="rounded-md shadow-sm space-y-4">
        <div className="relative">
          <label htmlFor="username" className="sr-only">Username</label>
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
            <UserIcon className="h-5 w-5" />
          </div>
          <input
            id="username"
            name="username"
            type="text"
            required
            className="appearance-none rounded-xl relative block w-full px-3 py-3 pl-10 border border-white/10 bg-black/40 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm backdrop-blur-md transition-all duration-300"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="relative">
          <label htmlFor="password" className="sr-only">Password</label>
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
            <Lock className="h-5 w-5" />
          </div>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="appearance-none rounded-xl relative block w-full px-3 py-3 pl-10 border border-white/10 bg-black/40 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm backdrop-blur-md transition-all duration-300"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={loading || !username || !password}
          className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-emerald-600 hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 focus:ring-offset-gray-900 transition-all duration-300 shadow-[0_0_20px_rgba(16,185,129,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center">
              <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2"></span>
              Registering...
            </span>
          ) : (
            <span className="flex items-center">
              Create Account
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </span>
          )}
        </button>
      </div>
    </form>
  );
}
