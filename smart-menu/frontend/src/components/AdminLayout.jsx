import { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { ArrowLeftFromLine } from 'lucide-react';
import AdminSidebar from './AdminSidebar';

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className={`transition-all duration-300 ${collapsed ? 'ml-20' : 'ml-64'}`}>
        <div className="p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <div />
            <Link
              to="/"
              className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-primary-500 transition-colors"
            >
              <ArrowLeftFromLine className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
