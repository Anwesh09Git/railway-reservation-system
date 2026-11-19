import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Eye, EyeOff, LockKeyhole, Mail, Phone, TrainFront, UserRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const update = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (form.password !== form.confirm) return toast.error('Passwords do not match');
    setSubmitting(true);
    try {
      await register({
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
      });
      navigate('/', { replace: true });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-2">
      <div className="hero-pattern hero-grid relative hidden items-center justify-center overflow-hidden p-12 text-white lg:flex">
        <div className="max-w-md">
          <span className="inline-flex items-center border-l-2 border-gold-400 pl-3 text-xs font-bold uppercase tracking-[0.18em] text-slate-200">
            New account · Traveller
          </span>
          <h2 className="mt-6 text-4xl leading-[1.15]">
            Keep your bookings in <span className="text-gold-400">one place.</span>
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-slate-200">
            Create an account to reserve berths, save passenger details and revisit your tickets
            whenever you need them.
          </p>
          <div className="mt-10 grid grid-cols-3 gap-3 text-center">
            {[
              ['8', 'Sample trains'],
              ['7', 'Stations'],
              ['PNR', 'Instant ticket'],
            ].map(([value, label]) => (
              <div key={label} className="rounded-lg border border-white/20 bg-white/5 p-4">
                <p className="text-xl font-bold text-white">{value}</p>
                <p className="mt-1 text-xs text-slate-200">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center px-4 py-12 sm:px-8">
        <div className="w-full max-w-md">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-700 text-white">
            <TrainFront className="h-6 w-6" />
          </span>
          <h1 className="mt-6 text-3xl">Create your account</h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Register to book tickets and manage your journeys.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label className="label">Full name</label>
              <div className="relative">
                <UserRound className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input className="input pl-10" placeholder="Aarav Sharma" value={form.name} onChange={update('name')} required />
              </div>
            </div>
            <div>
              <label className="label">Email address</label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input type="email" className="input pl-10" placeholder="you@example.com" value={form.email} onChange={update('email')} required />
              </div>
            </div>
            <div>
              <label className="label">
                Phone number <span className="font-normal normal-case text-slate-500">(optional)</span>
              </label>
              <div className="relative">
                <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input className="input pl-10" placeholder="9876543210" value={form.phone} onChange={update('phone')} />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label">Password</label>
                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="input pl-10"
                    placeholder="Min. 6 characters"
                    value={form.password}
                    onChange={update('password')}
                    minLength={6}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="label">Confirm password</label>
                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="input pl-10"
                    placeholder="Repeat password"
                    value={form.confirm}
                    onChange={update('confirm')}
                    minLength={6}
                    required
                  />
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              className="flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-brand-700"
            >
              {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              {showPassword ? 'Hide passwords' : 'Show passwords'}
            </button>
            <button type="submit" disabled={submitting} className="btn-primary w-full">
              {submitting ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-brand-700 hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
