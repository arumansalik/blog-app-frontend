import React, { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import API from "../api/axios";
import {
    User,
    Users,
    Bookmark,
    Heart,
    Link as LinkIcon,
    Globe,
    Twitter,
    Facebook,
} from "lucide-react";

export default function ProfilePage() {
    const { username } = useParams();
    const { user: loggedInUser } = useContext(AuthContext);

    const [profile, setProfile] = useState(null);
    const [activeTab, setActiveTab] = useState("posts");
    const [loading, setLoading] = useState(true);
    const [isFollowing, setIsFollowing] = useState(false);

    useEffect(() => {
        async function loadProfile() {
            try {
                const { data } = await API.get(`/users/${username}`);
                setProfile(data);

                // Check if logged user is following
                setIsFollowing(
                    data.user.followers.some(
                        (f) => f._id === loggedInUser?._id
                    )
                );

                setLoading(false);
            } catch (err) {
                console.error("Profile load error:", err);
                setLoading(false);
            }
        }

        loadProfile();
    }, [username]);

    const handleFollow = async () => {
        try {
            if (isFollowing) {
                await API.put(`/users/${profile.user._id}/unfollow`);
            } else {
                await API.put(`/users/${profile.user._id}/follow`);
            }
            setIsFollowing(!isFollowing);
        } catch (err) {
            console.error("Follow error", err);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center text-gray-300">
                Loading profile...
            </div>
        );
    }

    if (!profile) {
        return (
            <p className="text-center text-red-500">User not found.</p>
        );
    }

    const tabs = [
        { id: "posts", label: "Posts", icon: <User size={16} /> },
        { id: "bookmarks", label: "Bookmarks", icon: <Bookmark size={16} /> },
        { id: "likes", label: "Liked Posts", icon: <Heart size={16} /> },
        { id: "followers", label: "Followers", icon: <Users size={16} /> },
        { id: "following", label: "Following", icon: <Users size={16} /> },
    ];

    const selectedTabContent = {
        posts: profile.posts,
        bookmarks: profile.bookmarks,
        likes: profile.likedPosts,
        followers: profile.user.followers,
        following: profile.user.following,
    };

    return (
        <div className="min-h-screen bg-[#0A0A0F] text-gray-100 font-poppins pb-20">

            {/* HEADER SECTION */}
            <div className="bg-gradient-to-r from-indigo-700 to-purple-900 h-48 relative">
                <div className="absolute -bottom-12 left-10 flex items-center">
                    <img
                        src={
                            profile.user.avatar ||
                            `https://i.pravatar.cc/120?u=${profile.user._id}`
                        }
                        className="w-28 h-28 rounded-full border-4 border-[#0A0A0F]"
                    />
                    <div className="ml-6">
                        <h1 className="text-3xl font-bold">
                            {profile.user.username}
                        </h1>
                        <p className="text-gray-300">{profile.user.bio}</p>
                    </div>
                </div>
            </div>

            {/* FOLLOW BUTTON */}
            <div className="mt-20 px-10">
                {loggedInUser?._id !== profile.user._id && (
                    <button
                        onClick={handleFollow}
                        className={`px-6 py-2 rounded-xl text-white font-semibold transition ${
                            isFollowing
                                ? "bg-red-600 hover:bg-red-700"
                                : "bg-indigo-600 hover:bg-indigo-700"
                        }`}
                    >
                        {isFollowing ? "Unfollow" : "Follow"}
                    </button>
                )}
            </div>

            {/* SOCIAL LINKS */}
            <div className="px-10 mt-4 flex gap-6 text-gray-400">
                {profile.user.socialLinks?.twitter && (
                    <a href={profile.user.socialLinks.twitter} target="_blank">
                        <Twitter />
                    </a>
                )}
                {profile.user.socialLinks?.facebook && (
                    <a href={profile.user.socialLinks.facebook} target="_blank">
                        <Facebook />
                    </a>
                )}
                {profile.user.socialLinks?.website && (
                    <a href={profile.user.socialLinks.website} target="_blank">
                        <Globe />
                    </a>
                )}
            </div>

            {/* TABS */}
            <div className="mt-10 px-10 flex gap-6 border-b border-gray-800 pb-4">
                {tabs.map((t) => (
                    <button
                        key={t.id}
                        onClick={() => setActiveTab(t.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl transition ${
                            activeTab === t.id
                                ? "bg-indigo-600 text-white"
                                : "text-gray-400 hover:bg-[#1A1A23]"
                        }`}
                    >
                        {t.icon}
                        {t.label}
                    </button>
                ))}
            </div>

            {/* CONTENT LIST */}
            <div className="mt-8 px-10 space-y-6">
                {selectedTabContent[activeTab].length === 0 ? (
                    <p className="text-gray-400">No content available.</p>
                ) : activeTab === "followers" || activeTab === "following" ? (
                    selectedTabContent[activeTab].map((u) => (
                        <div
                            key={u._id}
                            className="flex items-center gap-4 bg-[#131319] p-4 rounded-xl border border-gray-800"
                        >
                            <img
                                src={u.avatar || `https://i.pravatar.cc/40?u=${u._id}`}
                                className="w-12 h-12 rounded-full border border-gray-700"
                            />
                            <p className="text-white text-lg">{u.username}</p>
                        </div>
                    ))
                ) : (
                    selectedTabContent[activeTab].map((p) => (
                        <Link
                            to={`/posts/${p._id}`}
                            key={p._id}
                            className="block bg-[#131319] border border-gray-800 p-6 rounded-2xl hover:border-indigo-500 transition"
                        >
                            <h2 className="text-xl font-semibold mb-2 text-white">
                                {p.title}
                            </h2>

                            <p className="text-gray-400 text-sm line-clamp-2">
                                {p.content?.replace(/[#>*_`]/g, "").slice(0, 150)}
                            </p>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
}
