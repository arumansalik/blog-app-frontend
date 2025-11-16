import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import MarkdownPreview from "@uiw/react-markdown-preview";
// import "@uiw/react-markdown-preview/dist/markdown.css";

import API from "../api/axios";
import {
    Heart,
    Bookmark,
    Eye,
    ArrowLeft,
    ThumbsUp,
    Share,
} from "lucide-react";

export default function SinglePost() {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [liked, setLiked] = useState(false);
    const [bookmarked, setBookmarked] = useState(false);

    useEffect(() => {
        async function loadPost() {
            try {
                const { data } = await API.get(`/posts/${id}`);
                setPost(data);
                setLoading(false);

                // Increment view count
                await API.put(`/posts/${id}/view`);

            } catch (err) {
                console.error("Single post error:", err);
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
        return <p className="text-center text-red-500">Post not found</p>;
    }

    return (
        <div className="min-h-screen bg-[#0A0A0F] text-gray-100 font-poppins pb-20">

            {/* Top Navigation */}
            <div className="px-6 py-4 border-b border-gray-800 bg-[#0E0E14] flex items-center gap-4 sticky top-0 z-40">
                <Link to="/" className="text-gray-300 hover:text-white">
                    <ArrowLeft size={22} />
                </Link>
                <h1 className="text-lg font-semibold">Back to Home</h1>
            </div>

            {/* COVER IMAGE */}
            <div className="w-full h-[350px] overflow-hidden">
                <img
                    src={post.cover}
                    alt="Cover"
                    className="w-full h-full object-cover opacity-90"
                />
            </div>

            {/* CONTENT CONTAINER */}
            <div className="max-w-4xl mx-auto px-6 mt-10">

                {/* TITLE */}
                <h1 className="text-4xl font-bold mb-4 text-white leading-tight">
                    {post.title}
                </h1>

                {/* AUTHOR CARD */}
                <div className="flex items-center gap-4 mb-10">
                    <img
                        src={
                            post.author?.avatar ||
                            `https://i.pravatar.cc/60?u=${post.author?._id}`
                        }
                        className="w-12 h-12 rounded-full border border-gray-700"
                    />
                    <div>
                        <p className="font-semibold text-white">
                            {post.author?.username}
                        </p>
                        <p className="text-gray-400 text-sm">
                            {new Date(post.createdAt).toDateString()}
                        </p>
                    </div>
                </div>

                {/* ACTION BUTTONS */}
                <div className="flex items-center gap-6 mb-10">

                    {/* Likes */}
                    <button
                        onClick={async () => {
                            await API.put(`/posts/${id}/like`);
                            setLiked((prev) => !prev);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-[#161621] border border-gray-700 rounded-xl hover:border-indigo-500 transition"
                    >
                        <Heart className={liked ? "text-red-500" : "text-gray-300"} size={20} />
                        <span>{post.likes?.length}</span>
                    </button>

                    {/* Bookmarks */}
                    <button
                        onClick={async () => {
                            await API.put(`/posts/${id}/bookmark`);
                            setBookmarked((prev) => !prev);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-[#161621] border border-gray-700 rounded-xl hover:border-indigo-500 transition"
                    >
                        <Bookmark size={20} className={bookmarked ? "text-yellow-400" : "text-gray-300"} />
                    </button>

                    {/* Views */}
                    <div className="flex items-center gap-2 px-4 py-2 bg-[#161621] border border-gray-700 rounded-xl">
                        <Eye size={20} className="text-gray-300" />
                        <span>{post.views}</span>
                    </div>

                    {/* Share */}
                    <button className="flex items-center gap-2 px-4 py-2 bg-[#161621] border border-gray-700 rounded-xl hover:border-indigo-500 transition">
                        <Share size={20} />
                    </button>

                </div>

                {/* MARKDOWN CONTENT */}
                <MarkdownPreview
                    source={post.content}
                    className="bg-transparent p-4 rounded-xl prose prose-invert max-w-none"
                    style={{
                        backgroundColor: "transparent",
                        color: "white",
                        fontSize: "18px",
                        lineHeight: "1.8",
                    }}
                />

                {/* TAGS */}
                <div className="flex flex-wrap gap-3 mt-10">
                    {post.tags.map((tag) => (
                        <span
                            key={tag}
                            className="px-4 py-2 bg-[#1A1A23] border border-gray-700 rounded-full text-sm hover:border-indigo-500 cursor-pointer"
                        >
              #{tag}
            </span>
                    ))}
                </div>

                {/* COMMENTS SECTION */}
                <div className="mt-20 bg-[#10101A] border border-gray-800 p-6 rounded-2xl">
                    <h3 className="text-xl font-semibold mb-4">💬 Comments</h3>

                    <textarea
                        placeholder="Write a comment..."
                        className="w-full bg-[#1A1A23] p-4 border border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                    ></textarea>

                    <button className="mt-3 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-xl">
                        Post Comment
                    </button>
                </div>

            </div>

        </div>
    );
}
