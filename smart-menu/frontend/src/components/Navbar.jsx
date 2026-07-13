import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon, Soup, Search, Shield, CreditCard } from 'lucide-react';

export default function Navbar({ darkMode, toggleDarkMode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { to: '/', label: 'Home' },
    { to: '/menu', label: 'Menu' },
    { to: '/feedback', label: 'Feedback' },
    { to: '/payment', label: 'Pay' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 border border-amber-500/30 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform overflow-hidden bg-black">
              <img src="/logo-icon.png" alt="Logo" className="w-full h-full object-cover scale-110" />
            </div>
            <span className="text-xl font-bold text-gray-800 dark:text-white">
              <span className="text-amber-500">Smart</span>Menu
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`font-medium transition-colors duration-200 ${location.pathname === link.to
                    ? 'text-primary-500'
                    : 'text-gray-600 dark:text-gray-300 hover:text-primary-500'
                  }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="w-px h-6 bg-gray-300 dark:bg-gray-600" />
            <Link
              to="/admin/login"
              className="flex items-center gap-1.5 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-primary-500 transition-colors"
            >
              <Shield className="w-4 h-4" />
              Admin
            </Link>
            <Link
              to="/cashier/login"
              className="flex items-center gap-1.5 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-emerald-500 transition-colors"
            >
              <CreditCard className="w-4 h-4" />
              Cashier
            </Link>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>

          <div className="md:hidden flex items-center gap-2">
            <button onClick={toggleDarkMode} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t dark:border-gray-700 slide-up">
          <div className="px-4 py-3 space-y-2">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-2 rounded-lg font-medium ${location.pathname === link.to
                    ? 'bg-primary-50 text-primary-500 dark:bg-primary-900/20'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
              >
                {link.label}
              </Link>
            ))}
            <hr className="border-gray-200 dark:border-gray-700 my-2" />
            <Link
              to="/admin/login"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Shield className="w-4 h-4" />
              Admin Panel
            </Link>
            <Link
              to="/cashier/login"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <CreditCard className="w-4 h-4" />
              Cashier Panel
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
