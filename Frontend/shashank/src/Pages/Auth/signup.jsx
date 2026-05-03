    import React from 'react'
    import { useState } from 'react'
    import { useNavigate } from 'react-router';
    import api from '../../api/axios'
    
    function Signup() {
      const navigate = useNavigate();
      const [form, setForm] = useState({
        name: "",
        email: "",
        password: ""
      })
      const [msg, setmsg] = useState("");
      const [msgType, setMsgType] = useState("");

    
      const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
      }



    const handleSubmit = async (e)=>{
        e.preventDefault();

        try{
          const response = await api.post('/auth/signup',form);
          setmsg(response.data.message);
          setMsgType("success");
          setForm({ name: "", email: "", password: "" });

        }catch(e){
          setmsg(e.response?.data?.message || "An error occurred");
          setMsgType("error");
        }
    
    }

    return (
      <div className="min-h-screen bg-slate-100 p-4 flex items-center justify-center">
        <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
          <div className="bg-indigo-600 text-white p-8 flex flex-col justify-between">
            <div>
              
            <h3>Demiwal</h3>

              <div className="mt-16">
                <h1 className="text-3xl font-bold">Get Started</h1>
                <p className="mt-3 text-indigo-100">Already have an account?</p>
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="mt-4 rounded-md bg-white text-indigo-600 px-4 py-2 text-sm font-semibold hover:bg-indigo-50"
                >
                  Log in

                </button>
              </div>
            </div>

          
          </div>

          <div className="p-8 md:p-10">
            <form onSubmit={handleSubmit} className="space-y-5">
              <h2 className="text-2xl font-bold text-slate-800">Sign Up</h2>

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  required
                  className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
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
                  type="password"
                  id="password"
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
                Create Account
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
    export default Signup