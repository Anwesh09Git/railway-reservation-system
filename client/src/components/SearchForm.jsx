import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftRight, CalendarDays, MapPin, Search, TrainFront } from 'lucide-react';
import api from '../api/axios';
import { CLASS_LABELS, daysFromToday } from '../utils/format';

const FALLBACK_STATIONS = [
  { name: 'New Delhi', code: 'NDLS' },
  { name: 'Mumbai Central', code: 'MMCT' },
  { name: 'Howrah Junction', code: 'HWH' },
  { name: 'Chennai Central', code: 'MAS' },
  { name: 'Bengaluru City', code: 'SBC' },
  { name: 'Amritsar Junction', code: 'ASR' },
];

const SearchForm = ({ compact = false, initial = {} }) => {
  const navigate = useNavigate();
  const [stations, setStations] = useState(FALLBACK_STATIONS);
  const [form, setForm] = useState({
    from: initial.from || '',
    to: initial.to || '',
    date: initial.date || daysFromToday(1),
    class: initial.class || '',
  });

  useEffect(() => {
    api
      .get('/trains/stations')
      .then(({ data }) => data.stations?.length && setStations(data.stations))
      .catch(() => {});
  }, []);

  useEffect(() => {
    setForm((current) => ({
      ...current,
      from: initial.from || '',
      to: initial.to || '',
      date: initial.date || daysFromToday(1),
      class: initial.class || '',
    }));
  }, [initial.from, initial.to, initial.date, initial.class]);

  const update = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }));

  const swap = () =>
    setForm((current) => ({ ...current, from: current.to, to: current.from }));

  const submit = (event) => {
    event.preventDefault();
    const params = new URLSearchParams();
    Object.entries(form).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    navigate(`/search?${params.toString()}`);
  };

  const fieldClass = compact
    ? 'rounded-xl border border-slate-200 bg-white px-3 py-2.5'
    : 'rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3';

  return (
    <form
      onSubmit={submit}
      className={
        compact
          ? 'grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_auto_1fr_1fr_1fr_auto]'
          : 'grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_auto_1fr_1fr_1fr_auto]'
      }
    >
      <div className="relative">
        <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-500" />
        <select
          aria-label="From station"
          className={`${fieldClass} w-full appearance-none pl-9 pr-3 text-sm font-medium text-slate-800 outline-none focus:border-brand-400 focus:ring-4 focus:ring-brand-100`}
          value={form.from}
          onChange={update('from')}
          required
        >
          <option value="">From station</option>
          {stations.map((station) => (
            <option key={station.code} value={station.code}>
              {station.name} ({station.code})
            </option>
          ))}
        </select>
      </div>

      <button
        type="button"
        onClick={swap}
        title="Swap stations"
        className="flex items-center justify-center gap-2 text-brand-600 sm:w-full lg:w-auto"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm transition hover:rotate-180 hover:border-brand-400">
          <ArrowLeftRight className="h-4 w-4" />
        </span>
      </button>

      <div className="relative">
        <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-rose-500" />
        <select
          aria-label="To station"
          className={`${fieldClass} w-full appearance-none pl-9 pr-3 text-sm font-medium text-slate-800 outline-none focus:border-brand-400 focus:ring-4 focus:ring-brand-100`}
          value={form.to}
          onChange={update('to')}
          required
        >
          <option value="">To station</option>
          {stations.map((station) => (
            <option key={station.code} value={station.code}>
              {station.name} ({station.code})
            </option>
          ))}
        </select>
      </div>

      <div className="relative">
        <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-500" />
        <input
          aria-label="Journey date"
          type="date"
          min={daysFromToday(0)}
          className={`${fieldClass} w-full pl-9 text-sm font-medium text-slate-800 outline-none focus:border-brand-400 focus:ring-4 focus:ring-brand-100`}
          value={form.date}
          onChange={update('date')}
          required
        />
      </div>

      <div className="relative">
        <TrainFront className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-500" />
        <select
          aria-label="Travel class"
          className={`${fieldClass} w-full appearance-none pl-9 pr-3 text-sm font-medium text-slate-800 outline-none focus:border-brand-400 focus:ring-4 focus:ring-brand-100`}
          value={form.class}
          onChange={update('class')}
        >
          <option value="">All classes</option>
          {Object.entries(CLASS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {value} · {label}
            </option>
          ))}
        </select>
      </div>

      <button type="submit" className="btn-primary h-full whitespace-nowrap px-7">
        <Search className="h-4 w-4" />
        Search
      </button>
    </form>
  );
};

export default SearchForm;
