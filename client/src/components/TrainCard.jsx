import { Link } from 'react-router-dom';
import { ArrowRight, Clock3, ShieldCheck, TrainFront, Wifi } from 'lucide-react';
import { CLASS_LABELS, daysFromToday, formatCurrency } from '../utils/format';

const TrainCard = ({ train, date }) => {
  const journeyDate = date || daysFromToday(1);
  const availability = train.availability || {};
  const classes = Object.keys(availability).length
    ? Object.keys(availability)
    : train.classes.map((cls) => cls.name);

  return (
    <article className="card overflow-hidden transition hover:border-brand-300">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-slate-50/60 px-5 py-3.5">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-100 text-brand-700">
            <TrainFront className="h-4 w-4" />
          </span>
          <div>
            <p className="text-sm font-bold text-navy-900">{train.name}</p>
            <p className="text-xs text-slate-500">#{train.number} · {train.distance} km</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {(train.amenities || []).slice(0, 3).map((amenity) => (
            <span className="chip" key={amenity}>
              {amenity === 'Wi-Fi' ? <Wifi className="h-3 w-3" /> : <ShieldCheck className="h-3 w-3" />}
              {amenity}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 px-5 py-6 sm:gap-8">
        <div>
          <p className="text-2xl font-extrabold text-navy-900">{train.departureTime}</p>
          <p className="text-sm font-semibold text-slate-700">{train.source.code}</p>
          <p className="truncate text-xs text-slate-500">{train.source.name}</p>
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
            <Clock3 className="h-3.5 w-3.5" /> {train.duration}
          </span>
          <div className="flex w-16 items-center gap-1 sm:w-28">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
            <span className="h-px flex-1 bg-slate-200" />
            <TrainFront className="h-3.5 w-3.5 text-brand-500" />
            <span className="h-px flex-1 bg-slate-200" />
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-extrabold text-navy-900">{train.arrivalTime}</p>
          <p className="text-sm font-semibold text-slate-700">{train.destination.code}</p>
          <p className="truncate text-xs text-slate-500">{train.destination.name}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2.5 border-t border-dashed border-slate-200 bg-slate-50/40 px-5 py-4">
        {classes.map((className) => {
          const info = availability[className];
          const classInfo = train.classes.find((c) => c.name === className) || {};
          const seats = info?.availableSeats ?? classInfo.totalSeats ?? 0;
          const fare = info?.fare ?? classInfo.fare ?? 0;
          const soldOut = seats === 0;

          return (
            <Link
              key={className}
              to={soldOut ? '#' : `/book/${train._id}?class=${className}&date=${journeyDate}`}
              onClick={(event) => soldOut && event.preventDefault()}
              className={`group flex min-w-[170px] flex-1 items-center justify-between gap-3 rounded-xl border bg-white px-3.5 py-2.5 transition ${
                soldOut
                  ? 'cursor-not-allowed border-slate-100 opacity-60'
                  : 'border-slate-200 hover:border-brand-400 hover:shadow-sm'
              }`}
            >
              <div>
                <p className="text-xs font-bold text-navy-900">
                  {className} <span className="font-normal text-slate-600">· {CLASS_LABELS[className] || className}</span>
                </p>
                <p className="mt-0.5 text-[11px] font-semibold">
                  {soldOut ? (
                    <span className="text-rose-500">Waitlist available</span>
                  ) : (
                    <span className="text-emerald-600">{seats} seats left</span>
                  )}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-extrabold text-navy-900">{formatCurrency(fare)}</p>
                <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-brand-600">
                  Book <ArrowRight className="h-3 w-3 transition group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </article>
  );
};

export default TrainCard;
