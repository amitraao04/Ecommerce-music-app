import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/', { replace: true }); // redirect to login
    }
  }, [navigate]);

  useEffect(() => {
   
    // Fetch products when component mounts or when search/category/page changes
    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/products', {
          params: {
            search,
            category,
            page,
            limit: 9,
          },
        });

        setProducts(res.data.products);
        setTotalPages(res.data.totalPages);
      } catch (err) {
        console.error('Error fetching products:', err);
      }
    };

    fetchProducts();
    // Simulating cart count - in a real app, you would fetch this from your cart API
    const fetchCartCount = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/cart', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const totalItems = res.data.items.reduce((acc, item) => acc + item.quantity, 0);
        setCartCount(totalItems);
      } catch (err) {
        console.error('Error fetching cart count:', err);
      }
    };
    
    fetchCartCount();
    
  }, [search, category, page]);

  const handleLogout = () => {
    console.log('Logging out...');
    localStorage.clear(); // clear storage (or cookies if needed)
    navigate('/', { replace: true });   // redirect to login page
  };

  const handleAddToCart = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/cart/add',
        { productId, quantity: 1 },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      // Optimistically update cart count
      setCartCount((prev) => prev + 1);
    } catch (err) {
      console.error('Error adding to cart:', err);
    }
  };
  
  

  // SVG Icons
  const MusicIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18V5l12-2v13"></path>
      <circle cx="6" cy="18" r="3"></circle>
      <circle cx="18" cy="16" r="3"></circle>
    </svg>
  );

  const CartIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1"></circle>
      <circle cx="20" cy="21" r="1"></circle>
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
    </svg>
  );

  const LogoutIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
      <polyline points="16 17 21 12 16 7"></polyline>
      <line x1="21" y1="12" x2="9" y2="12"></line>
    </svg>
  );

  const styles = {
    // Main container
    container: {
      backgroundColor: 'white',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
    },
    
    // Header styles
    header: {
      background: 'linear-gradient(135deg, #4a1d96 0%, #312e81 100%)',
      padding: '16px 24px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      color: 'white',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    },
    headerLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    logo: {
      color: '#fbbf24',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    logoText: {
      fontSize: '24px',
      fontWeight: 'bold',
    },
    headerRight: {
      display: 'flex',
      alignItems: 'center',
      gap: '20px',
    },
    cartButton: {
      background: 'none',
      border: 'none',
      color: '#fbbf24',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      cursor: 'pointer',
      position: 'relative',
      padding: '8px',
    },
    cartCount: {
      position: 'absolute',
      top: '0',
      right: '0',
      backgroundColor: '#f59e0b',
      color: 'white',
      borderRadius: '50%',
      width: '20px',
      height: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '12px',
      fontWeight: 'bold',
    },
    logoutButton: {
      background: 'rgba(255, 255, 255, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '8px',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '8px 16px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    },
    
    // Main content area
    content: {
      flex: '1',
      padding: '24px',
      maxWidth: '1200px',
      margin: '0 auto',
      width: '100%',
    },
    pageTitle: {
      fontSize: '28px',
      fontWeight: 'bold',
      color: '#4a1d96',
      marginBottom: '24px',
      borderBottom: '2px solid #f59e0b',
      paddingBottom: '8px',
    },
    
    // Search and filter
    filterSection: {
      display: 'flex',
      gap: '12px',
      marginBottom: '24px',
      flexWrap: 'wrap',
    },
    searchInput: {
      padding: '10px 16px',
      borderRadius: '8px',
      border: '1px solid #d1d5db',
      flex: '1',
      minWidth: '200px',
    },
    categorySelect: {
      padding: '10px 16px',
      borderRadius: '8px',
      border: '1px solid #d1d5db',
      backgroundColor: 'white',
      minWidth: '150px',
    },
    
    // Product grid
    productGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: '24px',
    },
    productCard: {
      backgroundColor: 'white',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      border: '1px solid #e5e7eb',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    },
    productImage: {
      width: '100%',
      height: '180px',
      objectFit: 'contain',
    },
    productContent: {
      padding: '16px',
    },
    productName: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#4a1d96',
      marginBottom: '8px',
    },
    productDescription: {
      color: '#6b7280',
      marginBottom: '12px',
      fontSize: '14px',
    },
    productPrice: {
      color: '#4a1d96',
      fontSize: '18px',
      fontWeight: 'bold',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    addToCartButton: {
      backgroundColor: '#4a1d96',
      color: '#fad166',
      border: 'none',
      borderRadius: '6px',
      padding: '6px 12px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500'
    },
    
    // Pagination
    pagination: {
      display: 'flex',
      justifyContent: 'center',
      gap: '8px',
      marginTop: '32px',
    },
    pageButton: {
      minWidth: '36px',
      height: '36px',
      borderRadius: '6px',
      border: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      fontWeight: '500',
    },
    activePageButton: {
      backgroundColor: '#f59e0b',
      color: 'white',
    },
    inactivePageButton: {
      backgroundColor: '#f3f4f6',
      color: '#4b5563',
    },
    
    // Footer
    footer: {
      background: 'linear-gradient(135deg, #4a1d96 0%, #312e81 100%)',
      color: 'white',
      padding: '24px',
      textAlign: 'center',
    },
    footerContent: {
      maxWidth: '1200px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
    },
    footerLogo: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      color: '#fbbf24',
      marginBottom: '16px',
    },
    footerLinks: {
      display: 'flex',
      justifyContent: 'center',
      gap: '24px',
      flexWrap: 'wrap',
    },
    footerLink: {
      color: '#d8b4fe',
      textDecoration: 'none',
    },
    footerCopyright: {
      marginTop: '16px',
      color: 'rgba(255, 255, 255, 0.6)',
      fontSize: '14px',
    },
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.logo}>
            <MusicIcon />
            <span style={styles.logoText}>Melodic Market</span>
          </div>
        </div>
        <div style={styles.headerRight}>
          <button style={styles.cartButton}  onClick={() => navigate('/cart')}>
            <CartIcon />
            <span>Cart</span>
            {cartCount > 0 && <span style={styles.cartCount}>{cartCount}</span>}
          </button>
          <button style={styles.logoutButton} onClick={handleLogout}>
            <LogoutIcon />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main style={styles.content}>
        <h1 style={styles.pageTitle}>Shop Our Collection</h1>

        {/* Search & Filter */}
        <div style={styles.filterSection}>
          <input
            type="text"
            placeholder="Search products..."
            style={styles.searchInput}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            style={styles.categorySelect}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="guitar">Guitar</option>
            <option value="drum">Drums</option>
            <option value="violin">Violin</option>
            <option value="keyboard">Keyboard and Piano</option>
            <option value="wind">Wind section</option>
            <option value="percussion">Percussions</option>
            <option value="microphone">Microphones</option>
            <option value="accessory">Other Accessories</option>
          </select>
        </div>

        {/* Product Grid */}
        <div style={styles.productGrid}>
          {products.length > 0 ? (
            products.map((product) => (
              <div key={product._id} style={styles.productCard}>
                <img
                  src={`http://localhost:5000/images/${product.image}`}
                  alt={product.name}
                  style={styles.productImage}
                />
                <div style={styles.productContent}>
                  <h2 style={styles.productName}>{product.name}</h2>
                  <p style={styles.productDescription}>{product.description}</p>
                  <div style={styles.productPrice}>
                    <span>₹{product.price}</span>
                    <button style={styles.addToCartButton} onClick={() => handleAddToCart(product._id)}>Add to Cart</button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No products found. Try a different search.</p>
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div style={styles.pagination}>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                style={{
                  ...styles.pageButton,
                  ...(page === i + 1 ? styles.activePageButton : styles.inactivePageButton),
                }}
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <div style={styles.footerLogo}>
            <MusicIcon />
            <span>Melodic Market</span>
          </div>
          <div style={styles.footerLinks}>
            <a href="#" style={styles.footerLink}>About Us</a>
            <a href="#" style={styles.footerLink}>Contact</a>
            <a href="#" style={styles.footerLink}>Terms & Conditions</a>
            <a href="#" style={styles.footerLink}>Privacy Policy</a>
            <a href="#" style={styles.footerLink}>FAQs</a>
          </div>
          <div style={styles.footerCopyright}>
            © {new Date().getFullYear()} Melodic Market. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;