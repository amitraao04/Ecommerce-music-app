// import React, { useState } from 'react';

// const SignupPage = () => {
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const handleSignup = (e) => {
//     e.preventDefault();
//     console.log('Signing up with:', { name, email, password });
//     // TODO: connect with backend
//   };

//   return (
//     <div style={{ padding: "2rem" }}>
//       <h2>Sign Up</h2>
//       <form onSubmit={handleSignup}>
//         <input
//           type="text"
//           placeholder="Name"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           required
//           style={{ display: 'block', margin: '10px 0' }}
//         />
//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//           style={{ display: 'block', margin: '10px 0' }}
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//           style={{ display: 'block', margin: '10px 0' }}
//         />
//         <button type="submit">Sign Up</button>
//       </form>
//     </div>
//   );
// };

// export default SignupPage;

import React, { useState } from 'react';
import api from '../api/axios';

const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
  
    try {
      const res = await api.post('/signup', {
        name,
        email,
        password,
      });
  
      console.log('Signup success:', res.data);
  
      // Store the JWT token in localStorage
      localStorage.setItem('token', res.data.token);
  
      // Redirect user to home or dashboard page
      window.location.href = '/dashboard'; // or use react-router
    } catch (err) {
      alert('Signup error:', err.response?.data || err.message);
    }
  };
  
  // Music icon SVG
  const MusicIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18V5l12-2v13"></path>
      <circle cx="6" cy="18" r="3"></circle>
      <circle cx="18" cy="16" r="3"></circle>
    </svg>
  );

  // Key icon SVG
  const KeyIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="15" r="4"></circle>
      <path d="M10.85 12.15 19 4m-4 0h4v4"></path>
    </svg>
  );

  // User icon SVG
  const UserIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="5"></circle>
      <path d="M20 21a8 8 0 0 0-16 0"></path>
    </svg>
  );

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #4a1d96 0%, #312e81 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      fontFamily: 'sans-serif',
      color: 'white'
    },
    formContainer: {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      borderRadius: '16px',
      padding: '32px',
      width: '100%',
      maxWidth: '420px',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
      border: '1px solid rgba(255, 255, 255, 0.2)'
    },
    header: {
      textAlign: 'center',
      marginBottom: '32px'
    },
    logoContainer: {
      display: 'inline-flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: '16px',
      color: '#fbbf24'
    },
    title: {
      fontSize: '28px',
      fontWeight: 'bold',
      color: '#fbbf24',
      marginBottom: '8px'
    },
    subtitle: {
      color: '#d8b4fe',
      fontSize: '16px'
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '24px'
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    },
    label: {
      fontSize: '14px',
      color: '#fbbf24',
      fontWeight: '500'
    },
    inputContainer: {
      position: 'relative'
    },
    input: {
      width: '100%',
      padding: '12px 16px',
      paddingRight: '40px',
      borderRadius: '8px',
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      border: '1px solid rgba(216, 180, 254, 0.3)',
      color: 'white',
      fontSize: '16px'
    },
    icon: {
      position: 'absolute',
      right: '12px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: 'rgba(216, 180, 254, 0.5)'
    },
    button: {
      width: '100%',
      padding: '12px 20px',
      borderRadius: '8px',
      border: 'none',
      background: 'linear-gradient(to right, #fbbf24, #f59e0b)',
      color: '#4a1d96',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      marginTop: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px'
    },
    footer: {
      marginTop: '32px',
      paddingTop: '24px',
      borderTop: '1px solid rgba(216, 180, 254, 0.2)',
      textAlign: 'center',
      fontSize: '14px',
      color: '#d8b4fe'
    },
    link: {
      color: '#fbbf24',
      textDecoration: 'none',
      fontWeight: '500',
      marginLeft: '6px'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <div style={styles.header}>
          <div style={styles.logoContainer}>
            <MusicIcon />
          </div>
          <h2 style={styles.title}>Join the Symphony</h2>
          <p style={styles.subtitle}>Start your musical journey with your favourite instrument</p>
        </div>
        
        <form onSubmit={handleSignup} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Full Name</label>
            <div style={styles.inputContainer}>
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={styles.input}
              />
              <div style={styles.icon}>
                <UserIcon />
              </div>
            </div>
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
            <div style={styles.inputContainer}>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={styles.input}
              />
              <div style={styles.icon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21.5 18.5h-19a1 1 0 0 1-1-1v-13a1 1 0 0 1 1-1h19a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1z"></path>
                  <path d="m3.5 6.5 9 6 9-6"></path>
                </svg>
              </div>
            </div>
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <div style={styles.inputContainer}>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={styles.input}
              />
              <div style={styles.icon}>
                <KeyIcon />
              </div>
            </div>
          </div>
          
          <button type="submit" style={styles.button}>
            <MusicIcon />
            Compose Your Account
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;