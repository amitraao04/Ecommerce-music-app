import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './OrderSuccessPage.css';

const OrderSuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderId, paymentId } = location.state || {};

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (!token) {
      // If not authenticated, redirect to login page
      navigate('/');
      return;
    }
    
    // If there's no orderId or paymentId, it means the user didn't complete payment
    if (!orderId || !paymentId) {
      navigate('/cart');
    }
  }, [orderId, paymentId, navigate]);

  const handleLogout = () => {
    // Clear authentication token
    localStorage.removeItem('token');
    // Navigate to login page
    navigate('/');
  };

  if (!orderId || !paymentId) {
    return null; // This will prevent the page from rendering before redirect
  }

  return (
    <div className="order-success-container">
      <div className="success-card">
        <div className="success-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>
        
        <h1>Payment Successful!</h1>
        <p>Thank you for your purchase. Your order has been placed successfully.</p>
        
        <div className="order-details">
          <div className="detail-row">
            <span>Order ID:</span>
            <span>{orderId}</span>
          </div>
          <div className="detail-row">
            <span>Payment ID:</span>
            <span>{paymentId}</span>
          </div>
        </div>
        
        <p className="email-info">
          A confirmation email has been sent to your registered email address.
        </p>
        
        <div className="action-buttons">
          <button 
            className="continue-shopping-btn"
            onClick={() => navigate('/products')}
          >
            Continue Shopping
          </button>
          
          <button 
            className="logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;