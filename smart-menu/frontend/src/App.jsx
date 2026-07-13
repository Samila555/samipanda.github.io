import { useState, useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import CustomerLayout from './components/CustomerLayout';
import AdminLayout from './components/AdminLayout';
import CashierLayout from './components/CashierLayout';

import Home from './pages/customer/Home';
import Menu from './pages/customer/Menu';
import Feedback from './pages/customer/Feedback';
import Payment from './pages/customer/Payment';

import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import ManageCategories from './pages/admin/ManageCategories';
import ManageMeals from './pages/admin/ManageMeals';
import ManageQRCodes from './pages/admin/ManageQRCodes';
import ManagePayments from './pages/admin/ManagePayments';
import ManageFeedbacks from './pages/admin/ManageFeedbacks';

import CashierLogin from './pages/cashier/Login';
import CashierPayments from './pages/cashier/Payments';

export default function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  return (
    <HashRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: { borderRadius: '12px', padding: '12px 16px' },
          }}
        />
        <Routes>
          <Route element={<CustomerLayout darkMode={darkMode} toggleDarkMode={toggleDarkMode} />}>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/payment" element={<Payment />} />
          </Route>

          <Route path="/admin/login" element={<Login />} />

          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={['admin', 'manager']}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="categories" element={<ManageCategories />} />
            <Route path="meals" element={<ManageMeals />} />
            <Route path="qrcodes" element={<ManageQRCodes />} />
            <Route path="payments" element={<ManagePayments />} />
            <Route path="feedbacks" element={<ManageFeedbacks />} />
          </Route>

          <Route path="/cashier/login" element={<CashierLogin />} />

          <Route
            path="/cashier"
            element={
              <ProtectedRoute roles={['cashier']}>
                <CashierLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<CashierPayments />} />
          </Route>
        </Routes>
      </AuthProvider>
    </HashRouter>
  );
}
