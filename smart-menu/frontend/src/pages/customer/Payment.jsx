import { useState, useEffect } from 'react';
import { CreditCard, Upload, CheckCircle, Banknote, Phone, Building2 } from 'lucide-react';
import API from '../../api/axios';
import toast from 'react-hot-toast';

export default function Payment() {
  const [form, setForm] = useState({ customerName: '', transactionId: '', amount: '', tableNumber: '' });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Load table number if scanned from QR
  useEffect(() => {
    const table = localStorage.getItem('tableNumber');
    if (table) setForm((prev) => ({ ...prev, tableNumber: table }));
  }, []);

  const bankDetails = {
    bankName: 'Commercial Bank of Ethiopia',
    accountName: 'SAMUEL MARU',
    accountNumber: '1000312465993',
    mobileMoney: '0947263641',
  };

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (f) {
      if (f.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      setFile(f);
      setPreview(URL.createObjectURL(f));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.customerName || !file) {
      toast.error('Please enter your name and upload a screenshot');
      return;
    }
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('customerName', form.customerName);
      formData.append('transactionId', form.transactionId);
      formData.append('amount', form.amount);
      if (form.tableNumber) formData.append('note', `Table: ${form.tableNumber}`);
      formData.append('screenshot', file);
      await API.post('/payments', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSuccess(true);
      toast.success('Payment proof submitted successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit payment');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="text-center fade-in">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Payment Submitted!</h2>
          <p className="text-gray-500 mb-8">Your payment proof has been received. We will verify it shortly.</p>
          <button onClick={() => { setSuccess(false); setForm({ customerName: '', transactionId: '', amount: '' }); setFile(null); setPreview(''); }} className="btn-primary">
            Submit Another Payment
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Make a <span className="text-primary-500">Payment</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg">Pay securely and upload your payment proof</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="card p-8 fade-in">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary-500" />
              Bank Details
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <Building2 className="w-5 h-5 text-primary-500 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Bank</p>
                  <p className="font-semibold">{bankDetails.bankName}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <Banknote className="w-5 h-5 text-primary-500 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Account Name</p>
                  <p className="font-semibold">{bankDetails.accountName}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <CreditCard className="w-5 h-5 text-primary-500 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Account Number</p>
                  <p className="font-semibold text-lg tracking-wider">{bankDetails.accountNumber}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <Phone className="w-5 h-5 text-primary-500 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Telebirr</p>
                  <p className="font-semibold">{bankDetails.mobileMoney}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card p-8 fade-in">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Upload className="w-5 h-5 text-primary-500" />
              Upload Payment Proof
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Your Name *</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={form.customerName}
                    onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center gap-2">Table Number <span className="text-xs font-normal text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full">Scanned</span></label>
                  <input
                    type="text"
                    placeholder="e.g. Table 5"
                    value={form.tableNumber}
                    onChange={(e) => setForm({ ...form, tableNumber: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Amount (ETB)</label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  className="input-field"
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Transaction ID</label>
                <input
                  type="text"
                  placeholder="TXN123456789"
                  value={form.transactionId}
                  onChange={(e) => setForm({ ...form, transactionId: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Payment Screenshot *</label>
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 cursor-pointer hover:border-primary-500 transition-colors">
                  <Upload className="w-10 h-10 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500">Click to upload screenshot</span>
                  <span className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</span>
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
                {preview && (
                  <div className="mt-3 relative">
                    <img src={preview} alt="Preview" className="w-full h-32 object-cover rounded-lg" />
                    <button
                      type="button"
                      onClick={() => { setFile(null); setPreview(''); }}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                    >
                      X
                    </button>
                  </div>
                )}
              </div>
              <button type="submit" disabled={submitting} className="btn-primary w-full flex items-center justify-center gap-2">
                <Upload className="w-4 h-4" />
                {submitting ? 'Submitting...' : 'Submit Payment Proof'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
