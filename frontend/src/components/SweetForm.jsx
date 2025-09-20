// src/components/SearchBar.jsx - Beautiful modern design
import { useState } from 'react';

export default function SearchBar({ onSearch }) {
  const [searchParams, setSearchParams] = useState({
    name: '',
    category: '',
    minPrice: '',
    maxPrice: ''
  });
  const [isExpanded, setIsExpanded] = useState(false);

  const handleChange = (e) => {
    const newParams = {
      ...searchParams,
      [e.target.name]: e.target.value
    };
    setSearchParams(newParams);
    onSearch(newParams);
  };

  const clearSearch = () => {
    const clearedParams = {
      name: '',
      category: '',
      minPrice: '',
      maxPrice: ''
    };
    setSearchParams(clearedParams);
    onSearch(clearedParams);
  };

  const hasActiveFilters = Object.values(searchParams).some(value => value !== '');
  const filterCount = Object.values(searchParams).filter(value => value !== '').length;

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 mb-8 overflow-hidden">
      {/* Main Search Bar */}
      <div className="p-6">
        <div className="flex items-center gap-4">
          {/* Primary Search Input */}
          <div className="flex-1 relative">
            <input
              name="name"
              type="text"
              placeholder="Search for your favorite sweets..."
              value={searchParams.name}
              onChange={handleChange}
              className="w-full px-6 py-4 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 pl-14 text-lg"
            />
            <div className="absolute left-5 top-4">
              <span className="text-purple-400 text-xl">🔍</span>
            </div>
          </div>

          {/* Advanced Filters Toggle */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`relative px-6 py-4 rounded-xl font-semibold transition-all duration-200 ${
              hasActiveFilters 
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <span>Filters</span>
              {hasActiveFilters && (
                <div className="bg-white/20 rounded-full px-2 py-0.5 text-xs">
                  {filterCount}
                </div>
              )}
              <span className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </div>
          </button>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={clearSearch}
              className="px-4 py-4 bg-red-100 hover:bg-red-200 text-red-600 rounded-xl transition-colors"
              title="Clear all filters"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Expanded Filters */}
      {isExpanded && (
        <div className="border-t border-gray-200 bg-gradient-to-r from-purple-50/50 to-pink-50/50 p-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Advanced Filters</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <div className="relative">
                <input
                  name="category"
                  type="text"
                  placeholder="e.g., Chocolate, Candy..."
                  value={searchParams.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 pl-12"
                />
                <div className="absolute left-4 top-3.5">
                  <span className="text-gray-400">📂</span>
                </div>
              </div>
            </div>

            {/* Min Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Min Price (₹)
              </label>
              <div className="relative">
                <input
                  name="minPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={searchParams.minPrice}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 pl-12"
                />
                <div className="absolute left-4 top-3.5">
                  <span className="text-gray-400">💰</span>
                </div>
              </div>
            </div>

            {/* Max Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Price (₹)
              </label>
              <div className="relative">
                <input
                  name="maxPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="999.00"
                  value={searchParams.maxPrice}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 pl-12"
                />
                <div className="absolute left-4 top-3.5">
                  <span className="text-gray-400">💸</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Filter Tags */}
          <div className="mt-6">
            <h5 className="text-sm font-medium text-gray-700 mb-3">Quick Filters:</h5>
            <div className="flex flex-wrap gap-2">
              {['Chocolate', 'Candy', 'Gummy', 'Under ₹50', 'Under ₹100', 'Premium'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    if (tag.includes('Under')) {
                      const price = tag.includes('₹50') ? '50' : '100';
                      setSearchParams(prev => ({ ...prev, maxPrice: price }));
                      onSearch({ ...searchParams, maxPrice: price });
                    } else if (tag === 'Premium') {
                      setSearchParams(prev => ({ ...prev, minPrice: '100' }));
                      onSearch({ ...searchParams, minPrice: '100' });
                    } else {
                      setSearchParams(prev => ({ ...prev, category: tag }));
                      onSearch({ ...searchParams, category: tag });
                    }
                  }}
                  className="px-4 py-2 bg-white hover:bg-purple-50 border border-gray-200 hover:border-purple-300 rounded-full text-sm transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="mt-6 p-4 bg-white rounded-lg border border-purple-200">
              <h5 className="text-sm font-medium text-gray-700 mb-2">Active Filters:</h5>
              <div className="flex flex-wrap gap-2">
                {searchParams.name && (
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                    Name: "{searchParams.name}"
                  </span>
                )}
                {searchParams.category && (
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                    Category: {searchParams.category}
                  </span>
                )}
                {searchParams.minPrice && (
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                    Min: ₹{searchParams.minPrice}
                  </span>
                )}
                {searchParams.maxPrice && (
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                    Max: ₹{searchParams.maxPrice}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}