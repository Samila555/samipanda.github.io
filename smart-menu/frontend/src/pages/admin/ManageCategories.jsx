import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Soup } from 'lucide-react';
import API from '../../api/axios';
import toast from 'react-hot-toast';

export default function ManageCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', description: '' });

  const fetchCategories = async () => {
    try {
      const { data } = await API.get('/categories');
      setCategories(data);
    } catch (err) {
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: '', description: '' });
    setShowModal(true);
  };

  const openEdit = (cat) => {
    setEditing(cat);
    setForm({ name: cat.name, description: cat.description || '' });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name) { toast.error('Name is required'); return; }
    try {
      if (editing) {
        await API.put(`/categories/${editing._id}`, form);
        toast.success('Category updated');
      } else {
        await API.post('/categories', form);
        toast.success('Category created');
      }
      setShowModal(false);
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category? All meals in it will also be deleted.')) return;
    try {
      await API.delete(`/categories/${id}`);
      toast.success('Category deleted');
      fetchCategories();
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  if (loading) return <div className="animate-pulse space-y-4">{[1, 2, 3].map(i => <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded-xl" />)}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Categories</h1>
          <p className="text-gray-500">{categories.length} categories</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" /> Add Category
        </button>
      </div>

      {categories.length === 0 ? (
        <div className="text-center py-20">
          <Soup className="w-20 h-20 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-400 text-xl">No categories yet</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {categories.map((cat) => (
            <div key={cat._id} className="card p-4 flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/20 rounded-xl flex items-center justify-center">
                  <Soup className="w-6 h-6 text-primary-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{cat.name}</h3>
                  {cat.description && <p className="text-sm text-gray-500">{cat.description}</p>}
                </div>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEdit(cat)} className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg text-blue-500">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(cat._id)} className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-red-500">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 w-full max-w-md slide-up" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-bold mb-6">{editing ? 'Edit Category' : 'New Category'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field" rows={3} />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">Cancel</button>
                <button type="submit" className="flex-1 btn-primary">{editing ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
