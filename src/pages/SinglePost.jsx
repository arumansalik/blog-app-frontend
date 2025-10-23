import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api/axios";
import { MessageSquare, Calendar, User } from "lucide-react";

export default function SinglePost() {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [comment, setComment] = useState("");
    const [comments, setComments] = useState([]);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const { data } = await API.get(`/posts/${id}`);
                setPost(data);
                setComments(data.comments || []);
            } catch (err) {
                console.error("Error fetching post:", err);
            }
        };
        fetchPost();
    }, [id]);

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!comment.trim()) return;

        try {
            const { data } = await API.post(`/posts/${id}/comments`, { text: comment });
            setComments((prev) => [data, ...prev]);
            setComment("");
        } catch (err) {
            console.error("Error adding comment:", err);
        }
    };

    if (!post) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0B0B0F] text-gray-400 font-[Poppins]">
                Loading post...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0B0B0F] text-gray-100 font-[Poppins] px-6 py-12 md:px-16">
            {/* Post Header */}
            <div className="max-w-4xl mx-auto">
                {post.cover && (
                    <img
                        src={post.cover}
                        alt="cover"
                        className="w-full rounded-2xl mb-8 border border-gray-800"
                    />
                )}

                <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-snug text-white">
                    {post.title}
                </h1>

                <div className="flex items-center gap-4 text-sm text-gray-400 mb-10">
                    <div className="flex items-center gap-2">
                        <User size={16} />
                        <span>{post.author?.name || "Anonymous"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar size={16} />
                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                    {post.tags?.length > 0 && (
                        <span className="px-3 py-1 bg-[#191921] border border-gray-700 rounded-lg text-gray-400 text-xs">
              #{post.tags.join(" #")}
            </span>
                    )}
                </div>

                {/* Post Content */}
                <div
                    className="prose prose-invert max-w-none leading-relaxed text-gray-300 text-[15px]"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {/* Comment Section */}
                <section className="mt-16">
                    <h2 className="text-xl font-semibold flex items-center gap-2 mb-6">
                        <MessageSquare size={18} /> Comments ({comments.length})
                    </h2>

                    {/* Add Comment */}
                    <form onSubmit={handleAddComment} className="mb-8">
            <textarea
                className="w-full bg-[#12121A] border border-gray-800 rounded-xl p-3 text-sm text-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                rows="3"
                placeholder="Write a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
            />
                        <button
                            type="submit"
                            className="mt-3 px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition"
                        >
                            Post Comment
                        </button>
                    </form>

                    {/* Comments List */}
                    <div className="space-y-6">
                        {comments.length > 0 ? (
                            comments.map((c, i) => (
                                <div
                                    key={i}
                                    className="border border-gray-800 bg-[#131319] p-4 rounded-xl"
                                >
                                    <div className="flex items-center gap-3 mb-2">
                                        <img
                                            src={`https://i.pravatar.cc/35?img=${i + 10}`}
                                            alt="avatar"
                                            className="w-8 h-8 rounded-full border border-gray-700"
                                        />
                                        <h4 className="text-sm font-semibold text-white">
                                            {c.author?.name || "Student"}
                                        </h4>
                                        <span className="text-xs text-gray-500 ml-auto">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </span>
                                    </div>
                                    <p className="text-gray-400 text-sm">{c.text}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-sm">No comments yet. Be the first to comment!</p>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}
