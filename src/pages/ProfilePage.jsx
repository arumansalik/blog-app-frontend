import React, { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { Edit, Link2, Users, PenLine } from "lucide-react";

export default function Profile() {
    const { username } = useParams();
    const navigate = useNavigate();
    const { user: loggedInUser } = useContext(AuthContext);

    const [profile, setProfile] = useState(null);
    const [tab, setTab] = useState("posts");
    const [loading, setLoading] = useState(true);
    const [isFollowing, setIsFollowing] = useState(false);

    /* 🚨 LOGIN CHECK — Redirect if not logged in */
    useEffect(() => {
        if (!loggedInUser) {
            alert("Please login to view profiles.");
            navigate("/login");
        }
    }, [loggedInUser, navigate]);

    /* 📌 Load Profile */
    useEffect(() => {
        async function loadProfile() {
            try {
                const { data } = await API.get(`/users/${username}`);
                setProfile(data);

                if (loggedInUser && data?.user?.followers) {
                    const followers = data.user.followers;
                    const loggedId = loggedInUser._id;

                    setIsFollowing(
                        followers.some(f =>
                            typeof f === "string"
                                ? f === loggedId
                                : f._id === loggedId
                        )
                    );
                }

                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        }

        loadProfile();
    }, [username, loggedInUser]);

    if (loading)
        return <div className="text-center mt-20 text-gray-400">Loading profile...</div>;

    if (!profile)
        return <div className="text-center mt-20 text-red-500">User not found</div>;

    const { user, posts, bookmarks, likedPosts } = profile;

    /* 📌 Follow/Unfollow */
    const handleFollowToggle = async () => {
        if (!loggedInUser) return alert("Login required!");

        const id = user._id;

        try {
            if (isFollowing) {
                await API.put(`/users/${id}/unfollow`);

                setProfile(prev => ({
                    ...prev,
                    user: {
                        ...prev.user,
                        followers: prev.user.followers.filter(f =>
                            typeof f === "string"
                                ? f !== loggedInUser._id
                                : f._id !== loggedInUser._id
                        )
                    }
                }));

                setIsFollowing(false);
            } else {
                await API.put(`/users/${id}/follow`);

                setProfile(prev => ({
                    ...prev,
                    user: {
                        ...prev.user,
                        followers: [
                            ...prev.user.followers,
                            { _id: loggedInUser._id, username: loggedInUser.username }
                        ]
                    }
                }));

                setIsFollowing(true);
            }
        } catch (err) {
            console.error("Follow error:", err);
        }
    };

    /* Avatar Fallback */
    const getInitial = name => name?.charAt(0)?.toUpperCase() || "?";

    return (
        <div className="min-h-screen bg-[#0A0A0F] text-gray-100 font-poppins pb-20">

            {/* BANNER */}
            <div className="w-full h-40 sm:h-52 bg-gradient-to-r from-indigo-600 to-purple-600"></div>

            {/* PROFILE HEADER */}
            <div className="max-w-4xl mx-auto px-5 -mt-20 flex flex-col sm:flex-row items-center sm:items-end gap-6">

                {/* Avatar */}
                {user.avatar ? (
                    <img
                        src={user.avatar}
                        className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-[#0A0A0F]"
                    />
                ) : (
                    <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-[#0A0A0F] bg-indigo-600 flex items-center justify-center text-4xl font-bold">
                        {getInitial(user.username)}
                    </div>
                )}

                {/* Info */}
                <div className="text-center sm:text-left w-full flex-1">
                    <h1 className="text-2xl sm:text-3xl font-bold">{user.username}</h1>
                    <p className="text-gray-400 mt-1 text-sm sm:text-base">{user.bio}</p>

                    <div className="flex flex-wrap justify-center sm:justify-start gap-4 mt-4 text-gray-400 text-sm">
                        <span className="flex items-center gap-2"><PenLine size={16} /> {posts.length} Posts</span>
                        <span className="flex items-center gap-2"><Users size={16} /> {user.followers?.length} Followers</span>
                        <span className="flex items-center gap-2"><Users size={16} /> {user.following?.length} Following</span>
                    </div>

                    {/* Social */}
                    <div className="flex justify-center sm:justify-start gap-5 mt-4">
                        {user.socialLinks?.website && (
                            <a href={user.socialLinks.website} target="_blank" className="hover:text-indigo-400">
                                <Link2 size={20} />
                            </a>
                        )}
                    </div>
                </div>

                {/* Follow / Edit */}
                <div className="flex items-center gap-3">
                    {loggedInUser.username === user.username ? (
                        <Link to="/edit-profile" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-xl flex items-center gap-2">
                            <Edit size={16} /> Edit
                        </Link>
                    ) : (
                        <button
                            onClick={handleFollowToggle}
                            className={`px-4 py-2 rounded-xl text-sm ${isFollowing ? "bg-gray-700 hover:bg-gray-600" : "bg-indigo-600 hover:bg-indigo-700"}`}
                        >
                            {isFollowing ? "Following" : "Follow"}
                        </button>
                    )}
                </div>

            </div>

            {/* TABS */}
            <div className="max-w-4xl mx-auto px-5 mt-10">
                <div className="flex gap-6 border-b border-gray-800 pb-4 overflow-x-auto">
                    {["posts", "bookmarks", "likes"].map(tabName => (
                        <button
                            key={tabName}
                            onClick={() => setTab(tabName)}
                            className={`pb-1 capitalize ${tab === tabName ? "text-indigo-400 border-b-2 border-indigo-500" : "text-gray-400"}`}
                        >
                            {tabName}
                        </button>
                    ))}
                </div>

                {/* CONTENT */}
                <div className="mt-8">
                    {tab === "posts" && <PostList posts={posts} />}
                    {tab === "bookmarks" && <PostList posts={bookmarks} />}
                    {tab === "likes" && <PostList posts={likedPosts} />}
                </div>
            </div>
        </div>
    );
}

/* POST CARD COMPONENT */
function PostList({ posts }) {
    if (!posts || posts.length === 0)
        return <p className="text-center text-gray-500">No posts here.</p>;

    return posts.map(post => (
        <Link
            key={post._id}
            to={`/posts/${post._id}`}
            className="block bg-[#131319] border border-gray-800 p-5 rounded-2xl mb-6 hover:border-indigo-600 transition"
        >
            <h2 className="text-lg sm:text-xl font-semibold">{post.title}</h2>
            <p className="text-gray-400 mt-2 text-sm line-clamp-2">
                {post.content.replace(/[#>*_`]/g, "").slice(0, 150)}...
            </p>
        </Link>
    ));
}
