import { Outlet, Link } from 'react-router-dom';
import { CreditCard, LogOut, Soup, ArrowLeftFromLine } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function CashierLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <aside className="fixed left-0 top-0 h-full w-64 bg-gray-900 text-white z-40">
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <Link to="/cashier" className="flex items-center gap-2">
            <CreditCard className="w-8 h-8 text-emerald-400" />
            <span className="font-bold"><span className="text-emerald-400">Cashier</span>Panel</span>
          </Link>
        </div>

        <nav className="p-2 space-y-1 mt-2">
          <Link
            to="/cashier"
            className="flex items-center gap-3 px-3 py-3 rounded-lg bg-primary-500 text-white"
          >
            <CreditCard className="w-5 h-5" />
            <span>Payments</span>
          </Link>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-2 border-t border-gray-700 space-y-1">
          <Link
            to="/"
            className="flex items-center gap-3 w-full px-3 py-3 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
          >
            <ArrowLeftFromLine className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-3 py-3 rounded-lg text-gray-400 hover:bg-red-600/20 hover:text-red-400 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <div className="ml-64">
        <div className="p-6 md:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
