import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  Activity,
  CalendarCheck2,
  IndianRupee,
  LayoutDashboard,
  Pencil,
  Plus,
  Ticket,
  TrainFront,
  Trash2,
  Users,
  X,
} from 'lucide-react';
import api from '../api/axios';
import Loader from '../components/Loader';
import StatusBadge from '../components/StatusBadge';
import { CLASS_LABELS, formatCurrency, formatDate } from '../utils/format';

const emptyTrain = {
  number: '',
  name: '',
  sourceName: '',
  sourceCode: '',
  destinationName: '',
  destinationCode: '',
  departureTime: '',
  arrivalTime: '',
  duration: '',
  distance: '',
  amenities: '',
  classes: [{ name: 'SL', fare: '', totalSeats: '' }],
};

const classOptions = Object.keys(CLASS_LABELS);

const AdminPage = () => {
  const [tab, setTab] = useState('overview');
  const [stats, setStats] = useState({});
  const [trains, setTrains] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyTrain);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, trainsRes, bookingsRes] = await Promise.all([
        api.get('/bookings/stats'),
        api.get('/trains'),
        api.get('/bookings/all'),
      ]);
      setStats(statsRes.data.stats || {});
      setTrains(trainsRes.data.trains || []);
      setBookings(bookingsRes.data.bookings || []);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateField = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }));

  const updateClass = (index, key, value) =>
    setForm((current) => ({
      ...current,
      classes: current.classes.map((item, i) => (i === index ? { ...item, [key]: value } : item)),
    }));

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyTrain);
    setModalOpen(true);
  };

  const openEdit = (train) => {
    setEditingId(train._id);
    setForm({
      number: train.number,
      name: train.name,
      sourceName: train.source.name,
      sourceCode: train.source.code,
      destinationName: train.destination.name,
      destinationCode: train.destination.code,
      departureTime: train.departureTime,
      arrivalTime: train.arrivalTime,
      duration: train.duration,
      distance: String(train.distance),
      amenities: (train.amenities || []).join(', '),
      classes: train.classes.map((cls) => ({ ...cls, fare: String(cls.fare), totalSeats: String(cls.totalSeats) })),
    });
    setModalOpen(true);
  };

  const saveTrain = async (event) => {
    event.preventDefault();
    setSaving(true);
    const payload = {
      number: form.number.trim().toUpperCase(),
      name: form.name.trim(),
      source: { name: form.sourceName.trim(), code: form.sourceCode.trim().toUpperCase() },
      destination: { name: form.destinationName.trim(), code: form.destinationCode.trim().toUpperCase() },
      departureTime: form.departureTime,
      arrivalTime: form.arrivalTime,
      duration: form.duration,
      distance: Number(form.distance),
      amenities: form.amenities.split(',').map((item) => item.trim()).filter(Boolean),
      classes: form.classes.map((cls) => ({
        name: cls.name,
        fare: Number(cls.fare),
        totalSeats: Number(cls.totalSeats),
      })),
    };

    try {
      if (editingId) {
        await api.put(`/trains/${editingId}`, payload);
        toast.success('Train updated');
      } else {
        await api.post('/trains', payload);
        toast.success('Train added');
      }
      setModalOpen(false);
      await fetchData();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  const deleteTrain = async (train) => {
    if (!window.confirm(`Delete train ${train.number} — ${train.name}?`)) return;
    try {
      await api.delete(`/trains/${train._id}`);
      toast.success('Train deleted');
      await fetchData();
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (loading) return <Loader fullPage message="Loading dashboard..." />;

  const statCards = [
    { label: 'Total bookings', value: stats.totalBookings || 0, icon: Ticket, tint: 'bg-brand-50 text-brand-600' },
    { label: 'Confirmed', value: stats.confirmed || 0, icon: CalendarCheck2, tint: 'bg-emerald-50 text-emerald-600' },
    { label: 'Revenue', value: formatCurrency(stats.revenue), icon: IndianRupee, tint: 'bg-amber-50 text-amber-600' },
    { label: 'Registered users', value: stats.users || 0, icon: Users, tint: 'bg-violet-50 text-violet-600' },
    { label: 'Active trains', value: stats.trains || 0, icon: TrainFront, tint: 'bg-cyan-50 text-cyan-600' },
    { label: 'Cancelled', value: stats.cancelled || 0, icon: Activity, tint: 'bg-rose-50 text-rose-600' },
  ];

  const tabs = [
    { key: 'overview', label: 'Overview', icon: LayoutDashboard },
    { key: 'trains', label: 'Trains', icon: TrainFront },
    { key: 'bookings', label: 'Bookings', icon: Ticket },
  ];

  return (
    <div className="bg-slate-50 pb-16">
      <div className="bg-navy-900 px-4 py-9 text-white sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-300">Control centre</p>
            <h1 className="mt-2 text-2xl font-extrabold sm:text-3xl">Admin dashboard</h1>
            <p className="mt-1 text-sm text-slate-300">Manage trains and monitor reservations.</p>
          </div>
          <button type="button" onClick={openAdd} className="btn-primary btn-sm">
            <Plus className="h-3.5 w-3.5" /> Add train
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <div className="flex gap-1 overflow-x-auto rounded-xl border border-slate-100 bg-white p-1 shadow-sm">
          {tabs.map(({ key, label, icon: Icon }) => (
            <button
              type="button"
              key={key}
              onClick={() => setTab(key)}
              className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-semibold transition ${
                tab === key ? 'bg-brand-700 text-white' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Icon className="h-4 w-4" /> {label}
            </button>
          ))}
        </div>

        {tab === 'overview' && (
          <div className="mt-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {statCards.map(({ label, value, icon: Icon, tint }) => (
                <div key={label} className="card flex items-center gap-4 p-5">
                  <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${tint}`}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-xs text-slate-500">{label}</p>
                    <p className="text-xl font-extrabold text-navy-900">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
              <div className="card overflow-hidden">
                <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                  <h2 className="text-sm font-bold text-navy-900">Recent bookings</h2>
                  <button type="button" onClick={() => setTab('bookings')} className="text-xs font-semibold text-brand-600 hover:underline">
                    View all
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[620px] text-left text-sm">
                    <thead className="bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
                      <tr>
                        <th className="px-5 py-3">PNR</th>
                        <th className="px-5 py-3">Train</th>
                        <th className="px-5 py-3">User</th>
                        <th className="px-5 py-3">Date</th>
                        <th className="px-5 py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {bookings.slice(0, 6).map((booking) => (
                        <tr key={booking._id} className="hover:bg-slate-50/60">
                          <td className="px-5 py-3 font-mono text-xs font-semibold text-slate-700">{booking.pnr}</td>
                          <td className="px-5 py-3 text-xs text-slate-600">{booking.trainSnapshot?.number}</td>
                          <td className="px-5 py-3 text-xs text-slate-600">{booking.user?.name || '—'}</td>
                          <td className="px-5 py-3 text-xs text-slate-600">{formatDate(booking.journeyDate, { weekday: undefined, year: undefined })}</td>
                          <td className="px-5 py-3"><StatusBadge status={booking.status} /></td>
                        </tr>
                      ))}
                      {bookings.length === 0 && (
                        <tr><td colSpan={5} className="px-5 py-10 text-center text-sm text-slate-600">No bookings yet</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="card p-5">
                <h2 className="text-sm font-bold text-navy-900">Booking breakdown</h2>
                <p className="mt-1 text-xs text-slate-500">Status of all reservations</p>
                <div className="mt-6 space-y-5">
                  {[
                    { label: 'Confirmed', value: stats.confirmed || 0, color: 'bg-emerald-500' },
                    { label: 'Waitlist', value: stats.waitlist || 0, color: 'bg-amber-500' },
                    { label: 'Cancelled', value: stats.cancelled || 0, color: 'bg-rose-500' },
                  ].map((item) => {
                    const percentage = stats.totalBookings ? Math.round((item.value / stats.totalBookings) * 100) : 0;
                    return (
                      <div key={item.label}>
                        <div className="flex justify-between text-xs font-semibold text-slate-600">
                          <span>{item.label}</span><span>{item.value} · {percentage}%</span>
                        </div>
                        <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                          <div className={`h-full rounded-full ${item.color}`} style={{ width: `${percentage}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 'trains' && (
          <div className="card mt-6 overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <h2 className="text-sm font-bold text-navy-900">All trains ({trains.length})</h2>
              <button type="button" onClick={openAdd} className="btn-secondary btn-sm"><Plus className="h-3.5 w-3.5" /> Add train</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-5 py-3">Train</th>
                    <th className="px-5 py-3">Route</th>
                    <th className="px-5 py-3">Timing</th>
                    <th className="px-5 py-3">Classes</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {trains.map((train) => (
                    <tr key={train._id} className="hover:bg-slate-50/60">
                      <td className="px-5 py-4">
                        <p className="font-bold text-navy-900">{train.name}</p>
                        <p className="text-xs text-slate-600">#{train.number}</p>
                      </td>
                      <td className="px-5 py-4 text-xs text-slate-600">
                        <p>{train.source.code} → {train.destination.code}</p>
                        <p className="text-slate-600">{train.distance} km</p>
                      </td>
                      <td className="px-5 py-4 text-xs text-slate-600">
                        <p>{train.departureTime} → {train.arrivalTime}</p>
                        <p className="text-slate-600">{train.duration}</p>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-wrap gap-1">
                          {train.classes.map((cls) => <span key={cls.name} className="chip">{cls.name}</span>)}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button type="button" onClick={() => openEdit(train)} className="rounded-lg p-2 text-brand-600 hover:bg-brand-50" aria-label="Edit train"><Pencil className="h-4 w-4" /></button>
                          <button type="button" onClick={() => deleteTrain(train)} className="rounded-lg p-2 text-rose-600 hover:bg-rose-50" aria-label="Delete train"><Trash2 className="h-4 w-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {trains.length === 0 && (
                    <tr><td colSpan={5} className="px-5 py-10 text-center text-sm text-slate-600">No trains found. Add one to get started.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'bookings' && (
          <div className="card mt-6 overflow-hidden">
            <div className="border-b border-slate-100 px-5 py-4">
              <h2 className="text-sm font-bold text-navy-900">All bookings ({bookings.length})</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[780px] text-left text-sm">
                <thead className="bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-5 py-3">PNR</th>
                    <th className="px-5 py-3">Passenger</th>
                    <th className="px-5 py-3">Train</th>
                    <th className="px-5 py-3">Journey</th>
                    <th className="px-5 py-3">Fare</th>
                    <th className="px-5 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {bookings.map((booking) => (
                    <tr key={booking._id} className="hover:bg-slate-50/60">
                      <td className="px-5 py-3 font-mono text-xs font-semibold text-slate-700">{booking.pnr}</td>
                      <td className="px-5 py-3 text-xs text-slate-600">{booking.passengers[0]?.name}{booking.passengers.length > 1 ? ` +${booking.passengers.length - 1}` : ''}</td>
                      <td className="px-5 py-3 text-xs text-slate-600">{booking.trainSnapshot?.number} · {booking.trainSnapshot?.source?.code}→{booking.trainSnapshot?.destination?.code}</td>
                      <td className="px-5 py-3 text-xs text-slate-600">{formatDate(booking.journeyDate, { weekday: undefined, year: undefined })}</td>
                      <td className="px-5 py-3 text-xs font-semibold text-navy-900">{formatCurrency(booking.totalFare)}</td>
                      <td className="px-5 py-3"><StatusBadge status={booking.status} /></td>
                    </tr>
                  ))}
                  {bookings.length === 0 && (
                    <tr><td colSpan={6} className="px-5 py-10 text-center text-sm text-slate-600">No bookings yet</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Train modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-sm sm:p-8">
          <div className="my-auto w-full max-w-3xl rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div>
                <h2 className="text-base font-bold text-navy-900">{editingId ? 'Edit train' : 'Add a new train'}</h2>
                <p className="text-xs text-slate-500">Fill in the train and route details.</p>
              </div>
              <button type="button" onClick={() => setModalOpen(false)} className="rounded-lg p-2 text-slate-600 hover:bg-slate-100" aria-label="Close"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={saveTrain} className="space-y-5 px-6 py-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div><label className="label">Train number</label><input className="input" value={form.number} onChange={updateField('number')} placeholder="12951" required /></div>
                <div><label className="label">Train name</label><input className="input" value={form.name} onChange={updateField('name')} placeholder="Mumbai Rajdhani Express" required /></div>
                <div><label className="label">Source station</label><input className="input" value={form.sourceName} onChange={updateField('sourceName')} placeholder="Mumbai Central" required /></div>
                <div><label className="label">Source code</label><input className="input" value={form.sourceCode} onChange={updateField('sourceCode')} placeholder="MMCT" required /></div>
                <div><label className="label">Destination station</label><input className="input" value={form.destinationName} onChange={updateField('destinationName')} placeholder="New Delhi" required /></div>
                <div><label className="label">Destination code</label><input className="input" value={form.destinationCode} onChange={updateField('destinationCode')} placeholder="NDLS" required /></div>
                <div><label className="label">Departure time</label><input className="input" value={form.departureTime} onChange={updateField('departureTime')} placeholder="16:35" required /></div>
                <div><label className="label">Arrival time</label><input className="input" value={form.arrivalTime} onChange={updateField('arrivalTime')} placeholder="08:35" required /></div>
                <div><label className="label">Duration</label><input className="input" value={form.duration} onChange={updateField('duration')} placeholder="16h 00m" required /></div>
                <div><label className="label">Distance (km)</label><input className="input" type="number" min="1" value={form.distance} onChange={updateField('distance')} placeholder="1386" required /></div>
              </div>
              <div>
                <label className="label">Amenities <span className="font-normal normal-case text-slate-600">(comma separated)</span></label>
                <input className="input" value={form.amenities} onChange={updateField('amenities')} placeholder="AC, Wi-Fi, Food Included" />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="label mb-0">Classes & fares</label>
                  <button
                    type="button"
                    onClick={() => setForm((current) => ({ ...current, classes: [...current.classes, { name: '3A', fare: '', totalSeats: '' }] }))}
                    className="text-xs font-semibold text-brand-600 hover:underline"
                  >
                    + Add class
                  </button>
                </div>
                <div className="space-y-2">
                  {form.classes.map((cls, index) => (
                    <div key={index} className="grid grid-cols-[1fr_1fr_1fr_auto] items-end gap-2 rounded-xl bg-slate-50 p-3">
                      <div>
                        <label className="label">Class</label>
                        <select className="input" value={cls.name} onChange={(event) => updateClass(index, 'name', event.target.value)}>
                          {classOptions.map((option) => <option key={option} value={option}>{option} · {CLASS_LABELS[option]}</option>)}
                        </select>
                      </div>
                      <div><label className="label">Fare (₹)</label><input className="input" type="number" min="1" value={cls.fare} onChange={(event) => updateClass(index, 'fare', event.target.value)} required /></div>
                      <div><label className="label">Seats</label><input className="input" type="number" min="1" value={cls.totalSeats} onChange={(event) => updateClass(index, 'totalSeats', event.target.value)} required /></div>
                      <button type="button" onClick={() => setForm((current) => ({ ...current, classes: current.classes.filter((_, i) => i !== index) }))} className="mb-1 rounded-lg p-2.5 text-rose-500 hover:bg-rose-50" aria-label="Remove class"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
                <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Saving...' : editingId ? 'Update train' : 'Add train'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
