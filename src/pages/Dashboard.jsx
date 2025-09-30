import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Home, FileText, PlusCircle, User } from "lucide-react";

export default function DashboardLayout({ children }) {
    const { user } = useContext(AuthContext);

    return (
        <div className="flex h-screen bg-zinc-950 text-white">
            {/* Sidebar */}
            <aside className="w-64 bg-black/90 border-r border-gray-800 p-6 hidden md:flex flex-col">
                {/* User Info */}
                <div className="mb-10">
                    <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-xl font-bold">
                        {user?.username?.[0].toUpperCase()}
                    </div>
                    <p className="mt-2 font-semibold">{user?.username}</p>
                    <p className="text-sm text-gray-400">{user?.email}</p>
                </div>

                {/* Navigation Links */}
                <nav className="flex flex-col gap-4 text-gray-300">
                    <a href="/" className="flex items-center gap-2 hover:text-white">
                        <Home size={18} /> Home
                    </a>
                    <a href="/blogs" className="flex items-center gap-2 hover:text-white">
                        <FileText size={18} /> Blogs
                    </a>
                    <a href="/create" className="flex items-center gap-2 hover:text-white">
                        <PlusCircle size={18} /> Create Blog
                    </a>
                    <a href="/profile" className="flex items-center gap-2 hover:text-white">
                        <User size={18} /> Profile
                    </a>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
