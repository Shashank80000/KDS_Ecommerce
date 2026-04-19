import React from 'react'
import { useState } from 'react'
import { useNavigate} from 'react-router';
import api from '../../api/axios'


function Login() {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [msg, setmsg] = useState("");
  const [msgType, setMsgType] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setmsg("");
    setMsgType("");

    try {
      const res = await api.post("/auth/login", form);

      const token = res?.data?.token;
      const resolvedUserId =
        res?.data?.userId ||
        res?.data?.user?.userId ||
        res?.data?.user?.userID;

      if (!token || !resolvedUserId) {
        setmsg("Login response is incomplete. Please try again.");
        setMsgType("error");
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("userId", resolvedUserId);
      if (res?.data?.user?.name) {
        localStorage.setItem("name", res.data.user.name);
      }

      setmsg(res?.data?.message || "Login successful");
      setMsgType("success");
      
      setTimeout(() => {
        navigate("/");
      }, 1000);

    } catch (error) {
      setmsg(error?.response?.data?.message || "Login failed");
      setMsgType("error");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 flex items-center justify-center">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        <div className="bg-indigo-600 text-white p-8 flex flex-col justify-between">
          <div>
            <h3>Demiwal</h3>

            <div className="mt-16">
              <h1 className="text-3xl font-bold">Welcome Back</h1>
              <p className="mt-3 text-indigo-100">New here? Create your account first.</p>
              <button
                type="button"
                onClick={() => navigate('/signup')}
                className="mt-4 rounded-md bg-white text-indigo-600 px-4 py-2 text-sm font-semibold hover:bg-indigo-50"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>

        <div className="p-8 md:p-10">
          <form onSubmit={handleSubmit} className="space-y-5">
            <h2 className="text-2xl font-bold text-slate-800">Login</h2>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-md bg-indigo-600 text-white py-2.5 font-semibold hover:bg-indigo-700 transition"
            >
              Log In
            </button>

            {msg && (
              <p
                className={`text-sm ${
                  msgType === "success" ? "text-emerald-700" : "text-rose-700"
                }`}
              >
                {msg}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login