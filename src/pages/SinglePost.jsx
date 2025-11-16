import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import MarkdownPreview from "@uiw/react-markdown-preview";
import {
    Heart,
    Bookmark,
    Eye,
    ArrowLeft,
    Share2,
    User,
} from "lucide-react";

import API from "../api/axios";

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

                await API.put(`/posts/${id}/view`);
            } catch (err) {
                console.error("Single post error:", err);
            }
            setLoading(false);
        }
        loadPost();
    }, [id]);

    if (loading)
        return (
            <div className="min-h-screen flex justify-center items-center text-gray-300">
                Loading post...
            </div>
        );

    if (!post) return <p className="text-center text-red-500">Post not found</p>;

    return (
        <div className="min-h-screen bg-[#0A0A0F] text-gray-100 font-poppins pb-28">

            {/* TOP NAV */}
            <div className="px-6 py-4 border-b border-gray-800 bg-[#0E0E14] flex items-center gap-3 sticky top-0 z-40">
                <Link to="/" className="text-gray-300 hover:text-white flex items-center gap-2">
                    <ArrowLeft size={22} />
                    <span className="text-sm">{post.title}</span>
                </Link>
            </div>

            {/* COVER */}
            <div className="w-full h-[380px] overflow-hidden shadow-xl">
                <img
                    src={post.cover}
                    alt="cover"
                    className="w-full h-full object-cover opacity-90"
                />
            </div>

            {/* ARTICLE */}
            <div className="max-w-4xl mx-auto px-6 mt-12">

                {/* TITLE */}
                <h1 className="text-4xl md:text-4xl font-bold mb-6 leading-tight text-white drop-shadow-sm">
                    {post.title}
                </h1>

                {/* AUTHOR CARD */}
                <div className="flex items-center gap-4 mb-12">
                    <img
                        src={
                            post.author?.avatar ||
                            `https://i.pravatar.cc/80?u=${post.author?._id}`
                        }
                        className="w-14 h-14 rounded-full border border-gray-700 shadow-md"
                    />
                    <div>
                        <p className="text-lg font-semibold text-white flex items-center gap-2">
                            <User size={16} /> {post.author?.username}
                        </p>
                        <p className="text-gray-400 text-sm">
                            {new Date(post.createdAt).toDateString()}
                        </p>
                    </div>
                </div>

                {/* ARTICLE BODY */}
                <MarkdownPreview
                    source={post.content}
                    className="bg-transparent p-4 rounded-xl prose prose-invert max-w-none"
                    style={{
                        backgroundColor: "transparent",
                        color: "white",
                        fontSize: "18px",
                        lineHeight: "1.9",
                    }}
                />

                {/* ACTION BAR BELOW CONTENT */}
                <div className="flex items-center gap-6 mt-10">

                    {/* LIKE */}
                    <button
                        onClick={async () => {
                            try {
                                const res = await API.put(`/posts/${id}/like`);
                                setPost((p) => ({ ...p, likes: res.data.likes }));
                                setLiked((prev) => !prev);
                            } catch (err) {
                                console.log(err);
                            }
                        }}
                        className="flex items-center gap-2 px-5 py-2 bg-[#161621] border border-gray-700 rounded-xl hover:bg-[#1c1c27] transition"
                    >
                        <Heart
                            size={20}
                            className={liked ? "text-red-500" : "text-gray-300"}
                        />
                        <span>{post.likes?.length}</span>
                    </button>

                    {/* BOOKMARK */}
                    <button
                        onClick={async () => {
                            try {
                                const res = await API.put(`/posts/${id}/bookmark`);
                                setPost((p) => ({ ...p, bookmarks: res.data.bookmarks }));
                                setBookmarked((prev) => !prev);
                            } catch (err) {
                                console.log(err);
                            }
                        }}
                        className="flex items-center gap-2 px-5 py-2 bg-[#161621] border border-gray-700 rounded-xl hover:bg-[#1c1c27] transition"
                    >
                        <Bookmark
                            size={20}
                            className={bookmarked ? "text-yellow-400" : "text-gray-300"}
                        />
                    </button>

                    {/* VIEWS */}
                    <div className="flex items-center gap-2 px-5 py-2 bg-[#161621] border border-gray-700 rounded-xl">
                        <Eye size={20} className="text-gray-300" />
                        <span>{post.views}</span>
                    </div>

                    {/* SHARE */}
                    <button className="flex items-center gap-2 px-5 py-2 bg-[#161621] border border-gray-700 rounded-xl hover:bg-[#1c1c27] transition">
                        <Share2 size={20} className="text-gray-300" />
                    </button>
                </div>

                {/* TAGS */}
                <div className="flex flex-wrap gap-3 mt-10">
                    {post.tags.map((tag) => (
                        <span
                            key={tag}
                            className="px-4 py-2 bg-[#1A1A23] border border-gray-700 rounded-xl text-sm hover:border-indigo-500 cursor-pointer transition"
                        >
              #{tag}
            </span>
                    ))}
                </div>

                {/* AUTHOR FOOTER CARD */}
                <div className="mt-20 bg-[#10101A] border border-gray-800 p-6 rounded-2xl shadow-xl flex gap-4 items-start">
                    <img
                        src={
                            post.author?.avatar ||
                            `https://i.pravatar.cc/70?u=${post.author?._id}`
                        }
                        className="w-14 h-14 rounded-full border border-gray-700"
                    />

                    <div>
                        <h3 className="text-xl font-semibold">{post.author?.username}</h3>
                        <p className="text-gray-400 text-sm">
                            Thanks for reading! Follow me for more content related to college
                            life, tech, and productivity.
                        </p>
                    </div>
                </div>

                {/* COMMENTS */}
                <div className="mt-16 bg-[#10101A] border border-gray-800 p-6 rounded-2xl shadow-xl">
                    <h3 className="text-xl font-semibold mb-4">💬 Comments</h3>

                    <textarea
                        placeholder="Write a comment..."
                        className="w-full bg-[#1A1A23] p-4 border border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                    ></textarea>

                    <button className="mt-3 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg">
                        Post Comment
                    </button>
                </div>
            </div>
        </div>
    );
}
