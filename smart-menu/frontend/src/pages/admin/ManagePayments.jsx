import { useEffect, useState } from 'react';
import { Search, CheckCircle, XCircle, Eye, CreditCard } from 'lucide-react';
import API from '../../api/axios';
import toast from 'react-hot-toast';

export default function ManagePayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [viewImage, setViewImage] = useState(null);

  const fetchPayments = async () => {
    try {
      const params = {};
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      const { data } = await API.get('/payments', { params });
      setPayments(data);
    } catch (err) {
      toast.error('Failed to load payments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPayments(); }, [statusFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchPayments();
  };

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/payments/${id}`, { paymentStatus: status });
      toast.success(`Payment ${status}`);
      fetchPayments();
    } catch (err) {
      toast.error('Failed to update');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'rejected': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
    }
  };

  if (loading) return <div className="animate-pulse space-y-4">{[1, 2, 3].map(i => <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded-xl" />)}</div>;

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Payments</h1>
          <p className="text-gray-500">{payments.length} total</p>
        </div>
        <div className="flex gap-3">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" placeholder="Search by name..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-10 py-2 text-sm" />
            </div>
            <button type="submit" className="btn-primary text-sm py-2">Search</button>
          </form>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input-field py-2 text-sm w-auto">
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="verified">Verified</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {payments.length === 0 ? (
        <div className="text-center py-20">
          <CreditCard className="w-20 h-20 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-400 text-xl">No payments found</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl shadow-md">
          <table className="w-full bg-white dark:bg-gray-800">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="text-left p-4 font-semibold text-sm">Customer</th>
                <th className="text-left p-4 font-semibold text-sm">Table / Note</th>
                <th className="text-left p-4 font-semibold text-sm">TXN ID</th>
                <th className="text-right p-4 font-semibold text-sm">Amount</th>
                <th className="text-center p-4 font-semibold text-sm">Status</th>
                <th className="text-center p-4 font-semibold text-sm">Screenshot</th>
                <th className="text-center p-4 font-semibold text-sm">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {payments.map((p) => (
                <tr key={p._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="p-4 font-medium">{p.customerName}</td>
                  <td className="p-4 text-amber-500 font-medium text-sm">{p.note || '-'}</td>
                  <td className="p-4 text-gray-500 text-sm">{p.transactionId || '-'}</td>
                  <td className="p-4 text-right font-semibold">${p.amount || 0}</td>
                  <td className="p-4 text-center">
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusBadge(p.paymentStatus)}`}>
                      {p.paymentStatus}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    {p.screenshot ? (
                      <button onClick={() => setViewImage(p.screenshot)} className="text-primary-500 hover:underline text-sm flex items-center gap-1 justify-center">
                        <Eye className="w-4 h-4" /> View
                      </button>
                    ) : '-'}
                  </td>
                  <td className="p-4 text-center">
                    {p.paymentStatus === 'pending' && (
                      <div className="flex justify-center gap-1">
                        <button onClick={() => updateStatus(p._id, 'verified')} className="p-2 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg text-green-500" title="Verify">
                          <CheckCircle className="w-5 h-5" />
                        </button>
                        <button onClick={() => updateStatus(p._id, 'rejected')} className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-red-500" title="Reject">
                          <XCircle className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {viewImage && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={() => setViewImage(null)}>
          <div className="max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
            <img src={viewImage} alt="Screenshot" className="w-full rounded-xl shadow-2xl" />
            <button onClick={() => setViewImage(null)} className="mt-4 btn-primary mx-auto block">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
