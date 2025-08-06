import React, { useState, useEffect } from 'react';
import './ProductList.css';

const ProductList = ({ token }) => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const fetchProducts = async () => {
    setLoading(true);
    setMessage('');
    try {
      const url = search 
        ? `http://127.0.0.1:8000/products/?search=${encodeURIComponent(search)}`
        : 'http://127.0.0.1:8000/products/';
      
      console.log('Fetching from:', url);
      const response = await fetch(url);
      console.log('Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Products data:', data);
        setProducts(data);
        setMessage('');
      } else {
        setMessage('Failed to fetch products');
        console.error('Fetch failed:', response.status, response.statusText);
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
      console.error('Network error:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId) => {
    if (!token) {
      setMessage('Please login to add items to cart');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/cart/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          product_id: productId,
          quantity: 1
        })
      });

      if (response.ok) {
        setMessage('Added to cart!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        const error = await response.json();
        setMessage(`Error: ${error.detail || 'Failed to add to cart'}`);
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  return (
    <div className="product-list-container">
      <h2 className="product-list-title">Products</h2>
      
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          className="search-input"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit" className="search-button">Search</button>
        <button type="button" onClick={() => { setSearch(''); fetchProducts(); }} className="clear-button">
          Clear
        </button>
      </form>

      {loading && <p className="loading-text">Loading...</p>}
      {message && (
        <p className={message.includes('Error') ? 'error-message' : 'success-message'}>
          {message}
        </p>
      )}

      <div className="products-grid">
        {products.length === 0 ? (
          <p className="no-products">No products found</p>
        ) : (
          products.map(product => (
            <div key={product.id} className="product-card">
              <h3 className="product-title">{product.title}</h3>
              <p className="product-description">{product.description}</p>
              <p className="product-price"><strong>Price: ${product.price}</strong></p>
              <p className="product-stock">Seller ID: {product.seller_id}</p>
              <p className="product-stock">Published: {product.is_published ? 'Yes' : 'No'}</p>
              {token && (
                <button onClick={() => addToCart(product.id)} className="add-to-cart-button">
                  Add to Cart
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductList;
