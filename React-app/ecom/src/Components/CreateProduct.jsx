import React, { useState } from 'react';
import './CreateProduct.css';

const CreateProduct = ({ token }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!token) {
      setMessage('Please login to create products');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('http://127.0.0.1:8000/products/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price)
        })
      });

      if (response.ok) {
        const data = await response.json();
        setMessage(`Product created successfully! ID: ${data.id}`);
        setFormData({ title: '', description: '', price: '' });
      } else {
        const error = await response.json();
        setMessage(`Error: ${error.detail || 'Failed to create product'}`);
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return <p className="login-prompt">Please login to create products</p>;
  }

  return (
    <div className="create-product-container">
      <h2 className="create-product-title">Create Product</h2>
      <form onSubmit={handleSubmit} className="create-product-form">
        <div className="form-group">
          <label className="form-label">Title:</label>
          <input
            type="text"
            name="title"
            className="form-input"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Description:</label>
                    <textarea
            name="description"
            className="form-textarea"
            value={formData.description}
            onChange={handleChange}
            required
            rows="4"
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Price:</label>
          <input
            type="number"
            step="0.01"
            name="price"
            className="form-input"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>
        
        <button type="submit" disabled={loading} className="create-product-button">
          {loading ? 'Creating...' : 'Create Product'}
        </button>
      </form>
      
      {loading && <p className="loading-text">Creating product...</p>}
      {message && (
        <p className={message.includes('Error') ? 'error-message' : 'success-message'}>
          {message}
        </p>
      )}
    </div>
  );
};

export default CreateProduct;
