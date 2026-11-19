import { CheckCircle2, Clock3, XCircle } from 'lucide-react';
import { capitalize } from '../utils/format';

const icons = {
  confirmed: CheckCircle2,
  waitlist: Clock3,
  cancelled: XCircle,
};

const StatusBadge = ({ status }) => {
  const Icon = icons[status] || Clock3;
  return (
    <span className={`status-${status || 'waitlist'}`}>
      <Icon className="h-3.5 w-3.5" />
      {capitalize(status || 'waitlist')}
    </span>
  );
};

export default StatusBadge;
