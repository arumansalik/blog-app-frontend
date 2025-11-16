import { Link } from "react-router-dom";
import { Search, PenSquare, User, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import API from "../api/axios";

function formatDate(date) {
    return new Date(date).toLocaleDateString();
}

export default function Dashboard() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadPosts() {
            try {
                const res = await API.get("/posts");
                console.log("Fetched Posts:", res.data.posts);
                setPosts(res.data.posts || []);
            } catch (err) {
                console.error("Error fetching posts:", err);
            } finally {
                setLoading(false);
            }
        }

        loadPosts();
    }, []);

    return (
        <div className="min-h-screen bg-[#0A0A0F] text-gray-100 font-poppins">

            {/* NAVBAR */}
            <header className="backdrop-blur-md bg-[#0E0E14]/70 border-b border-gray-800 px-10 py-4 flex justify-between items-center sticky top-0 z-50 shadow-lg">
                <Link to="/" className="text-2xl font-bold hover:text-indigo-400 transition">
                    College<span className="text-indigo-500">Blog</span>
                </Link>

                <div className="hidden md:flex items-center bg-[#191921] px-4 py-2 rounded-xl w-96 border border-gray-700 hover:border-indigo-500 transition-all">
                    <Search size={18} className="text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search articles..."
                        className="bg-transparent outline-none ml-3 text-sm text-gray-300 w-full"
                    />
                </div>

                <div className="flex items-center gap-6">
                    <Link to="/create" className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-medium text-sm">
                        <PenSquare size={16} /> Write
                    </Link>
                    <Link to="/profile" className="flex items-center gap-2 text-gray-300 hover:text-white text-sm">
                        <User size={16} /> Profile
                    </Link>
                </div>
            </header>

            {/* HERO */}
            <section className="px-8 md:px-12 lg:px-20 py-20 bg-gradient-to-br from-[#10101A] via-[#0C0C14] to-[#090911] text-center">
                <h1 className="text-4xl md:text-5xl font-bold">
                    Discover & Share <span className="text-indigo-500">College Stories</span>
                </h1>
                <p className="text-gray-400 max-w-xl mx-auto mt-4">
                    Explore blogs written by your college students.
                </p>
                <Link
                    to="/create"
                    className="inline-block mt-8 px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-lg hover:scale-105 transition"
                >
                    ✍️ Start Writing
                </Link>
            </section>

            {/* CONTENT */}
            <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10 px-8 md:px-12 py-14">

                {/* LEFT: POSTS */}
                <div className="lg:col-span-2 space-y-10">
                    {loading ? (
                        <p className="text-gray-500 animate-pulse">Loading posts...</p>
                    ) : posts.length === 0 ? (
                        <p className="text-gray-500">No blogs yet. Create one!</p>
                    ) : (
                        posts.map((post) => (
                            <div
                                key={post._id}
                                className="bg-[#131319] border border-gray-800 p-8 rounded-2xl hover:border-indigo-600 hover:shadow-indigo-500/10 transition-all duration-200"
                            >
                                {/* AUTHOR */}
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={
                                                post.author?.avatar ||
                                                `https://i.pravatar.cc/50?u=${post.author?._id}`
                                            }
                                            className="w-10 h-10 rounded-full border border-gray-700"
                                        />
                                        <div>
                                            <h4 className="text-sm font-semibold text-white">
                                                {post.author?.username}
                                            </h4>
                                            <p className="text-xs text-gray-500">
                                                {formatDate(post.createdAt)}
                                            </p>
                                        </div>
                                    </div>

                                    {post.tags?.length > 0 && (
                                        <span className="text-[12px] px-3 py-1 bg-[#1B1B24] border border-gray-700 rounded-lg text-gray-400">
                                            #{post.tags.join(" #")}
                                        </span>
                                    )}
                                </div>

                                {/* TITLE */}
                                <h2 className="text-xl font-semibold mb-3 hover:text-indigo-400 transition">
                                    {post.title}
                                </h2>

                                {/* SNIPPET */}
                                <p className="text-gray-400 text-sm mb-5 leading-relaxed line-clamp-3">
                                    {post.content?.replace(/[#>*_`]/g, "").slice(0, 180)}...
                                </p>

                                {/* ACTION */}
                                <div className="flex justify-between items-center text-sm">
                                    <Link
                                        to={`/posts/${post._id}`}
                                        className="text-indigo-400 hover:text-indigo-300 font-medium"
                                    >
                                        Read More →
                                    </Link>
                                    <span className="text-gray-500">4 min read</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* RIGHT SIDEBAR — You can add trending, tags, writers later */}
                <aside>
                    <div className="text-gray-500">More features coming soon…</div>
                </aside>
            </main>
        </div>
    );
}
