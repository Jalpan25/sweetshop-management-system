// src/components/SearchBar.jsx
import { useState } from 'react';

export default function SearchBar({ onSearch }) {
  const [searchParams, setSearchParams] = useState({
    name: '',
    category: '',
    minPrice: '',
    maxPrice: ''
  });

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

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-lg font-semibold mb-4">Search & Filter Sweets</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <input
          name="name"
          type="text"
          placeholder="Search by name..."
          value={searchParams.name}
          onChange={handleChange}
          className="border px-3 py-2 rounded-lg"
        />
        
        <input
          name="category"
          type="text"
          placeholder="Filter by category..."
          value={searchParams.category}
          onChange={handleChange}
          className="border px-3 py-2 rounded-lg"
        />
        
        <input
          name="minPrice"
          type="number"
          step="0.01"
          placeholder="Min price..."
          value={searchParams.minPrice}
          onChange={handleChange}
          className="border px-3 py-2 rounded-lg"
        />
        
        <input
          name="maxPrice"
          type="number"
          step="0.01"
          placeholder="Max price..."
          value={searchParams.maxPrice}
          onChange={handleChange}
          className="border px-3 py-2 rounded-lg"
        />
      </div>
      
      <button
        onClick={clearSearch}
        className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
      >
        Clear Filters
      </button>
    </div>
  );
}