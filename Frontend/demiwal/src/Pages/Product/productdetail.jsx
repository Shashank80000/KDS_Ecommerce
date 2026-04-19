import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useParams } from "react-router";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const loadProduct = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const res = await api.get("/products/");
      const products = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.products)
          ? res.data.products
          : [];

      const p = products.find((item) => item._id === id);
      setProduct(p || null);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Unable to load product");
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProduct();
  }, [id]);

  const addToCart = async () => {
    if (!product) {
      return;
    }

    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("Please login first");
      return;
    }

    try {
      const res = await api.post("/cart/add", {
        userId,
        productId: product._id,
      });

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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (errorMessage) {
    return <div className="p-6 text-red-600">{errorMessage}</div>;
  }

  if (!product) {
    return <div className="p-6">Product not found.</div>;
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <img
        src={product.image}
        alt={product.title}
        className="w-full h-40 object-contain bg-white rounded"
      />
      <h1 className="text-2xl font-bold mt-4">{product.title}</h1>
      <p className="text-gray-700 mt-2">{product.description}</p>
      <p className="text-xl font-semibold mt-4">${product.price}</p>

      <button
        onClick={addToCart}
        className="mt-6 w-full md:w-1/2 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
      >
        Add to Cart
      </button>
    </div>
  );
}
