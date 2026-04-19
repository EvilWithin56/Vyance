import React, { useState } from 'react';
import { Lock, User, PlusCircle, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';

interface AuthProps {
  onLogin: (u: string, p: string) => void;
  onSignup: (u: string, p: string) => void;
  authError: string | null;
  connected: boolean;
}

export default function Auth({ onLogin, onSignup, authError, connected }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) onLogin(username, password);
    else onSignup(username, password);
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface flex items-center justify-center p-4 antialiased">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8 flex flex-col items-center">
           <div className="w-12 h-12 rounded-xl border border-primary/20 bg-surface-container-lowest shadow-sm flex items-center justify-center mb-4 text-primary">
              <Lock className="w-6 h-6" />
           </div>
           <h1 className="text-2xl font-headline font-bold mb-1">Welcome to Indigo</h1>
           <p className="text-sm text-on-surface-variant font-label">
             {!connected ? 'Connecting to WS Server...' : (isLogin ? 'Sign in to continue' : 'Create a new account')}
           </p>
        </div>

        <div className="bg-surface-container-lowest rounded-3xl p-6 ambient-shadow border border-surface-container">
          <form onSubmit={handleSubmit} className="space-y-4">
             {authError && (
               <div className="bg-error-container text-on-error-container text-xs font-semibold px-3 py-2 rounded-xl text-center">
                  {authError}
               </div>
             )}
             <div>
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">Username</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant opacity-60" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50"
                    placeholder="Enter username"
                  />
                </div>
             </div>
             <div>
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant opacity-60" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50"
                    placeholder="••••••••"
                  />
                </div>
             </div>
             
             <button
               type="submit"
               disabled={!connected || !username || !password}
               className="w-full primary-gradient text-on-primary mt-4 py-3 rounded-xl font-semibold flex items-center justify-center space-x-2 hover:opacity-95 disabled:opacity-50 transition-all font-label"
             >
                {isLogin ? <span>Sign In</span> : <span>Create Account</span>}
                <ArrowRight className="w-4 h-4" />
             </button>
          </form>

          <div className="mt-6 text-center">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-xs text-primary font-medium hover:underline flex items-center justify-center space-x-1 mx-auto"
            >
               {isLogin ? (
                 <><span>Don't have an account? Sign up</span></>
               ) : (
                 <><span>Already have an account? Sign in</span></>
               )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
