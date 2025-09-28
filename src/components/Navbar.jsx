import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Search, PlusCircle, Home, User } from "lucide-react";

export default function Navbar() {
    const { user, logout } = useContext(AuthContext);

    return (
        <nav className="bg-black/90 backdrop-blur-md text-white px-6 py-3 flex justify-between items-center shadow-md border-b border-gray-800">
            {/* Left: Logo */}
            <h1 className="text-2xl font-bold tracking-wide text-white">
                Medium<span className="text-green-500">Blogs</span>
            </h1>

            {/* Center: Navigation + Search */}
            <div className="flex items-center gap-6">
                {/* Navigation Links */}
                <div className="hidden md:flex gap-6 text-gray-300">
                    <a href="/" className="hover:text-white flex items-center gap-1">
                        <Home size={18} /> Home
                    </a>
                    <a href="/blogs" className="hover:text-white flex items-center gap-1">
                        <Search size={18} /> Blogs
                    </a>
                    <a href="/create" className="hover:text-white flex items-center gap-1">
                        <PlusCircle size={18} /> Create
                    </a>
                    <a href="/profile" className="hover:text-white flex items-center gap-1">
                        <User size={18} /> Profile
                    </a>
                </div>

                {/* Search Bar */}
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search blogs..."
                        className="w-64 px-4 py-2 pl-10 rounded-full bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                    />
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                </div>
            </div>

            {/* Right: User & Logout */}
            <div className="flex items-center gap-4">
                {user ? (
                    <>
            <span className="text-gray-300 hidden sm:block">
              Hello, <span className="font-semibold">{user.username}</span>
            </span>
                        <button
                            onClick={logout}
                            className="bg-red-600 hover:bg-red-700 transition text-white py-1 px-4 rounded-lg font-semibold"
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <a
                        href="/login"
                        className="bg-green-600 hover:bg-green-700 transition text-white py-1 px-4 rounded-lg font-semibold"
                    >
                        Login
                    </a>
                )}
            </div>
        </nav>
    );
}
