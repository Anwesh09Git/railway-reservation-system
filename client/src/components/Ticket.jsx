import { CalendarDays, Clock3, MapPin, TicketCheck, TrainFront } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { CLASS_LABELS, formatCurrency, formatDate, formatDateTime } from '../utils/format';

const Ticket = ({ booking }) => {
  const snapshot = booking.trainSnapshot || {};
  const isCancelled = booking.status === 'cancelled';

  return (
    <div className="print-area overflow-hidden rounded-xl border border-slate-200 bg-white shadow-soft">
      <div className="flex flex-wrap items-center justify-between gap-4 border-l-4 border-brand-600 bg-navy-950 px-6 py-5 text-white">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-lg border border-white/20 bg-white/5">
            <TicketCheck className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs uppercase tracking-widest text-brand-200">Electronic Reservation Slip</p>
            <p className="text-lg font-bold">RailYatri Ticket</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-brand-200">PNR Number</p>
          <p className="font-mono text-2xl font-bold tracking-wider">{booking.pnr}</p>
        </div>
      </div>

      <div className="grid gap-4 border-b border-dashed border-slate-200 bg-slate-50/70 px-6 py-5 sm:grid-cols-3">
        <div>
          <p className="label">Train</p>
          <p className="flex items-center gap-1.5 text-sm font-bold text-navy-900">
            <TrainFront className="h-4 w-4 text-brand-600" />
            {snapshot.number} · {snapshot.name}
          </p>
        </div>
        <div>
          <p className="label">Journey Date</p>
          <p className="flex items-center gap-1.5 text-sm font-bold text-navy-900">
            <CalendarDays className="h-4 w-4 text-brand-600" />
            {formatDate(booking.journeyDate)}
          </p>
        </div>
        <div>
          <p className="label">Booking Status</p>
          <div className="mt-0.5 flex items-center gap-2">
            <StatusBadge status={booking.status} />
            <span className="text-xs text-slate-500">{booking.paymentStatus}</span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 px-6 py-6 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
        <div>
          <p className="label">Boarding</p>
          <p className="text-2xl font-extrabold text-navy-900">{snapshot.departureTime}</p>
          <p className="flex items-center gap-1 text-sm font-semibold text-slate-700">
            <MapPin className="h-3.5 w-3.5 text-brand-500" />
            {snapshot.source?.name} ({snapshot.source?.code})
          </p>
        </div>
        <div className="hidden flex-col items-center gap-1 sm:flex">
          <span className="h-px w-16 bg-slate-200" />
          <span className="chip"><Clock3 className="h-3 w-3" /> Onward journey</span>
          <span className="h-px w-16 bg-slate-200" />
        </div>
        <div className="sm:text-right">
          <p className="label">Destination</p>
          <p className="text-2xl font-extrabold text-navy-900">{snapshot.arrivalTime}</p>
          <p className="flex items-center gap-1 text-sm font-semibold text-slate-700 sm:justify-end">
            <MapPin className="h-3.5 w-3.5 text-rose-500" />
            {snapshot.destination?.name} ({snapshot.destination?.code})
          </p>
        </div>
      </div>

      <div className="px-6 pb-6">
        <div className="mb-3 flex items-center justify-between">
          <h4 className="text-sm font-bold text-navy-900">Passenger Details</h4>
          <span className="chip">{booking.travelClass} · {CLASS_LABELS[booking.travelClass] || booking.travelClass}</span>
        </div>
        <div className="overflow-hidden rounded-xl border border-slate-100">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-2.5">#</th>
                <th className="px-4 py-2.5">Name</th>
                <th className="px-4 py-2.5">Age</th>
                <th className="px-4 py-2.5">Gender</th>
                <th className="px-4 py-2.5">Berth</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {booking.passengers.map((passenger, index) => (
                <tr key={`${passenger.name}-${index}`} className={isCancelled ? 'line-through opacity-60' : ''}>
                  <td className="px-4 py-2.5 text-slate-600">{index + 1}</td>
                  <td className="px-4 py-2.5 font-semibold text-slate-800">{passenger.name}</td>
                  <td className="px-4 py-2.5 text-slate-600">{passenger.age}</td>
                  <td className="px-4 py-2.5 text-slate-600">{passenger.gender}</td>
                  <td className="px-4 py-2.5 font-semibold text-slate-700">
                    {passenger.seat ? `${passenger.seat} · ${passenger.berth}` : 'RAC / WL'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-5 flex flex-wrap items-end justify-between gap-4 rounded-xl bg-slate-50 px-5 py-4">
          <div className="space-y-1 text-xs text-slate-500">
            <p>Fare: {formatCurrency(booking.farePerPassenger)} × {booking.passengers.length}</p>
            <p>Reservation charge: {formatCurrency(booking.reservationCharge)}</p>
            <p>Payment: {booking.paymentMethod || 'UPI'} · Booked {formatDateTime(booking.createdAt)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Total fare</p>
            <p className="text-2xl font-extrabold text-navy-900">{formatCurrency(booking.totalFare)}</p>
          </div>
        </div>

        {isCancelled && (
          <p className="mt-4 rounded-lg bg-rose-50 px-4 py-3 text-center text-xs font-semibold text-rose-700">
            This ticket was cancelled{booking.cancelledAt ? ` on ${formatDateTime(booking.cancelledAt)}` : ''}.
          </p>
        )}
      </div>
    </div>
  );
};

export default Ticket;
