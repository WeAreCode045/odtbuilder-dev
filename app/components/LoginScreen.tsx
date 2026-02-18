import React, { useState } from 'react';
import { register, login, getAccount } from '../utils/appwrite';

interface Props {
  onLogin: (user: any) => void;
}

export const LoginScreen: React.FC<Props> = ({ onLogin }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (isRegister) {
        await register(email, password, name || undefined);
        // After register, create a session
        await login(email, password);
      } else {
        await login(email, password);
      }
      const acct = await getAccount();
      onLogin(acct);
    } catch (err: any) {
      setError(err?.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded shadow">
        <h2 className="text-2xl font-semibold mb-4">{isRegister ? 'Register' : 'Login'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full border rounded px-3 py-2" />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input value={email} onChange={e => setEmail(e.target.value)} type="email" required className="mt-1 block w-full border rounded px-3 py-2" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input value={password} onChange={e => setPassword(e.target.value)} type="password" required className="mt-1 block w-full border rounded px-3 py-2" />
          </div>

          {error && <div className="text-sm text-red-600">{error}</div>}

          <div className="flex items-center justify-between">
            <button className="bg-blue-600 text-white px-4 py-2 rounded" disabled={loading}>
              {loading ? 'Please wait...' : isRegister ? 'Create account' : 'Login'}
            </button>
            <button type="button" className="text-sm text-gray-600 underline" onClick={() => setIsRegister(s => !s)}>
              {isRegister ? 'Have an account? Login' : "Don't have an account? Register"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
