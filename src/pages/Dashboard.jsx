import { Link } from "react-router-dom";
import { Search, PenSquare, User, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import API from "../api/axios";

function formatDate(createdAt) {
    const now = new Date();
    const date = new Date(createdAt);
    const diff = (now - date) / 1000;

    const days = Math.floor(diff / 86400);
    const hours = Math.floor((diff % 86400) / 3600);
    const mins = Math.floor((diff % 3600) / 60);

    if (days === 0 && hours === 0) return `${mins} minutes ago`;
    if (days === 0 && hours > 0) return `${hours} hours ago`;
    if (days > 0 && days < 30) return `${days} days ago`;

    return date.toLocaleDateString();
}

export default function Dashboard() {
    const [posts, setPosts] = useState([]);
    const [trending, setTrending] = useState([]);
    const [tags, setTags] = useState([]);
    const [writers, setWriters] = useState([]);

    useEffect(() => {
        async function loadData() {
            try {
                // Fetch everything in parallel
                const [postsRes, trendingRes, tagsRes, writersRes] = await Promise.all([
                    API.get("/posts"),
                    API.get("/posts/trending"),
                    API.get("/posts/tags"),
                    API.get("/posts/top-writers"),
                ]);

                console.log("Posts API:", postsRes.data);

                // Normalize data depending on backend format
                setPosts(postsRes.data.posts || postsRes.data.data || postsRes.data || []);
                setTrending(trendingRes.data.posts || trendingRes.data || []);
                setTags(tagsRes.data.tags || tagsRes.data || []);
                setWriters(writersRes.data.writers || writersRes.data || []);

            } catch (err) {
                console.error("Dashboard fetch error:", err);
            }
        }

        loadData();
    }, []);

    return (
        <div className="min-h-screen bg-[#0A0A0F] text-gray-100 font-poppins">

            {/* HEADER */}
            <header className="backdrop-blur-md bg-[#0E0E14]/70 border-b border-gray-800 px-10 py-4 flex justify-between items-center sticky top-0 z-50 shadow-lg">
                <Link to="/" className="text-2xl font-bold text-white tracking-tight hover:text-indigo-500 transition">
                    College<span className="text-indigo-500">Blog</span>
                </Link>

                <div className="hidden md:flex items-center bg-[#191921] px-4 py-2 rounded-xl w-96 border border-gray-700 hover:border-indigo-500 transition-all">
                    <Search size={18} className="text-gray-400" />
                    <input type="text" placeholder="Search articles..." className="bg-transparent outline-none ml-3 text-sm text-gray-300 w-full" />
                </div>

                <div className="flex items-center gap-6">
                    <Link to="/create" className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-medium text-sm transition">
                        <PenSquare size={16} /> Write
                    </Link>
                    <Link to="/profile" className="flex items-center gap-2 text-gray-300 hover:text-white transition text-sm">
                        <User size={16} /> Profile
                    </Link>
                </div>
            </header>

            {/* HERO */}
            <section className="px-8 md:px-12 lg:px-20 py-20 bg-gradient-to-br from-[#10101A] via-[#0C0C14] to-[#090911] text-center">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-snug">
                        Discover & Share <span className="text-indigo-500">College Stories</span>
                    </h1>
                    <p className="text-gray-400 max-w-2xl mx-auto mb-8 text-[15px]">
                        Read and write blogs from your college community.
                    </p>
                    <Link to="/create" className="inline-block px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 transition text-white font-semibold shadow-lg hover:scale-105 transform duration-200">
                        ✍️ Start Writing
                    </Link>
                </div>
            </section>

            {/* BLOG FEED */}
            <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10 px-8 md:px-12 py-14">

                {/* LEFT SIDE — BLOG POSTS */}
                <div className="lg:col-span-2 space-y-10">

                    {posts.length === 0 ? (
                        <p className="text-gray-500">No blogs yet. Create one!</p>
                    ) : (
                        posts.map((post) => (
                            <div key={post._id} className="bg-[#131319] border border-gray-800 p-8 rounded-2xl hover:border-indigo-600 hover:shadow-indigo-500/10 transition-all duration-200">

                                {/* Author */}
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <img src={`https://i.pravatar.cc/50?u=${post.author?._id}`} className="w-10 h-10 rounded-full border border-gray-700" />
                                        <div>
                                            <h4 className="text-sm font-semibold text-white">{post.author?.name || "Anonymous"}</h4>
                                            <p className="text-xs text-gray-500">{formatDate(post.createdAt)}</p>
                                        </div>
                                    </div>

                                    {post.tags?.length > 0 && (
                                        <span className="text-[12px] px-3 py-1 bg-[#1B1B24] border border-gray-700 rounded-lg text-gray-400">
                      #{post.tags.join(" #")}
                    </span>
                                    )}
                                </div>

                                {/* Title */}
                                <h2 className="text-xl font-semibold mb-3 text-white hover:text-indigo-400 transition">
                                    {post.title}
                                </h2>

                                {/* Summary */}
                                <p className="text-gray-400 text-sm mb-5 leading-relaxed line-clamp-3">
                                    {post.summary || "No summary provided..."}
                                </p>

                                {/* Bottom */}
                                <div className="flex justify-between items-center text-sm">
                                    <Link to={`/posts/${post._id}`} className="text-indigo-400 hover:text-indigo-300 font-medium">
                                        Read More →
                                    </Link>
                                    <span className="text-gray-500">{post.readTime || "4 min read"}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* RIGHT SIDEBAR */}
                <aside className="space-y-8">

                    {/* Trending */}
                    <div className="bg-[#131319] p-6 rounded-2xl border border-gray-800">
                        <h3 className="text-lg font-semibold mb-5 flex items-center gap-2">
                            <TrendingUp size={18} /> Trending Now
                        </h3>

                        {(trending.length === 0) ? (
                            <p className="text-gray-500 text-sm">No trending posts</p>
                        ) : (
                            <ul className="space-y-4 text-sm text-gray-400">
                                {trending.map((t) => (
                                    <li key={t._id} className="hover:text-indigo-400 cursor-pointer">🔥 {t.title}</li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Tags */}
                    <div className="bg-[#131319] p-6 rounded-2xl border border-gray-800">
                        <h3 className="text-lg font-semibold mb-5">Popular Tags</h3>

                        {tags.length === 0 ? (
                            <p className="text-gray-500 text-sm">No tags found</p>
                        ) : (
                            <div className="flex flex-wrap gap-2 text-sm">
                                {tags.map((tag) => (
                                    <span key={tag} className="px-3 py-1 bg-[#1B1B24] rounded-lg border border-gray-700 hover:border-indigo-500 hover:text-indigo-400 cursor-pointer">
                    #{tag}
                  </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Writers */}
                    <div className="bg-[#131319] p-6 rounded-2xl border border-gray-800">
                        <h3 className="text-lg font-semibold mb-5">Top Writers</h3>

                        {writers.length === 0 ? (
                            <p className="text-gray-500 text-sm">No writers yet</p>
                        ) : (
                            <div className="flex flex-col gap-4">
                                {writers.map((writer) => (
                                    <div key={writer._id} className="flex items-center gap-3">
                                        <img src={`https://i.pravatar.cc/40?u=${writer._id}`} className="w-9 h-9 rounded-full border border-gray-700" />
                                        <div>
                                            <h4 className="text-sm font-medium text-white">{writer.name}</h4>
                                            <p className="text-xs text-gray-500">{writer.posts} articles</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </aside>
            </main>
        </div>
    );
}
