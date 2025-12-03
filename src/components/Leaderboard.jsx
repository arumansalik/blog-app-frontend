import React, { useEffect, useState } from "react";
import API from "../api/axios";
import { Trophy } from "lucide-react";
import { Link } from "react-router-dom";

export default function Leaderboard() {
    const [leaders, setLeaders] = useState([]);

    useEffect(() => {
        async function load() {
            try {
                const { data } = await API.get("/explore/leaderboard");
                // API returns { leaderboard }
                setLeaders(data.leaderboard || []);
            } catch (err) {
                console.error("Leaderboard load error", err);
            }
        }
        load();
    }, []);

    return (
        <div className="bg-[#131319] p-6 rounded-2xl border border-gray-800">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Trophy size={18} /> Leaderboard
            </h3>

            {leaders.length === 0 ? (
                <p className="text-gray-500 text-sm">No data yet</p>
            ) : (
                <ol className="space-y-4">
                    {leaders.slice(0, 10).map((entry, idx) => (
                        <li key={entry.author?._id || idx} className="flex items-center gap-3">
                            <div className="w-10 text-center font-bold text-indigo-400">{idx + 1}</div>

                            <Link to={`/profile/${entry.author.username}`} className="flex items-center gap-3 flex-1">
                                <img
                                    src={entry.author.avatar || `https://i.pravatar.cc/40?u=${entry.author._id}`}
                                    alt=""
                                    className="w-10 h-10 rounded-full border border-gray-700"
                                />
                                <div>
                                    <div className="font-medium text-white">{entry.author.username}</div>
                                    <div className="text-xs text-gray-400">Posts: {entry.postsCount} · Views: {entry.totalViews}</div>
                                </div>
                            </Link>

                            <div className="text-sm text-gray-300 font-semibold">{entry.score}</div>
                        </li>
                    ))}
                </ol>
            )}
        </div>
    );
}
