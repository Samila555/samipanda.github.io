import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, UtensilsCrossed, ListTree, QrCode, CreditCard, MessageSquare, LogOut, Soup, ChevronLeft
} from 'lucide-react';

export default function AdminSidebar({ collapsed, setCollapsed }) {
  const location = useLocation();
  const { logout } = useAuth();

  const links = [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
    { to: '/admin/categories', icon: ListTree, label: 'Categories' },
    { to: '/admin/meals', icon: UtensilsCrossed, label: 'Meals' },
    { to: '/admin/qrcodes', icon: QrCode, label: 'QR Codes' },
    { to: '/admin/payments', icon: CreditCard, label: 'Payments' },
    { to: '/admin/feedbacks', icon: MessageSquare, label: 'Feedbacks' },
  ];

  return (
    <aside className={`fixed left-0 top-0 h-full bg-gray-900 text-white transition-all duration-300 z-40 ${collapsed ? 'w-20' : 'w-64'
      }`}>
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        {!collapsed && (
          <Link to="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full border border-amber-500/30 overflow-hidden bg-black flex items-center justify-center">
              <img src={`${import.meta.env.BASE_URL}logo-icon.png`} alt="Logo" className="w-full h-full object-cover scale-110" />
            </div>
            <span className="font-bold"><span className="text-amber-500">Smart</span>Menu</span>
          </Link>
        )}
        {collapsed && (
          <div className="w-8 h-8 rounded-full border border-amber-500/30 overflow-hidden bg-black flex items-center justify-center mx-auto">
            <img src={`${import.meta.env.BASE_URL}logo-icon.png`} alt="Logo" className="w-full h-full object-cover scale-110" />
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded hover:bg-gray-700 transition-colors"
        >
          <ChevronLeft className={`w-5 h-5 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
        </button>
      </div>

      <nav className="p-2 space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const active = link.end ? location.pathname === '/admin' : location.pathname.startsWith(link.to);
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${active ? 'bg-primary-500 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                } ${collapsed ? 'justify-center' : ''}`}
            >
              <Icon className="w-5 h-5 min-w-5" />
              {!collapsed && <span>{link.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-2 border-t border-gray-700">
        <button
          onClick={logout}
          className={`flex items-center gap-3 w-full px-3 py-3 rounded-lg text-gray-400 hover:bg-red-600/20 hover:text-red-400 transition-colors ${collapsed ? 'justify-center' : ''
            }`}
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
