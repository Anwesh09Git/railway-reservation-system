import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Download, Printer } from 'lucide-react';
import api from '../api/axios';
import Loader from '../components/Loader';
import Ticket from '../components/Ticket';

const TicketPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get(`/bookings/${id}`)
      .then(({ data }) => setBooking(data.booking))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader fullPage message="Loading your e-ticket..." />;

  if (error || !booking) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-xl font-bold text-navy-900">Ticket unavailable</h1>
        <p className="mt-2 text-sm text-rose-700">{error || 'This ticket could not be found.'}</p>
        <Link to="/bookings" className="btn-primary mt-6">Back to my bookings</Link>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 pb-16 pt-10">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="no-print mb-6 flex flex-wrap items-center justify-between gap-4">
          <Link to="/bookings" className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-brand-600">
            <ArrowLeft className="h-4 w-4" /> My bookings
          </Link>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => window.print()} className="btn-secondary btn-sm">
              <Printer className="h-3.5 w-3.5" /> Print / Save as PDF
            </button>
            <button type="button" onClick={() => window.print()} className="btn-primary btn-sm">
              <Download className="h-3.5 w-3.5" /> Download ticket
            </button>
          </div>
        </div>

        {location.state?.justBooked && (
          <div className="no-print mb-5 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            <div>
              <p className="text-sm font-bold text-emerald-800">Booking confirmed!</p>
              <p className="text-xs text-emerald-700">Your e-ticket is ready. Save or print it for your journey.</p>
            </div>
          </div>
        )}

        <Ticket booking={booking} />

        <p className="no-print mt-5 text-center text-xs text-slate-600">
          Please carry a valid photo ID along with this e-ticket and PNR number.
        </p>
      </div>
    </div>
  );
};

export default TicketPage;
