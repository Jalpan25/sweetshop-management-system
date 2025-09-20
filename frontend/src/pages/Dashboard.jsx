// src/pages/Dashboard.jsx - Beautiful modern design
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllSweets, searchSweets } from "../api/sweetApi";
import SweetCard from "../components/SweetCard";
import SweetForm from "../components/SweetForm";
import SearchBar from "../components/SearchBar";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [sweets, setSweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSweet, setEditingSweet] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    
    if (!token) {
      navigate("/login");
    } else {
      setUser(JSON.parse(userData));
      loadSweets();
    }
  }, [navigate]);

  const loadSweets = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getAllSweets();
      setSweets(response.data);
    } catch (error) {
      console.error('Error loading sweets:', error);
      setError('Failed to load sweets. Please try refreshing the page.');
      
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (searchParams) => {
    setLoading(true);
    setError("");
    try {
      const params = Object.fromEntries(
        Object.entries(searchParams).filter(([_, value]) => value !== '')
      );
      
      if (Object.keys(params).length === 0) {
        await loadSweets();
      } else {
        const response = await searchSweets(params);
        setSweets(response.data);
      }
    } catch (error) {
      console.error('Error searching sweets:', error);
      setError('Failed to search sweets. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (sweet) => {
    setEditingSweet(sweet);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingSweet(null);
  };

  const isAdmin = user?.role === 'ROLE_ADMIN';
  const totalStock = sweets.reduce((sum, sweet) => sum + sweet.quantity, 0);
  const lowStockItems = sweets.filter(sweet => sweet.quantity <= 5 && sweet.quantity > 0).length;
  const outOfStockItems = sweets.filter(sweet => sweet.quantity === 0).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute -top-4 -right-4 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative pt-24 pb-12 px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-12">
            <div className="text-center mb-8">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent mb-4">
                Sweet Shop Management
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Manage your sweet inventory with style and efficiency
              </p>
            </div>

            {user && (
              <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-white/20">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                  {/* Welcome Section */}
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-2xl text-white">
                        {(user.name || user.email).charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Welcome back,</p>
                      <p className="text-2xl font-bold text-gray-800">{user.name || user.email}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          user.role === 'ROLE_ADMIN' 
                            ? 'bg-purple-100 text-purple-800 border border-purple-200' 
                            : 'bg-blue-100 text-blue-800 border border-blue-200'
                        }`}>
                          {user.role === 'ROLE_ADMIN' ? 'Shop Manager' : 'Customer'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Stats Cards for Admin */}
                  {isAdmin && (
                    <div className="grid grid-cols-3 gap-4 lg:gap-6">
                      <div className="bg-gradient-to-r from-green-400 to-green-500 rounded-xl p-4 text-white text-center">
                        <p className="text-2xl font-bold">{sweets.length}</p>
                        <p className="text-xs opacity-90">Total Products</p>
                      </div>
                      <div className="bg-gradient-to-r from-blue-400 to-blue-500 rounded-xl p-4 text-white text-center">
                        <p className="text-2xl font-bold">{totalStock}</p>
                        <p className="text-xs opacity-90">Total Stock</p>
                      </div>
                      <div className="bg-gradient-to-r from-orange-400 to-red-500 rounded-xl p-4 text-white text-center">
                        <p className="text-2xl font-bold">{lowStockItems + outOfStockItems}</p>
                        <p className="text-xs opacity-90">Low/Out Stock</p>
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  {isAdmin && (
                    <button
                      onClick={() => setShowForm(true)}
                      className="px-8 py-4 bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white rounded-xl font-semibold transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2"
                    >
                      <span className="text-xl">+</span>
                      <span>Add New Sweet</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          <SearchBar onSearch={handleSearch} />

          {/* Error State */}
          {error && (
            <div className="mb-8 bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-2xl p-6 animate-fade-in">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-red-500 text-xl">⚠</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-red-800 mb-1">Something went wrong</h3>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
                <button
                  onClick={loadSweets}
                  className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors shadow-md hover:shadow-lg"
                >
                  Retry
                </button>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="text-center py-16">
              <div className="inline-flex flex-col items-center space-y-4">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl">🍬</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-lg font-medium text-gray-700">Loading your sweets...</p>
                  <p className="text-sm text-gray-500">Preparing something delicious</p>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Results Summary */}
              {sweets.length > 0 && (
                <div className="mb-8 text-center">
                  <p className="text-gray-600">
                    Showing <span className="font-semibold text-purple-600">{sweets.length}</span> sweet{sweets.length !== 1 ? 's' : ''}
                    {lowStockItems > 0 && (
                      <span className="ml-2 px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium">
                        {lowStockItems} low stock
                      </span>
                    )}
                    {outOfStockItems > 0 && (
                      <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                        {outOfStockItems} out of stock
                      </span>
                    )}
                  </p>
                </div>
              )}

              {/* Sweet Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {sweets.length === 0 ? (
                  <div className="col-span-full">
                    <div className="text-center py-16 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/20">
                      <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center">
                        <span className="text-4xl text-white">🔍</span>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">No sweets found</h3>
                      <p className="text-gray-600 mb-8 max-w-md mx-auto">
                        {isAdmin 
                          ? "Start building your inventory by adding your first sweet product."
                          : "Check back later for new sweet arrivals or try adjusting your search filters."
                        }
                      </p>
                      {isAdmin && (
                        <button
                          onClick={() => setShowForm(true)}
                          className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl font-semibold transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                        >
                          Add Your First Sweet
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  sweets.map((sweet, index) => (
                    <div 
                      key={sweet.id}
                      className="animate-fade-in"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <SweetCard
                        sweet={sweet}
                        user={user}
                        onUpdate={loadSweets}
                        onEdit={handleEdit}
                      />
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Sweet Form Modal */}
      {showForm && (
        <SweetForm
          sweet={editingSweet}
          onClose={handleCloseForm}
          onUpdate={loadSweets}
        />
      )}
    </div>
  );
}