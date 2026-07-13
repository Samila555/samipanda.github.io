import { useEffect, useState } from 'react';
import { Trash2, MessageSquare, Send, Star, Quote } from 'lucide-react';
import API from '../../api/axios';
import toast from 'react-hot-toast';

export default function ManageFeedbacks() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [respondId, setRespondId] = useState(null);
  const [response, setResponse] = useState('');

  const fetchFeedbacks = async () => {
    try {
      const { data } = await API.get('/feedback');
      setFeedbacks(data);
    } catch (err) {
      toast.error('Failed to load feedbacks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFeedbacks(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this feedback?')) return;
    try {
      await API.delete(`/feedback/${id}`);
      toast.success('Feedback deleted');
      fetchFeedbacks();
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  const handleRespond = async (id) => {
    if (!response.trim()) {
      toast.error('Please enter a response');
      return;
    }
    try {
      await API.put(`/feedback/${id}/respond`, { response });
      toast.success('Response submitted');
      setRespondId(null);
      setResponse('');
      fetchFeedbacks();
    } catch (err) {
      toast.error('Failed to respond');
    }
  };

  if (loading) return <div className="animate-pulse space-y-4">{[1, 2, 3].map(i => <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-xl" />)}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Feedbacks</h1>
          <p className="text-gray-500">{feedbacks.length} reviews</p>
        </div>
      </div>

      {feedbacks.length === 0 ? (
        <div className="text-center py-20">
          <MessageSquare className="w-20 h-20 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-400 text-xl">No feedbacks yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {feedbacks.map((fb) => (
            <div key={fb._id} className="card p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                    <Quote className="w-5 h-5 text-primary-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{fb.customerName}</h3>
                    <p className="text-xs text-gray-400">{new Date(fb.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className={`w-4 h-4 ${s <= fb.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                    ))}
                  </div>
                  <button onClick={() => handleDelete(fb._id)} className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {fb.comment && <p className="text-gray-600 dark:text-gray-400 mb-3">{fb.comment}</p>}
              {fb.response && (
                <div className="pl-4 border-l-2 border-primary-500 mb-3">
                  <p className="text-xs text-gray-400 font-medium">Your Response:</p>
                  <p className="text-sm text-gray-500">{fb.response}</p>
                </div>
              )}
              {respondId === fb._id ? (
                <div className="flex gap-2 mt-2">
                  <input
                    type="text"
                    placeholder="Type your response..."
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                    className="input-field flex-1 text-sm"
                    autoFocus
                  />
                  <button onClick={() => handleRespond(fb._id)} className="btn-primary text-sm py-2 px-4 flex items-center gap-1">
                    <Send className="w-4 h-4" /> Send
                  </button>
                  <button onClick={() => { setRespondId(null); setResponse(''); }} className="py-2 px-3 border rounded-lg text-sm">Cancel</button>
                </div>
              ) : !fb.response ? (
                <button
                  onClick={() => setRespondId(fb._id)}
                  className="text-primary-500 text-sm font-medium hover:underline mt-2"
                >
                  Respond to feedback
                </button>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
