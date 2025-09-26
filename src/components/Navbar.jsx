import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
    const { user, logout } = useContext(AuthContext);
    const [search, setSearch] = useState("");
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (search.trim()) {
            navigate(`/search?q=${search}`);
        }
    };

    return (
        <nav className="bg-white border-b shadow-md px-6 py-4 flex justify-between items-center">
            {/* Logo */}
            <div
                className="text-2xl font-bold text-purple-700 cursor-pointer"
                onClick={() => navigate("/")}
            >
                🎓 College Blogs
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex-1 mx-6">
                <input
                    type="text"
                    placeholder="Search blogs..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
            </form>

            {/* Right Section */}
            <div className="flex items-center gap-4">
                {user ? (
                    <>
                        {/* Write Blog */}
                        <button
                            onClick={() => navigate("/create")}
                            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
                        >
                            ✍️ Write Blog
                        </button>

                        {/* Profile Dropdown */}
                        <div className="relative group">
                            <button className="bg-purple-200 rounded-full w-10 h-10 flex items-center justify-center font-bold text-purple-700">
                                {user.username?.[0]?.toUpperCase()}
                            </button>
                            <div className="absolute right-0 hidden group-hover:block mt-2 bg-white shadow-md rounded-lg w-40">
                                <button
                                    onClick={() => navigate("/profile")}
                                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                >
                                    Profile
                                </button>
                                <button
                                    onClick={logout}
                                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex gap-3">
                        <button
                            onClick={() => navigate("/login")}
                            className="px-4 py-2 text-purple-700 border border-purple-700 rounded-lg hover:bg-purple-50"
                        >
                            Login
                        </button>
                        <button
                            onClick={() => navigate("/register")}
                            className="px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800"
                        >
                            Register
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
}
