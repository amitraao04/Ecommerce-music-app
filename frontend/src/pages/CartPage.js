import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './CartPage.css'; // We'll create this file separately

const CartPage = () => {
  const [cart, setCart] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/', { replace: true });
    }
  }, [navigate]);

  const fetchCart = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('https://music-backend-xq0r.onrender.com/api/cart', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCart(res.data);
    } catch (err) {
      console.error('Error fetching cart:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleRemove = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'https://music-backend-xq0r.onrender.com/api/cart/remove',
        { productId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchCart(); // Refresh cart
    } catch (err) {
      console.error('Error removing item:', err);
    }
  };

  const handleUpdateQuantity = async (productId, quantity) => {
    if (quantity < 1) return; // Prevent quantity below 1
    
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        'https://music-backend-xq0r.onrender.com/api/cart/update',
        { productId, quantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchCart(); // Refresh cart
    } catch (err) {
      console.error('Error updating quantity:', err);
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  const calculateTotal = () => {
    if (!cart || !cart.items.length) return 0;
    return cart.items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0).toFixed(2);
  };

  if (isLoading) {
    return (
      <div className="cart-loading">
        <div className="loading-spinner"></div>
        <p>Loading your cart...</p>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h1 className="cart-title">Your Shopping Cart</h1>
      
      {!cart || cart.items.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is currently empty.</p>
          <button 
            className="continue-shopping-btn"
            onClick={() => navigate('/products')}
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <>
          <div className="cart-header">
            <span className="header-item">Product</span>
            <span className="header-item">Price</span>
            <span className="header-item">Quantity</span>
            <span className="header-item">Total</span>
            <span className="header-item">Actions</span>
          </div>
          
          <div className="cart-items">
            {cart.items.map((item) => (
              <div key={item.productId} className="cart-item">
                <div className="item-info">
                  <div className="item-details">
                    <h3>{item.name || `Product ID: ${item.productId}`}</h3>
                    {item.description && <p className="item-description">{item.description}</p>}
                  </div>
                </div>
                
                <div className="item-price">
                ₹{item.price ? item.price.toFixed(2) : '0.00'}
                </div>
                
                <div className="item-quantity">
                  <button 
                    className="quantity-btn decrease"
                    onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    −
                  </button>
                  <span className="quantity-value">{item.quantity}</span>
                  <button 
                    className="quantity-btn increase"
                    onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
                
                <div className="item-total">
                ₹{item.price ? (item.price * item.quantity).toFixed(2) : '0.00'}
                </div>
                
                <div className="item-actions">
                  <button 
                    className="remove-btn"
                    onClick={() => handleRemove(item.productId)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="cart-summary">
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>₹{calculateTotal()}</span>
            </div>
            <div className="summary-row">
              <span>Shipping:</span>
              <span>Calculated at checkout</span>
            </div>
            <div className="summary-row total">
              <span>Estimated Total:</span>
              <span>₹{calculateTotal()}</span>
            </div>
            
            <div className="cart-actions">
              <button 
                className="continue-shopping-btn"
                onClick={() => navigate('/products')}
              >
                Continue Shopping
              </button>
              <button 
                className="checkout-btn"
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;

