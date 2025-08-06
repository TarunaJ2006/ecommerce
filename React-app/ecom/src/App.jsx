import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import CreateAccount from './Components/CreateAccount';
import Login from './Components/Login';
import ProductList from './Components/ProductList';
import CreateProduct from './Components/CreateProduct';
import Cart from './Components/Cart';
import './App.css';

function App() {
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  const handleLogin = (newToken) => {
    setToken(newToken);
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('token');
  };

  const renderNavigation = () => (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/products" className="nav-brand">
          E-Commerce Store
        </Link>
        
        <div className="nav-links">
          <Link to="/products" className="nav-link">
            Products
          </Link>
          
          {token ? (
            <>
              <Link to="/cart" className="nav-link">
                Cart
              </Link>
              <Link to="/create-product" className="nav-link">
                Create Product
              </Link>
              <span className="user-info">✅ Logged in</span>
              <button onClick={handleLogout} className="logout-button">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                Login
              </Link>
              <Link to="/create-account" className="nav-link">
                Create Account
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );

  return (
    <Router>
      <div className="app">
        {renderNavigation()}
        
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Navigate to="/products" replace />} />
            <Route path="/products" element={<ProductList token={token} />} />
            <Route path="/create-account" element={<CreateAccount />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route 
              path="/create-product" 
              element={token ? <CreateProduct token={token} /> : <Navigate to="/login" replace />} 
            />
            <Route 
              path="/cart" 
              element={token ? <Cart token={token} /> : <Navigate to="/login" replace />} 
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
