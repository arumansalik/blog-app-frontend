import React, { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import MarkdownPreview from "@uiw/react-markdown-preview";
import {
    Heart,
    Bookmark,
    Eye,
    ArrowLeft,
    Share,
    UserPlus,
    UserCheck,
} from "lucide-react";

import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";

// Comments Component (you already have this)
import CommentSection from "../components/CommentSection";

/**
 * SinglePost page
 * - Loads post
 * - Loads author profile (so followers array is available)
 * - Toggle like/bookmark with optimistic UI & backend persistence
 * - Follow/Unfollow author (updates UI instantly)
 * - Shows related posts (by tags) or fallback to /explore/trending
 */
export default function SinglePost() {
    const { id } = useParams();
    const { user: loggedInUser } = useContext(AuthContext);

    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    const [liked, setLiked] = useState(false);
    const [bookmarked, setBookmarked] = useState(false);

    const [isFollowingAuthor, setIsFollowingAuthor] = useState(false);
    const [authorProfile, setAuthorProfile] = useState(null);

    const [related, setRelated] = useState([]);
    const [relatedLoading, setRelatedLoading] = useState(true);

    // load post + author profile
    async function loadPost() {
        try {
            setLoading(true);
            const { data } = await API.get(`/posts/${id}`);
            setPost(data);

            // set like/bookmark initial states (guard string/ObjectId)
            const myId = loggedInUser?._id?.toString();
            setLiked(Boolean(data.likes?.some((u) => u?.toString() === myId)));
            setBookmarked(Boolean(data.bookmarks?.some((u) => u?.toString() === myId)));

            // increment view count (fire-and-forget)
            try {
                await API.put(`/posts/${id}/view`);
                // optional: update post.views from response or increment locally
                setPost((p) => (p ? { ...p, views: (p.views || 0) + 1 } : p));
            } catch (e) {
                // ignore view increment errors
            }

            // fetch full author profile (so we know followers)
            if (data.author?.username) {
                try {
                    const profileRes = await API.get(`/users/${data.author.username}`);
                    setAuthorProfile(profileRes.data.user || null);

                    const followers = profileRes.data.user?.followers || [];
                    setIsFollowingAuthor(
                        Boolean(
                            followers.some((f) =>
                                typeof f === "string" ? f === myId : f._id?.toString() === myId
                            )
                        )
                    );
                } catch (err) {
                    // fallback: no author profile available
                    setAuthorProfile(null);
                    setIsFollowingAuthor(false);
                }
            } else {
                setAuthorProfile(null);
                setIsFollowingAuthor(false);
            }

            setLoading(false);

            // fetch related posts (after we have post)
            fetchRelatedPosts(data);
        } catch (err) {
            console.error("Single Post Error:", err);
            setLoading(false);
        }
    }

    // fetch related posts by tags, fallback to trending
    async function fetchRelatedPosts(postData) {
        try {
            setRelatedLoading(true);

            // Try local tag-match via /posts endpoint
            const allRes = await API.get("/posts");
            const allPosts = Array.isArray(allRes.data) ? allRes.data : allRes.data.posts || [];

            // find posts that share at least one tag (excluding current)
            const tags = postData.tags || [];
            const tagSet = new Set(tags.map((t) => String(t).toLowerCase()));

            const matched = allPosts
                .filter((p) => p._id !== postData._id)
                .map((p) => ({ ...p }))
                .filter((p) => {
                    if (!p.tags || p.tags.length === 0) return false;
                    return p.tags.some((t) => tagSet.has(String(t).toLowerCase()));
                });

            if (matched.length > 0) {
                setRelated(matched.slice(0, 4));
                setRelatedLoading(false);
                return;
            }

            // fallback: request trending posts from /explore/trending
            const trendingRes = await API.get("/explore/trending");
            const trending = Array.isArray(trendingRes.data) ? trendingRes.data : trendingRes.data.posts || [];
            setRelated(trending.filter((p) => p._id !== postData._id).slice(0, 4));
            setRelatedLoading(false);
        } catch (err) {
            console.error("Related posts error:", err);
            setRelated([]);
            setRelatedLoading(false);
        }
    }

    useEffect(() => {
        loadPost();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, loggedInUser]); // reload when id or user changes

    // Toggle like with optimistic update
    const toggleLike = async () => {
        if (!loggedInUser) return alert("Please log in to like posts.");

        const myId = loggedInUser._id.toString();
        const currentlyLiked = liked;

        // optimistic UI
        setLiked(!currentlyLiked);
        setPost((prev) =>
            prev
                ? {
                    ...prev,
                    likes: currentlyLiked
                        ? prev.likes.filter((u) => u?.toString() !== myId)
                        : [...(prev.likes || []), myId],
                }
                : prev
        );

        try {
            await API.put(`/posts/${id}/like`);
        } catch (err) {
            // revert on failure
            console.error("Like toggle failed:", err);
            setLiked(currentlyLiked);
            setPost((prev) =>
                prev
                    ? {
                        ...prev,
                        likes: currentlyLiked
                            ? [...(prev.likes || []), myId]
                            : (prev.likes || []).filter((u) => u?.toString() !== myId),
                    }
                    : prev
            );
        }
    };

    // Toggle bookmark with optimistic update
    const toggleBookmark = async () => {
        if (!loggedInUser) return alert("Please log in to bookmark posts.");
        const myId = loggedInUser._id.toString();
        const currentlyBookmarked = bookmarked;

        setBookmarked(!currentlyBookmarked);
        setPost((prev) =>
            prev
                ? {
                    ...prev,
                    bookmarks: currentlyBookmarked
                        ? prev.bookmarks.filter((u) => u?.toString() !== myId)
                        : [...(prev.bookmarks || []), myId],
                }
                : prev
        );

        try {
            await API.put(`/posts/${id}/bookmark`);
        } catch (err) {
            console.error("Bookmark toggle failed:", err);
            setBookmarked(currentlyBookmarked);
            setPost((prev) =>
                prev
                    ? {
                        ...prev,
                        bookmarks: currentlyBookmarked
                            ? [...(prev.bookmarks || []), myId]
                            : (prev.bookmarks || []).filter((u) => u?.toString() !== myId),
                    }
                    : prev
            );
        }
    };

    // Follow/unfollow author (authorProfile must exist)
    const handleFollowToggleAuthor = async () => {
        if (!loggedInUser) return alert("Please log in to follow users.");
        if (!authorProfile) return;

        try {
            const authorId = authorProfile._id;
            if (isFollowingAuthor) {
                await API.put(`/users/${authorId}/unfollow`);
                setIsFollowingAuthor(false);
                setAuthorProfile((prev) => ({
                    ...prev,
                    followers: (prev.followers || []).filter((f) =>
                        typeof f === "string" ? f !== loggedInUser._id : f._id?.toString() !== loggedInUser._id
                    ),
                }));
            } else {
                await API.put(`/users/${authorId}/follow`);
                setIsFollowingAuthor(true);
                setAuthorProfile((prev) => ({
                    ...prev,
                    followers: [...(prev.followers || []), { _id: loggedInUser._id, username: loggedInUser.username }],
                }));
            }
        } catch (err) {
            console.error("Follow toggle error:", err);
        }
    };

    // loading states
    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center text-gray-300">
                Loading post...
            </div>
        );
    }

    if (!post) return <p className="text-center text-red-500">Post Not Found</p>;

    return (
        <div className="min-h-screen bg-[#0A0A0F] text-gray-100 font-poppins pb-20">
            {/* Top Navigation */}
            <div className="px-6 py-4 border-b border-gray-800 bg-[#0E0E14] flex items-center gap-4 sticky top-0 z-40">
                <Link to="/" className="text-gray-300 hover:text-white">
                    <ArrowLeft size={22} />
                </Link>
                <h1 className="text-lg font-semibold truncate">{post.title}</h1>
            </div>

            {/* Cover */}
            <div className="w-full h-[300px] md:h-[380px] overflow-hidden">
                <img src={post.cover} alt="Cover" className="w-full h-full object-cover opacity-90" />
            </div>

            {/* CONTENT WRAPPER */}
            <div className="max-w-3xl mx-auto px-6 mt-10">
                {/* Title */}
                <h1 className="text-4xl font-bold mb-4 leading-tight text-white">{post.title}</h1>

                {/* AUTHOR */}
                <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-4">
                        {post.author?.avatar ? (
                            <img src={post.author.avatar} className="w-14 h-14 rounded-full border border-gray-700" />
                        ) : (
                            <div className="w-14 h-14 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold">
                                {post.author?.username?.charAt(0)?.toUpperCase() || "U"}
                            </div>
                        )}

                        <div>
                            <Link to={`/profile/${post.author?.username}`} className="font-semibold text-white text-lg hover:text-indigo-400">
                                {post.author?.username}
                            </Link>
                            <p className="text-gray-400 text-sm">{new Date(post.createdAt).toDateString()}</p>
                            <p className="text-xs text-gray-500 mt-1">{authorProfile?.followers?.length ?? "—"} followers</p>
                        </div>
                    </div>

                    {/* Follow */}
                    {loggedInUser?._id?.toString() !== post.author?._id?.toString() && (
                        <button
                            onClick={handleFollowToggleAuthor}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all ${
                                isFollowingAuthor ? "bg-gray-700 hover:bg-gray-600 text-gray-200" : "bg-indigo-600 hover:bg-indigo-700 text-white"
                            }`}
                        >
                            {isFollowingAuthor ? (
                                <>
                                    <UserCheck size={18} className="text-green-400" />
                                    Following
                                </>
                            ) : (
                                <>
                                    <UserPlus size={18} className="text-white" />
                                    Follow
                                </>
                            )}
                        </button>
                    )}
                </div>

                {/* Markdown content */}
                <div className="bg-[#14141E] border border-gray-800 rounded-2xl p-8 shadow-xl leading-relaxed">
                    <MarkdownPreview source={post.content} className="prose prose-invert max-w-none" style={{ background: "transparent", color: "white", fontSize: "18px", lineHeight: "1.9", letterSpacing: "0.3px" }} />
                </div>

                {/* ACTIONS */}
                <div className="flex flex-wrap items-center gap-4 mt-8 mb-10">
                    <button onClick={toggleLike} className="flex items-center gap-3 px-5 py-3 bg-[#161621] border border-gray-700 rounded-xl hover:border-red-500 transition">
                        <Heart size={22} className={liked ? "text-red-400" : "text-gray-300"} />
                        <span>{post.likes?.length || 0}</span>
                    </button>

                    <button onClick={toggleBookmark} className="flex items-center gap-3 px-5 py-3 bg-[#161621] border border-gray-700 rounded-xl hover:border-yellow-500 transition">
                        <Bookmark size={22} className={bookmarked ? "text-yellow-400" : "text-gray-300"} />
                    </button>

                    <div className="flex items-center gap-3 px-4 py-2 bg-[#161621] border border-gray-700 rounded-xl">
                        <Eye size={20} className="text-gray-300" />
                        <span>{post.views}</span>
                    </div>

                    <button onClick={() => { navigator.clipboard.writeText(window.location.href); alert("Link copied!"); }} className="flex items-center gap-2 px-4 py-2 bg-[#161621] border border-gray-700 rounded-xl hover:border-indigo-500 transition">
                        <Share size={18} />
                        Share
                    </button>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-3 mb-12">
                    {post.tags?.map((tag) => (
                        <button key={tag} onClick={() => { /* add search or filter action */ }} className="px-4 py-2 bg-[#1A1A23] border border-gray-700 rounded-xl text-sm hover:border-indigo-500 cursor-pointer">
                            #{tag}
                        </button>
                    ))}
                </div>

                {/* RELATED + COMMENTS GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        {/* Comments */}
                        <CommentSection postId={id} />
                    </div>

                    {/* Related Posts */}
                    <aside className="space-y-6">
                        <div className="bg-[#131319] p-6 rounded-2xl border border-gray-800">
                            <h3 className="text-lg font-semibold mb-4">Related Posts</h3>
                            {relatedLoading ? (
                                <p className="text-gray-400">Loading...</p>
                            ) : related.length === 0 ? (
                                <p className="text-gray-500 text-sm">No related posts found</p>
                            ) : (
                                related.map((r) => (
                                    <Link key={r._id} to={`/posts/${r._id}`} className="block py-3 border-b border-gray-800 last:border-b-0">
                                        <h4 className="text-sm font-medium text-white">{r.title}</h4>
                                        <p className="text-xs text-gray-400 mt-1 line-clamp-2">{(r.content || "").replace(/[#>*_`]/g, "").slice(0, 80)}...</p>
                                    </Link>
                                ))
                            )}
                        </div>

                        <div className="bg-[#131319] p-6 rounded-2xl border border-gray-800">
                            <h3 className="text-lg font-semibold mb-4">More From Author</h3>
                            {authorProfile ? (
                                <>
                                    { (authorProfile?.posts || []).length === 0 ? (
                                        <p className="text-gray-500 text-sm">No other posts</p>
                                    ) : (
                                        authorProfile.posts.slice(0, 4).map(p => (
                                            <Link key={p._id} to={`/posts/${p._id}`} className="block py-2 text-sm text-gray-300 hover:text-indigo-400">
                                                {p.title}
                                            </Link>
                                        ))
                                    )}
                                </>
                            ) : (
                                <p className="text-gray-500 text-sm">No data</p>
                            )}
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
