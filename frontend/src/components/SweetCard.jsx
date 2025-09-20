// src/components/SweetCard.jsx - Beautiful modern design
import { useState } from 'react';
import { deleteSweet } from '../api/sweetApi';
import InventoryModal from './InventoryModal';

export default function SweetCard({ sweet, user, onUpdate, onEdit }) {
  const [showInventoryModal, setShowInventoryModal] = useState(false);
  const [inventoryMode, setInventoryMode] = useState('purchase');
  const [loading, setLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const isAdmin = user?.role === 'ROLE_ADMIN';
  const isOutOfStock = sweet.quantity === 0;

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this sweet? This action cannot be undone.')) {
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
    if (sweet.quantity === 0) return 'text-red-600 bg-red-100 border-red-200';
    if (sweet.quantity <= 5) return 'text-orange-600 bg-orange-100 border-orange-200';
    return 'text-green-600 bg-green-100 border-green-200';
  };

  const getStockStatusText = () => {
    if (sweet.quantity === 0) return 'Out of Stock';
    if (sweet.quantity <= 5) return 'Low Stock';
    return 'In Stock';
  };

  const getStockIcon = () => {
    if (sweet.quantity === 0) return '❌';
    if (sweet.quantity <= 5) return '⚠️';
    return '✅';
  };

  return (
    <>
      <div 
        className={`bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 relative overflow-hidden group ${
          isOutOfStock ? 'opacity-75' : ''
        } ${isHovered ? 'transform -translate-y-2' : ''}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Background Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-pink-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Content */}
        <div className="relative z-10">
          {/* Header with Sweet Icon */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-start space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-xl flex items-center justify-center shadow-md">
                <span className="text-xl text-white">🍬</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-1 group-hover:text-purple-800 transition-colors">
                  {sweet.name}
                </h3>
                <span className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 px-3 py-1 rounded-full text-xs font-semibold border border-purple-200">
                  {sweet.category}
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                ₹{sweet.price}
              </p>
              <p className="text-xs text-gray-500">per unit</p>
            </div>
          </div>

          {/* Stock Status Section */}
          <div className="mb-6 bg-gray-50 rounded-xl p-4 group-hover:bg-white group-hover:shadow-md transition-all duration-300">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-semibold text-gray-700">Inventory Status</span>
              <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStockStatusColor()}`}>
                <span className="mr-1">{getStockIcon()}</span>
                {getStockStatusText()}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Available Stock</span>
                <span className="font-bold text-gray-800">{sweet.quantity} units</span>
              </div>
              
              {/* Enhanced Stock Level Bar */}
              <div className="relative">
                <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
                  <div 
                    className={`h-3 rounded-full transition-all duration-500 shadow-sm ${
                      sweet.quantity === 0 ? 'bg-gradient-to-r from-red-400 to-red-500' :
                      sweet.quantity <= 5 ? 'bg-gradient-to-r from-orange-400 to-orange-500' : 
                      'bg-gradient-to-r from-green-400 to-green-500'
                    }`}
                    style={{ 
                      width: `${Math.min((sweet.quantity / 20) * 100, 100)}%` 
                    }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0</span>
                  <span>20+</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {/* Primary Purchase Button */}
            <button
              onClick={openPurchaseModal}
              disabled={isOutOfStock}
              className={`w-full px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 ${
                isOutOfStock
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white transform hover:scale-105 shadow-lg hover:shadow-xl'
              }`}
            >
              <span className="text-lg">{isOutOfStock ? '❌' : '🛒'}</span>
              <span>{isOutOfStock ? 'Out of Stock' : 'Purchase Now'}</span>
            </button>

            {/* Admin Actions */}
            {isAdmin && (
              <>
                {/* Admin Button Row */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={openRestockModal}
                    className="px-4 py-3 bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white rounded-xl font-semibold transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center space-x-1"
                  >
                    <span>📦</span>
                    <span className="text-sm">Restock</span>
                  </button>
                  <button
                    onClick={() => onEdit(sweet)}
                    className="px-4 py-3 bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white rounded-xl font-semibold transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center space-x-1"
                  >
                    <span>✏️</span>
                    <span className="text-sm">Edit</span>
                  </button>
                </div>

                {/* Delete Button */}
                <button
                  onClick={handleDelete}
                  disabled={loading}
                  className="w-full px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white rounded-xl font-semibold transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <>
                      <span>🗑️</span>
                      <span>Delete Sweet</span>
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Decorative corner accent */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-purple-200/30 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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