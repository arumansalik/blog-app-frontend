import { Link } from "react-router-dom";
import { Search, PenSquare, User } from "lucide-react";
import { useEffect, useState, useContext } from "react";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";

import Trending from "../components/Trending";
import Leaderboard from "../components/Leaderboard";

export default function Dashboard() {
    const [posts, setPosts] = useState([]);
    const [visiblePosts, setVisiblePosts] = useState(5);
    const [loading, setLoading] = useState(true);

    const { user } = useContext(AuthContext);

    // Mobile detection
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    useEffect(() => {
        const resize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener("resize", resize);
        return () => window.removeEventListener("resize", resize);
    }, []);

    useEffect(() => {
        async function loadPosts() {
            try {
                const res = await API.get("/posts");
                setPosts(res.data.posts || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        loadPosts();
    }, []);

    const loadMore = () => setVisiblePosts(prev => prev + 5);

    return (
        <div className="min-h-screen bg-[#0A0A0F] text-gray-100 font-poppins">

            {/* NAVBAR */}
            <header className="backdrop-blur-md bg-[#0E0E14]/70 border-b border-gray-800 px-6 md:px-10 py-4 flex justify-between items-center sticky top-0 z-50 shadow-lg">
                <Link to="/" className="text-2xl font-bold">
                    College<span className="text-indigo-500">Blog</span>
                </Link>

                <div className="hidden md:flex items-center bg-[#191921] px-4 py-2 rounded-xl w-96 border border-gray-700 hover:border-indigo-500">
                    <Search size={18} className="text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search articles..."
                        className="bg-transparent outline-none ml-3 text-sm text-gray-300 w-full"
                    />
                </div>

                <div className="flex items-center gap-6">
                    <Link
                        to={user ? "/create" : "/login"}
                        className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 text-sm"
                    >
                        <PenSquare size={16} /> Write
                    </Link>

                    <Link
                        to={user ? `/profile/${user.username}` : "/login"}
                        className="flex items-center gap-2 text-gray-300 hover:text-white text-sm"
                    >
                        <User size={16} /> Profile
                    </Link>
                </div>
            </header>

            {/* HERO */}
            <section className="px-6 md:px-12 lg:px-20 py-20 text-center bg-gradient-to-br from-[#10101A] via-[#0C0C14] to-[#090911]">
                <h1 className="text-4xl md:text-5xl font-bold">
                    Discover & Share <span className="text-indigo-500">College Stories</span>
                </h1>

                <p className="text-gray-400 max-w-xl mx-auto mt-4">
                    Explore blogs written by your college students.
                </p>

                <Link
                    to={user ? "/create" : "/login"}
                    className="inline-block mt-8 px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-lg hover:scale-105 transition"
                >
                    ✍️ Start Writing
                </Link>
            </section>

            {/* CONTENT */}
            <main className="max-w-7xl mx-auto px-6 md:px-12 py-14 grid grid-cols-1 lg:grid-cols-3 gap-10">

                {/* POSTS SECTION */}
                <div className="lg:col-span-2 space-y-10">
                    {loading ? (
                        <p className="text-gray-400">Loading posts...</p>
                    ) : (
                        <>
                            {(isMobile ? posts.slice(0, visiblePosts) : posts).map(post => (
                                <PostCard key={post._id} post={post} />
                            ))}

                            {/* Mobile Load More */}
                            {isMobile && visiblePosts < posts.length && (
                                <button
                                    onClick={loadMore}
                                    className="w-full py-3 mt-4 rounded-xl
                  backdrop-blur-md bg-white/10 border border-white/20
                  hover:bg-white/20 transition text-white font-semibold shadow-lg"
                                >
                                    Load More
                                </button>
                            )}
                        </>
                    )}
                </div>

                {/* SIDEBAR ON DESKTOP */}
                {!isMobile && (
                    <aside className="space-y-6">
                        <Trending limit={5} />
                        <Leaderboard />
                    </aside>
                )}
            </main>

            {/* SHOW TRENDING + LEADERBOARD ON MOBILE BELOW EVERYTHING */}
            {isMobile && (
                <div className="px-6 py-10 space-y-8">
                    <Trending limit={5} />
                    <Leaderboard />
                </div>
            )}
        </div>
    );
}


/* POST CARD */
function PostCard({ post }) {
    return (
        <Link
            to={`/posts/${post._id}`}
            className="block bg-[#131319] p-7 rounded-2xl border border-gray-800 hover:border-indigo-600 transition"
        >
            <div className="flex items-center gap-3 mb-3">
                <img
                    src={post.author?.avatar || `https://i.pravatar.cc/50?u=${post.author?._id}`}
                    className="w-10 h-10 rounded-full border border-gray-700"
                />
                <div>
                    <h4 className="font-semibold text-sm">{post.author?.username}</h4>
                    <p className="text-xs text-gray-500">
                        {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                </div>
            </div>

            <h2 className="text-lg font-semibold">{post.title}</h2>

            <p className="text-gray-400 text-sm mt-2 line-clamp-3">
                {post.content.replace(/[#>*_`]/g, "").slice(0, 180)}...
            </p>

            <p className="text-indigo-400 mt-4">Read More →</p>
        </Link>
    );
}
