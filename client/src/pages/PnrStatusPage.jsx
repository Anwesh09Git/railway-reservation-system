import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowRight, CalendarDays, Hash, Search, Ticket, TrainFront } from 'lucide-react';
import api from '../api/axios';
import StatusBadge from '../components/StatusBadge';
import { CLASS_LABELS, formatCurrency, formatDate } from '../utils/format';

const PnrStatusPage = () => {
  const [pnr, setPnr] = useState('');
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const checkStatus = async (event) => {
    event.preventDefault();
    if (!/^\d{10}$/.test(pnr)) return toast.error('Enter a valid 10-digit PNR number');
    setLoading(true);
    setSearched(true);
    setBooking(null);
    try {
      const { data } = await api.get(`/bookings/pnr/${pnr}`);
      setBooking(data.booking);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 pb-16">
      <div className="bg-navy-900 px-4 py-10 text-white sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
            <Hash className="h-5 w-5 text-gold-400" />
          </span>
          <h1 className="mt-4 text-2xl font-extrabold sm:text-3xl">Check PNR status</h1>
          <p className="mt-2 text-sm text-slate-300">Enter your 10-digit PNR number to see your ticket status.</p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 pt-8 sm:px-6">
        <form onSubmit={checkStatus} className="card flex flex-col gap-3 p-5 sm:flex-row">
          <div className="relative flex-1">
            <Hash className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-500" />
            <input
              className="input pl-10 font-mono tracking-widest"
              placeholder="e.g. 4829103756"
              inputMode="numeric"
              maxLength={10}
              value={pnr}
              onChange={(event) => setPnr(event.target.value.replace(/\D/g, ''))}
              aria-label="PNR number"
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary">
            <Search className="h-4 w-4" /> {loading ? 'Checking...' : 'Check status'}
          </button>
        </form>

        <p className="mt-3 text-center text-xs text-slate-600">
          Try the sample PNR <button type="button" onClick={() => setPnr('4829103756')} className="font-bold text-brand-600 hover:underline">4829103756</button>
        </p>

        {booking && (
          <div className="card mt-7 overflow-hidden animate-fade-up">
            <div className="flex flex-wrap items-center justify-between gap-3 bg-brand-50 px-5 py-4">
              <div>
                <p className="text-xs text-brand-700">PNR number</p>
                <p className="font-mono text-xl font-bold tracking-widest text-navy-900">{booking.pnr}</p>
              </div>
              <StatusBadge status={booking.status} />
            </div>
            <div className="px-5 py-5">
              <p className="flex items-center gap-2 text-sm font-bold text-navy-900">
                <TrainFront className="h-4 w-4 text-brand-600" />
                {booking.trainSnapshot?.number} · {booking.trainSnapshot?.name}
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="label">From</p>
                  <p className="text-sm font-bold text-navy-900">{booking.trainSnapshot?.source?.code}</p>
                  <p className="text-[11px] text-slate-500">{booking.trainSnapshot?.source?.name}</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="label">Journey date</p>
                  <p className="flex items-center gap-1 text-sm font-bold text-navy-900">
                    <CalendarDays className="h-3.5 w-3.5 text-brand-500" /> {formatDate(booking.journeyDate)}
                  </p>
                  <p className="text-[11px] text-slate-500">{booking.travelClass} · {CLASS_LABELS[booking.travelClass]}</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="label">To</p>
                  <p className="text-sm font-bold text-navy-900">{booking.trainSnapshot?.destination?.code}</p>
                  <p className="text-[11px] text-slate-500">{booking.trainSnapshot?.destination?.name}</p>
                </div>
              </div>
              <div className="mt-4 rounded-xl border border-slate-100 p-4">
                <p className="text-xs font-bold text-slate-600">Passengers</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {booking.passengers.map((passenger, index) => (
                    <span key={index} className="chip">
                      {passenger.name} · {passenger.seat ? `Seat ${passenger.seat} (${passenger.berth})` : 'Waitlist'}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-dashed border-slate-200 pt-4">
                <p className="text-sm text-slate-500">Total fare <b className="text-navy-900">{formatCurrency(booking.totalFare)}</b></p>
                <Link to="/login" className="btn-primary btn-sm">
                  <Ticket className="h-3.5 w-3.5" /> Log in to view ticket <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {searched && !loading && !booking && (
          <div className="card mt-7 px-6 py-12 text-center">
            <Ticket className="mx-auto h-8 w-8 text-slate-300" />
            <p className="mt-3 text-sm font-semibold text-navy-900">No ticket found</p>
            <p className="mt-1 text-xs text-slate-500">Please check the PNR number and try again.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PnrStatusPage;
