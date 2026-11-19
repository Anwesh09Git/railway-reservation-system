import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  LogOut,
  Menu,
  Ticket,
  TrainFront,
  UserCircle2,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const links = [
  { to: '/', label: 'Home' },
  { to: '/search', label: 'Find Trains' },
  { to: '/pnr', label: 'PNR Status' },
  { to: '/bookings', label: 'My Bookings' },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const close = () => {
    setOpen(false);
    setMenu(false);
  };

  const handleLogout = () => {
    logout();
    close();
    navigate('/');
  };

  const navClass = ({ isActive }) =>
    `relative py-2 text-sm font-semibold transition-colors ${
      isActive ? 'text-brand-700' : 'text-slate-700 hover:text-brand-700'
    }`;

  return (
    <header className="no-print sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" onClick={close} className="flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-700 text-white">
            <TrainFront className="h-5 w-5" />
          </span>
          <span className="font-display text-xl font-bold tracking-tight text-navy-900">
            Rail<span className="text-brand-700">Yatri</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} className={navClass} end={link.to === '/'}>
              {link.label}
            </NavLink>
          ))}
          {isAdmin && (
            <NavLink to="/admin" className={navClass}>
              Admin
            </NavLink>
          )}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setMenu((current) => !current)}
                className="flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-800 transition hover:border-brand-400 hover:text-brand-700"
              >
                <UserCircle2 className="h-4 w-4" />
                {user?.name?.split(' ')[0]}
              </button>
              {menu && (
                <>
                  <button className="fixed inset-0 z-10 cursor-default" onClick={close} aria-label="Close menu" />
                  <div className="absolute right-0 z-20 mt-2 w-52 overflow-hidden rounded-xl border border-slate-100 bg-white py-1 shadow-soft">
                    <Link to="/profile" onClick={close} className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50">
                      <UserCircle2 className="h-4 w-4" /> My Profile
                    </Link>
                    <Link to="/bookings" onClick={close} className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50">
                      <Ticket className="h-4 w-4" /> My Bookings
                    </Link>
                    {isAdmin && (
                      <Link to="/admin" onClick={close} className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50">
                        <LayoutDashboard className="h-4 w-4" /> Dashboard
                      </Link>
                    )}
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 border-t border-slate-100 px-4 py-2.5 text-left text-sm text-rose-600 hover:bg-rose-50"
                    >
                      <LogOut className="h-4 w-4" /> Log out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="btn-secondary btn-sm">
                Log in
              </Link>
              <Link to="/register" className="btn-primary btn-sm">
                Sign up
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="rounded-lg p-2 text-slate-700 md:hidden"
          onClick={() => setOpen((current) => !current)}
          aria-label="Toggle navigation"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-100 bg-white px-4 pb-5 pt-2 md:hidden">
          <div className="flex flex-col gap-1">
            {[...links, ...(isAdmin ? [{ to: '/admin', label: 'Admin' }] : [])].map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={close}
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium ${
                    isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-50'
                  }`
                }
                end={link.to === '/'}
              >
                {link.label}
              </NavLink>
            ))}
            <div className="mt-2 flex gap-2 border-t border-slate-100 pt-4">
              {isAuthenticated ? (
                <>
                  <Link to="/profile" onClick={close} className="btn-secondary flex-1">
                    Profile
                  </Link>
                  <button type="button" onClick={handleLogout} className="btn-danger flex-1">
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={close} className="btn-secondary flex-1">
                    Log in
                  </Link>
                  <Link to="/register" onClick={close} className="btn-primary flex-1">
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
