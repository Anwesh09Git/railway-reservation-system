import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Eye, EyeOff, LockKeyhole, Mail, ShieldCheck, TrainFront } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const update = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await login(form);
      navigate(location.state?.from || '/', { replace: true });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const fillDemo = (email, password) => setForm({ email, password });

  return (
    <div className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-2">
      <div className="flex items-center justify-center px-4 py-12 sm:px-8">
        <div className="w-full max-w-md">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-700 text-white">
            <TrainFront className="h-6 w-6" />
          </span>
          <h1 className="mt-6 text-3xl">Log in to RailYatri</h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Sign in to manage your bookings and tickets.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="label">Email address</label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  className="input pl-10"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={update('email')}
                  required
                />
              </div>
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="input pl-10 pr-11"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={update('password')}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-brand-700"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={submitting} className="btn-primary w-full">
              {submitting ? 'Signing in...' : 'Log in'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            New here?{' '}
            <Link to="/register" className="font-semibold text-brand-700 hover:underline">
              Create an account
            </Link>
          </p>

          <div className="mt-8 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4">
            <p className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
              <ShieldCheck className="h-3.5 w-3.5 text-brand-700" /> Demo accounts
            </p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => fillDemo('demo@railway.com', 'demo123')}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-left text-xs hover:border-brand-400"
              >
                <b className="block text-slate-700">Traveller</b>
                <span className="text-slate-600">demo@railway.com / demo123</span>
              </button>
              <button
                type="button"
                onClick={() => fillDemo('admin@railway.com', 'admin123')}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-left text-xs hover:border-brand-400"
              >
                <b className="block text-slate-700">Admin</b>
                <span className="text-slate-600">admin@railway.com / admin123</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="hero-pattern hero-grid relative hidden items-center justify-center overflow-hidden p-12 text-white lg:flex">
        <div className="max-w-md text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-lg border border-white/20 bg-white/5">
            <TrainFront className="h-10 w-10 text-gold-400" />
          </div>
          <h2 className="mt-8 text-3xl">Tickets and PNRs, kept together.</h2>
          <p className="mt-4 text-sm leading-relaxed text-slate-200">
            Sign in to reserve a berth, review your bookings and download a print-ready ticket.
          </p>
          <div className="mt-10 space-y-3 text-left">
            {[
              'Instant e-tickets with a PNR',
              'Seat availability by travel class',
              'Cancel a ticket from your bookings',
            ].map((item) => (
              <p key={item} className="flex items-center gap-2 text-sm text-slate-100">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gold-400" />
                {item}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
