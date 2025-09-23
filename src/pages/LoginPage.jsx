import {useState, useContext} from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import API from "../api/axios";

export default function LoginPage() {
    const [form, setForm] = useState({ email: "", password: "" });
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await API.post("/auth/login", form);
            login(data.user, data.token);
            navigate("/");
        } catch (error) {
            alert(error.response?.data?.message || "Login failed");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black px-4">
            <div className="bg-zinc-900 text-white p-8 rounded-xl shadow-lg w-full max-w-md">
                <h2 className="text-3xl font-bold text-center mb-6">Login</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Email</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your college email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            value={form.password}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 transition text-white py-2 px-4 rounded-lg font-semibold"
                    >
                        Login
                    </button>
                </form>

                {/* Register link */}
                <p className="text-center text-gray-400 mt-6">
                    Don’t have an account?{" "}
                    <a
                        href="/register"
                        className="text-blue-400 font-medium hover:underline"
                    >
                        Register
                    </a>
                </p>
            </div>
        </div>
    )
}