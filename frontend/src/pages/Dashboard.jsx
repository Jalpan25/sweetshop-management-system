// src/pages/Dashboard.jsx - Production version
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
      // Filter out empty search parameters
      const params = Object.fromEntries(
        Object.entries(searchParams).filter(([_, value]) => value !== '')
      );
      
      if (Object.keys(params).length === 0) {
        // If no search parameters, load all sweets
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

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🍬 Sweet Shop Management
          </h1>
          {user && (
            <div className="flex justify-between items-center">
              <p className="text-gray-600">
                Welcome back, <span className="font-semibold">{user.email}</span>
                <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {user.role === 'ROLE_ADMIN' ? 'Admin' : 'User'}
                </span>
              </p>
              
              {isAdmin && (
                <button
                  onClick={() => setShowForm(true)}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                >
                  + Add New Sweet
                </button>
              )}
            </div>
          )}
        </div>

        <SearchBar onSearch={handleSearch} />

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 rounded-lg">
            <p className="text-red-800">{error}</p>
            <button
              onClick={loadSweets}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
            >
              Retry
            </button>
          </div>
        )}

        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading sweets...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sweets.length === 0 ? (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-600 text-lg">No sweets found</p>
                {isAdmin && (
                  <button
                    onClick={() => setShowForm(true)}
                    className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Add Your First Sweet
                  </button>
                )}
              </div>
            ) : (
              sweets.map((sweet) => (
                <SweetCard
                  key={sweet.id}
                  sweet={sweet}
                  user={user}
                  onUpdate={loadSweets}
                  onEdit={handleEdit}
                />
              ))
            )}
          </div>
        )}

        {showForm && (
          <SweetForm
            sweet={editingSweet}
            onClose={handleCloseForm}
            onUpdate={loadSweets}
          />
        )}
      </div>
    </div>
  );
}