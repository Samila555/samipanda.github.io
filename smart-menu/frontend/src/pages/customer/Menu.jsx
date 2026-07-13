import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X, Soup, ChevronDown, ChevronUp } from 'lucide-react';
import API from '../../api/axios';
import toast from 'react-hot-toast';

export default function Menu() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [meals, setMeals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState(searchParams.get('meal') || null);
  const [expandedMeal, setExpandedMeal] = useState(null);

  useEffect(() => {
    API.get('/categories').then(({ data }) => setCategories(data)).catch(() => { });

    // Save table number if provided via QR code link
    const tableNum = searchParams.get('table');
    if (tableNum) {
      localStorage.setItem('tableNumber', tableNum);
      toast.success(`Welcome to ${tableNum}!`);
    }
  }, [searchParams]);

  const fetchMeals = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedCategory) params.category = selectedCategory;
      if (search) params.search = search;
      if (priceRange.min) params.minPrice = priceRange.min;
      if (priceRange.max) params.maxPrice = priceRange.max;
      params.available = true;
      const { data } = await API.get('/meals', { params });
      setMeals(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, search, priceRange.min, priceRange.max]);

  useEffect(() => {
    fetchMeals();
    const interval = setInterval(fetchMeals, 15000);
    return () => clearInterval(interval);
  }, [fetchMeals]);

  useEffect(() => {
    if (selectedMeal) {
      setExpandedMeal(selectedMeal);
      setTimeout(() => {
        document.getElementById(`meal-${selectedMeal}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 500);
    }
  }, [selectedMeal, meals]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchMeals();
  };

  const handleCategoryClick = (catId) => {
    setSelectedCategory(catId === selectedCategory ? '' : catId);
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our <span className="text-primary-500">Menu</span></h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg">Discover our delicious offerings</p>
        </div>

        <div className="mb-8 space-y-4">
          <form onSubmit={handleSearch} className="flex gap-3 max-w-2xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search meals..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field pl-12"
              />
            </div>
            <button type="submit" className="btn-primary">Search</button>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={`p-3 rounded-lg border-2 transition-all ${showFilters ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-300 dark:border-gray-600'}`}
            >
              <SlidersHorizontal className="w-5 h-5" />
            </button>
          </form>

          {showFilters && (
            <div className="max-w-2xl mx-auto card p-4 slide-up">
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <label className="text-sm text-gray-500 mb-1 block">Min Price</label>
                  <input type="number" placeholder="ETB 0" value={priceRange.min} onChange={(e) => setPriceRange(p => ({ ...p, min: e.target.value }))} className="input-field" />
                </div>
                <div className="flex-1">
                  <label className="text-sm text-gray-500 mb-1 block">Max Price</label>
                  <input type="number" placeholder="ETB 50" value={priceRange.max} onChange={(e) => setPriceRange(p => ({ ...p, max: e.target.value }))} className="input-field" />
                </div>
                <button onClick={fetchMeals} className="btn-primary">Apply</button>
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => handleCategoryClick(cat._id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === cat._id
                  ? 'bg-primary-500 text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-500'
                  }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="card animate-pulse">
                <div className="h-48 bg-gray-200 dark:bg-gray-700" />
                <div className="p-5 space-y-3">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : meals.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full border border-amber-500/30 overflow-hidden bg-black flex items-center justify-center mx-auto mb-4">
              <img src={`${import.meta.env.BASE_URL}logo-icon.png`} alt="Logo" className="w-full h-full object-cover scale-110 opacity-50 grayscale" />
            </div>
            <h3 className="text-2xl font-bold text-gray-400">No meals found</h3>
            <p className="text-gray-400">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {meals.map((meal) => (
              <div id={`meal-${meal._id}`} key={meal._id} className={`card overflow-hidden group fade-in transition-all duration-500 ${selectedMeal === meal._id ? 'ring-4 ring-primary-500 shadow-xl shadow-primary-500/20 scale-[1.02]' : ''}`}>
                <div className="h-48 flex items-center justify-center relative overflow-hidden bg-gray-100 dark:bg-gray-700">
                  {meal.image ? (
                    <img src={meal.image} alt={meal.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <div className="bg-black/5 w-full h-full flex items-center justify-center overflow-hidden">
                      <img src={`${import.meta.env.BASE_URL}logo-icon.png`} alt="Placeholder" className="w-24 h-24 object-cover scale-110 opacity-20 group-hover:opacity-40 group-hover:scale-125 transition-all duration-500 rounded-full" />
                    </div>
                  )}
                  {!meal.available && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="bg-red-500 text-white px-4 py-1 rounded-full text-sm font-bold">Unavailable</span>
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg group-hover:text-primary-500 transition-colors">{meal.name}</h3>
                    <span className="text-primary-500 font-bold text-lg">ETB {meal.price}</span>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-3 line-clamp-2">{meal.description}</p>
                  <button
                    onClick={() => setExpandedMeal(expandedMeal === meal._id ? null : meal._id)}
                    className="text-primary-500 text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all"
                  >
                    Details {expandedMeal === meal._id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  {expandedMeal === meal._id && (
                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 space-y-3 slide-up">
                      <div>
                        <h4 className="font-semibold text-sm mb-1">Nutrition</h4>
                        <div className="flex gap-4 text-xs text-gray-500">
                          <span>🔥 {meal.calories} cal</span>
                          <span>💪 {meal.protein}g protein</span>
                          <span>🍚 {meal.carbohydrates}g carbs</span>
                          <span>🧈 {meal.fat}g fat</span>
                        </div>
                      </div>
                      {meal.ingredients?.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-sm mb-1">Ingredients</h4>
                          <p className="text-sm text-gray-500">{meal.ingredients.join(', ')}</p>
                        </div>
                      )}
                      {meal.preparationMethod && (
                        <div>
                          <h4 className="font-semibold text-sm mb-1">Preparation</h4>
                          <p className="text-sm text-gray-500">{meal.preparationMethod}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
