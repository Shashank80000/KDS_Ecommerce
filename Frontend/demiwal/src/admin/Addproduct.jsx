import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router";

export default function AddProduct() {
    const [form , setForm] = useState({
        title: "",
        description: "",
        price: "",
        category: "",
        image: "",
        stock: "",
    });

    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState("");

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            setErrorMessage("");

            const payload = {
                ...form,
                price: Number(form.price),
                stock: form.stock === "" ? 0 : Number(form.stock),
                
            };

            await api.post("/products/add", payload);
            alert("Product added successfully!");
            navigate("/admin/products");
        }catch(err){
            setErrorMessage(err.response?.data?.message || err.response?.data?.error || "Error adding product");
            console.error("Error adding product:", err);
        }
    }

    return(
        <div className="max-w-lg mx-auto mt-10 bg-white p-6 shadow rounded">
            <h2 className="text-2xl font-bold mb-6">Add New Product</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
                {
                    Object.keys(form).map((key) => (
                        <input
                            key={key}
                            name = {key}
                            value={form[key]}
                            onChange={handleChange}
                            placeholder={key}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    ))
                }
                <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                    Add Product
                </button>
                {errorMessage && (
                    <p className="text-sm text-red-600">{errorMessage}</p>
                )}
            </form>
        </div>
    )
}