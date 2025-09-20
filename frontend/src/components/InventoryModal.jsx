// src/components/InventoryModal.jsx - Beautiful modern design
import { useState } from 'react';
import { purchaseSweet, restockSweet } from '../api/inventoryApi';

export default function InventoryModal({ 
  sweet, 
  user, 
  onClose, 
  onUpdate, 
  mode = 'purchase'
}) {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const isPurchaseMode = mode === 'purchase';
  const maxPurchaseQuantity = Math.min(sweet.quantity, 10);

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
      
      setSuccess(true);
      setTimeout(() => {
        onUpdate();
        onClose();
      }, 1500);
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

  if (success) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 animate-slide-in">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
              <div className="text-3xl text-white animate-bounce">✓</div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              {isPurchaseMode ? 'Purchase Successful!' : 'Restocked Successfully!'}
            </h3>
            <p className="text-gray-600 mb-4">
              {isPurchaseMode 
                ? `You purchased ${quantity} ${sweet.name}${quantity > 1 ? 's' : ''}`
                : `Added ${quantity} units to ${sweet.name} inventory`
              }
            </p>
            <div className="w-8 h-8 mx-auto">
              <div className="w-full h-full border-4 border-green-200 border-t-green-500 rounded-full animate-spin"></div>
            </div>
            <p className="text-sm text-gray-500 mt-2">Updating inventory...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto animate-slide-in">
        {/* Header */}
        <div className={`${
          isPurchaseMode 
            ? 'bg-gradient-to-r from-blue-500 to-purple-600' 
            : 'bg-gradient-to-r from-green-500 to-teal-600'
        } text-white p-6 rounded-t-2xl`}>
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-2xl">{isPurchaseMode ? '🛒' : '📦'}</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold">
                  {isPurchaseMode ? 'Purchase Sweet' : 'Restock Inventory'}
                </h3>
                <p className="text-white/80">
                  {isPurchaseMode ? 'Complete your purchase' : 'Add inventory stock'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
            >
              <span className="text-white text-xl">×</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Sweet Details Card */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 mb-6">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-lg font-bold text-gray-800 mb-1">{sweet.name}</h4>
                <div className="flex items-center space-x-2 mb-2">
                  <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
                    {sweet.category}
                  </span>
                  <span className="text-gray-500 text-sm">•</span>
                  <span className="text-gray-600 text-sm">₹{sweet.price} each</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Stock:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    sweet.quantity === 0 ? 'bg-red-100 text-red-800' :
                    sweet.quantity <= 5 ? 'bg-orange-100 text-orange-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {sweet.quantity} units
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-500 rounded-xl flex items-center justify-center">
                  <span className="text-2xl text-white">🍬</span>
                </div>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl animate-fade-in">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-red-500 text-sm">⚠️</span>
                </div>
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Quantity Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                {isPurchaseMode ? 'How many would you like to purchase?' : 'How many units to add?'}
              </label>
              
              {/* Quantity Selector */}
              <div className="flex items-center space-x-4 mb-4">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-600 transition-colors"
                >
                  -
                </button>
                
                <div className="flex-1 relative">
                  <input
                    type="number"
                    min="1"
                    max={isPurchaseMode ? maxPurchaseQuantity : 1000}
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-xl text-center text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>
                
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(isPurchaseMode ? maxPurchaseQuantity : 1000, quantity + 1))}
                  className="w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-600 transition-colors"
                >
                  +
                </button>
              </div>

              {/* Quick Select Buttons */}
              {isPurchaseMode && (
                <div className="flex space-x-2">
                  {[1, 2, 5].filter(num => num <= maxPurchaseQuantity).map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setQuantity(num)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        quantity === num
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              )}

              {isPurchaseMode && (
                <p className="text-xs text-gray-500 mt-2">
                  Maximum available: {maxPurchaseQuantity} units
                </p>
              )}
            </div>

            {/* Cost Summary for Purchase */}
            {isPurchaseMode && (
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600">Total Cost</p>
                    <p className="text-2xl font-bold text-blue-600">
                      ₹{(sweet.price * quantity).toFixed(2)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">{quantity} × ₹{sweet.price}</p>
                    <p className="text-xs text-gray-500">Including all charges</p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || (isPurchaseMode && sweet.quantity === 0)}
                className={`flex-1 px-6 py-4 text-white rounded-xl font-semibold transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
                  isPurchaseMode 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
                    : 'bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700'
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <span className="mr-2">{isPurchaseMode ? '🛒' : '📦'}</span>
                    {isPurchaseMode ? 'Complete Purchase' : 'Add to Stock'}
                  </div>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}