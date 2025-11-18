import React, { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { Edit, Link2, Users, PenLine } from "lucide-react";

export default function Profile() {
    const { username } = useParams();
    const { user: loggedInUser } = useContext(AuthContext);

    const [profile, setProfile] = useState(null);
    const [tab, setTab] = useState("posts");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadProfile() {
            try {
                const { data } = await API.get(`/users/${username}`);
                setProfile(data);
                setLoading(false);
            } catch (error) {
                console.error(error);
            }
        }
        loadProfile();
    }, [username]);

    if (loading) {
        return (
            <div className="text-center mt-20 text-gray-400">
                Loading profile...
            </div>
        );
    }

    const { user, posts, bookmarks, likedPosts } = profile;

    return (
        <div className="min-h-screen bg-[#0A0A0F] text-gray-100 font-poppins pb-20">

            {/* BANNER */}
            <div className="w-full h-40 sm:h-52 bg-gradient-to-r from-indigo-600 to-purple-600"></div>

            {/* PROFILE HEADER */}
            <div className="max-w-4xl mx-auto px-5 -mt-16 flex flex-col sm:flex-row items-center sm:items-end gap-6">

                {/* Avatar */}
                <img
                    src={user.avatar || `https://i.pravatar.cc/150?u=${user._id}`}
                    className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-[#0A0A0F]"
                />

                {/* User Info */}
                <div className="text-center sm:text-left w-full flex-1">
                    <h1 className="text-2xl sm:text-3xl font-bold">{user.username}</h1>
                    <p className="text-gray-400 mt-1 text-sm sm:text-base">{user.bio}</p>

                    {/* Stats */}
                    <div className="flex flex-wrap justify-center sm:justify-start gap-4 mt-4 text-gray-400 text-sm">
                        <span className="flex items-center gap-2">
                            <PenLine size={16} /> {posts.length} Posts
                        </span>
                        <span className="flex items-center gap-2">
                            <Users size={16} /> {user.followers?.length} Followers
                        </span>
                        <span className="flex items-center gap-2">
                            <Users size={16} /> {user.following?.length} Following
                        </span>
                    </div>

                    {/* Social links */}
                    <div className="flex justify-center sm:justify-start gap-5 mt-4">
                        {user.socialLinks?.website && (
                            <a
                                href={user.socialLinks.website}
                                target="_blank"
                                className="hover:text-indigo-400 transition"
                            >
                                <Link2 size={20} />
                            </a>
                        )}
                    </div>
                </div>

                {/* Edit Button */}
                {loggedInUser?.username === user.username && (
                    <Link
                        to="/edit-profile"
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-xl flex items-center gap-2 text-sm sm:text-base"
                    >
                        <Edit size={16} /> Edit
                    </Link>
                )}
            </div>

            {/* TABS */}
            <div className="max-w-4xl mx-auto px-5 mt-10">
                <div className="flex gap-6 border-b border-gray-800 pb-4 overflow-x-auto">
                    {["posts", "bookmarks", "likes"].map((t) => (
                        <button
                            key={t}
                            onClick={() => setTab(t)}
                            className={`pb-1 capitalize ${
                                tab === t ? "text-indigo-400 border-b-2 border-indigo-500" : "text-gray-400"
                            }`}
                        >
                            {t}
                        </button>
                    ))}
                </div>

                {/* TAB CONTENT */}
                <div className="mt-8">
                    {tab === "posts" &&
                        posts.map((p) => <ProfilePostCard key={p._id} post={p} />)}

                    {tab === "bookmarks" &&
                        bookmarks.map((p) => <ProfilePostCard key={p._id} post={p} />)}

                    {tab === "likes" &&
                        likedPosts.map((p) => <ProfilePostCard key={p._id} post={p} />)}
                </div>
            </div>
        </div>
    );
}

/* POST CARD */
function ProfilePostCard({ post }) {
    return (
        <Link
            to={`/posts/${post._id}`}
            className="block bg-[#131319] border border-gray-800 p-5 rounded-2xl mb-6 hover:border-indigo-600 transition"
        >
            <h2 className="text-lg sm:text-xl font-semibold">{post.title}</h2>
            <p className="text-gray-400 mt-2 text-sm line-clamp-2">
                {post.content.replace(/[#>*_`]/g, "").slice(0, 150)}...
            </p>
        </Link>
    );
}
