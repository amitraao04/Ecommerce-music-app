import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import HomePage from './pages/HomePage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage'; // Add this
import OrderSuccessPage from './pages/OrderSuccessPage'; // Add this

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/Products" element={<HomePage />} />
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} /> 
        <Route path="/order-success" element={<OrderSuccessPage />} /> 
      </Routes>
    </Router>
  );
}

export default App;