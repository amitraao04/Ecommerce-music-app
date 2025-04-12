// src/pages/HomePage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
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
  }, [search, category, page]);

  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-4">Shop Products</h1>

      {/* Search & Filter */}
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Search..."
          className="p-2 rounded text-black"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="p-2 rounded text-black"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="electronics">Electronics</option>
          <option value="fashion">Fashion</option>
          <option value="books">Books</option>
          {/* Add your actual categories here */}
        </select>
      </div>

      {/* Product Grid */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {products.map((product) => (
          <div key={product._id} className="bg-white/10 p-4 rounded-lg shadow">
            <img
              src={`http://localhost:5000/images/${product.image}`}
              alt={product.name}
              className="w-full h-40 object-cover mb-2 rounded"
            />
            <h2 className="text-xl font-semibold text-amber-300">{product.name}</h2>
            <p className="text-purple-100">{product.description}</p>
            <p className="text-amber-200 mt-2 font-bold">₹{product.price}</p>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="mt-6 flex justify-center gap-2">
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            className={`px-3 py-1 rounded ${page === i + 1 ? 'bg-amber-400' : 'bg-white/10'}`}
            onClick={() => setPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
