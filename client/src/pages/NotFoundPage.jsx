import { Link } from 'react-router-dom';
import { ArrowLeft, TrainFront } from 'lucide-react';

const NotFoundPage = () => (
  <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
    <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
      <TrainFront className="h-8 w-8" />
    </span>
    <p className="mt-6 text-6xl font-extrabold text-navy-900">404</p>
    <h1 className="mt-2 text-xl font-bold text-navy-900">This track doesn't exist</h1>
    <p className="mt-2 max-w-sm text-sm text-slate-500">
      The page you're looking for may have been moved or never existed.
    </p>
    <Link to="/" className="btn-primary mt-6">
      <ArrowLeft className="h-4 w-4" /> Back to home
    </Link>
  </div>
);

export default NotFoundPage;
