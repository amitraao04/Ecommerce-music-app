// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import './CheckoutPage.css';

// const CheckoutPage = () => {
//   const navigate = useNavigate();
//   const [isLoading, setIsLoading] = useState(true);
//   const [cart, setCart] = useState(null);
//   const [orderProcessing, setOrderProcessing] = useState(false);
//   const [shippingInfo, setShippingInfo] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     address: '',
//     city: '',
//     state: '',
//     pincode: '',
//   });
//   const [errors, setErrors] = useState({});

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       navigate('/', { replace: true });
//       return;
//     }
//     fetchCart();
//   }, [navigate]);

//   const fetchCart = async () => {
//     setIsLoading(true);
//     try {
//       const token = localStorage.getItem('token');
//       const res = await axios.get('http://localhost:5000/api/cart', {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setCart(res.data);
//     } catch (err) {
//       console.error('Error fetching cart:', err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setShippingInfo({
//       ...shippingInfo,
//       [name]: value,
//     });

//     // Clear error for this field when user starts typing
//     if (errors[name]) {
//       setErrors({
//         ...errors,
//         [name]: '',
//       });
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};
//     if (!shippingInfo.name.trim()) newErrors.name = 'Name is required';
//     if (!shippingInfo.email.trim()) newErrors.email = 'Email is required';
//     else if (!/\S+@\S+\.\S+/.test(shippingInfo.email)) newErrors.email = 'Email is invalid';
//     if (!shippingInfo.phone.trim()) newErrors.phone = 'Phone number is required';
//     else if (!/^\d{10}$/.test(shippingInfo.phone)) newErrors.phone = 'Phone number must be 10 digits';
//     if (!shippingInfo.address.trim()) newErrors.address = 'Address is required';
//     if (!shippingInfo.city.trim()) newErrors.city = 'City is required';
//     if (!shippingInfo.state.trim()) newErrors.state = 'State is required';
//     if (!shippingInfo.pincode.trim()) newErrors.pincode = 'Pincode is required';
//     else if (!/^\d{6}$/.test(shippingInfo.pincode)) newErrors.pincode = 'Pincode must be 6 digits';

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const calculateTotal = () => {
//     if (!cart || !cart.items || cart.items.length === 0) return 0;
//     return cart.items.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
//   };

//   const handlePayment = async () => {
//     if (!validateForm()) return;
    
//     setOrderProcessing(true);
//     try {
//       // Create an order on your server
//       const token = localStorage.getItem('token');
//       const orderRes = await axios.post('http://localhost:5000/order', {
//         amount: parseFloat(calculateTotal()*100), // Convert to paise
//         currency: 'INR',
//       }, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const { id: orderId, amount } = orderRes.data;

//       // Initialize Razorpay
//       const options = {
//         key: process.env.REACT_APP_RAZORPAY_KEY_ID,
//         amount: (amount/100).toString(), // Convert to rupees
//         currency: 'INR',
//         name: 'Your Store Name',
//         description: 'Purchase from your store',
//         order_id: orderId,
//         handler: async function (response) {
//           try {
//             // Payment verification
//             const paymentData = {
//               razorpay_order_id: response.razorpay_order_id,
//               razorpay_payment_id: response.razorpay_payment_id,
//               razorpay_signature: response.razorpay_signature,
//               shippingInfo,
//             };
//             await axios.post('http://localhost:5000/api/orders/verify', paymentData, {
//               headers: { Authorization: `Bearer ${token}` },
//             });
//             navigate('/order-success', { state: { orderId: response.razorpay_order_id, paymentId: response.razorpay_payment_id } });
//           } catch (error) {
//             console.error('Payment verification failed:', error);
//             alert('Payment verification failed. Please contact support.');
//           }
//         },
//         prefill: { name: shippingInfo.name, email: shippingInfo.email, contact: shippingInfo.phone },
//         notes: { address: shippingInfo.address },
//         theme: { color: '#3399cc' },
//       };

//       const razorpay = new window.Razorpay(options);
//       razorpay.open();
//     } catch (error) {
//       console.error('Payment initiation failed:', error);
//       alert('Unable to initialize payment. Please try again later.');
//     } finally {
//       setOrderProcessing(false);
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="checkout-loading">
//         <div className="loading-spinner"></div>
//         <p>Loading checkout...</p>
//       </div>
//     );
//   }

//   if (!cart || cart.items.length === 0) {
//     return (
//       <div className="empty-checkout">
//         <h2>Your cart is empty</h2>
//         <p>Add some products to your cart before proceeding to checkout.</p>
//         <button 
//           className="continue-shopping-btn"
//           onClick={() => navigate('/products')}
//         >
//           Continue Shopping
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="checkout-container">
//       <h1 className="checkout-title">Checkout</h1>

//       <div className="checkout-grid">
//         <div className="shipping-section">
//           <h2>Shipping Information</h2>

//           {['name', 'email', 'phone', 'address', 'city', 'state', 'pincode'].map((field) => (
//             <div key={field} className="form-group">
//               <label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
//               <input
//                 type={field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'}
//                 id={field}
//                 name={field}
//                 value={shippingInfo[field]}
//                 onChange={handleInputChange}
//                 className={errors[field] ? 'error' : ''}
//               />
//               {errors[field] && <p className="error-text">{errors[field]}</p>}
//             </div>
//           ))}
//         </div>

//         <div className="order-summary-section">
//           <h2>Order Summary</h2>
//           <div className="order-items">
//             {cart.items.map((item) => (
//               <div key={item.productId} className="order-item">
//                 <div className="item-info">
//                   <span className="item-name">{item.name || `Product ID: ${item.productId}`}</span>
//                   <span className="item-quantity">x {item.quantity}</span>
//                 </div>
//                 <div className="item-price">₹{(item.price * item.quantity).toFixed(2)}</div>
//               </div>
//             ))}
//           </div>

//           <div className="order-totals">
//             <div className="total-row">
//               <span>Subtotal</span>
//               <span>₹{calculateTotal()}</span>
//             </div>
//             <div className="total-row">
//               <span>Shipping</span>
//               <span>₹50.00</span>
//             </div>
//             <div className="total-row grand-total">
//               <span>Total</span>
//               <span>₹{(parseFloat(calculateTotal()) + 50).toFixed(2)}</span>
//             </div>
//           </div>

//           <button 
//             className="pay-now-btn"
//             onClick={handlePayment}
//             disabled={orderProcessing}
//           >
//             {orderProcessing ? 'Processing...' : 'Pay Now'}
//           </button>

//           <button 
//             className="back-to-cart-btn"
//             onClick={() => navigate('/cart')}
//             disabled={orderProcessing}
//           >
//             Back to Cart
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CheckoutPage;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [cart, setCart] = useState(null);
  const [orderProcessing, setOrderProcessing] = useState(false);
  const [shippingInfo, setShippingInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/', { replace: true });
      return;
    }
    fetchCart();
  }, [navigate]);

  const fetchCart = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/cart', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(res.data);
    } catch (err) {
      console.error('Error fetching cart:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo({
      ...shippingInfo,
      [name]: value,
    });

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!shippingInfo.name.trim()) newErrors.name = 'Name is required';
    if (!shippingInfo.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(shippingInfo.email)) newErrors.email = 'Email is invalid';
    if (!shippingInfo.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!/^\d{10}$/.test(shippingInfo.phone)) newErrors.phone = 'Phone number must be 10 digits';
    if (!shippingInfo.address.trim()) newErrors.address = 'Address is required';
    if (!shippingInfo.city.trim()) newErrors.city = 'City is required';
    if (!shippingInfo.state.trim()) newErrors.state = 'State is required';
    if (!shippingInfo.pincode.trim()) newErrors.pincode = 'Pincode is required';
    else if (!/^\d{6}$/.test(shippingInfo.pincode)) newErrors.pincode = 'Pincode must be 6 digits';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateTotal = () => {
    if (!cart || !cart.items || cart.items.length === 0) return 0;
    return cart.items.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  const handlePayment = async () => {
    if (!validateForm()) return;
    
    setOrderProcessing(true);
    try {
      // Create an order on your server
      const token = localStorage.getItem('token');
      const orderRes = await axios.post('http://localhost:5000/order', {
        amount: parseFloat(calculateTotal()*100), // Convert to paise
        currency: 'INR',
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      const { id: orderId, amount } = orderRes.data;
  
      // Initialize Razorpay
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: (amount/100).toString(), // Convert to rupees
        currency: 'INR',
        name: 'Your Store Name',
        description: 'Purchase from your store',
        order_id: orderId,
        handler: async function (response) {
          try {
            // Payment verification
            const paymentData = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              shippingInfo: shippingInfo
            };
            
            console.log('Sending verification data:', paymentData);
            
            const verificationResponse = await axios.post('http://localhost:5000/api/orders/verify', paymentData, {
              headers: { Authorization: `Bearer ${token}` },
            });
            
            console.log('Verification successful:', verificationResponse.data);
            navigate('/order-success', { state: { orderId: response.razorpay_order_id, paymentId: response.razorpay_payment_id } });
          } catch (error) {
            console.error('Payment verification failed:', error);
            console.error('Error details:', error.response?.data);
            console.error('Error status:', error.response?.status);
            alert('Payment verification failed. Please contact support.');
          }
        },
        prefill: { name: shippingInfo.name, email: shippingInfo.email, contact: shippingInfo.phone },
        notes: { address: shippingInfo.address },
        theme: { color: '#3399cc' },
      };
  
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Payment initiation failed:', error);
      console.error('Error details:', error.response?.data);
      alert('Unable to initialize payment. Please try again later.');
    } finally {
      setOrderProcessing(false);
    }
  };


//   const handlePayment = async () => {
//     if (!validateForm()) return;
    
//     setOrderProcessing(true);
//     try {
//       // Create an order on your server
//       const token = localStorage.getItem('token');
//       const orderRes = await axios.post('http://localhost:5000/order', {
//         amount: parseFloat(calculateTotal()*100), // Convert to paise
//         currency: 'INR',
//       }, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const { id: orderId, amount } = orderRes.data;

//       // Initialize Razorpay
//       const options = {
//         key: process.env.REACT_APP_RAZORPAY_KEY_ID,
//         amount: (amount/100).toString(), // Convert to rupees
//         currency: 'INR',
//         name: 'Your Store Name',
//         description: 'Purchase from your store',
//         order_id: orderId,
//         handler: async function (response) {
//           try {
//             // Payment verification
//             const paymentData = {
//               razorpay_order_id: response.razorpay_order_id,
//               razorpay_payment_id: response.razorpay_payment_id,
//               razorpay_signature: response.razorpay_signature,
//               shippingInfo,
//             };
//             await axios.post('http://localhost:5000/api/orders/verify', paymentData, {
//               headers: { Authorization: `Bearer ${token}` },
//             });
//             navigate('/order-success', { state: { orderId: response.razorpay_order_id, paymentId: response.razorpay_payment_id } });
//           } catch (error) {
//             console.error('Payment verification failed:', error);
//             alert('Payment verification failed. Please contact support.');
//           }
//         },
//         prefill: { name: shippingInfo.name, email: shippingInfo.email, contact: shippingInfo.phone },
//         notes: { address: shippingInfo.address },
//         theme: { color: '#3399cc' },
//       };

//       const razorpay = new window.Razorpay(options);
//       razorpay.open();
//     } catch (error) {
//       console.error('Payment initiation failed:', error);
//       alert('Unable to initialize payment. Please try again later.');
//     } finally {
//       setOrderProcessing(false);
//     }
//   };

  if (isLoading) {
    return (
      <div className="checkout-loading">
        <div className="loading-spinner"></div>
        <p>Loading checkout...</p>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="empty-checkout">
        <h2>Your cart is empty</h2>
        <p>Add some products to your cart before proceeding to checkout.</p>
        <button 
          className="continue-shopping-btn"
          onClick={() => navigate('/products')}
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <h1 className="checkout-title">Checkout</h1>

      <div className="checkout-grid">
        <div className="shipping-section">
          <h2>Shipping Information</h2>

          {['name', 'email', 'phone', 'address', 'city', 'state', 'pincode'].map((field) => (
            <div key={field} className="form-group">
              <label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
              <input
                type={field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'}
                id={field}
                name={field}
                value={shippingInfo[field]}
                onChange={handleInputChange}
                className={errors[field] ? 'error' : ''}
              />
              {errors[field] && <p className="error-text">{errors[field]}</p>}
            </div>
          ))}
        </div>

        <div className="order-summary-section">
          <h2>Order Summary</h2>
          <div className="order-items">
            {cart.items.map((item) => (
              <div key={item.productId} className="order-item">
                <div className="item-info">
                  <span className="item-name">{item.name || `Product ID: ${item.productId}`}</span>
                  <span className="item-quantity">x {item.quantity}</span>
                </div>
                <div className="item-price">₹{(item.price * item.quantity).toFixed(2)}</div>
              </div>
            ))}
          </div>

          <div className="order-totals">
            <div className="total-row">
              <span>Subtotal</span>
              <span>₹{calculateTotal()}</span>
            </div>
            <div className="total-row">
              <span>Shipping</span>
              <span>₹50.00</span>
            </div>
            <div className="total-row grand-total">
              <span>Total</span>
              <span>₹{(parseFloat(calculateTotal()) + 50).toFixed(2)}</span>
            </div>
          </div>

          <button 
            className="pay-now-btn"
            onClick={handlePayment}
            disabled={orderProcessing}
          >
            {orderProcessing ? 'Processing...' : 'Pay Now'}
          </button>

          <button 
            className="back-to-cart-btn"
            onClick={() => navigate('/cart')}
            disabled={orderProcessing}
          >
            Back to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;