import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import API from "../api/axios"

export default function RegisterPage() {
    const [form, setForm] = useState({ username: "", email: "", password: "" });
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await API.post("/auth/register", form);
            login(data.user, data.token);
            navigate("/");
        } catch (error) {
            alert(error.response?.data?.message || "Registration failed");
        }
    };

    return (
        <div className="flex min-h-screen">
            <div className="w-1/2 bg-gradient-to-r from-purple-900 to-black flex flex-col justify-center items-center text-white">
                <h1 className="text-3xl font-bold mb-4">Join the College Blog Community</h1>
                <p className="text-gray-300 mb-8">
                    Share ideas, read student stories, and stay updated with campus life.
                </p>

            </div>

            {/* Right Section */}
            <div className="w-1/2 flex justify-center items-center bg-white">
                <div className="w-96">
                    <h2 className="text-2xl font-bold mb-4">Sign Up Account</h2>
                    <h4 className="mb-4">Create an account to post articles, leave comments, and follow topics you care about.</h4>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            value={form.username}
                            onChange={handleChange}
                            className="w-full border p-2 rounded-lg"
                            required
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={form.email}
                            onChange={handleChange}
                            className="w-full border p-2 rounded-lg"
                            required
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={form.password}
                            onChange={handleChange}
                            className="w-full border p-2 rounded-lg"
                            required
                        />
                        <button
                            type="submit"
                            className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800"
                        >
                            Sign Up
                        </button>
                    </form>

                    <p className="text-sm mt-4 text-gray-600">
                        Already have an account?{" "}
                        <Link to="/login" className="text-blue-600">
                            Log in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}