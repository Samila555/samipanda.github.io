import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { UtensilsCrossed, ListTree, MessageSquare, CreditCard, TrendingUp, DollarSign, Clock, CheckCircle, XCircle } from 'lucide-react';
import API from '../../api/axios';

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    API.get('/dashboard').then(({ data }) => setStats(data)).catch(() => {});
  }, []);

  if (!stats) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-28 bg-gray-200 dark:bg-gray-700 rounded-xl" />)}
        </div>
      </div>
    );
  }

  const cards = [
    { icon: UtensilsCrossed, label: 'Total Meals', value: stats.totalMeals, color: 'from-blue-500 to-blue-600' },
    { icon: ListTree, label: 'Categories', value: stats.totalCategories, color: 'from-purple-500 to-purple-600' },
    { icon: MessageSquare, label: 'Feedbacks', value: stats.totalFeedbacks, color: 'from-green-500 to-green-600' },
    { icon: CreditCard, label: 'Payments', value: stats.totalPayments, color: 'from-orange-500 to-orange-600' },
    { icon: CheckCircle, label: 'Verified', value: stats.verifiedPayments, color: 'from-emerald-500 to-emerald-600' },
    { icon: DollarSign, label: 'Revenue', value: `$${stats.totalRevenue}`, color: 'from-rose-500 to-rose-600' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-500">Welcome to Smart Menu Admin</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card, i) => (
          <div key={i} className="card overflow-hidden group hover:-translate-y-1">
            <div className={`bg-gradient-to-br ${card.color} p-4`}>
              <card.icon className="w-8 h-8 text-white" />
            </div>
            <div className="p-4">
              <p className="text-2xl font-bold">{card.value}</p>
              <p className="text-gray-500 text-sm">{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="card p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary-500" />
            Popular Meals
          </h2>
          {stats.popularMeals?.length > 0 ? (
            <div className="space-y-3">
              {stats.popularMeals.map((meal, i) => (
                <div key={meal._id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 bg-primary-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-semibold">{meal.name}</p>
                      <p className="text-xs text-gray-400">{meal.categoryId?.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary-500">${meal.price}</p>
                    <p className="text-xs text-gray-400">{meal.popularity} views</p>
                  </div>
                </div>
              ))}
            </div>
          ) : <p className="text-gray-400">No data yet</p>}
        </div>

        <div className="space-y-8">
          <div className="card p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary-500" />
              Recent Feedbacks
            </h2>
            {stats.recentFeedbacks?.length > 0 ? (
              <div className="space-y-3">
                {stats.recentFeedbacks.map((fb) => (
                  <div key={fb._id} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold text-sm">{fb.customerName}</span>
                      <span className="text-yellow-500 text-sm">{'★'.repeat(fb.rating)}</span>
                    </div>
                    {fb.comment && <p className="text-sm text-gray-500">{fb.comment}</p>}
                  </div>
                ))}
              </div>
            ) : <p className="text-gray-400">No feedbacks yet</p>}
          </div>

          <div className="card p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary-500" />
              Recent Payments
            </h2>
            {stats.recentPayments?.length > 0 ? (
              <div className="space-y-3">
                {stats.recentPayments.map((p) => (
                  <div key={p._id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div>
                      <p className="font-semibold text-sm">{p.customerName}</p>
                      <p className="text-xs text-gray-400">{p.transactionId || 'No TXN ID'}</p>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        p.paymentStatus === 'verified' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                        p.paymentStatus === 'rejected' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                        'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                      }`}>
                        {p.paymentStatus}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : <p className="text-gray-400">No payments yet</p>}
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link to="/admin/categories" className="card p-4 text-center hover:-translate-y-1">
          <p className="font-bold">{stats.totalCategories}</p>
          <p className="text-sm text-gray-500">Manage Categories</p>
        </Link>
        <Link to="/admin/meals" className="card p-4 text-center hover:-translate-y-1">
          <p className="font-bold">{stats.totalMeals}</p>
          <p className="text-sm text-gray-500">Manage Meals</p>
        </Link>
        <Link to="/admin/payments" className="card p-4 text-center hover:-translate-y-1">
          <p className="font-bold">{stats.totalPayments}</p>
          <p className="text-sm text-gray-500">View Payments</p>
        </Link>
        <Link to="/admin/feedbacks" className="card p-4 text-center hover:-translate-y-1">
          <p className="font-bold">{stats.totalFeedbacks}</p>
          <p className="text-sm text-gray-500">View Feedbacks</p>
        </Link>
      </div>
    </div>
  );
}
