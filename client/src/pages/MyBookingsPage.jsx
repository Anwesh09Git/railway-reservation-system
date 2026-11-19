import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { CalendarDays, Eye, Ticket, TrainFront, XCircle } from 'lucide-react';
import api from '../api/axios';
import Loader from '../components/Loader';
import StatusBadge from '../components/StatusBadge';
import { CLASS_LABELS, formatCurrency, formatDate } from '../utils/format';

const filters = ['All', 'confirmed', 'waitlist', 'cancelled'];

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('All');
  const [cancelling, setCancelling] = useState(null);

  useEffect(() => {
    api
      .get('/bookings/my')
      .then(({ data }) => setBookings(data.bookings || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const visibleBookings = useMemo(
    () => (filter === 'All' ? bookings : bookings.filter((booking) => booking.status === filter)),
    [bookings, filter]
  );

  const cancelBooking = async (booking) => {
    if (!window.confirm(`Cancel ticket ${booking.pnr}? This cannot be undone.`)) return;
    setCancelling(booking._id);
    try {
      const { data } = await api.put(`/bookings/${booking._id}/cancel`);
      setBookings((current) => current.map((item) => (item._id === booking._id ? data.booking : item)));
      toast.success(data.message);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setCancelling(null);
    }
  };

  if (loading) return <Loader fullPage message="Loading your bookings..." />;

  return (
    <div className="bg-slate-50 pb-16">
      <div className="bg-navy-900 px-4 py-10 text-white sm:px-6">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-300">Your travel plans</p>
          <h1 className="mt-2 text-2xl font-extrabold sm:text-3xl">My bookings</h1>
          <p className="mt-1 text-sm text-slate-300">View, download or cancel your reserved tickets.</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <div className="flex flex-wrap gap-2">
          {filters.map((item) => (
            <button
              type="button"
              key={item}
              onClick={() => setFilter(item)}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                filter === item
                  ? 'bg-brand-700 text-white'
                  : 'border border-slate-300 bg-white text-slate-700 hover:border-brand-400'
              }`}
            >
              {item === 'All' ? 'All tickets' : item.charAt(0).toUpperCase() + item.slice(1)}
              {item !== 'All' && (
                <span className="ml-1.5 opacity-70">
                  {bookings.filter((booking) => booking.status === item).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {error && (
          <div className="mt-6 rounded-xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">
            {error}
          </div>
        )}

        {!error && visibleBookings.length === 0 && (
          <div className="card mt-6 flex flex-col items-center px-6 py-16 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-600">
              <Ticket className="h-6 w-6" />
            </span>
            <h3 className="mt-4 text-base font-bold text-navy-900">
              {bookings.length ? 'No tickets in this category' : 'No bookings yet'}
            </h3>
            <p className="mt-1 max-w-sm text-sm text-slate-500">
              {bookings.length
                ? 'Try another filter to see your other tickets.'
                : 'Your booked tickets will appear here. Find a train to get started.'}
            </p>
            <Link to="/search" className="btn-primary mt-5">
              Find trains
            </Link>
          </div>
        )}

        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          {visibleBookings.map((booking) => {
            const snapshot = booking.trainSnapshot || {};
            return (
              <article key={booking._id} className="card overflow-hidden">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-slate-50/70 px-5 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-100 text-brand-700">
                      <TrainFront className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-xs font-bold text-navy-900">PNR {booking.pnr}</p>
                      <p className="text-[11px] text-slate-500">Booked {new Date(booking.createdAt).toLocaleDateString('en-IN')}</p>
                    </div>
                  </div>
                  <StatusBadge status={booking.status} />
                </div>

                <div className="px-5 py-5">
                  <p className="text-sm font-bold text-navy-900">
                    {snapshot.number} · {snapshot.name}
                  </p>
                  <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                    <div>
                      <p className="text-lg font-extrabold text-navy-900">{snapshot.departureTime}</p>
                      <p className="text-xs font-semibold text-slate-600">{snapshot.source?.code}</p>
                      <p className="truncate text-[11px] text-slate-600">{snapshot.source?.name}</p>
                    </div>
                    <span className="text-[10px] font-medium text-slate-600">→</span>
                    <div className="text-right">
                      <p className="text-lg font-extrabold text-navy-900">{snapshot.arrivalTime}</p>
                      <p className="text-xs font-semibold text-slate-600">{snapshot.destination?.code}</p>
                      <p className="truncate text-[11px] text-slate-600">{snapshot.destination?.name}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-dashed border-slate-200 pt-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5" /> {formatDate(booking.journeyDate)}</span>
                    <span>{booking.travelClass} · {CLASS_LABELS[booking.travelClass] || booking.travelClass}</span>
                    <span>{booking.passengers.length} passenger{booking.passengers.length === 1 ? '' : 's'}</span>
                    <span className="ml-auto text-sm font-extrabold text-navy-900">{formatCurrency(booking.totalFare)}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 border-t border-slate-100 bg-slate-50/40 px-5 py-3.5">
                  <Link to={`/tickets/${booking._id}`} className="btn-primary btn-sm">
                    <Eye className="h-3.5 w-3.5" /> View ticket
                  </Link>
                  {booking.status !== 'cancelled' && (
                    <button
                      type="button"
                      onClick={() => cancelBooking(booking)}
                      disabled={cancelling === booking._id}
                      className="btn-secondary btn-sm hover:border-rose-300 hover:text-rose-600"
                    >
                      <XCircle className="h-3.5 w-3.5" />
                      {cancelling === booking._id ? 'Cancelling...' : 'Cancel ticket'}
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MyBookingsPage;
