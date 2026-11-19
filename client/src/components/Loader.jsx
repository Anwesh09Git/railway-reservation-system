import { Loader2 } from 'lucide-react';

const Loader = ({ message = 'Loading...', fullPage = false }) => (
  <div
    className={`flex flex-col items-center justify-center gap-3 text-slate-500 ${
      fullPage ? 'min-h-[60vh]' : 'py-12'
    }`}
  >
    <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
    <p className="text-sm font-medium">{message}</p>
  </div>
);

export default Loader;
