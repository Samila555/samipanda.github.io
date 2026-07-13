import { useState, useEffect } from 'react';
import { Star, MessageSquare, Send, Quote } from 'lucide-react';
import API from '../../api/axios';
import toast from 'react-hot-toast';

export default function Feedback() {
  const [form, setForm] = useState({ customerName: '', rating: 0, comment: '' });
  const [feedbacks, setFeedbacks] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);

  useEffect(() => {
    API.get('/feedback').then(({ data }) => setFeedbacks(data)).catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.customerName || !form.rating) {
      toast.error('Please enter your name and rating');
      return;
    }
    setSubmitting(true);
    try {
      const { data } = await API.post('/feedback', form);
      setFeedbacks([data, ...feedbacks]);
      setForm({ customerName: '', rating: 0, comment: '' });
      toast.success('Thank you for your feedback!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit');
    } finally {
      setSubmitting(false);
    }
  };

  const averageRating = feedbacks.length > 0
    ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1)
    : 0;

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Your <span className="text-primary-500">Feedback</span></h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg">We value your opinion. Tell us about your experience.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="card p-8 fade-in">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-primary-500" />
              Share Your Thoughts
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
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
                <label className="block text-sm font-medium mb-2">Rating *</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoveredStar(star)}
                      onMouseLeave={() => setHoveredStar(0)}
                      onClick={() => setForm({ ...form, rating: star })}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= (hoveredStar || form.rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300 dark:text-gray-600'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Comment</label>
                <textarea
                  placeholder="Tell us about your experience..."
                  value={form.comment}
                  onChange={(e) => setForm({ ...form, comment: e.target.value })}
                  className="input-field min-h-[100px] resize-none"
                  rows={4}
                />
              </div>
              <button type="submit" disabled={submitting} className="btn-primary w-full flex items-center justify-center gap-2">
                <Send className="w-4 h-4" />
                {submitting ? 'Submitting...' : 'Submit Feedback'}
              </button>
            </form>
          </div>

          <div className="fade-in">
            {feedbacks.length > 0 && (
              <div className="card p-6 mb-6 text-center">
                <p className="text-5xl font-bold text-primary-500 mb-2">{averageRating}</p>
                <div className="flex justify-center gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className={`w-5 h-5 ${s <= Math.round(averageRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                  ))}
                </div>
                <p className="text-gray-500">Based on {feedbacks.length} reviews</p>
              </div>
            )}
            <h3 className="font-bold text-xl mb-4">Recent Reviews</h3>
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
              {feedbacks.map((fb) => (
                <div key={fb._id} className="card p-4 slide-up">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                        <Quote className="w-4 h-4 text-primary-500" />
                      </div>
                      <span className="font-semibold">{fb.customerName}</span>
                    </div>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className={`w-4 h-4 ${s <= fb.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                      ))}
                    </div>
                  </div>
                  {fb.comment && <p className="text-gray-600 dark:text-gray-400 text-sm">{fb.comment}</p>}
                  {fb.response && (
                    <div className="mt-2 pl-4 border-l-2 border-primary-500">
                      <p className="text-xs text-gray-400 font-medium">Manager Response:</p>
                      <p className="text-sm text-gray-500">{fb.response}</p>
                    </div>
                  )}
                </div>
              ))}
              {feedbacks.length === 0 && (
                <p className="text-gray-400 text-center py-8">No reviews yet. Be the first!</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
