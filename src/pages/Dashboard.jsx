import { Link } from "react-router-dom";
import { Search, PenSquare, User, TrendingUp } from "lucide-react";

export default function MainPage() {
    return (
        <div className="min-h-screen bg-[#0B0B0F] text-gray-100 font-[Poppins]">
            {/* Navbar */}
            <header className="border-b border-gray-800 bg-[#0E0E14] px-10 py-4 flex justify-between items-center sticky top-0 z-40">
                <Link to="/" className="text-2xl font-bold text-white tracking-tight">
                    College<span className="text-indigo-500">Blog</span>
                </Link>

                {/* Search bar */}
                <div className="flex items-center bg-[#191921] px-4 py-2 rounded-xl w-80 border border-gray-700">
                    <Search size={18} className="text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search articles..."
                        className="bg-transparent outline-none ml-3 text-sm text-gray-300 w-full"
                    />
                </div>

                {/* Actions */}
                <div className="flex items-center gap-6">
                    <Link
                        to="/create"
                        className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-medium text-sm"
                    >
                        <PenSquare size={16} /> Write
                    </Link>
                    <Link
                        to="/profile"
                        className="flex items-center gap-2 text-gray-300 hover:text-white transition text-sm"
                    >
                        <User size={16} /> Profile
                    </Link>
                </div>
            </header>

            {/* Hero Section */}
            <section className="px-10 py-16 bg-gradient-to-br from-[#0E0E14] via-[#12121A] to-[#0B0B0F]">
                <div className="max-w-6xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-snug">
                        Discover & Share <span className="text-indigo-500">College Stories</span>
                    </h1>
                    <p className="text-gray-400 max-w-2xl mx-auto mb-8 text-[15px]">
                        Write, read, and explore thoughts from students, teachers, and alumni of your college.
                        Join the community — express, inspire, and connect.
                    </p>
                    <Link
                        to="/create"
                        className="inline-block px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 transition text-white font-medium"
                    >
                        Start Writing
                    </Link>
                </div>
            </section>

            {/* Main Blog Feed */}
            <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10 px-10 py-14">
                {/* Left / Center - Blog Feed */}
                <div className="lg:col-span-2 space-y-10">
                    {[1, 2, 3, 4, 5].map((_, i) => (
                        <div
                            key={i}
                            className="bg-[#131319] border border-gray-800 p-8 rounded-2xl hover:border-gray-600 hover:shadow-xl hover:scale-[1.01] transition-transform duration-200"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <img
                                        src={`https://i.pravatar.cc/50?img=${i + 2}`}
                                        alt="author"
                                        className="w-10 h-10 rounded-full border border-gray-700"
                                    />
                                    <div>
                                        <h4 className="text-sm font-semibold text-white">
                                            {["Aarav", "Sneha", "Vishnu", "Priya", "Manoj"][i]}
                                        </h4>
                                        <p className="text-xs text-gray-400">2 days ago</p>
                                    </div>
                                </div>
                                <span className="text-[12px] px-3 py-1 bg-[#191921] border border-gray-700 rounded-lg text-gray-400">
                  College Life
                </span>
                            </div>

                            <h2 className="text-xl font-semibold mb-3 text-white">
                                {[
                                    "How I Managed College & Side Projects",
                                    "Top 5 Tech Fests You Must Attend",
                                    "Balancing Studies with Internships",
                                    "How Our College’s Cultural Fest Changed Me",
                                    "Why Networking Matters in Campus"
                                ][i]}
                            </h2>
                            <p className="text-gray-400 text-sm mb-5 leading-relaxed">
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Nulla beatae doloremque
                                quasi laborum. Dolores adipisci alias, illum itaque nam asperiores saepe...
                            </p>

                            <div className="flex justify-between items-center text-sm">
                                <Link
                                    to={`/posts/${i}`}
                                    className="text-indigo-400 hover:text-indigo-300 transition font-medium"
                                >
                                    Read More →
                                </Link>
                                <span className="text-gray-500">4 min read</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Right - Sidebar */}
                <aside className="space-y-8">
                    {/* Trending */}
                    <div className="bg-[#131319] p-6 rounded-2xl border border-gray-800">
                        <h3 className="text-lg font-semibold mb-5 flex items-center gap-2">
                            <TrendingUp size={18} /> Trending Now
                        </h3>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li className="hover:text-indigo-400 transition cursor-pointer">
                                🔥 “Top 10 Coding Tips by Final Years”
                            </li>
                            <li className="hover:text-indigo-400 transition cursor-pointer">
                                💡 “How to Get Internships While Studying”
                            </li>
                            <li className="hover:text-indigo-400 transition cursor-pointer">
                                📚 “Engineering Diaries: Night Before Exams”
                            </li>
                        </ul>
                    </div>

                    {/* Popular Tags */}
                    <div className="bg-[#131319] p-6 rounded-2xl border border-gray-800">
                        <h3 className="text-lg font-semibold mb-5">Popular Tags</h3>
                        <div className="flex flex-wrap gap-2 text-sm">
                            {["Tech", "Fest", "Startups", "CollegeLife", "Career", "Design"].map((tag) => (
                                <span
                                    key={tag}
                                    className="px-3 py-1 bg-[#1B1B24] rounded-lg border border-gray-700 hover:border-indigo-500 cursor-pointer"
                                >
                  #{tag}
                </span>
                            ))}
                        </div>
                    </div>

                    {/* Top Writers */}
                    <div className="bg-[#131319] p-6 rounded-2xl border border-gray-800">
                        <h3 className="text-lg font-semibold mb-5">Top Writers</h3>
                        <div className="flex flex-col gap-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <img
                                        src={`https://i.pravatar.cc/40?img=${i + 5}`}
                                        alt="writer"
                                        className="w-9 h-9 rounded-full border border-gray-700"
                                    />
                                    <div>
                                        <h4 className="text-sm font-medium text-white">
                                            {["Nandhini", "Arjun", "Deepika"][i - 1]}
                                        </h4>
                                        <p className="text-xs text-gray-500">12 articles</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>
            </main>
        </div>
    );
}
