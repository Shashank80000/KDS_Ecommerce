import { useState, useEffect } from "react";
import api from "../../api/axios.js";
import { useNavigate } from "react-router";

export default function Checkout() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load cart + addresses
  useEffect(() => {
    const loadCheckoutData = async () => {
      try {
        setLoading(true);
        setError("");

        if (!userId) {
          setCart({ items: [] });
          setAddresses([]);
          setSelectedAddress(null);
          return;
        }

        const [cartResponse, addressResponse] = await Promise.all([
          api.get(`/cart/${userId}`),
          api.get(`/address/${userId}`),
        ]);

        setCart(cartResponse.data?.cart || { items: [] });

        const addressList = Array.isArray(addressResponse.data)
          ? addressResponse.data
          : [];
        setAddresses(addressList);
        setSelectedAddress(addressList[0] || null);
      } catch (fetchError) {
        setError(fetchError?.response?.data?.message || "Unable to load checkout data");
        setCart({ items: [] });
        setAddresses([]);
        setSelectedAddress(null);
      } finally {
        setLoading(false);
      }
    };

    loadCheckoutData();
  }, [userId]);

  if (loading) return <div className="p-6">Loading...</div>;

  if (error) return <div className="p-6 text-red-600">{error}</div>;

  if (!userId) return <div className="p-6">Please login to continue checkout.</div>;

  const items = Array.isArray(cart.items) ? cart.items : [];
  const safeItems = items.map((item) => ({
    ...item,
    productPrice:
      item?.productId && typeof item.productId === "object"
        ? Number(item.productId.price || 0)
        : 0,
    productTitle:
      item?.productId && typeof item.productId === "object"
        ? item.productId.title || "Product"
        : "Product",
  }));

  const total = safeItems.reduce(
    (sum, item) => sum + item.productPrice * Number(item.quantity || 0),
    0
  );

  // ✅ PLACE ORDER + CLEAR CART
  const placeOrder = async () => {
    if (!selectedAddress) {
      alert("Please select address");
      return;
    }

    try {
      const res = await api.post("/orders/place", {
        userId,
        address: selectedAddress,
      });

      if (res?.data?.orderId) {
        navigate(`/order-success/${res.data.orderId}`, { replace: true });
        return;
      }

      navigate("/order-success", { replace: true });
    } catch (placeOrderError) {
      alert(placeOrderError?.response?.data?.message || "Unable to place order");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>

      {/* Address Selection */}
      <h2 className="font-semibold mb-2">Select Delivery Address</h2>

      <div className="space-y-3">
        {addresses.map((addr) => (
          <label
            key={addr._id}
            className="block border p-3 rounded cursor-pointer"
          >
            <input
              type="radio"
              name="address"
              checked={selectedAddress?._id === addr._id}
              onChange={() => setSelectedAddress(addr)}
              className="mr-2"
            />
            <strong>{addr.fullName}</strong>
            <p className="text-sm">
              {addr.adressLine}, {addr.city}, {addr.state} - {addr.pincode}
            </p>
            <p className="text-sm">📞 {addr.phone}</p>
          </label>
        ))}
      </div>

      {/* Order Summary */}
      <h2 className="font-semibold mt-6 mb-2">Order Summary</h2>
      <p className="text-lg font-bold">Total: ₹{total}</p>

      <button
        onClick={placeOrder}
        className="mt-6 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
      >
        Place Order (COD)
      </button>
    </div>
  );
}
