import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Soup, Search, X, QrCode, Download, Copy, Check } from 'lucide-react';
import API from '../../api/axios';
import toast from 'react-hot-toast';

export default function ManageMeals() {
  const [meals, setMeals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState('');
  const [qrMeal, setQrMeal] = useState(null);
  const [copied, setCopied] = useState(false);
  const [form, setForm] = useState({
    categoryId: '', name: '', description: '', ingredients: '', preparationMethod: '',
    calories: '', protein: '', carbohydrates: '', fat: '', price: '', available: true,
  });
  const [imageFile, setImageFile] = useState(null);

  const fetchData = async () => {
    try {
      const [mealsRes, catsRes] = await Promise.all([API.get('/meals'), API.get('/categories')]);
      setMeals(mealsRes.data);
      setCategories(catsRes.data);
    } catch (err) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ categoryId: categories[0]?._id || '', name: '', description: '', ingredients: '', preparationMethod: '', calories: '', protein: '', carbohydrates: '', fat: '', price: '', available: true });
    setImageFile(null);
    setShowModal(true);
  };

  const openEdit = (meal) => {
    setEditing(meal);
    setForm({
      categoryId: meal.categoryId?._id || meal.categoryId || '',
      name: meal.name, description: meal.description || '',
      ingredients: meal.ingredients?.join(', ') || '', preparationMethod: meal.preparationMethod || '',
      calories: meal.calories || '', protein: meal.protein || '', carbohydrates: meal.carbohydrates || '',
      fat: meal.fat || '', price: meal.price, available: meal.available,
    });
    setImageFile(null);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.categoryId || !form.price) {
      toast.error('Name, category, and price are required');
      return;
    }
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, val]) => formData.append(key, val));
      if (imageFile) formData.append('image', imageFile);
      if (editing) {
        await API.put(`/meals/${editing._id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Meal updated');
      } else {
        await API.post('/meals', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Meal created');
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this meal?')) return;
    try {
      await API.delete(`/meals/${id}`);
      toast.success('Meal deleted');
      fetchData();
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  const showQR = async (meal) => {
    try {
      const { data } = await API.get(`/meals/${meal._id}/qrcode`);
      setQrMeal({ ...meal, qrCode: data.qrCode, url: data.url });
    } catch (err) {
      toast.error('Failed to load QR code');
    }
  };

  const downloadQR = () => {
    if (!qrMeal) return;
    const link = document.createElement('a');
    link.href = qrMeal.qrCode;
    link.download = `${qrMeal.name.replace(/\s+/g, '-')}-QR.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyUrl = () => {
    if (!qrMeal) return;
    navigator.clipboard.writeText(qrMeal.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('URL copied!');
  };

  const filteredMeals = meals.filter(m =>
    m.name?.toLowerCase().includes(search.toLowerCase()) ||
    m.categoryId?.name?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="animate-pulse space-y-4">{[1, 2, 3].map(i => <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded-xl" />)}</div>;

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Meals</h1>
          <p className="text-gray-500">{meals.length} meals</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-10 py-2 text-sm" />
          </div>
          <button onClick={openCreate} className="btn-primary flex items-center gap-2 whitespace-nowrap">
            <Plus className="w-5 h-5" /> Add Meal
          </button>
        </div>
      </div>

      {filteredMeals.length === 0 ? (
        <div className="text-center py-20">
          <Soup className="w-20 h-20 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-400 text-xl">No meals found</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl shadow-md">
          <table className="w-full bg-white dark:bg-gray-800">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="text-left p-4 font-semibold text-sm">Name</th>
                <th className="text-left p-4 font-semibold text-sm">Category</th>
                <th className="text-right p-4 font-semibold text-sm">Price</th>
                <th className="text-center p-4 font-semibold text-sm">Status</th>
                <th className="text-right p-4 font-semibold text-sm">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filteredMeals.map((meal) => (
                <tr key={meal._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary-50 dark:bg-primary-900/20 rounded-lg flex items-center justify-center overflow-hidden">
                        {meal.image ? (
                          <img src={meal.image?.startsWith('/uploads') ? (import.meta.env.PROD ? `https://samipanda-github-io-1.onrender.com${meal.image}` : `http://localhost:5000${meal.image}`) : meal.image} alt={meal.name} className="w-full h-full object-cover" />
                        ) : (
                          <Soup className="w-5 h-5 text-primary-500" />
                        )}
                      </div>
                      <span className="font-medium">{meal.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-gray-500">{meal.categoryId?.name || 'N/A'}</td>
                  <td className="p-4 text-right font-semibold">${meal.price}</td>
                  <td className="p-4 text-center">
                    <span className={`text-xs px-2 py-1 rounded-full ${meal.available ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                      {meal.available ? 'Available' : 'Unavailable'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => showQR(meal)} className="p-2 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg text-primary-500" title="QR Code">
                        <QrCode className="w-4 h-4" />
                      </button>
                      <button onClick={() => openEdit(meal)} className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg text-blue-500">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(meal._id)} className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-red-500">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-xl font-bold">{editing ? 'Edit Meal' : 'New Meal'}</h2>
              <button onClick={() => setShowModal(false)}><X className="w-5 h-5" /></button>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar">
              <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Name *</label>
                  <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" required />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Category *</label>
                  <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} className="input-field" required>
                    <option value="">Select category</option>
                    {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field" rows={1} />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Ingredients (comma separated)</label>
                  <input type="text" value={form.ingredients} onChange={(e) => setForm({ ...form, ingredients: e.target.value })} className="input-field" placeholder="Chicken, Lettuce, Tomato" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Preparation Method</label>
                  <textarea value={form.preparationMethod} onChange={(e) => setForm({ ...form, preparationMethod: e.target.value })} className="input-field" rows={1} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Price *</label>
                  <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="input-field" min="0" step="0.01" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Calories</label>
                  <input type="number" value={form.calories} onChange={(e) => setForm({ ...form, calories: e.target.value })} className="input-field" min="0" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Protein (g)</label>
                  <input type="number" value={form.protein} onChange={(e) => setForm({ ...form, protein: e.target.value })} className="input-field" min="0" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Carbs (g)</label>
                  <input type="number" value={form.carbohydrates} onChange={(e) => setForm({ ...form, carbohydrates: e.target.value })} className="input-field" min="0" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Fat (g)</label>
                  <input type="number" value={form.fat} onChange={(e) => setForm({ ...form, fat: e.target.value })} className="input-field" min="0" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Image</label>
                  <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} className="input-field" />
                </div>
                <div className="md:col-span-2 flex items-center gap-2 mt-2">
                  <input type="checkbox" checked={form.available} onChange={(e) => setForm({ ...form, available: e.target.checked })} className="w-5 h-5 rounded" />
                  <label className="text-sm font-medium">Available</label>
                </div>
              </form>
            </div>

            <div className="p-6 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 rounded-b-2xl">
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium">Cancel</button>
                <button type="button" onClick={handleSubmit} className="flex-1 btn-primary py-2.5">{editing ? 'Update Meal' : 'Create Meal'}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {qrMeal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => { setQrMeal(null); setCopied(false); }}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 w-full max-w-sm slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">{qrMeal.name} - QR Code</h3>
              <button onClick={() => { setQrMeal(null); setCopied(false); }}><X className="w-6 h-6" /></button>
            </div>
            <div className="bg-white p-4 rounded-xl flex justify-center mb-4">
              <img src={qrMeal.qrCode} alt={`QR for ${qrMeal.name}`} className="w-56 h-56" />
            </div>
            <div className="flex gap-3">
              <button onClick={downloadQR} className="flex-1 btn-primary flex items-center justify-center gap-2">
                <Download className="w-4 h-4" /> Download
              </button>
              <button onClick={copyUrl} className="flex-1 py-2 border border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center gap-2">
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />} {copied ? 'Copied!' : 'Copy URL'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
