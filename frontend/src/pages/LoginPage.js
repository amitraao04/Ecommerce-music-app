// import React, { useState } from 'react';

// const LoginPage = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const handleLogin = (e) => {
//     e.preventDefault();
//     console.log('Logging in with:', { email, password });
//     // TODO: connect with backend
//   };

//   return (
//     <div style={{ padding: "2rem" }}>
//       <h2>Login</h2>
//       <form onSubmit={handleLogin}>
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
//         <button type="submit">Login</button>
//       </form>
//     </div>
//   );
// };

// export default LoginPage;


import React, { useState } from 'react';
import { Music, KeyRound } from 'lucide-react';
import api from '../api/axios';
import { Link } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post('/login', {
        email,
        password,
      });

      console.log('Login success:', res.data);

      // Store the JWT token in localStorage
      localStorage.setItem('token', res.data.token);

      // Redirect user to home or dashboard page
      window.location.href = '/';
    } catch (err) {
      alert('Login error:', err.response?.data || err.message);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-indigo-800 flex items-center justify-center p-6">
      <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-2xl p-8 w-full max-w-md border border-white/20">
        <div className="text-center mb-8">
          <div className="inline-flex justify-center items-center mb-4">
            <Music className="text-amber-400 h-12 w-12" />
          </div>
          <h2 className="text-3xl font-bold text-amber-300">Melodic Access</h2>
          <p className="text-purple-200 mt-2">Enter your credentials to continue</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-amber-200 text-sm font-medium">Email</label>
            <div className="relative">
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-white/5 border border-purple-300/30 rounded-lg px-4 py-3 text-white placeholder-purple-200/50 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="block text-amber-200 text-sm font-medium">Password</label>
            <div className="relative">
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-white/5 border border-purple-300/30 rounded-lg px-4 py-3 text-white placeholder-purple-200/50 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
              />
              <KeyRound className="absolute right-3 top-3 h-5 w-5 text-purple-300/50" />
            </div>
          </div>
          
          <div className="pt-2">
            <button 
              type="submit"
              className="w-full bg-gradient-to-r from-amber-400 to-amber-500 text-purple-900 font-semibold py-3 px-4 rounded-lg shadow hover:from-amber-500 hover:to-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-purple-800 transition-all duration-300 flex items-center justify-center"
            >
              <Music className="h-5 w-5 mr-2" />
              Harmonize Login
            </button>
          </div>
        </form>
        <div className="text-center mt-6">
          <p className="text-sm text-purple-200">
            Don’t have an account?{' '}
            <Link to="/signup" className="text-amber-300 hover:underline font-semibold">
              Sign Up
            </Link>
          </p>
        </div>
        
      </div>
    </div>
  );
};

export default LoginPage;
