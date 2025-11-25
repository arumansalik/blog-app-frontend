import React, { useEffect, useState } from "react";
import API from "../api/axios";
import { TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

export default function Trending({ limit = 5 }) {
    const [trending, setTrending] = useState([]);

    useEffect(() => {
        async function load() {
            try {
                const { data } = await API.get("/explore/trending");
                setTrending(data.slice ? data.slice(0, limit) : data);
            } catch (err) {
                console.error("Trending load error", err);
            }
        }
        load();
    }, [limit]);

    return (
        <div className="bg-[#131319] p-6 rounded-2xl border border-gray-800">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <TrendingUp size={18} /> Trending
            </h3>

            {trending.length === 0 ? (
                <p className="text-gray-500 text-sm">No trending posts</p>
            ) : (
                <ul className="space-y-4">
                    {trending.map((p) => (
                        <li key={p._id}>
                            <Link
                                to={`/posts/${p._id}`}
                                className="flex items-center gap-3 hover:text-indigo-400 group"
                            >
                                {/* Thumbnail */}
                                <img
                                    src={p.cover}
                                    className="w-12 h-10 rounded-md object-cover flex-shrink-0"
                                />

                                {/* Title + Meta */}
                                <div className="flex-1 min-w-0">
                                    <div className="font-medium text-white text-sm truncate">
                                        {p.title}
                                    </div>

                                    <div className="text-xs text-gray-400 truncate">
                                        {p.author?.username} · {p.views} views
                                    </div>
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
