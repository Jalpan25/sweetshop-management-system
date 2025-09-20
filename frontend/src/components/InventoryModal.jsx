// src/components/InventoryModal.jsx
import { useState } from 'react';
import { purchaseSweet, restockSweet } from '../api/inventoryApi';

export default function InventoryModal({ 
  sweet, 
  user, 
  onClose, 
  onUpdate, 
  mode = 'purchase' // 'purchase' or 'restock'
}) {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isPurchaseMode = mode === 'purchase';
  const isAdmin = user?.role === 'ROLE_ADMIN';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isPurchaseMode) {
        await purchaseSweet(sweet.id, quantity);
      } else {
        await restockSweet(sweet.id, quantity);
      }
      
      onUpdate(); // Refresh the sweet list
      onClose();
    } catch (error) {
      console.error('Inventory operation failed:', error);
      setError(
        error.response?.data?.message || 
        `Failed to ${isPurchaseMode ? 'purchase' : 'restock'} sweet`
      );
    } finally {
      setLoading(false);
    }
  };

  const maxPurchaseQuantity = Math.min(sweet.quantity, 10); // Limit max purchase

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-96 max-w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">
            {isPurchaseMode ? '🛒 Purchase Sweet' : '📦 Restock Sweet'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <h4 className="font-semibold">{sweet.name}</h4>
          <p className="text-sm text-gray-600">Category: {sweet.category}</p>
          <p className="text-sm text-gray-600">Price: ₹{sweet.price}</p>
          <p className="text-sm text-gray-600">
            Current Stock: <span className="font-medium">{sweet.quantity}</span>
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {isPurchaseMode ? 'Quantity to Purchase:' : 'Quantity to Restock:'}
            </label>
            <input
              type="number"
              min="1"
              max={isPurchaseMode ? maxPurchaseQuantity : 1000}
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
              required
            />
            {isPurchaseMode && (
              <p className="text-xs text-gray-500 mt-1">
                Max available: {maxPurchaseQuantity}
              </p>
            )}
          </div>

          {isPurchaseMode && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Total Cost: ₹{(sweet.price * quantity).toFixed(2)}</strong>
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || (isPurchaseMode && sweet.quantity === 0)}
              className={`flex-1 px-4 py-2 text-white rounded-lg font-medium ${
                isPurchaseMode 
                  ? 'bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400'
                  : 'bg-green-600 hover:bg-green-700 disabled:bg-gray-400'
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </span>
              ) : (
                `${isPurchaseMode ? '🛒 Purchase' : '📦 Restock'}`
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}