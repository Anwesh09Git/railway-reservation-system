export const CLASS_LABELS = {
  SL: 'Sleeper',
  '3A': 'AC 3 Tier',
  '2A': 'AC 2 Tier',
  '1A': 'AC First Class',
  CC: 'AC Chair Car',
  EC: 'Executive Chair Car',
};

export const formatCurrency = (amount) => `₹${Number(amount || 0).toLocaleString('en-IN')}`;

export const formatDate = (value, options = {}) => {
  if (!value) return '—';
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    ...options,
  });
};

export const formatDateTime = (value) =>
  value ? new Date(value).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : '—';

export const toInputDate = (date) => {
  const d = date instanceof Date ? date : new Date();
  const offset = d.getTimezoneOffset();
  return new Date(d.getTime() - offset * 60000).toISOString().slice(0, 10);
};

export const daysFromToday = (days) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return toInputDate(date);
};

export const capitalize = (text) => (text ? text.charAt(0).toUpperCase() + text.slice(1) : '');
