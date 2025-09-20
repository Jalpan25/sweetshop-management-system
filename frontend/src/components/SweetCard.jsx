// src/components/SweetCard.jsx
import { useState } from 'react';
import { purchaseSweet, deleteSweet, restockSweet } from '../api/sweetApi';

function SweetCard({ sweet, user, onUpdate, onEdit }) {
  const [loading, setLoading] = useState(false);
  const [restockQuantity, setRestockQuantity] = useState('');
  const [showRestock, setShowRestock] = useState(false);

  const isAdmin = user?.role === 'ROLE_ADMIN';
  const isOutOfStock = sweet.quantity === 0;

  const handlePurchase = async () => {
    setLoading(true);
    try {
      await purchaseSweet(sweet.id);
      onUpdate();
      alert('Sweet purchased successfully!');
    } catch (error) {
      alert('Error purchasing sweet: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this sweet?')) {
      setLoading(true);
      try {
        await deleteSweet(sweet.id);
        onUpdate();
        alert('Sweet deleted successfully!');
      } catch (error) {
        alert('Error deleting sweet: ' + (error.response?.data?.message || error.message));
      } finally {
        setLoading(false);
      }
    }
  };

  const handleRestock = async () => {
    if (!restockQuantity || restockQuantity < 1) {
      alert('Please enter a valid quantity');
      return;
    }
    
    setLoading(true);
    try {
      await restockSweet(sweet.id, parseInt(restockQuantity));
      onUpdate();
      setShowRestock(false);
      setRestockQuantity('');
      alert('Sweet restocked successfully!');
    } catch (error) {
      alert('Error restocking sweet: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-gray-800">{sweet.name}</h3>
        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
          {sweet.category}
        </span>
      </div>
      
      <div className="mb-4">
        <p className="text-2xl font-bold text-green-600">${sweet.price}</p>
        <p className={`text-sm ${isOutOfStock ? 'text-red-500' : 'text-gray-600'}`}>
          Stock: {sweet.quantity} {isOutOfStock && '(Out of Stock)'}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={handlePurchase}
          disabled={loading || isOutOfStock}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            isOutOfStock
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          {loading ? 'Processing...' : 'Purchase'}
        </button>

        {isAdmin && (
          <>
            <button
              onClick={() => onEdit(sweet)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              Edit
            </button>
            
            <button
              onClick={handleDelete}
              disabled={loading}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
            >
              Delete
            </button>
            
            <button
              onClick={() => setShowRestock(!showRestock)}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 font-medium"
            >
              Restock
            </button>
          </>
        )}
      </div>

      {showRestock && isAdmin && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Quantity to add"
              value={restockQuantity}
              onChange={(e) => setRestockQuantity(e.target.value)}
              className="flex-1 border px-3 py-2 rounded-lg"
              min="1"
            />
            <button
              onClick={handleRestock}
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Add Stock
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SweetCard;