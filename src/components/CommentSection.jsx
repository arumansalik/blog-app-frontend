import React, { useEffect, useState } from "react";
import API from "../api/axios";
import { Heart, MessageCircle } from "lucide-react";

export default function CommentSection({ postId }) {
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState("");
    const [replyText, setReplyText] = useState("");
    const [activeReply, setActiveReply] = useState(null);

    /* Load comments */
    useEffect(() => {
        async function loadComments() {
            try {
                const res = await API.get(`/comments/post/${postId}`);
                setComments(res.data);
            } catch (err) {
                console.log("Comment load error:", err);
            }
        }
        loadComments();
    }, [postId]);

    /* Add comment */
    const submitComment = async () => {
        if (!commentText.trim()) return;

        try {
            const res = await API.post(`/comments/${postId}`, {
                content: commentText,
            });

            setComments((prev) => [res.data, ...prev]);
            setCommentText("");
        } catch (err) {
            console.log(err);
        }
    };

    /* Reply to comment */
    const submitReply = async (commentId) => {
        if (!replyText.trim()) return;

        try {
            const res = await API.post(`/comments/reply/${commentId}`, {
                content: replyText,
            });

            setComments((prev) =>
                prev.map((c) =>
                    c._id === commentId
                        ? { ...c, replies: [...(c.replies || []), res.data] }
                        : c
                )
            );

            setReplyText("");
            setActiveReply(null);
        } catch (err) {
            console.log(err);
        }
    };

    /* Like Comment */
    const toggleLikeComment = async (commentId) => {
        try {
            const res = await API.put(`/comments/${commentId}/like`);

            setComments((prev) =>
                prev.map((c) => {
                    if (c._id === commentId) return res.data;

                    if (c.replies.some((r) => r._id === commentId)) {
                        return {
                            ...c,
                            replies: c.replies.map((r) =>
                                r._id === commentId ? res.data : r
                            ),
                        };
                    }
                    return c;
                })
            );
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="mt-20 bg-[#10101A] border border-gray-800 p-6 rounded-2xl shadow-xl">
            <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                💬 Comments
            </h3>

            {/* Add comment */}
            <div className="mb-8">
        <textarea
            placeholder="Write a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="w-full bg-[#1A1A23] p-4 border border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
        />
                <button
                    onClick={submitComment}
                    className="mt-3 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg"
                >
                    Post Comment
                </button>
            </div>

            {/* Comment List */}
            <div className="space-y-6">
                {comments.map((comment) => (
                    <div
                        key={comment._id}
                        className="bg-[#14141E] p-5 rounded-xl border border-gray-700"
                    >
                        {/* USER */}
                        <div className="flex items-center gap-3 mb-3">
                            <img
                                src={
                                    comment.author?.avatar ||
                                    `https://i.pravatar.cc/40?u=${comment.author?._id}`
                                }
                                className="w-10 h-10 rounded-full border border-gray-700"
                            />
                            <div>
                                <p className="font-medium">{comment.author?.username}</p>
                                <p className="text-xs text-gray-500">
                                    {new Date(comment.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>

                        {/* COMMENT TEXT */}
                        <p className="text-gray-300 leading-relaxed mb-4">
                            {comment.content}
                        </p>

                        {/* ACTIONS */}
                        <div className="flex items-center gap-6 text-sm">
                            {/* Like */}
                            <button
                                onClick={() => toggleLikeComment(comment._id)}
                                className="flex items-center gap-2 text-gray-400 hover:text-red-400 transition"
                            >
                                <Heart size={18} />
                                {comment.likes?.length}
                            </button>

                            {/* Reply */}
                            <button
                                onClick={() =>
                                    setActiveReply(activeReply === comment._id ? null : comment._id)
                                }
                                className="flex items-center gap-2 text-gray-400 hover:text-indigo-400 transition"
                            >
                                <MessageCircle size={18} />
                                Reply
                            </button>
                        </div>

                        {/* Reply Box */}
                        {activeReply === comment._id && (
                            <div className="mt-4 ml-10">
                <textarea
                    placeholder="Write a reply..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="w-full bg-[#1A1A23] p-3 border border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                ></textarea>

                                <button
                                    onClick={() => submitReply(comment._id)}
                                    className="mt-2 px-4 py-1 bg-indigo-600 hover:bg-indigo-700 rounded-lg"
                                >
                                    Reply
                                </button>
                            </div>
                        )}

                        {/* Replies */}
                        {comment.replies && comment.replies.length > 0 && (
                            <div className="ml-10 mt-6 space-y-4 border-l border-gray-700 pl-6">
                                {comment.replies.map((reply) => (
                                    <div key={reply._id}>
                                        <div className="flex items-center gap-3 mb-2">
                                            <img
                                                src={
                                                    reply.author?.avatar ||
                                                    `https://i.pravatar.cc/40?u=${reply.author?._id}`
                                                }
                                                className="w-8 h-8 rounded-full border border-gray-700"
                                            />
                                            <div>
                                                <p className="font-medium text-sm">
                                                    {reply.author?.username}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {new Date(reply.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>

                                        <p className="text-gray-400 text-sm leading-relaxed mb-2">
                                            {reply.content}
                                        </p>

                                        <button
                                            onClick={() => toggleLikeComment(reply._id)}
                                            className="flex items-center gap-2 text-gray-400 hover:text-red-400 text-xs"
                                        >
                                            <Heart size={14} />
                                            {reply.likes?.length}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
