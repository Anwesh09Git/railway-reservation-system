import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowLeft, SlidersHorizontal, TrainFront } from 'lucide-react';
import api from '../api/axios';
import Loader from '../components/Loader';
import SearchForm from '../components/SearchForm';
import TrainCard from '../components/TrainCard';
import { daysFromToday, formatDate } from '../utils/format';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const [trains, setTrains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sort, setSort] = useState('departure');

  const from = searchParams.get('from') || '';
  const to = searchParams.get('to') || '';
  const date = searchParams.get('date') || daysFromToday(1);
  const travelClass = searchParams.get('class') || '';

  useEffect(() => {
    const fetchTrains = async () => {
      setLoading(true);
      setError('');
      try {
        const params = new URLSearchParams({ date });
        if (from) params.set('from', from);
        if (to) params.set('to', to);
        if (travelClass) params.set('class', travelClass);
        const { data } = await api.get(`/trains/search?${params.toString()}`);
        setTrains(data.trains || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTrains();
  }, [from, to, date, travelClass]);

  const sortedTrains = useMemo(() => {
    const list = [...trains];
    if (sort === 'fare') {
      list.sort((a, b) => {
        const faresA = Object.values(a.availability || {}).map((v) => v?.fare || 0);
        const faresB = Object.values(b.availability || {}).map((v) => v?.fare || 0);
        return Math.min(...faresA) - Math.min(...faresB);
      });
    } else if (sort === 'seats') {
      list.sort((a, b) => {
        const seatsA = Object.values(a.availability || {}).reduce((sum, v) => sum + (v?.availableSeats || 0), 0);
        const seatsB = Object.values(b.availability || {}).reduce((sum, v) => sum + (v?.availableSeats || 0), 0);
        return seatsB - seatsA;
      });
    } else {
      list.sort((a, b) => a.departureTime.localeCompare(b.departureTime));
    }
    return list;
  }, [trains, sort]);

  return (
    <div className="bg-slate-50 pb-16">
      <div className="bg-navy-900 px-4 py-10 text-white sm:px-6">
        <div className="mx-auto max-w-7xl">
          <a href="/" className="inline-flex items-center gap-1.5 text-xs text-brand-200 hover:text-white">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to home
          </a>
          <h1 className="mt-3 text-2xl font-extrabold sm:text-3xl">Find your train</h1>
          <p className="mt-1 text-sm text-slate-300">
            Compare routes, fares and seat availability for your journey.
          </p>
        </div>
      </div>

      <div className="mx-auto -mt-2 max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <div className="card p-4 sm:p-5">
          <SearchForm compact initial={{ from, to, date, class: travelClass }} />
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-navy-900">
              {loading ? 'Searching trains...' : `${trains.length} train${trains.length === 1 ? '' : 's'} found`}
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              {from || 'All origins'} → {to || 'All destinations'} · {formatDate(date)}
              {travelClass ? ` · ${travelClass}` : ''}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-slate-600" />
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-brand-400"
              aria-label="Sort trains"
            >
              <option value="departure">Sort: Departure</option>
              <option value="fare">Sort: Lowest fare</option>
              <option value="seats">Sort: Most seats</option>
            </select>
          </div>
        </div>

        {loading && <Loader message="Fetching the latest availability..." />}

        {error && (
          <div className="mt-6 rounded-xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">
            {error}
          </div>
        )}

        {!loading && !error && sortedTrains.length === 0 && (
          <div className="card mt-6 flex flex-col items-center px-6 py-16 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-600">
              <TrainFront className="h-6 w-6" />
            </span>
            <h3 className="mt-4 text-base font-bold text-navy-900">No trains on this route</h3>
            <p className="mt-1 max-w-sm text-sm text-slate-500">
              Try a different pair of stations, another date or remove the class filter.
            </p>
          </div>
        )}

        <div className="mt-6 space-y-5">
          {sortedTrains.map((train) => (
            <TrainCard key={train._id} train={train} date={date} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
