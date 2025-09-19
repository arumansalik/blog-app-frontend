import {useState, useEffect, useContext} from "react";
import API from "../api/axios";
import { AuthContext} from "../context/AuthContext";
import { useNavigate} from "react-router-dom";

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
            const {data} = await API.post("/auth/register", form);
            login(data.user, data.token);
            navigate("/");
        } catch (error) {
            alert(error.response?.data?.message || "Registration failed");
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-80">
                <h2 className="text-2xl mb-4">Register</h2>
                <input type="text" name="username" placeholder="Username"
                       value={form.username} onChange={handleChange}
                       className="w-full mb-3 p-2 border rounded"/>
                <input type="email" name="email" placeholder="Email"
                       value={form.email} onChange={handleChange}
                       className="w-full mb-3 p-2 border rounded"/>
                <input type="password" name="password" placeholder="Password"
                       value={form.password} onChange={handleChange}
                       className="w-full mb-3 p-2 border rounded"/>
                <button type="submit"
                        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                    Register
                </button>
            </form>
        </div>
    )
}