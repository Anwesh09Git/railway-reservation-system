import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  Info,
  LockKeyhole,
  MapPin,
  Plus,
  ShieldCheck,
  Trash2,
  TrainFront,
  UserRound,
} from 'lucide-react';
import api from '../api/axios';
import Loader from '../components/Loader';
import { CLASS_LABELS, daysFromToday, formatCurrency, formatDate } from '../utils/format';

const emptyPassenger = () => ({ name: '', age: '', gender: 'Male' });

const BookPage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const journeyDate = searchParams.get('date') || daysFromToday(1);
  const [train, setTrain] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [travelClass, setTravelClass] = useState(searchParams.get('class') || '');
  const [passengers, setPassengers] = useState([emptyPassenger()]);
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchTrain = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/trains/${id}?date=${journeyDate}`);
        setTrain(data.train);
        setTravelClass((current) => current || data.train.classes[0]?.name || '');
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTrain();
  }, [id, journeyDate]);

  if (loading) return <Loader fullPage message="Loading train details..." />;

  if (error || !train) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-xl font-bold text-navy-900">Unable to load this train</h1>
        <p className="mt-2 text-sm text-rose-700">{error || 'Train not found'}</p>
        <button type="button" onClick={() => navigate('/search')} className="btn-primary mt-6">
          Back to search
        </button>
      </div>
    );
  }

  const availability = train.availability?.[travelClass];
  const classInfo = train.classes.find((cls) => cls.name === travelClass);
  const seatsLeft = availability?.availableSeats ?? classInfo?.totalSeats ?? 0;
  const farePerPassenger = availability?.fare ?? classInfo?.fare ?? 0;
  const charge = travelClass === 'SL' ? 40 : 60;
  const totalFare = farePerPassenger * passengers.length + charge;
  const willBeWaitlisted = passengers.length > seatsLeft;

  const updatePassenger = (index, key, value) =>
    setPassengers((current) =>
      current.map((passenger, i) => (i === index ? { ...passenger, [key]: value } : passenger))
    );

  const addPassenger = () => {
    if (passengers.length >= 6) return toast.error('You can book up to 6 passengers at a time');
    setPassengers((current) => [...current, emptyPassenger()]);
  };

  const removePassenger = (index) => {
    if (passengers.length === 1) return toast.error('At least one passenger is required');
    setPassengers((current) => current.filter((_, i) => i !== index));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    for (const passenger of passengers) {
      if (!passenger.name.trim() || !passenger.age || Number(passenger.age) < 1) {
        return toast.error('Please fill name and age for every passenger');
      }
    }

    setSubmitting(true);
    try {
      const { data } = await api.post('/bookings', {
        trainId: id,
        journeyDate,
        travelClass,
        passengers,
        paymentMethod,
      });
      toast.success(data.message);
      navigate(`/tickets/${data.booking._id}`, { state: { justBooked: true } });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-50 pb-16">
      <div className="bg-navy-900 px-4 py-8 text-white sm:px-6">
        <div className="mx-auto max-w-7xl">
          <button type="button" onClick={() => navigate(-1)} className="inline-flex items-center gap-1.5 text-xs text-brand-200 hover:text-white">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to trains
          </button>
          <h1 className="mt-3 text-2xl font-extrabold sm:text-3xl">Complete your booking</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mx-auto mt-6 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            {/* Journey summary */}
            <section className="card p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                    <TrainFront className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-navy-900">{train.name}</p>
                    <p className="text-xs text-slate-500">#{train.number}</p>
                  </div>
                </div>
                <span className="chip"><CalendarDays className="h-3 w-3" /> {formatDate(journeyDate)}</span>
              </div>

              <div className="mt-5 grid grid-cols-[1fr_auto_1fr] items-center gap-3 rounded-xl bg-slate-50 px-4 py-4">
                <div>
                  <p className="text-xl font-extrabold text-navy-900">{train.departureTime}</p>
                  <p className="text-xs font-semibold text-slate-600">{train.source.code} · {train.source.name}</p>
                </div>
                <div className="text-center text-xs text-slate-600">{train.duration}</div>
                <div className="text-right">
                  <p className="text-xl font-extrabold text-navy-900">{train.arrivalTime}</p>
                  <p className="text-xs font-semibold text-slate-600">{train.destination.code} · {train.destination.name}</p>
                </div>
              </div>

              <div className="mt-5">
                <label className="label">Travel class</label>
                <div className="flex flex-wrap gap-2">
                  {train.classes.map((cls) => {
                    const clsAvailability = train.availability?.[cls.name];
                    const left = clsAvailability?.availableSeats ?? cls.totalSeats;
                    return (
                      <button
                        type="button"
                        key={cls.name}
                        onClick={() => setTravelClass(cls.name)}
                        className={`rounded-xl border px-4 py-2.5 text-left text-xs transition ${
                          travelClass === cls.name
                            ? 'border-brand-500 bg-brand-50 text-brand-800 ring-2 ring-brand-100'
                            : 'border-slate-200 bg-white text-slate-600 hover:border-brand-300'
                        }`}
                      >
                        <span className="block font-bold">{cls.name} · {CLASS_LABELS[cls.name]}</span>
                        <span className={`mt-0.5 block ${left ? 'text-emerald-600' : 'text-rose-500'}`}>
                          {formatCurrency(cls.fare)} · {left ? `${left} seats` : 'Waitlist'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* Passengers */}
            <section className="card p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-navy-900">Passenger details</h2>
                  <p className="mt-1 text-xs text-slate-500">Enter names exactly as on a valid photo ID.</p>
                </div>
                <button type="button" onClick={addPassenger} className="btn-secondary btn-sm">
                  <Plus className="h-3.5 w-3.5" /> Add passenger
                </button>
              </div>

              <div className="mt-5 space-y-4">
                {passengers.map((passenger, index) => (
                  <div key={index} className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-500">
                        <UserRound className="h-3.5 w-3.5 text-brand-500" /> Passenger {index + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => removePassenger(index)}
                        className="text-slate-600 transition hover:text-rose-600"
                        aria-label={`Remove passenger ${index + 1}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-[1.4fr_0.6fr_0.9fr]">
                      <div>
                        <label className="label">Full name</label>
                        <input
                          className="input"
                          placeholder="e.g. Aarav Sharma"
                          value={passenger.name}
                          onChange={(event) => updatePassenger(index, 'name', event.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <label className="label">Age</label>
                        <input
                          className="input"
                          type="number"
                          min="1"
                          max="120"
                          placeholder="Age"
                          value={passenger.age}
                          onChange={(event) => updatePassenger(index, 'age', event.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <label className="label">Gender</label>
                        <select
                          className="input"
                          value={passenger.gender}
                          onChange={(event) => updatePassenger(index, 'gender', event.target.value)}
                        >
                          <option>Male</option>
                          <option>Female</option>
                          <option>Other</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Payment method */}
            <section className="card p-5 sm:p-6">
              <h2 className="text-base font-bold text-navy-900">Payment method</h2>
              <p className="mt-1 text-xs text-slate-500">Choose how you'd like to pay for this booking.</p>
              <div className="mt-4 grid gap-2 sm:grid-cols-3">
                {['UPI', 'Card', 'Net Banking'].map((method) => (
                  <button
                    type="button"
                    key={method}
                    onClick={() => setPaymentMethod(method)}
                    className={`flex items-center gap-2 rounded-xl border px-3 py-3 text-sm font-semibold transition ${
                      paymentMethod === method
                        ? 'border-brand-500 bg-brand-50 text-brand-800'
                        : 'border-slate-200 text-slate-600 hover:border-brand-300'
                    }`}
                  >
                    <CreditCard className="h-4 w-4" /> {method}
                  </button>
                ))}
              </div>
              <p className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-600">
                <LockKeyhole className="h-3 w-3" /> Demo checkout — no real payment is collected.
              </p>
            </section>
          </div>

          {/* Summary */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="card overflow-hidden">
              <div className="border-b border-slate-100 bg-slate-50/70 px-5 py-4">
                <h2 className="text-sm font-bold text-navy-900">Fare summary</h2>
              </div>
              <div className="space-y-3 px-5 py-5 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Ticket fare × {passengers.length}</span>
                  <span className="font-semibold text-slate-800">{formatCurrency(farePerPassenger * passengers.length)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Reservation charge</span>
                  <span className="font-semibold text-slate-800">{formatCurrency(charge)}</span>
                </div>
                <div className="flex justify-between border-t border-dashed border-slate-200 pt-3">
                  <span className="font-bold text-navy-900">Total amount</span>
                  <span className="text-xl font-extrabold text-brand-700">{formatCurrency(totalFare)}</span>
                </div>
              </div>
              <div className="px-5 pb-5">
                {willBeWaitlisted ? (
                  <p className="mb-3 flex items-start gap-2 rounded-lg bg-amber-50 px-3 py-2.5 text-[11px] text-amber-700">
                    <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    Only {seatsLeft} seat{seatsLeft === 1 ? '' : 's'} left. Extra passengers will be waitlisted.
                  </p>
                ) : (
                  <p className="mb-3 flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2.5 text-[11px] font-medium text-emerald-700">
                    <CheckCircle2 className="h-3.5 w-3.5" /> {seatsLeft} seats available on this date
                  </p>
                )}
                <button type="submit" disabled={submitting} className="btn-primary w-full">
                  {submitting ? 'Confirming...' : 'Confirm booking'}
                </button>
                <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-slate-600">
                  <ShieldCheck className="h-3.5 w-3.5" /> Secure booking · Instant PNR
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-brand-100 bg-brand-50/60 p-5">
              <p className="flex items-center gap-2 text-xs font-bold text-brand-800">
                <MapPin className="h-4 w-4" /> Good to know
              </p>
              <p className="mt-2 text-[11px] leading-relaxed text-brand-900/70">
                Arrive at the station at least 30 minutes before departure. Carry a valid photo ID
                along with your e-ticket and PNR number.
              </p>
            </div>
          </aside>
        </div>
      </form>
    </div>
  );
};

export default BookPage;
