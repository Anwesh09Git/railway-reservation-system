import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone, TrainFront } from 'lucide-react';

const Footer = () => (
  <footer className="no-print border-t-4 border-brand-700 bg-navy-950 text-slate-200">
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-700 text-white">
              <TrainFront className="h-5 w-5" />
            </span>
            <span className="font-display text-xl font-bold text-white">
              Rail<span className="text-brand-300">Yatri</span>
            </span>
          </div>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-200">
            Search trains, check availability, reserve a berth and keep track of your PNR — all from
            one reservation desk.
          </p>
          <p className="mt-5 text-xs font-medium uppercase tracking-widest text-slate-300">
            React · Express · MongoDB
          </p>
        </div>

        <div>
          <h4 className="text-sm font-bold text-white">Explore</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-slate-200">
            <li><Link to="/" className="hover:text-brand-300 hover:underline">Home</Link></li>
            <li><Link to="/search" className="hover:text-brand-300 hover:underline">Find trains</Link></li>
            <li><Link to="/pnr" className="hover:text-brand-300 hover:underline">PNR status</Link></li>
            <li><Link to="/bookings" className="hover:text-brand-300 hover:underline">My bookings</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold text-white">Contact</h4>
          <ul className="mt-4 space-y-3 text-sm text-slate-200">
            <li className="flex items-start gap-2"><Mail className="mt-0.5 h-4 w-4 shrink-0 text-brand-300" /> support@railyatri.in</li>
            <li className="flex items-start gap-2"><Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand-300" /> 1800-123-4567</li>
            <li className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-300" /> New Delhi, India</li>
          </ul>
        </div>
      </div>

      <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/15 pt-6 text-xs text-slate-300 sm:flex-row">
        <p>© {new Date().getFullYear()} RailYatri. All rights reserved.</p>
        <p>Demo project for educational purposes.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
