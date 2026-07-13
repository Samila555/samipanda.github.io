import { Link } from 'react-router-dom';
import { Soup, Mail, Phone, MapPin, Shield, CreditCard } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full border border-amber-500/30 overflow-hidden bg-black flex items-center justify-center">
                <img src="/logo-icon.png" alt="Logo" className="w-full h-full object-cover scale-110" />
              </div>
              <span className="text-xl font-bold"><span className="text-amber-500">Smart</span>Menu</span>
            </div>
            <p className="text-gray-400">Delicious food, digitally served. Experience the future of dining.</p>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/" className="hover:text-primary-500 transition-colors">Home</a></li>
              <li><a href="/menu" className="hover:text-primary-500 transition-colors">Menu</a></li>
              <li><a href="/feedback" className="hover:text-primary-500 transition-colors">Feedback</a></li>
              <li><a href="/payment" className="hover:text-primary-500 transition-colors">Make Payment</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact</h3>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-center gap-2"><MapPin className="w-4 h-4" /> 123 Restaurant St, Food City</li>
              <li className="flex items-center gap-2"><Phone className="w-4 h-4" /> +1 234 567 8900</li>
              <li className="flex items-center gap-2"><Mail className="w-4 h-4" /> info@smartmenu.com</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-gray-500">
          <p>&copy; {new Date().getFullYear()} SmartMenu. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/admin/login" className="flex items-center gap-1.5 text-sm hover:text-primary-500 transition-colors">
              <Shield className="w-4 h-4" />
              Admin
            </Link>
            <Link to="/cashier/login" className="flex items-center gap-1.5 text-sm hover:text-emerald-400 transition-colors">
              <CreditCard className="w-4 h-4" />
              Cashier
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
