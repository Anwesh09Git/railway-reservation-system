import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  BadgeCheck,
  BellRing,
  CreditCard,
  Headphones,
  MapPinned,
  Search,
  ShieldCheck,
  TrainFront,
} from 'lucide-react';
import SearchForm from '../components/SearchForm';
import { daysFromToday, formatCurrency } from '../utils/format';

const popularRoutes = [
  { from: 'NDLS', to: 'MMCT', title: 'New Delhi → Mumbai', train: '12213 · Duronto Express', fare: 2300, tone: 'bg-[#8E2F1E]' },
  { from: 'HWH', to: 'NDLS', title: 'Howrah → New Delhi', train: '12301 · Rajdhani Express', fare: 2450, tone: 'bg-[#1C3552]' },
  { from: 'MAS', to: 'SBC', title: 'Chennai → Bengaluru', train: '12009 · Shatabdi Express', fare: 1200, tone: 'bg-[#6D5320]' },
  { from: 'NDLS', to: 'SBC', title: 'New Delhi → Bengaluru', train: '12627 · Karnataka Express', fare: 900, tone: 'bg-[#2F4A3C]' },
];

const features = [
  {
    icon: Search,
    title: 'Find the right train',
    text: 'Filter by station, date and class. See the fares and berths still available before you book.',
  },
  {
    icon: CreditCard,
    title: 'Reserve in minutes',
    text: 'Add your passengers, confirm the fare and get a ticket with a PNR straight away.',
  },
  {
    icon: BellRing,
    title: 'Check any PNR',
    text: 'Enter a 10-digit PNR to see the train, journey date and booking status — no login needed.',
  },
  {
    icon: ShieldCheck,
    title: 'Your bookings, private',
    text: 'Tickets are tied to your account, with admin access kept separate from travellers.',
  },
];

const steps = [
  { number: '01', title: 'Search your route', text: 'Choose your origin, destination, date and preferred class.' },
  { number: '02', title: 'Pick your train', text: 'Compare departure times, fares and available berths.' },
  { number: '03', title: 'Add passengers', text: 'Enter traveller details and confirm your booking instantly.' },
  { number: '04', title: 'Track your PNR', text: 'View, print or cancel your ticket whenever you need.' },
];

const assurances = [
  { icon: ShieldCheck, text: 'Auth-protected access' },
  { icon: CreditCard, text: 'Fares shown up front' },
  { icon: BadgeCheck, text: 'PNR checks without login' },
  { icon: Headphones, text: 'Print-ready e-tickets' },
];

const HomePage = () => {
  const navigate = useNavigate();

  const goToRoute = (route) =>
    navigate(`/search?from=${route.from}&to=${route.to}&date=${daysFromToday(2)}`);

  return (
    <div>
      {/* Hero — ink, paper and one rail-red rule instead of layered gradients. */}
      <section className="hero-pattern hero-grid relative overflow-hidden border-b-4 border-brand-700">
        <div className="relative mx-auto max-w-7xl px-4 pb-28 pt-16 sm:px-6 sm:pt-20 lg:px-8">
          <span className="inline-flex items-center border-l-2 border-gold-400 pl-3 text-xs font-bold uppercase tracking-[0.18em] text-slate-200">
            RailYatri · Reservation desk
          </span>
          <h1 className="mt-6 max-w-4xl text-4xl leading-[1.1] text-white sm:text-5xl lg:text-6xl">
            Find your train. <span className="text-gold-400">Reserve your berth.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-200">
            Search routes, compare fares and get a confirmed ticket with a PNR — without the queue
            at the counter.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-3 text-xs font-semibold text-slate-200">
            <span className="flex items-center gap-2"><TrainFront className="h-4 w-4 text-gold-400" /> 8 sample trains</span>
            <span className="flex items-center gap-2"><MapPinned className="h-4 w-4 text-gold-400" /> 7 stations</span>
            <span className="flex items-center gap-2"><BadgeCheck className="h-4 w-4 text-gold-400" /> Instant PNR</span>
          </div>
        </div>
      </section>

      {/* Search card */}
      <div className="relative z-10 mx-auto -mt-16 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="card animate-fade-up p-4 border-l-4 border-l-brand-600 sm:p-6">
          <div className="mb-4 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
              <TrainFront className="h-4 w-4" />
            </span>
            <h2 className="text-base font-bold text-navy-900">Plan your journey</h2>
          </div>
          <SearchForm />
        </div>
      </div>

      {/* Popular routes */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-brand-700">Popular routes</p>
            <h2 className="section-title mt-2">Frequently travelled journeys</h2>
          </div>
          <button type="button" onClick={() => navigate('/search')} className="btn-secondary btn-sm">
            View all trains <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {popularRoutes.map((route) => (
            <button
              type="button"
              key={route.title}
              onClick={() => goToRoute(route)}
              className={`group rounded-xl ${route.tone} p-5 text-left text-white shadow-soft transition hover:-translate-y-0.5`}
            >
              <TrainFront className="h-6 w-6 text-gold-400" />
              <p className="mt-6 text-base font-bold">{route.title}</p>
              <p className="mt-1 text-xs text-slate-100">{route.train}</p>
              <div className="mt-5 flex items-end justify-between border-t border-white/20 pt-3">
                <span className="text-xs text-slate-100">
                  From <b className="text-base text-white">{formatCurrency(route.fare)}</b>
                </span>
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="border-y border-slate-200 bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-bold uppercase tracking-widest text-brand-700">Why RailYatri</p>
          <h2 className="section-title mt-2">A clearer way to book</h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-600">
            The essentials of railway booking, laid out plainly — from the first search to the
            ticket in your hand.
          </p>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map(({ icon: Icon, title, text }) => (
              <div key={title} className="card p-6 transition hover:border-brand-300">
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-base font-bold text-navy-900">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <p className="text-sm font-bold uppercase tracking-widest text-brand-700">How it works</p>
        <h2 className="section-title mt-2">Four steps from search to seat</h2>
        <div className="relative mt-12 grid gap-8 md:grid-cols-4">
          <div className="absolute left-0 right-0 top-6 hidden h-px bg-slate-200 md:block" />
          {steps.map((step) => (
            <div key={step.number} className="relative text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border-4 border-slate-50 bg-brand-700 text-sm font-bold text-white shadow-soft">
                {step.number}
              </div>
              <h3 className="mt-4 text-base font-bold text-navy-900">{step.title}</h3>
              <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-slate-600">{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="hero-pattern rounded-xl border-l-4 border-gold-400 px-6 py-12 sm:px-12">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-200">
            Search · Compare · Reserve
          </p>
          <h2 className="mt-3 max-w-2xl text-2xl text-white sm:text-3xl">
            Ready to reserve a berth?
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-200">
            Choose a route, check what is available and confirm your ticket in a few clicks.
          </p>
          <button type="button" onClick={() => navigate('/search')} className="btn-primary mt-6">
            Find trains <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>

      {/* Assurances */}
      <section className="border-y border-slate-200 bg-slate-100 py-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-10 gap-y-4 px-4 text-xs font-semibold text-slate-700 sm:px-6">
          {assurances.map(({ icon: Icon, text }) => (
            <span key={text} className="flex items-center gap-2">
              <Icon className="h-4 w-4 text-brand-700" /> {text}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
