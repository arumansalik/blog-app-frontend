import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import MarkdownPreview from "@uiw/react-markdown-preview";
import {
    Heart,
    Bookmark,
    Eye,
    ArrowLeft,
    Share,
} from "lucide-react";
import API from "../api/axios";

// 🔥 Import reusable comment component
import CommentSection from "../components/CommentSection";

export default function SinglePost() {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    const [liked, setLiked] = useState(false);
    const [bookmarked, setBookmarked] = useState(false);

    /* Load post */
    useEffect(() => {
        async function loadPost() {
            try {
                const { data } = await API.get(`/posts/${id}`);

                setPost(data);
                setLoading(false);

                setLiked(data.likes?.includes(localStorage.getItem("userId")));
                setBookmarked(data.bookmarks?.includes(localStorage.getItem("userId")));

                // Count view
                await API.put(`/posts/${id}/view`);
            } catch (err) {
                console.error("Single Post Error:", err);
            }
        }
        loadPost();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center text-gray-300">
                Loading post...
            </div>
        );
    }

    if (!post) {
        return <p className="text-center text-red-500">Post Not Found</p>;
    }

    return (
        <div className="min-h-screen bg-[#0A0A0F] text-gray-100 font-poppins pb-20">

            {/* Navigation */}
            <div className="px-6 py-4 border-b border-gray-800 bg-[#0E0E14] flex items-center gap-4 sticky top-0 z-40">
                <Link to="/" className="text-gray-300 hover:text-white">
                    <ArrowLeft size={22} />
                </Link>
                <h1 className="text-lg font-semibold">{post.title}</h1>
            </div>

            {/* Cover Image */}
            <div className="w-full h-[350px] overflow-hidden">
                <img
                    src={post.cover}
                    alt="Cover"
                    className="w-full h-full object-cover opacity-90"
                />
            </div>

            {/* Content Container */}
            <div className="max-w-4xl mx-auto px-6 mt-10">

                {/* Title */}
                <h1 className="text-4xl font-bold mb-4 leading-tight text-white">
                    {post.title}
                </h1>

                {/* Author Section */}
                <div className="flex items-center gap-4 mb-10">
                    <img
                        src={post.author?.avatar || `https://i.pravatar.cc/60?u=${post.author?._id}`}
                        className="w-14 h-14 rounded-full border border-gray-700"
                    />

                    <div>
                        <p className="font-semibold text-white text-lg">
                            {post.author?.username}
                        </p>
                        <p className="text-gray-400 text-sm">
                            {new Date(post.createdAt).toDateString()}
                        </p>
                    </div>
                </div>

                {/* Markdown Content */}
                <div className="bg-[#14141E] border border-gray-800 rounded-2xl p-8 shadow-xl">
                    <MarkdownPreview
                        source={post.content}
                        className="prose prose-invert max-w-none"
                        style={{
                            background: "transparent",
                            color: "white",
                            fontSize: "18px",
                            lineHeight: "1.8",
                        }}
                    />
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-6 mt-10 mb-16">

                    {/* Like */}
                    <button
                        onClick={async () => {
                            await API.put(`/posts/${id}/like`);
                            setLiked((prev) => !prev);

                            setPost((prev) => ({
                                ...prev,
                                likes: liked
                                    ? prev.likes.filter(
                                        (u) => u !== localStorage.getItem("userId")
                                    )
                                    : [...prev.likes, localStorage.getItem("userId")],
                            }));
                        }}
                        className="flex items-center gap-3 px-5 py-3 bg-[#161621] border border-gray-700 rounded-xl hover:border-red-500 transition"
                    >
                        <Heart
                            size={22}
                            className={liked ? "text-red-400" : "text-gray-300"}
                        />
                        <span>{post.likes.length}</span>
                    </button>

                    {/* Bookmark */}
                    <button
                        onClick={async () => {
                            await API.put(`/posts/${id}/bookmark`);
                            setBookmarked((prev) => !prev);
                        }}
                        className="flex items-center gap-3 px-5 py-3 bg-[#161621] border border-gray-700 rounded-xl hover:border-yellow-500 transition"
                    >
                        <Bookmark
                            size={22}
                            className={bookmarked ? "text-yellow-400" : "text-gray-300"}
                        />
                    </button>

                    {/* Views */}
                    <div className="flex items-center gap-3 px-5 py-3 bg-[#161621] border border-gray-700 rounded-xl">
                        <Eye size={22} className="text-gray-300" />
                        <span>{post.views}</span>
                    </div>

                    {/* Share */}
                    <button
                        onClick={() => navigator.clipboard.writeText(window.location.href)}
                        className="flex items-center gap-3 px-5 py-3 bg-[#161621] border border-gray-700 rounded-xl hover:border-indigo-500 transition"
                    >
                        <Share size={22} />
                        <span>Share</span>
                    </button>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-3 mb-16">
                    {post.tags.map((tag) => (
                        <span
                            key={tag}
                            className="px-4 py-2 bg-[#1A1A23] border border-gray-700 rounded-xl text-sm hover:border-indigo-500 cursor-pointer"
                        >
              #{tag}
            </span>
                    ))}
                </div>

                {/* COMMENTS */}
                <CommentSection postId={id} />

            </div>
        </div>
    );
}
