import { useEffect, useState } from "react";
import api from "../../api/axios";

import { Link } from "react-router";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [loadError, setLoadError] = useState("");

  const loadProducts = async () => {
    try {
      const res = await api.get(
        `/products?search=${search}&category=${category}`
      );

      const productList = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.products)
          ? res.data.products
          : [];

      setProducts(productList);
      setLoadError("");
    } catch (error) {
      setProducts([]);
      setLoadError(
        error?.response?.data?.message ||
        "Unable to load products right now. Please try again."
      );
      console.error("Failed to load products", error);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [search, category]);

 const addToCart = async (productId) => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("Please log in to add items to your cart.");
      return;
    }

    try {
      const res = await api.post(`/cart/add`, { userId, productId });
      const itemCount = (res.data?.cart?.items || []).reduce(
        (sum, item) => sum + Number(item.quantity || 0),
        0
      );

      localStorage.setItem("cartCount", String(itemCount));
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      alert(error?.response?.data?.message || "Unable to add item to cart");
    }
  };

  return (
    <div className="p-6">
      {/* Search */}
      <div className="mb-6 flex flex-col md:flex-row gap-4 items-center bg-white p-4 rounded-lg shadow-sm">
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/2 border border-gray-900 px-4 py-2 rounded-md 
               focus:outline-none focus:ring-2 focus:ring-blue-700"
        />

        {/* Category Filter */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full md:w-1/4 border border-gray-300 px-4 py-2 rounded-md 
               focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Categories</option>
          <option value="electronics">Electronics</option>
          <option value="women">Women</option>
          <option value="men">Men</option>
        </select>
      </div>

      {/* Products Grid */}
      {loadError && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {loadError}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {products.map((product) => (
          <div
            key={product._id}
            className="border p-3 rounded shadow hover:shadow-lg transition"
          >
            <Link to={`/product/${product._id}`}>
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-40 object-contain bg-white rounded"
              />
              <h2 className="mt-2 font-semibold text-lg">{product.title}</h2>
            </Link>

            {/* Price + Add to Cart (same line) */}
            <div className="mt-2 flex items-center justify-between">
              <p className="text-gray-700 font-semibold">${product.price}</p>

              <button
                onClick={() => addToCart(product._id)}
                className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition"
              >
                Add to cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
