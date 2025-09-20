// src/components/SweetForm.jsx
import { useState, useEffect } from 'react';
import { addSweet, updateSweet } from '../api/sweetApi';

function SweetForm({ sweet, onClose, onUpdate }) {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    quantity: ''
  });
  const [loading, setLoading] = useState(false);

  const isEditing = !!sweet;

  useEffect(() => {
    if (sweet) {
      setFormData({
        name: sweet.name,
        category: sweet.category,
        price: sweet.price.toString(),
        quantity: sweet.quantity.toString()
      });
    }
  }, [sweet]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const data = {
        ...formData,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity)
      };

      if (isEditing) {
        await updateSweet(sweet.id, data);
        alert('Sweet updated successfully!');
      } else {
        await addSweet(data);
        alert('Sweet added successfully!');
      }
      
      onUpdate();
      onClose();
    } catch (error) {
      alert(`Error ${isEditing ? 'updating' : 'adding'} sweet: ` + 
            (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold mb-6">
          {isEditing ? 'Edit Sweet' : 'Add New Sweet'}
        </h2>
        
        <form onSubmit={handleSubmit}>
          <input
            name="name"
            type="text"
            placeholder="Sweet Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-lg mb-4"
            required
          />
          
          <input
            name="category"
            type="text"
            placeholder="Category (e.g., Chocolate, Candy)"
            value={formData.category}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-lg mb-4"
            required
          />
          
          <input
            name="price"
            type="number"
            step="0.01"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-lg mb-4"
            required
          />
          
          <input
            name="quantity"
            type="number"
            placeholder="Quantity in Stock"
            value={formData.quantity}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-lg mb-6"
            required
          />
          
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 font-medium"
            >
              {loading ? 'Saving...' : (isEditing ? 'Update' : 'Add')}
            </button>
            
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SweetForm;