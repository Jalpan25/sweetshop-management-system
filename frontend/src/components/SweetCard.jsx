// src/components/SweetCard.jsx - Updated with inventory actions
import { useState } from 'react';
import { deleteSweet } from '../api/sweetApi';
import InventoryModal from './InventoryModal';

export default function SweetCard({ sweet, user, onUpdate, onEdit }) {
  const [showInventoryModal, setShowInventoryModal] = useState(false);
  const [inventoryMode, setInventoryMode] = useState('purchase');
  const [loading, setLoading] = useState(false);

  const isAdmin = user?.role === 'ROLE_ADMIN';
  const isOutOfStock = sweet.quantity === 0;

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this sweet?')) {
      return;
    }

    setLoading(true);
    try {
      await deleteSweet(sweet.id);
      onUpdate();
    } catch (error) {
      console.error('Error deleting sweet:', error);
      alert('Failed to delete sweet');
    } finally {
      setLoading(false);
    }
  };

  const openPurchaseModal = () => {
    setInventoryMode('purchase');
    setShowInventoryModal(true);
  };

  const openRestockModal = () => {
    setInventoryMode('restock');
    setShowInventoryModal(true);
  };

  const getStockStatusColor = () => {
    if (sweet.quantity === 0) return 'text-red-600 bg-red-100';
    if (sweet.quantity <= 5) return 'text-orange-600 bg-orange-100';
    return 'text-green-600 bg-green-100';
  };

  const getStockStatusText = () => {
    if (sweet.quantity === 0) return 'Out of Stock';
    if (sweet.quantity <= 5) return 'Low Stock';
    return 'In Stock';
  };

  return (
    <>
      <div className={`bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow ${
        isOutOfStock ? 'opacity-75' : ''
      }`}>
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-1">{sweet.name}</h3>
            <p className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded-full inline-block">
              {sweet.category}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-blue-600">₹{sweet.price}</p>
          </div>
        </div>

        {/* Stock Status */}
        <div className="mb-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">Stock:</span>
            <span className={`text-sm font-medium px-2 py-1 rounded-full ${getStockStatusColor()}`}>
              {getStockStatusText()}
            </span>
          </div>
          <div className="mt-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Quantity</span>
              <span className="font-medium">{sweet.quantity} units</span>
            </div>
            {/* Stock level bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
              <div 
                className={`h-2 rounded-full ${
                  sweet.quantity === 0 ? 'bg-red-500' :
                  sweet.quantity <= 5 ? 'bg-orange-500' : 'bg-green-500'
                }`}
                style={{ 
                  width: `${Math.min((sweet.quantity / 20) * 100, 100)}%` 
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          {/* Purchase Button (for all users) */}
          <button
            onClick={openPurchaseModal}
            disabled={isOutOfStock}
            className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
              isOutOfStock
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isOutOfStock ? '❌ Out of Stock' : '🛒 Purchase'}
          </button>

          {/* Admin Actions */}
          {isAdmin && (
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={openRestockModal}
                className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium text-sm"
              >
                📦 Restock
              </button>
              <button
                onClick={() => onEdit(sweet)}
                className="px-3 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 font-medium text-sm"
              >
                ✏️ Edit
              </button>
            </div>
          )}

          {/* Delete Button (Admin only) */}
          {isAdmin && (
            <button
              onClick={handleDelete}
              disabled={loading}
              className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium disabled:bg-gray-400 text-sm"
            >
              {loading ? 'Deleting...' : '🗑️ Delete'}
            </button>
          )}
        </div>
      </div>

      {/* Inventory Modal */}
      {showInventoryModal && (
        <InventoryModal
          sweet={sweet}
          user={user}
          mode={inventoryMode}
          onClose={() => setShowInventoryModal(false)}
          onUpdate={onUpdate}
        />
      )}
    </>
  );
}