import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Button from './Button';
import styles from './AuthModal.module.css';

export default function AuthModal({ isOpen, onClose }) {
  const { login } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  function handleOverlayClick(e) {
    if (e.target === e.currentTarget) onClose();
  }

  function switchMode(next) {
    setMode(next);
    setError('');
    setEmail('');
    setPassword('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Something went wrong');
        return;
      }

      if (mode === 'register') {
        // Auto-login after registration for a smooth UX
        const loginRes = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        const loginData = await loginRes.json();
        if (loginRes.ok) {
          login(loginData.token, loginData.user);
          onClose();
        } else {
          setError('Registered! Please log in.');
          setMode('login');
        }
      } else {
        login(data.token, data.user);
        onClose();
      }
    } catch {
      setError('Network error — is the server running?');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.panel} role="dialog" aria-modal="true">
        <button className={styles.close} onClick={onClose} aria-label="Close">
          &times;
        </button>

        <h2 className={styles.title}>
          {mode === 'login' ? 'Welcome back' : 'Create account'}
        </h2>

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <label className={styles.label}>
            Email
            <input
              type="email"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="you@example.com"
            />
          </label>

          <label className={styles.label}>
            Password
            <input
              type="password"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              placeholder="Min. 6 characters"
            />
          </label>

          {error && <p className={styles.error}>{error}</p>}

          <Button type="submit" variant="primary" disabled={loading} className={styles.submit}>
            {loading ? 'Please wait…' : mode === 'login' ? 'Login' : 'Register'}
          </Button>
        </form>

        <p className={styles.toggle}>
          {mode === 'login' ? (
            <>
              No account?{' '}
              <button className={styles.link} onClick={() => switchMode('register')}>
                Register
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button className={styles.link} onClick={() => switchMode('login')}>
                Login
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
