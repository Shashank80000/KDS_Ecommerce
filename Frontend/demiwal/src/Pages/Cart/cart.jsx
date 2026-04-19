import { useState, useEffect } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router";


export default function Cart() {
    const userId = localStorage.getItem("userId");
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    //Load cart data
    const loadCart = async () => {
        try {
            setLoading(true);
            setError("");

            if (!userId) {
                setCart({ items: [] });
                return;
            }

            const res = await api.get(`/cart/${userId}`);
            setCart(res.data?.cart || { items: [] });
        } catch (e) {
            if (e?.response?.status === 404) {
                setCart({ items: [] });
            } else {
                setError(e?.response?.data?.message || "Unable to load cart");
                setCart({ items: [] });
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCart();
    }, []);

    const removeItem = async (productId) => {
        await api.post(`/cart/remove`, { userId, productId });
        loadCart();
        window.dispatchEvent(new Event("cartUpdated"));
    };

    //Update item quantity
    const updateQty = async (productId, quantity) => {
        if (quantity === 0) {
            await removeItem(productId);
            return;
        }

        await api.post(`/cart/update`, { userId, productId, quantity });
        loadCart();
        window.dispatchEvent(new Event("cartUpdated"));
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div className="p-6 text-red-600">{error}</div>;
    }

    if (!userId) {
        return <div className="p-6">Please login to view your cart.</div>;
    }

    const items = cart?.items || [];
    const safeItems = items.map((item) => {
        const product =
            item?.productId && typeof item.productId === "object"
                ? item.productId
                : null;

        return {
            ...item,
            productRefId:
                product?._id ||
                (typeof item?.productId === "string" ? item.productId : null),
            productTitle: product?.title || "Product unavailable",
            productImage: product?.image || "",
            productPrice: Number(product?.price || 0),
        };
    });

    const total = safeItems.reduce(
        (sum, item) => sum + item.productPrice * Number(item.quantity || 0),
        0
    );

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

            {safeItems.length === 0 ? (
                <div>Your cart is empty.</div>
            ) : (
                <div className="space-y-4">
                    {safeItems.map((item, index) => (
                        <div
                            key={item.productRefId || index}
                            className="flex items-center justify-between p-4 border rounded"
                        >
                            <div className="flex items-center gap-4">
                                {item.productImage ? (
                                    <img
                                        src={item.productImage}
                                        alt={item.productTitle}
                                        className="w-16 h-16 object-cover rounded"
                                    />
                                ) : (
                                    <div className="w-16 h-16 rounded bg-gray-200 flex items-center justify-center text-xs text-gray-600">
                                        No image
                                    </div>
                                )}
                                <div>
                                    <h2 className="text-lg font-semibold">
                                        {item.productTitle}
                                    </h2>
                                    <p className="text-gray-600">
                                        ${item.productPrice.toFixed(2)}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() =>
                                        updateQty(item.productRefId, item.quantity - 1)
                                    }
                                    disabled={!item.productRefId}
                                    className="px-2 py-1 bg-gray-200 rounded"
                                >
                                    -
                                </button>
                                <span>{item.quantity}</span>
                                <button
                                    onClick={() =>
                                        updateQty(item.productRefId, item.quantity + 1)
                                    }
                                    disabled={!item.productRefId}
                                    className="px-2 py-1 bg-gray-200 rounded"
                                >
                                    +
                                </button>
                            </div>
                            <div>
                                <p className="font-semibold">
                                    ${(item.productPrice * item.quantity).toFixed(2)}
                                </p>
                            </div>
                            <button
                                onClick={() => removeItem(item.productRefId)}
                                disabled={!item.productRefId}
                                className="text-red-500"
                            >
                                Remove
                            </button>
                        </div>
                    ))}

                    <div className="text-right mt-4">
                        <h2 className="text-xl font-bold">Total: ${total.toFixed(2)}</h2>
                    </div>
                    <button onClick={() => navigate("/checkout-address")} className="w-full bg-blue-500 text-white p-2 rounded">
                        Proceed to Checkout
                    </button>
                </div>
            )}
        </div>
    );
}
