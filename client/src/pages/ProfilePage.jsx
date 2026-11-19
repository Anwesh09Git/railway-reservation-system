import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { CalendarDays, KeyRound, Mail, Phone, Ticket, UserCircle2 } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { formatDate } from '../utils/format';

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '', password: '' });
  const [saving, setSaving] = useState(false);
  const [stats, setStats] = useState({ count: 0, latest: null });

  useEffect(() => {
    api
      .get('/bookings/my')
      .then(({ data }) =>
        setStats({ count: data.bookings.length, latest: data.bookings[0]?.journeyDate || null })
      )
      .catch(() => {});
  }, []);

  const update = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      await updateProfile({ name: form.name, phone: form.phone, ...(form.password ? { password: form.password } : {}) });
      setForm((current) => ({ ...current, password: '' }));
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-slate-50 pb-16">
      <div className="bg-navy-900 px-4 py-10 text-white sm:px-6">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-300">Account</p>
          <h1 className="mt-2 text-2xl font-extrabold sm:text-3xl">My profile</h1>
        </div>
      </div>

      <div className="mx-auto grid max-w-5xl gap-6 px-4 pt-6 sm:px-6 lg:grid-cols-[1fr_320px]">
        <section className="card p-5 sm:p-7">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-100 text-brand-700">
              <UserCircle2 className="h-7 w-7" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-navy-900">{user?.name}</h2>
              <p className="text-sm text-slate-500">{user?.email}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-7 space-y-5">
            <div>
              <label className="label">Full name</label>
              <input className="input" value={form.name} onChange={update('name')} required />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="label">Phone number</label>
                <input className="input" value={form.phone} onChange={update('phone')} placeholder="Add a phone number" />
              </div>
              <div>
                <label className="label">New password <span className="font-normal normal-case text-slate-600">(optional)</span></label>
                <input
                  className="input"
                  type="password"
                  minLength={6}
                  value={form.password}
                  onChange={update('password')}
                  placeholder="Leave blank to keep current"
                />
              </div>
            </div>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Saving...' : 'Save changes'}
            </button>
          </form>
        </section>

        <aside className="space-y-5">
          <div className="card p-5">
            <h2 className="text-sm font-bold text-navy-900">Account details</h2>
            <div className="mt-4 space-y-3 text-sm">
              <p className="flex items-center gap-2 text-slate-600"><Mail className="h-4 w-4 text-brand-500" /> {user?.email}</p>
              <p className="flex items-center gap-2 text-slate-600"><Phone className="h-4 w-4 text-brand-500" /> {user?.phone || 'Not provided'}</p>
              <p className="flex items-center gap-2 text-slate-600">
                <KeyRound className="h-4 w-4 text-brand-500" /> {user?.role === 'admin' ? 'Administrator' : 'Traveller'}
              </p>
              <p className="flex items-center gap-2 text-slate-600">
                <CalendarDays className="h-4 w-4 text-brand-500" /> Joined {user?.createdAt ? formatDate(user.createdAt.slice(0, 10)) : '—'}
              </p>
            </div>
          </div>

          <div className="card p-5">
            <h2 className="text-sm font-bold text-navy-900">Your activity</h2>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-brand-50 p-4">
                <Ticket className="h-4 w-4 text-brand-600" />
                <p className="mt-2 text-2xl font-extrabold text-navy-900">{stats.count}</p>
                <p className="text-[11px] text-slate-500">Total bookings</p>
              </div>
              <div className="rounded-xl bg-emerald-50 p-4">
                <CalendarDays className="h-4 w-4 text-emerald-600" />
                <p className="text-xs font-bold text-navy-900">{stats.latest ? formatDate(stats.latest, { year: undefined }) : '—'}</p>
                <p className="mt-1 text-[11px] text-slate-500">Latest journey</p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default ProfilePage;
