import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AuthContext } from "../context/AuthContext";
import API from "../api/axios";

export default function RegisterPage() {
    const [form, setForm] = useState({ username: "", email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState("");

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data } = await API.post("/auth/register", form);
            login(data.user, data.token);
            setMsg("Account created successfully! 🎉 Redirecting...");
            setTimeout(() => navigate("/"), 1000);
        } catch (error) {
            setMsg(error.response?.data?.message || "Registration failed");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-[#0A0A0F]">
            {/* LEFT SIDE — ANIMATED HERO */}
            <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-gradient-to-br from-indigo-700 via-purple-800 to-black items-center justify-center text-white">
                {/* Floating blurred shapes */}
                <div className="absolute w-72 h-72 bg-purple-600 opacity-30 blur-3xl rounded-full -top-10 -left-10 animate-pulse"></div>
                <div className="absolute w-64 h-64 bg-indigo-600 opacity-30 blur-3xl rounded-full bottom-10 right-10 animate-ping"></div>

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="relative z-10 p-10 text-center"
                >
                    <h1 className="text-5xl font-bold mb-6 leading-tight">
                        Welcome to <span className="text-indigo-300">Campus Blog</span>
                    </h1>

                    <p className="text-gray-200 text-lg max-w-md mx-auto">
                        Join a community of students, share your ideas, write blogs,
                        and explore content posted by your college mates.
                    </p>
                </motion.div>
            </div>

            {/* RIGHT SIDE — FORM */}
            <div className="w-full lg:w-1/2 bg-[#111118] flex justify-center items-center px-6">
                <motion.div
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full max-w-md bg-[#1A1A23]/70 backdrop-blur-xl shadow-2xl border border-gray-700/40 rounded-2xl p-10"
                >
                    <h2 className="text-3xl font-bold text-white text-center mb-2">
                        Create Account
                    </h2>
                    <p className="text-gray-400 text-center mb-8">
                        Join the platform and start sharing your stories.
                    </p>

                    {msg && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mb-4 p-3 text-sm text-center rounded-lg bg-indigo-600 text-white"
                        >
                            {msg}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Username */}
                        <div>
                            <label className="text-gray-300 text-sm">Username</label>
                            <input
                                type="text"
                                name="username"
                                value={form.username}
                                onChange={handleChange}
                                className="w-full px-4 py-3 mt-1 rounded-xl bg-[#22222D] border border-gray-700 text-white focus:border-indigo-500 outline-none transition"
                                placeholder="john_doe"
                                required
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="text-gray-300 text-sm">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                className="w-full px-4 py-3 mt-1 rounded-xl bg-[#22222D] border border-gray-700 text-white focus:border-indigo-500 outline-none transition"
                                placeholder="you@example.com"
                                required
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="text-gray-300 text-sm">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                className="w-full px-4 py-3 mt-1 rounded-xl bg-[#22222D] border border-gray-700 text-white focus:border-indigo-500 outline-none transition"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        {/* Sign Up Button */}
                        <motion.button
                            whileTap={{ scale: 0.94 }}
                            whileHover={{ scale: 1.02 }}
                            disabled={loading}
                            type="submit"
                            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition text-lg shadow-lg"
                        >
                            {loading ? "Creating Account..." : "Sign Up"}
                        </motion.button>
                    </form>

                    {/* Login Link */}
                    <p className="text-gray-400 text-center text-sm mt-6">
                        Already have an account?{" "}
                        <Link to="/login" className="text-indigo-400 hover:text-indigo-300">
                            Login
                        </Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
