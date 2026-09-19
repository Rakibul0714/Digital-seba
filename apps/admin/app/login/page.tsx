'use client';
import { FormEvent, useState } from 'react';
import { ArrowLeft, ArrowRight, Landmark, LockKeyhole, Mail } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.message || 'Login failed');
      localStorage.setItem('accessToken', payload.accessToken);
      localStorage.setItem('user', JSON.stringify(payload.user));
      window.location.href = `${window.location.origin}/admin/dashboard`;
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'Email or password is incorrect');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page">
      <div className="login-art">
        <div className="login-brand">
          <span className="brand-mark"><Landmark size={21} /></span>
          <span>Digital Seba</span>
        </div>
        <div className="login-art-center">
          <div className="eyebrow">Office Management</div>
          <h1>Center for Citizen<br /><span>Services</span></h1>
          <p>Manage all applications, certificates and holding services from one place.</p>
        </div>
      </div>
      <div className="login-right">
        <a href="/" className="home-link">
          <ArrowLeft size={14} /> Back to Homepage
        </a>
        <form className="login-panel" onSubmit={handleLogin}>
          <div className="login-copy">
            <span className="small-label">Secure Access</span>
            <h2>Office Login</h2>
            <p>Enter your credentials to access your account.</p>
          </div>
          <label>
            Email Address
            <div className="input-icon">
              <Mail size={16} />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="office@digitalseba.local" required />
            </div>
          </label>
          <label>
            Password
            <div className="input-icon">
              <LockKeyhole size={16} />
              <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Enter password" required />
            </div>
          </label>
          <div className="remember">
            <label><input type="checkbox" /> Remember me</label>
            <a href="#">Forgot password?</a>
          </div>
          {error && <p className="login-error">{error}</p>}
          <button className="login-submit" type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'} {!loading && <ArrowRight size={16} />}
          </button>
        </form>
      </div>
    </main>
  );
}
