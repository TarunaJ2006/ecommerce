import React, { useState, useEffect } from 'react';
import './Cart.css';

const Cart = ({ token }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const fetchCart = async () => {
    if (!token) return;
    
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/cart/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setCart(data);
      } else {
        setMessage('Failed to fetch cart');
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/cart/items/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ quantity: newQuantity })
      });

      if (response.ok) {
        fetchCart(); // Refresh cart
        setMessage('Quantity updated!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        const error = await response.json();
        setMessage(`Error: ${error.detail || 'Failed to update quantity'}`);
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  const removeItem = async (itemId) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/cart/items/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok || response.status === 204) {
        fetchCart(); // Refresh cart
        setMessage('Item removed!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        const error = await response.json();
        setMessage(`Error: ${error.detail || 'Failed to remove item'}`);
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  const clearCart = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/cart/clear', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok || response.status === 204) {
        fetchCart(); // Refresh cart
        setMessage('Cart cleared!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        const error = await response.json();
        setMessage(`Error: ${error.detail || 'Failed to clear cart'}`);
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  const calculateTotal = () => {
    if (!cart || !cart.cart_items) return 0;
    return cart.cart_items.reduce((total, item) => 
      total + (item.product.price * item.quantity), 0
    ).toFixed(2);
  };

  useEffect(() => {
    fetchCart();
  }, [token]);

  if (!token) {
    return <p className="login-prompt">Please login to view your cart</p>;
  }

  return (
    <div className="cart-container">
      <h2 className="cart-title">Shopping Cart</h2>
      
      {loading && <p className="cart-loading">Loading...</p>}
      {message && (
        <p className={`cart-message ${message.includes('Error') ? 'error' : 'success'}`}>
          {message}
        </p>
      )}

      {cart && (
        <div>
          {!cart.cart_items || cart.cart_items.length === 0 ? (
            <p className="cart-empty">Your cart is empty</p>
          ) : (
            <div>
              <div className="cart-items">
                {cart.cart_items.map(item => (
                  <div key={item.id} className="cart-item">
                    <h4 className="cart-item-title">{item.product.title}</h4>
                    <p className="cart-item-description">{item.product.description}</p>
                    <p className="cart-item-price">Price: ${item.product.price}</p>
                    <div className="quantity-section">
                      <label className="quantity-label">Quantity: </label>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                        className="quantity-input"
                      />
                    </div>
                    <p className="cart-item-subtotal">
                      <strong>Subtotal: ${(item.product.price * item.quantity).toFixed(2)}</strong>
                    </p>
                    <button onClick={() => removeItem(item.id)} className="remove-item-button">
                      Remove Item
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="cart-summary">
                <h3 className="cart-total">Total: ${calculateTotal()}</h3>
                <div className="cart-actions">
                  <button onClick={clearCart} className="clear-cart-button">
                    Clear Cart
                  </button>
                  <button className="checkout-button">
                    Checkout
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Cart;
